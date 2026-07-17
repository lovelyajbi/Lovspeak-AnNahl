
import React from 'react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  message?: string;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ message = "Preparing your journey" }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-gray-950 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-64 h-64 bg-lovelya-200 dark:bg-lovelya-900/30 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-32 h-32 md:w-40 md:h-40 bg-white dark:bg-gray-900 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-lovelya-500/20 mb-8 relative border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
            <img 
              src="/logo.svg?v=1.0.2" 
              alt="LovSpeak Logo" 
              className="w-full h-full object-contain p-4"
            />
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-[2.5rem] border-4 border-lovelya-400"
            />
        </motion.div>

        {/* Text Animation */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="space-y-4"
        >
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            LovSpeak
          </h1>
          <p className="text-sm md:text-lg font-bold text-lovelya-600 dark:text-lovelya-400 uppercase tracking-[0.3em]">
            where language meets faith
          </p>
          <p className="text-[10px] md:text-xs font-black text-gray-400 dark:text-gray-500 mt-2 uppercase tracking-widest bg-gray-50 dark:bg-gray-900 px-3 py-1 rounded-full">
            {message}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mt-12 w-48 md:w-64 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative border border-gray-200 dark:border-gray-700 shadow-inner">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-lovelya-500 to-transparent w-full"
          />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest text-center"
      >
        by lovelya
      </motion.div>
    </div>
  );
};

export default SplashScreen;
