import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

export interface TourStep {
  selector?: string;
  /** Used instead of `selector` on small screens, when the target on mobile
   * is a different element (e.g. sidebar nav vs. bottom tab bar). */
  mobileSelector?: string;
  title: string;
  body: string;
  /** Used instead of `body` on small screens, for a shorter/more accurate
   * description of what's actually visible there. */
  mobileBody?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  spotlightPadding?: number;
}

interface Rect { top: number; left: number; width: number; height: number; }

interface TourGuideProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  storageKey?: string;
  accentColor?: string;
  /** Viewport width (px) below which this app's layout switches to its mobile
   * nav — must match the CSS breakpoint the steps' selectors depend on. */
  mobileBreakpoint?: number;
}

const PADDING = 10;
const BUBBLE_W = 320;
const BUBBLE_H_EST = 220;
const MARGIN = 14;
const DEFAULT_MOBILE_BREAKPOINT = 768;

const getRect = (selector?: string): Rect | null => {
  if (!selector) return null;
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width === 0 && r.height === 0) return null;
  return { top: r.top, left: r.left, width: r.width, height: r.height };
};

const scrollIntoView = (selector?: string) => {
  if (!selector) return;
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return;
  const r = el.getBoundingClientRect();
  const inView = r.top >= 60 && r.bottom <= window.innerHeight - 60;
  if (!inView) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

const pickPlacement = (
  rect: Rect | null,
  placement: TourStep['placement'] = 'auto'
): 'top' | 'bottom' | 'left' | 'right' | 'center' => {
  if (!rect) return 'center';
  if (placement && placement !== 'auto') return placement;
  const spaceBottom = window.innerHeight - (rect.top + rect.height);
  const spaceTop = rect.top;
  const spaceRight = window.innerWidth - (rect.left + rect.width);
  const spaceLeft = rect.left;
  const opts = [
    { name: 'bottom' as const, space: spaceBottom, need: BUBBLE_H_EST + MARGIN },
    { name: 'top' as const, space: spaceTop, need: BUBBLE_H_EST + MARGIN },
    { name: 'right' as const, space: spaceRight, need: BUBBLE_W + MARGIN },
    { name: 'left' as const, space: spaceLeft, need: BUBBLE_W + MARGIN },
  ];
  const fit = opts.find(o => o.space >= o.need);
  if (fit) return fit.name;
  return opts.sort((a, b) => b.space - a.space)[0].name;
};

const bubblePos = (
  rect: Rect | null,
  side: 'top' | 'bottom' | 'left' | 'right' | 'center'
): { top: number; left: number; transform?: string } => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (!rect || side === 'center') {
    return { top: vh / 2, left: vw / 2, transform: 'translate(-50%, -50%)' };
  }
  let top = 0, left = 0;
  if (side === 'bottom') { top = rect.top + rect.height + MARGIN; left = rect.left + rect.width / 2 - BUBBLE_W / 2; }
  else if (side === 'top') { top = rect.top - BUBBLE_H_EST - MARGIN; left = rect.left + rect.width / 2 - BUBBLE_W / 2; }
  else if (side === 'right') { top = rect.top + rect.height / 2 - BUBBLE_H_EST / 2; left = rect.left + rect.width + MARGIN; }
  else { top = rect.top + rect.height / 2 - BUBBLE_H_EST / 2; left = rect.left - BUBBLE_W - MARGIN; }
  left = Math.max(8, Math.min(left, vw - BUBBLE_W - 8));
  top = Math.max(8, Math.min(top, vh - 120));
  return { top, left };
};

