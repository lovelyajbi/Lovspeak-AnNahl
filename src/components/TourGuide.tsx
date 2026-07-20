import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

export interface TourStep {
  selector?: string;
  title: string;
  body: string;
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
}

const PADDING = 10;
const BUBBLE_W = 320;
const BUBBLE_H_EST = 220;
const MARGIN = 14;

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
  steps, isOpen, onClose, storageKey, accentColor = '#e9458b'
}) => {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [tick, setTick] = useState(0);

  const step = steps[index];

  useEffect(() => {
    if (isOpen) setIndex(0);
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen || !step) return;
    scrollIntoView(step.selector);
    const measure = () => setRect(getRect(step.selector));
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
  }, [isOpen, index, step, tick]);

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

        {/* Bubble */}
        <motion.div
          key={`bubble-${index}`}
          initial={{ opacity: 0, scale: 0.96, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{
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
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: '#3a445a' }}>{step.body}</p>

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
      body: 'Panduan singkat ini akan memperkenalkan fitur utama app dalam beberapa langkah. Silakan ikuti atau lewati kapan saja.',
      placement: 'auto',
    },
    {
      selector: '[data-tour="hero-actions"]',
      title: 'Mulai dari sini',
      body: 'Klik "Test" untuk mengukur level Bahasa Inggrismu, lalu "Plan" untuk membuat rencana belajar harian yang sesuai. Ini langkah pertama yang disarankan.',
      placement: 'bottom',
    },
    {
      selector: '[data-tour="learning-hub"]',
      title: 'Learning Hub',
      body: 'Semua modul latihan ada di sini: Reading, Listening, Speaking, Shadowing, Vocab, Grammar, dan lainnya. Geser ke samping untuk melihat semuanya.',
      placement: 'top',
    },
  ];

  if (hasPlan) {
    steps.push({
      selector: '[data-tour="daily-missions"]',
      title: 'Daily Missions — fleksibel',
      body: 'Daily Plan bersifat fleksibel: tugas harian dibuat berdasarkan level, fokus, dan intensitas yang kamu pilih sendiri di menu "Plan". Cocok kalau kamu ingin belajar sesuai kemampuan dan kemauan pribadi. Selesaikan tugas untuk mendapat XP.',
      placement: 'top',
    });
  }

  steps.push(
    {
      selector: '[data-tour="roadmap-nav"]',
      title: 'Learning Roadmap — terstruktur',
      body: 'Berbeda dari Daily Plan, Roadmap adalah jalur latihan berurutan yang sudah dirancang tim Lovelya. Kamu mengikuti template kurikulum tetap dari unit ke unit — pas kalau kamu ingin panduan lengkap tanpa perlu mengatur sendiri.',
      placement: 'right',
    },
    {
      selector: '[data-tour="bottom-nav"]',
      title: 'Navigasi utama',
      body: 'Gunakan menu ini untuk berpindah antar bagian: Dashboard, Learning Roadmap, modul latihan (Reading, Listening, Shadowing, dll.), Diary, AI Tutor, Profil, dan Settings.',
      placement: 'right',
    },
    {
      title: 'Siap memulai!',
      body: hasPlan
        ? 'Rekomendasi langkah pertama: (1) klik "Test" untuk assessment level, (2) buka "Plan" untuk memperbarui Daily Plan fleksibel, atau ikuti "Learning Roadmap" bila ingin jalur terstruktur dari Lovelya, (3) mulai satu misi. Selamat belajar!'
        : 'Rekomendasi langkah pertama: (1) klik "Test" untuk assessment level, (2) buka "Plan" untuk membuat Daily Plan fleksibel — setelah itu daftar Daily Missions akan muncul di Dashboard, atau (3) langsung ikuti "Learning Roadmap" bila ingin jalur terstruktur dari Lovelya. Selamat belajar!',
      placement: 'auto',
    },
  );

  return steps;
};

export const ADMIN_TOUR_STEPS: TourStep[] = [
  {
    title: 'Selamat datang di Admin Console',
    body: 'Panduan singkat ini akan menunjukkan bagian-bagian penting dari dashboard admin LovSpeak. Silakan ikuti atau lewati kapan saja.',
    placement: 'auto',
  },
  {
    selector: '[data-tour="admin-nav"]',
    title: 'Menu utama',
    body: 'Semua bagian admin ada di sisi kiri: Overview, User, Perlu perhatian, Komentar, Tugas, dan Akses.',
    placement: 'right',
  },
  {
    selector: '[data-tour="admin-kpis"]',
    title: 'Ringkasan kelas',
    body: 'Kartu-kartu ini memperlihatkan kondisi kelasmu sekilas: jumlah user, rata-rata nilai, penyelesaian Daily Plan, dan user yang perlu perhatian.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="admin-users-nav"]',
    title: 'Kelola user',
    body: 'Klik "User" untuk melihat daftar semua siswa, nilai, aktivitas, dan detail komentar mereka.',
    placement: 'right',
  },
  {
    selector: '[data-tour="admin-assignments-nav"]',
    title: 'Kirim tugas & broadcast',
    body: 'Dari sini kamu bisa membuat tugas khusus atau broadcast pesan ke seluruh user, dengan tenggat opsional.',
    placement: 'right',
  },
  {
    selector: '[data-tour="admin-refresh"]',
    title: 'Muat ulang data',
    body: 'Tekan tombol ini kapan saja untuk memperbarui data terbaru dari user.',
    placement: 'bottom',
  },
  {
    title: 'Siap mulai!',
    body: 'Rekomendasi langkah pertama: (1) cek Overview, (2) buka "Perlu perhatian" untuk menemukan user yang perlu dibantu, (3) kirim tugas pertama dari menu Tugas.',
    placement: 'auto',
  },
];
