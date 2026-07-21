import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'lovspeak_install_dismissed_at';
const DISMISS_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // hide for a week after dismiss

/**
 * PWA install prompt for the login screen. Renders three modes:
 *  - Chrome/Edge/Android desktop+mobile: real one-tap install via
 *    `beforeinstallprompt`.
 *  - iOS Safari: manual step-by-step guide (Share → Add to Home Screen)
 *    because iOS doesn't fire the event and has no programmatic install.
 *  - Everything else / already installed: renders nothing.
 */
const InstallPrompt: React.FC = () => {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      const at = Number(localStorage.getItem(DISMISS_KEY) || 0);
      return at > 0 && Date.now() - at < DISMISS_COOLDOWN_MS;
    } catch { return false; }
  });

  const isStandalone = typeof window !== 'undefined' && (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );

  const isIos = typeof window !== 'undefined' &&
    /iphone|ipad|ipod/i.test(window.navigator.userAgent) &&
    !(window.navigator as any).standalone;

  useEffect(() => {
    if (isStandalone) { setInstalled(true); return; }
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => { setInstalled(true); setDeferred(null); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, [isStandalone]);

  if (installed || dismissed) return null;

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch { /* ignore */ }
    setDismissed(true);
  };

  const install = async () => {
    if (!deferred) return;
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === 'accepted') setInstalled(true);
    } catch (e) {
      console.error('Install prompt failed:', e);
    } finally {
      setDeferred(null);
    }
  };

  if (!deferred && !isIos) return null;

  return (
    <div className="mt-6 rounded-2xl border border-lovelya-100 bg-gradient-to-br from-lovelya-50 to-white p-4 shadow-sm dark:border-lovelya-900/40 dark:from-lovelya-950/30 dark:to-gray-900">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-lovelya-500 text-white shadow-md shadow-lovelya-500/30">
          <i className="fas fa-mobile-screen-button text-base" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-slate-900 dark:text-white">Install LovSpeak sebagai aplikasi</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-gray-400">Buka lebih cepat, jalan tanpa alamat web, dan bisa dipakai layaknya app biasa.</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {deferred && (
              <button
                type="button"
                onClick={install}
                className="inline-flex items-center gap-1.5 rounded-xl bg-lovelya-600 px-3 py-2 text-xs font-black text-white shadow-sm transition hover:bg-lovelya-700 active:scale-95"
              >
                <i className="fas fa-download" /> Install sekarang
              </button>
            )}
            {isIos && (
              <button
                type="button"
                onClick={() => setShowIosGuide(current => !current)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-lovelya-600 px-3 py-2 text-xs font-black text-white shadow-sm transition hover:bg-lovelya-700 active:scale-95"
              >
                <i className="fas fa-mobile-screen-button" /> Cara install di iPhone
              </button>
            )}
            <button
              type="button"
              onClick={dismiss}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Nanti saja
            </button>
          </div>

          {isIos && showIosGuide && (
            <ol className="mt-3 space-y-1.5 rounded-xl bg-white/60 p-3 text-xs text-slate-600 dark:bg-gray-800/60 dark:text-gray-300">
              <li>1. Ketuk ikon <b>Share</b> <i className="fas fa-arrow-up-from-bracket mx-0.5" /> di Safari.</li>
              <li>2. Pilih <b>Add to Home Screen</b> <i className="fas fa-square-plus mx-0.5" />.</li>
              <li>3. Ketuk <b>Add</b> di kanan atas — LovSpeak siap dipakai.</li>
            </ol>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
