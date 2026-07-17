
import React, { useState, useEffect } from 'react';

const SidebarTimer: React.FC = () => {
  // Default 25 minutes (Pomodoro style)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let interval: any = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Optional: Add sound effect here if needed
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActive(!isActive);
  };
  
  const resetTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActive(false);
    setTimeLeft(initialTime);
  };

  const adjustTime = (minutes: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newTime = Math.max(60, initialTime + minutes * 60); // Minimum 1 minute
    setInitialTime(newTime);
    setTimeLeft(newTime);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isExpanded) {
    return (
      <div 
        onClick={() => setIsExpanded(true)}
        className="mx-4 mb-6 cursor-pointer group"
      >
        <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md flex items-center justify-between hover:shadow-lg transition-all border border-white/10 relative overflow-hidden">
            {/* Active Indicator Bar */}
            {isActive && <div className="absolute bottom-0 left-0 h-1 bg-lovelya-400 animate-pulse w-full"></div>}
            
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0`}>
                    <i className={`fas ${isActive ? 'fa-stopwatch animate-pulse' : 'fa-clock'} text-sm`}></i>
                </div>
                <div>
                    <div className="text-[10px] font-bold opacity-80 uppercase tracking-wider">Focus Timer</div>
                    <div className="text-sm font-mono font-bold leading-none">{formatTime(timeLeft)}</div>
                </div>
            </div>
            
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white/80 pr-1">
                <i className="fas fa-chevron-down text-xs"></i>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 mb-6 p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg relative overflow-hidden group border border-white/10 animate-fade-in">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
            <i className="fas fa-hourglass-half text-6xl transform rotate-12"></i>
        </div>
        
        {/* Collapse Button */}
        <button 
            onClick={() => setIsExpanded(false)}
            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-white/50 hover:text-white z-20 transition bg-black/10 rounded-full"
        >
            <i className="fas fa-chevron-up text-[10px]"></i>
        </button>

        <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 flex items-center gap-1">
                    <i className="fas fa-clock"></i> Focus Timer
                </span>
            </div>
            
            <div className="text-4xl font-mono font-black mb-4 tracking-wider text-center drop-shadow-md">
                {formatTime(timeLeft)}
            </div>
            
            {/* Quick Adjust */}
            <div className="flex justify-center gap-2 mb-4">
                 <button 
                    onClick={(e) => adjustTime(-5, e)} 
                    className="px-3 py-1 rounded-lg bg-black/20 hover:bg-black/30 text-[10px] font-bold transition"
                >
                    -5m
                </button>
                <button 
                    onClick={(e) => adjustTime(5, e)} 
                    className="px-3 py-1 rounded-lg bg-black/20 hover:bg-black/30 text-[10px] font-bold transition"
                >
                    +5m
                </button>
            </div>

            <div className="flex gap-2">
                <button 
                    onClick={toggleTimer}
                    className={`flex-1 py-2 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm ${
                        isActive 
                        ? 'bg-lovelya-400 text-lovelya-900 hover:bg-lovelya-300' 
                        : 'bg-white text-indigo-600 hover:bg-indigo-50'
                    }`}
                >
                    <i className={`fas ${isActive ? 'fa-pause' : 'fa-play'}`}></i>
                    {isActive ? 'PAUSE' : 'START'}
                </button>
                <button 
                    onClick={resetTimer}
                    className="w-10 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition flex items-center justify-center backdrop-blur-sm"
                    title="Reset"
                >
                    <i className="fas fa-redo-alt text-xs"></i>
                </button>
            </div>
        </div>
    </div>
  );
};

export default SidebarTimer;
