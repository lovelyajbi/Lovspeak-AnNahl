
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { checkActivationCode, activateUser, saveGeminiApiKeys } from '../../services/storage';

export const ActivationPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { refreshStatus, signout, user } = useAuth();

  useEffect(() => {
    if (!user?.email) return;

    let cancelled = false;
    const runSilentSync = async () => {
      try {
        await refreshStatus();
        if (cancelled) return;

        window.setTimeout(() => {
          if (!cancelled) {
            refreshStatus().catch(console.error);
          }
        }, 1800);
      } catch (err) {
        console.error('Silent access sync error:', err);
      }
    };

    runSilentSync();
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const isValid = await checkActivationCode(code.trim());
    if (isValid) {
      await activateUser();
      await refreshStatus();
    } else {
      setError('Invalid activation code. Please contact the administrator.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh dark:bg-mesh-dark p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 border border-gray-100 dark:border-gray-700 text-center"
      >
        <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-3xl flex items-center justify-center shadow-xl shadow-lovelya-200/20 mx-auto mb-8 overflow-hidden border border-gray-100 dark:border-gray-800">
          <img
            src="/logo.svg?v=1.0.2"
            alt="Lovelya Logo"
            className="w-full h-full object-contain p-2"
          />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Aktivasi Akses</h2>
        <p className="text-gray-500 font-medium mb-8">
          Masukkan kode aktivasi Anda untuk melanjutkan ke LovSpeak.
        </p>

        <form onSubmit={handleActivate} className="space-y-6">
          <div className="relative group">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="LOVSPEAK-XXXX-XXXX"
              className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-lovelya-500 rounded-2xl font-bold text-center tracking-widest transition-all outline-none"
              required
            />
            <div className="mt-3">
              <a
                href="https://lovelya-edu.myscalev.com/lovspeak1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-lovelya-600 hover:text-lovelya-700 underline transition-colors"
              >
                Belum punya akses? Dapatkan kode akses di sini
              </a>
            </div>
            {error && <p className="text-rose-500 text-xs font-bold mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-black transition active:scale-95 disabled:opacity-50"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Aktifkan Dengan Kode'}
          </button>
        </form>

        <button
          onClick={signout}
          className="mt-8 text-gray-400 hover:text-gray-600 font-bold text-sm transition"
        >
          Sign Out
        </button>
      </motion.div>
    </div>
  );
};

export const ApiKeySetupPage: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<string[]>(Array(5).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { refreshStatus, signout } = useAuth();

  const handleKeyChange = (index: number, value: string) => {
    const newKeys = [...apiKeys];
    newKeys[index] = value;
    setApiKeys(newKeys);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const filteredKeys = apiKeys.map(k => k.trim()).filter(k => k !== '');

    if (filteredKeys.length === 0) {
      setError('Silakan masukkan setidaknya satu API Key Anda.');
      return;
    }

    if (filteredKeys.some(k => k.length < 5)) {
      setError('Format API Key sepertinya tidak valid. Silakan cek kembali kunci yang Anda masukkan.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log("Attempting to save API Keys...");
      await saveGeminiApiKeys(filteredKeys);
      console.log("API Keys saved. Refreshing status...");
      await refreshStatus();
      console.log("Status refreshed.");
    } catch (err: any) {
      console.error("Save API Key Error:", err);
      setError('Gagal menyimpan API Key: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh dark:bg-mesh-dark p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 w-full max-w-xl rounded-[2.5rem] shadow-2xl p-6 md:p-10 border border-gray-100 dark:border-gray-700"
      >
        <div className="text-center mb-8 md:mb-10">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl shadow-lovelya-200/20 mx-auto mb-6 overflow-hidden border border-gray-100 dark:border-gray-700">
            <img
              src="/logo.svg?v=1.0.2"
              alt="Lovelya Logo"
              className="w-full h-full object-contain p-2"
            />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2 md:mb-4">Connect AI</h2>
          <p className="text-sm md:text-base text-gray-500 font-medium">LovSpeak uses your own AI API Key for personalized learning. You can add up to 5 keys for extended daily limits.</p>
        </div>

        {/* Tutorial Video Banner */}
        <a
          href="https://youtu.be/L1uiW--pyTE"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 md:gap-4 p-3.5 md:p-4 bg-gradient-to-r from-red-50 via-red-50 to-orange-50 dark:from-red-900/20 dark:via-red-900/15 dark:to-orange-900/10 rounded-2xl border border-red-100 dark:border-red-800/40 hover:border-red-300 dark:hover:border-red-700 hover:shadow-lg hover:shadow-red-100/50 dark:hover:shadow-red-900/20 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 bg-red-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-red-200 dark:shadow-red-900/30 group-hover:scale-110 transition-transform duration-300 shrink-0">
            <i className="fas fa-play text-white text-sm md:text-base ml-0.5"></i>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm font-black text-gray-800 dark:text-white leading-tight">
              📺 Tonton Tutorial Setting API Key
            </p>
            <p className="text-[9px] md:text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 leading-snug">
              Bingung cara setting? Ikuti video tutorial langkah demi langkah di sini
            </p>
          </div>
          <i className="fas fa-external-link-alt text-red-400 group-hover:text-red-600 dark:group-hover:text-red-400 text-xs transition-colors shrink-0"></i>
        </a>

        <form onSubmit={handleSave} className="space-y-6 md:space-y-8">
          <div className="space-y-3">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Gemini API Keys</label>
            <div className="space-y-3 max-h-[300px] overflow-y-auto px-1 py-1 custom-scrollbar">
              {apiKeys.map((key, index) => (
                <div key={index} className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300">#{index + 1}</span>
                  <input
                    type="password"
                    value={key}
                    onChange={(e) => handleKeyChange(index, e.target.value)}
                    placeholder={index === 0 ? "Masukkan Key Utama (Wajib)" : `Masukkan Key Cadangan #${index} (Opsional)`}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-lovelya-500 rounded-xl font-bold transition-all outline-none text-sm font-mono"
                    required={index === 0}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 p-3 md:p-4 bg-lovelya-50 dark:bg-lovelya-900/20 rounded-2xl border border-lovelya-100 dark:border-lovelya-800">
              <i className="fas fa-magic text-lovelya-500 text-xs"></i>
              <p className="text-[9px] md:text-xs text-lovelya-700 dark:text-lovelya-300 font-bold leading-relaxed">
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline hover:text-lovelya-900">Dapatkan AI API Key gratis di sini</a>. Jika Anda punya lebih dari satu key, masukkan semuanya untuk rotasi otomatis.
              </p>
            </div>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-[10px] md:text-xs font-bold flex items-center gap-2"
              >
                <i className="fas fa-exclamation-triangle"></i>
                {error}
              </motion.div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-lovelya-600 text-white py-3.5 md:py-4 rounded-2xl font-black text-base md:text-lg shadow-xl shadow-lovelya-200 hover:bg-lovelya-700 transition active:scale-95 disabled:opacity-50"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Connect & Start Learning'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-700 pt-6">
          <button
            onClick={signout}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold text-sm transition flex items-center gap-2 mx-auto justify-center"
          >
            <i className="fas fa-sign-out-alt"></i> Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  );
};