const TourGuide: React.FC<TourGuideProps> = ({
  steps, isOpen, onClose, storageKey, accentColor = '#e9458b', mobileBreakpoint = DEFAULT_MOBILE_BREAKPOINT
}) => {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [tick, setTick] = useState(0);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < mobileBreakpoint);

  const step = steps[index];

  useEffect(() => {
    if (isOpen) setIndex(0);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onResize = () => setIsMobile(window.innerWidth < mobileBreakpoint);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isOpen, mobileBreakpoint]);

  const effectiveSelector = (isMobile && step?.mobileSelector) ? step.mobileSelector : step?.selector;
  const effectiveBody = (isMobile && step?.mobileBody) ? step.mobileBody : step?.body;

  useLayoutEffect(() => {
    if (!isOpen || !step) return;
    scrollIntoView(effectiveSelector);
    const measure = () => setRect(getRect(effectiveSelector));
    // give layout a beat
    const t = window.setTimeout(measure, 60);
    const onResize = () => setTick(v => v + 1);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [isOpen, index, step, effectiveSelector, tick]);

  const finish = () => {
    if (storageKey) {
      try { localStorage.setItem(storageKey, '1'); } catch { /* ignore */ }
    }
    onClose();
  };

  const skip = () => finish();
  const next = () => { if (index < steps.length - 1) setIndex(i => i + 1); else finish(); };
  const back = () => { if (index > 0) setIndex(i => i - 1); };

  const side = useMemo(() => pickPlacement(rect, step?.placement), [rect, step, tick]);
  const pos = useMemo(() => bubblePos(rect, side), [rect, side, tick]);
  // On mobile the bubble is always a full-width sheet, not positioned near the
  // target — so if the target sits in the bottom half of the screen (e.g. the
  // bottom tab bar), anchoring the sheet at the bottom would cover the very
  // thing being highlighted. Flip it to the top of the screen in that case.
  const mobileSheetSide = useMemo(() => {
    if (!rect) return 'bottom';
    const center = rect.top + rect.height / 2;
    return center > window.innerHeight / 2 ? 'top' : 'bottom';
  }, [rect, tick]);

  if (!isOpen || !step) return null;

  const pad = step.spotlightPadding ?? PADDING;
  const hasSpot = !!rect;
  const spot = rect ? {
    x: Math.max(0, rect.left - pad),
    y: Math.max(0, rect.top - pad),
    w: rect.width + pad * 2,
    h: rect.height + pad * 2,
  } : null;

  return (
    <AnimatePresence>
      <motion.div
        key="tour-root"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{ position: 'fixed', inset: 0, zIndex: 2000, pointerEvents: 'auto' }}
        aria-live="polite"
      >
        {/* SVG overlay with cutout */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <mask id="lovspeak-tour-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {hasSpot && spot && (
                <rect x={spot.x} y={spot.y} width={spot.w} height={spot.h} rx={16} ry={16} fill="black" />
              )}
            </mask>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="rgba(10,14,25,0.68)" mask="url(#lovspeak-tour-mask)" />
          {hasSpot && spot && (
            <rect
              x={spot.x} y={spot.y} width={spot.w} height={spot.h} rx={16} ry={16}
              fill="none" stroke={accentColor} strokeWidth={2}
              style={{ filter: `drop-shadow(0 0 12px ${accentColor})` }}
            />
          )}
        </svg>

        {/* Skip button top-right */}
        <button
          type="button"
          onClick={skip}
          style={{
            position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.95)',
            color: '#172033', border: 'none', borderRadius: 999, padding: '8px 14px',
            fontWeight: 800, fontSize: 12, cursor: 'pointer', boxShadow: '0 6px 20px rgba(0,0,0,0.25)'
          }}
        >
          Lewati tour
        </button>

        {/* Bubble: on mobile, anchor as a full-width sheet (top or bottom,
            whichever side the highlighted target isn't on) so long text never
            gets clipped and the sheet never covers what it's pointing at. */}
        <motion.div
          key={`bubble-${index}`}
          initial={isMobile ? { opacity: 0, y: mobileSheetSide === 'top' ? -24 : 24 } : { opacity: 0, scale: 0.96, y: 6 }}
          animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={isMobile ? {
            position: 'fixed',
            left: 12, right: 12,
            ...(mobileSheetSide === 'top'
              ? { top: 'max(12px, env(safe-area-inset-top))' }
              : { bottom: 'max(12px, env(safe-area-inset-bottom))' }),
            width: 'auto', maxWidth: 'none',
            maxHeight: 'calc(100vh - 96px)', overflowY: 'auto',
            background: 'white', color: '#172033', borderRadius: 20,
            boxShadow: '0 20px 60px rgba(10,14,25,0.35)',
            padding: 16, fontFamily: 'inherit'
          } : {
            position: 'absolute',
            top: pos.top, left: pos.left, transform: pos.transform,
            width: BUBBLE_W, maxWidth: 'calc(100vw - 24px)',
            background: 'white', color: '#172033', borderRadius: 20,
            boxShadow: '0 20px 60px rgba(10,14,25,0.35)',
            padding: 20, fontFamily: 'inherit'
          }}
        >
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: accentColor }}>Panduan LovSpeak · {index + 1}/{steps.length}</div>
            <div style={{ fontSize: 16, fontWeight: 900, lineHeight: 1.25, marginTop: 4, color: '#172033' }}>{step.title}</div>
          </div>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: '#3a445a' }}>{effectiveBody}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16 }}>
            {steps.map((_, i) => (
              <span
                key={i}
                style={{
                  width: i === index ? 22 : 6, height: 6, borderRadius: 999,
                  background: i === index ? accentColor : '#d4d9e3',
                  transition: 'all .25s'
                }}
              />
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              {index > 0 && (
                <button
                  type="button"
                  onClick={back}
                  style={{
                    border: '1px solid #e7eaf0', background: '#f4f6fa', color: '#172033',
                    borderRadius: 10, padding: '8px 12px', fontSize: 12, fontWeight: 800, cursor: 'pointer'
                  }}
                >Kembali</button>
              )}
              <button
                type="button"
                onClick={next}
                style={{
                  border: 'none', background: accentColor, color: 'white',
                  borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 800, cursor: 'pointer',
                  boxShadow: `0 6px 14px ${accentColor}55`
                }}
              >{index === steps.length - 1 ? 'Selesai' : 'Lanjut'}</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TourGuide;

export const TOUR_KEY_APP = 'lovspeak_tour_seen_v1';
export const TOUR_KEY_ADMIN = 'lovspeak_admin_tour_seen_v1';

export const buildAppTourSteps = ({ hasPlan }: { hasPlan: boolean }): TourStep[] => {
  const steps: TourStep[] = [
    {
      title: 'Selamat datang di LovSpeak!',
      body: 'Panduan singkat fitur utama. Boleh dilewati kapan saja.',
      placement: 'auto',
    },
    {
      selector: '[data-tour="hero-actions"]',
      title: 'Mulai dari sini',
      body: '"Test" untuk cek level Bahasa Inggrismu, "Plan" untuk buat rencana belajar harian.',
      placement: 'bottom',
    },
    {
      selector: '[data-tour="learning-hub"]',
      title: 'Learning Hub',
      body: 'Semua modul latihan: Reading, Listening, Speaking, Shadowing, Grammar, dll. Geser untuk lihat semua.',
      placement: 'top',
    },
  ];

  if (hasPlan) {
    steps.push({
      selector: '[data-tour="daily-missions"]',
      title: 'Daily Missions — fleksibel',
      body: 'Tugas harian sesuai level & fokus pilihanmu di menu "Plan". Selesaikan untuk dapat XP.',
      placement: 'top',
    });
  }

  steps.push(
    {
      selector: '[data-tour="roadmap-nav"]',
      mobileSelector: '[data-tour="roadmap-nav-mobile"]',
      title: 'Learning Roadmap — terstruktur',
      body: 'Jalur belajar berurutan dari tim Lovelya, dari unit ke unit — cocok kalau ingin panduan lengkap tanpa atur sendiri.',
      placement: 'right',
    },
    {
      selector: '[data-tour="sidebar-nav"]',
      mobileSelector: '[data-tour="bottom-nav"]',
      title: 'Navigasi utama',
      body: 'Semua bagian app: Dashboard, Roadmap, modul latihan, Profil, Settings.',
      mobileBody: 'Pindah antar bagian: Home, Roadmap, Games, Profil, Settings.',
      placement: 'right',
    },
    {
      title: 'Siap memulai!',
      body: hasPlan
        ? '1) "Test" untuk assessment. 2) "Plan" untuk atur Daily Plan, atau ikuti Roadmap. 3) Mulai satu misi. Selamat belajar!'
        : '1) "Test" untuk assessment. 2) "Plan" untuk buat Daily Plan, atau langsung ikuti Roadmap. Selamat belajar!',
      placement: 'auto',
    },
  );

  return steps;
};

export const ADMIN_TOUR_STEPS: TourStep[] = [
  {
    title: 'Selamat datang di Admin Console',
    body: 'Panduan singkat bagian-bagian penting dashboard admin. Boleh dilewati kapan saja.',
    placement: 'auto',
  },
  {
    selector: '[data-tour="admin-nav"]',
    mobileSelector: '[data-tour="admin-nav-mobile"]',
    title: 'Menu utama',
    body: 'Semua bagian admin ada di sini: Overview, User, Perlu perhatian, Komentar, Tugas, Akses.',
    mobileBody: 'Overview, User, dan Tugas ada di sini. Sisanya di menu "Lainnya".',
    placement: 'right',
  },
  {
    selector: '[data-tour="admin-kpis"]',
    title: 'Ringkasan kelas',
    body: 'Kondisi kelas sekilas: jumlah user, rata-rata nilai, penyelesaian Daily Plan, user yang perlu perhatian.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="admin-users-nav"]',
    mobileSelector: '[data-tour="admin-users-nav-mobile"]',
    title: 'Kelola user',
    body: 'Lihat daftar siswa, nilai, aktivitas, dan komentar mereka di sini.',
    placement: 'right',
  },
  {
    selector: '[data-tour="admin-assignments-nav"]',
    mobileSelector: '[data-tour="admin-assignments-nav-mobile"]',
    title: 'Kirim tugas & broadcast',
    body: 'Buat tugas khusus atau broadcast pesan ke seluruh user, dengan tenggat opsional.',
    placement: 'right',
  },
  {
    selector: '[data-tour="admin-refresh"]',
    title: 'Muat ulang data',
    body: 'Tekan kapan saja untuk memperbarui data terbaru dari user.',
    placement: 'bottom',
  },
  {
    title: 'Siap mulai!',
    body: '1) Cek Overview. 2) "Perlu perhatian" untuk cari user yang butuh bantuan. 3) Kirim tugas pertama.',
    placement: 'auto',
  },
];
