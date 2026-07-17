
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView } from '../types';

type ModalType = 'limit' | 'invalid_key' | null;

interface ApiLimitModalProps {
    onNavigateToSettings: () => void;
}

export const ApiLimitModal: React.FC<ApiLimitModalProps> = ({ onNavigateToSettings }) => {
    const [modalType, setModalType] = useState<ModalType>(null);

    useEffect(() => {
        const handleLimitReached = () => {
            setModalType('limit');
        };

        const handleInvalidKey = () => {
            setModalType('invalid_key');
        };

        window.addEventListener('lovelya_api_limit_reached', handleLimitReached);
        window.addEventListener('lovelya_api_key_invalid', handleInvalidKey);
        return () => {
            window.removeEventListener('lovelya_api_limit_reached', handleLimitReached);
            window.removeEventListener('lovelya_api_key_invalid', handleInvalidKey);
        };
    }, []);

    if (!modalType) return null;

    const isLimit = modalType === 'limit';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                    <div className="p-8 text-center">
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 ${
                            isLimit 
                                ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-500' 
                                : 'bg-amber-50 dark:bg-amber-900/20 text-amber-500'
                        }`}>
                            <i className={`fas ${isLimit ? 'fa-bolt-lightning' : 'fa-key'} text-3xl`}></i>
                        </div>

                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
                            {isLimit ? 'API Key Telah Habis' : 'API Key Tidak Valid'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed mb-6">
                            {isLimit 
                                ? 'Wah, sepertinya Anda belajar sangat giat hari ini! Semua kuota kunci AI Anda sudah terpakai maksimal.'
                                : 'API Key yang Anda masukkan sepertinya tidak valid atau salah. Silakan periksa kembali dan pastikan key sudah benar.'
                            }
                        </p>

                        {/* Tutorial Video Link - shown for invalid key */}
                        {!isLimit && (
                            <a
                                href="https://youtu.be/L1uiW--pyTE"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 p-3 mb-5 bg-gradient-to-r from-red-50 via-red-50 to-orange-50 dark:from-red-900/20 dark:via-red-900/15 dark:to-orange-900/10 rounded-xl border border-red-100 dark:border-red-800/40 hover:border-red-300 dark:hover:border-red-700 hover:shadow-md transition-all duration-300 cursor-pointer text-left"
                            >
                                <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center shadow-md shadow-red-200 dark:shadow-red-900/30 group-hover:scale-110 transition-transform duration-300 shrink-0">
                                    <i className="fas fa-play text-white text-[10px] ml-0.5"></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-black text-gray-800 dark:text-white leading-tight">
                                        📺 Tonton Tutorial Setting API Key
                                    </p>
                                    <p className="text-[9px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                                        Ikuti panduan langkah demi langkah
                                    </p>
                                </div>
                                <i className="fas fa-external-link-alt text-red-400 text-[10px] shrink-0"></i>
                            </a>
                        )}

                        {/* Tips for invalid key */}
                        {!isLimit && (
                            <div className="text-left p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800/30 mb-5">
                                <p className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2">Langkah yang bisa dicoba:</p>
                                <ul className="space-y-1.5">
                                    <li className="text-[10px] text-gray-600 dark:text-gray-400 font-medium flex items-start gap-2">
                                        <span className="text-amber-500 mt-0.5">•</span>
                                        Pastikan API Key di-copy dengan benar (tanpa spasi)
                                    </li>
                                    <li className="text-[10px] text-gray-600 dark:text-gray-400 font-medium flex items-start gap-2">
                                        <span className="text-amber-500 mt-0.5">•</span>
                                        Buat API Key baru di <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-lovelya-600 underline font-bold">Google AI Studio</a>
                                    </li>
                                    <li className="text-[10px] text-gray-600 dark:text-gray-400 font-medium flex items-start gap-2">
                                        <span className="text-amber-500 mt-0.5">•</span>
                                        Update key Anda di menu Settings
                                    </li>
                                </ul>
                            </div>
                        )}

                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    setModalType(null);
                                    onNavigateToSettings();
                                }}
                                className="w-full py-4 bg-lovelya-600 text-white rounded-2xl font-black shadow-lg shadow-lovelya-200 hover:bg-lovelya-700 transition active:scale-95 flex items-center justify-center gap-2"
                            >
                                <i className="fas fa-cog"></i> {isLimit ? 'Update API Keys' : 'Buka Settings'}
                            </button>

                            <button
                                onClick={() => setModalType(null)}
                                className="w-full py-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold text-xs transition"
                            >
                                Nanti Saja
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 justify-center">
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isLimit ? 'bg-lovelya-500' : 'bg-amber-500'}`}></span>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">LovSpeak Intelligent Guard</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
