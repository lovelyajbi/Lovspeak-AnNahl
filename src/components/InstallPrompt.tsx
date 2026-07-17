
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Version key — bump this to force popup to reappear for all users
const INSTALL_PROMPT_VERSION = 'v2';
const DISMISS_KEY = `pwa_install_dismissed_${INSTALL_PROMPT_VERSION}`;

const InstallPrompt: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Clean up ALL old dismiss keys from previous versions
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('pwa_') && key !== DISMISS_KEY) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));

    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent) || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    const isAndroid = /android/.test(userAgent);

    // ONLY hide if truly running as installed app (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

    if (isStandalone) {
      // Already installed and running as app — no need to show
      setIsVisible(false);
      return;
    }

    // Check if user dismissed THIS version of the prompt (session-only, not permanent)
    const dismissed = sessionStorage.getItem(DISMISS_KEY);
    if (dismissed) {
      setIsVisible(false);
      return;
    }

    if (isIos) {
      setPlatform('ios');
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    } else {
      setPlatform(isAndroid ? 'android' : 'other');

      let promptFired = false;

      const handler = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
        promptFired = true;
        setIsVisible(true);
      };

      window.addEventListener('beforeinstallprompt', handler);

      // For Android: if beforeinstallprompt doesn't fire within 3 seconds,
      // show manual install instructions instead of doing nothing.
      const fallbackTimer = setTimeout(() => {
        if (!promptFired) {
          setIsVisible(true);
        }
      }, 3000);

      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
        clearTimeout(fallbackTimer);
      };
    }
  }, []);

  const handleDismiss = () => {
    // Only dismiss for this browser session, so it reappears next visit
    sessionStorage.setItem(DISMISS_KEY, 'true');
    setIsVisible(false);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-24 inset-x-4 z-[60] md:bottom-8 md:right-8 md:left-auto md:w-80"
      >
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-lovelya-100 dark:border-gray-700 p-5 relative overflow-hidden">
          <button 
            onClick={handleDismiss}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-600 transition z-10"
          >
            <i className="fas fa-times"></i>
          </button>

          {/* Android WITH native install support (beforeinstallprompt fired) */}
          {platform === 'android' && deferredPrompt && (
            <>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center p-1 shadow-lg shrink-0 overflow-hidden border border-gray-100 dark:border-gray-600">
                  <img src="/logo.svg" alt="LovSpeak Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 pr-6">
                  <h4 className="font-black text-gray-900 dark:text-white text-sm mb-1">Install LovSpeak</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    Install LovSpeak on your home screen for faster access and a better experience.
                  </p>
                </div>
              </div>
              <button
                onClick={handleInstallClick}
                className="w-full mt-4 py-3 bg-lovelya-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-lovelya-700 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <i className="fas fa-download"></i>
                Install Now
              </button>
            </>
          )}

          {/* Android WITHOUT native install support (fallback manual instructions) */}
          {platform === 'android' && !deferredPrompt && (
            <>
              <div className="flex items-center gap-3 mb-3 pr-8">
                <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center p-1 shadow-md shrink-0 overflow-hidden border border-gray-100 dark:border-gray-600">
                  <img src="/logo.svg" alt="LovSpeak Logo" className="w-full h-full object-contain" />
                </div>
                <h4 className="font-black text-gray-900 dark:text-white text-sm leading-tight">Install LovSpeak</h4>
              </div>

              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-3">
                Untuk pengalaman terbaik, install LovSpeak ke home screen kamu:
              </p>

              {/* Compact 2-Step Visual for Android */}
              <div className="flex items-stretch gap-1.5">
                {/* Step 1 */}
                <div className="flex-1 bg-lovelya-50 dark:bg-lovelya-900/15 rounded-xl p-2.5 text-center border border-lovelya-100 dark:border-lovelya-800/30">
                  <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded-lg mx-auto mb-1.5 flex items-center justify-center shadow-sm">
                    <i className="fas fa-ellipsis-vertical text-lovelya-600 text-sm"></i>
                  </div>
                  <p className="text-[8px] font-black text-gray-700 dark:text-gray-200 leading-tight">1. Tap Menu</p>
                  <p className="text-[7px] text-gray-400 mt-0.5 leading-tight">⋮ pojok kanan atas</p>
                </div>

                {/* Arrow */}
                <div className="flex items-center">
                  <i className="fas fa-chevron-right text-[7px] text-gray-300 dark:text-gray-600"></i>
                </div>

                {/* Step 2 */}
                <div className="flex-1 bg-green-50 dark:bg-green-900/15 rounded-xl p-2.5 text-center border border-green-100 dark:border-green-800/30">
                  <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded-lg mx-auto mb-1.5 flex items-center justify-center shadow-sm">
                    <i className="fas fa-plus-square text-green-500 text-sm"></i>
                  </div>
                  <p className="text-[8px] font-black text-gray-700 dark:text-gray-200 leading-tight">2. Install App</p>
                  <p className="text-[7px] text-gray-400 mt-0.5 leading-tight">atau "Add to Home"</p>
                </div>
              </div>
            </>
          )}

          {/* Desktop / Other platforms */}
          {platform === 'other' && (
            <>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center p-1 shadow-lg shrink-0 overflow-hidden border border-gray-100 dark:border-gray-600">
                  <img src="/logo.svg" alt="LovSpeak Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 pr-6">
                  <h4 className="font-black text-gray-900 dark:text-white text-sm mb-1">Install LovSpeak</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    Install LovSpeak on your device for faster access and a better experience.
                  </p>
                </div>
              </div>
              <button
                onClick={handleInstallClick}
                className="w-full mt-4 py-3 bg-lovelya-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-lovelya-700 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <i className="fas fa-download"></i>
                {deferredPrompt ? "Install Now" : "Install App"}
              </button>
            </>
          )}

          {/* iOS - Compact Step-by-Step Guide */}
          {platform === 'ios' && (
            <>
              <div className="flex items-center gap-3 mb-3 pr-8">
                <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center p-1 shadow-md shrink-0 overflow-hidden border border-gray-100 dark:border-gray-600">
                  <img src="/logo.svg" alt="LovSpeak Logo" className="w-full h-full object-contain" />
                </div>
                <h4 className="font-black text-gray-900 dark:text-white text-sm leading-tight">Install LovSpeak</h4>
              </div>

              {/* Apple Policy Notice */}
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-3">
                Karena kebijakan Apple yang cukup ketat, Anda harus install manual dengan cara berikut:
              </p>

              {/* Compact 3-Step Visual */}
              <div className="flex items-stretch gap-1.5">
                {/* Step 1 */}
                <div className="flex-1 bg-lovelya-50 dark:bg-lovelya-900/15 rounded-xl p-2.5 text-center border border-lovelya-100 dark:border-lovelya-800/30">
                  <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded-lg mx-auto mb-1.5 flex items-center justify-center shadow-sm">
                    <i className="fas fa-arrow-up-from-bracket text-lovelya-600 text-sm"></i>
                  </div>
                  <p className="text-[8px] font-black text-gray-700 dark:text-gray-200 leading-tight">1. Tap Share</p>
                  <p className="text-[7px] text-gray-400 mt-0.5 leading-tight">di bawah Safari</p>
                </div>

                {/* Arrow */}
                <div className="flex items-center">
                  <i className="fas fa-chevron-right text-[7px] text-gray-300 dark:text-gray-600"></i>
                </div>

                {/* Step 2 */}
                <div className="flex-1 bg-blue-50 dark:bg-blue-900/15 rounded-xl p-2.5 text-center border border-blue-100 dark:border-blue-800/30">
                  <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded-lg mx-auto mb-1.5 flex items-center justify-center shadow-sm">
                    <i className="fas fa-plus-square text-blue-500 text-sm"></i>
                  </div>
                  <p className="text-[8px] font-black text-gray-700 dark:text-gray-200 leading-tight">2. Add to Home</p>
                  <p className="text-[7px] text-gray-400 mt-0.5 leading-tight">scroll & pilih</p>
                </div>

                {/* Arrow */}
                <div className="flex items-center">
                  <i className="fas fa-chevron-right text-[7px] text-gray-300 dark:text-gray-600"></i>
                </div>

                {/* Step 3 */}
                <div className="flex-1 bg-green-50 dark:bg-green-900/15 rounded-xl p-2.5 text-center border border-green-100 dark:border-green-800/30">
                  <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded-lg mx-auto mb-1.5 flex items-center justify-center shadow-sm">
                    <i className="fas fa-check text-green-500 text-sm"></i>
                  </div>
                  <p className="text-[8px] font-black text-gray-700 dark:text-gray-200 leading-tight">3. Tap Add</p>
                  <p className="text-[7px] text-gray-400 mt-0.5 leading-tight">pojok kanan atas</p>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstallPrompt;
