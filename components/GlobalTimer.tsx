
import React, { useState, useEffect, useRef } from 'react';

const GlobalTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true); // Minimized by default
  const [isVisible, setIsVisible] = useState(false); // Hidden until first used

  // Interval Logic
  useEffect(() => {
    let interval: any = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  // Event Listener Logic (FIXED: Empty dependency array)
  // This ensures the listener is attached ONCE and never removed while the app runs.
  useEffect(() => {
    const handleStartFocus = () => {
      // Use functional updates or direct sets to guarantee execution regardless of current state
      setIsVisible(true);
      setIsMinimized(false);
      setIsActive(true);
    };
    
    window.addEventListener('start-focus-timer', handleStartFocus);
    
    // Cleanup only on unmount
    return () => {
        window.removeEventListener('start-focus-timer', handleStartFocus);
    };
  }, []); // Empty dependency array is critical here

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const closeTimer = () => {
    setIsActive(false);
    setIsVisible(false);
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  // Minimized View
  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-24 right-6 z-[100] bg-gray-900 text-white p-3 rounded-full shadow-xl border border-gray-700 hover:scale-110 transition-transform animate-bounce-in flex items-center justify-center gap-2 group cursor-pointer"
      >
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
        <i className="fas fa-stopwatch text-xl"></i>
        {isActive && <span className="text-xs font-mono font-bold pr-1">{formatTime(seconds)}</span>}
      </button>
    );
  }

  // Expanded View
  return (
    <div className="fixed bottom-24 right-6 z-[100] animate-slide-up">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-64 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 flex justify-between items-center cursor-move">
          <div className="flex items-center gap-2 text-white">
            <i className="fas fa-clock"></i>
            <span className="text-sm font-bold uppercase tracking-wider">Focus Timer</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsMinimized(true)} className="text-white/80 hover:text-white transition">
              <i className="fas fa-minus text-xs"></i>
            </button>
            <button onClick={closeTimer} className="text-white/80 hover:text-white transition">
              <i className="fas fa-times text-xs"></i>
            </button>
          </div>
        </div>

        {/* Display */}
        <div className="p-5 text-center">
          <div className="text-5xl font-mono font-black text-gray-800 dark:text-white mb-2 tracking-tighter">
            {formatTime(seconds)}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest mb-4">
            {isActive ? 'Focusing...' : 'Paused'}
          </p>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            <button
              onClick={toggleTimer}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg transition-transform hover:scale-105 active:scale-95 ${
                isActive 
                  ? 'bg-lovelya-100 text-lovelya-600 dark:bg-lovelya-900/30 dark:text-lovelya-400' 
                  : 'bg-indigo-600 text-white'
              }`}
            >
              <i className={`fas ${isActive ? 'fa-pause' : 'fa-play pl-1'}`}></i>
            </button>
            <button
              onClick={resetTimer}
              className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center text-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <i className="fas fa-redo"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalTimer;
