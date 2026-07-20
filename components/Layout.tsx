
import React, { useState, useEffect, useRef } from 'react';
import { AppView, UserProfile } from '../types';
import { getThemeColor, saveThemeColor, getUserProfile } from '../services/storage';
import { audioService } from '../services/audioService';
import { requestAppRefresh } from '../services/appRefresh';
import SidebarTimer from './SidebarTimer';
import GlobalTimer from './GlobalTimer';
import FeedbackNotifications from '../src/components/FeedbackNotifications';
import { useAuth } from '../src/contexts/AuthContext';

interface LayoutProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  children: React.ReactNode;
  userProfile: UserProfile | null;
}

// Function to generate shades from hex color
function generateShades(hexColor: string) {
  // Convert hex to RGB
  let r = 0, g = 0, b = 0;
  if (!hexColor) return {};

  if (hexColor.length === 4) {
    r = parseInt("0x" + hexColor[1] + hexColor[1]);
    g = parseInt("0x" + hexColor[2] + hexColor[2]);
    b = parseInt("0x" + hexColor[3] + hexColor[3]);
  } else if (hexColor.length === 7) {
    r = parseInt("0x" + hexColor[1] + hexColor[2]);
    g = parseInt("0x" + hexColor[3] + hexColor[4]);
    b = parseInt("0x" + hexColor[5] + hexColor[6]);
  }

  // Helper to mix with white or black
  const mix = (r: number, g: number, b: number, percent: number, isDark: boolean) => {
    const t = isDark ? 0 : 255;
    const newR = Math.round(r + (t - r) * percent);
    const newG = Math.round(g + (t - g) * percent);
    const newB = Math.round(b + (t - b) * percent);
    return `rgb(${newR}, ${newG}, ${newB})`;
  };

  return {
    50: mix(r, g, b, 0.95, false),
    100: mix(r, g, b, 0.9, false),
    200: mix(r, g, b, 0.75, false),
    300: mix(r, g, b, 0.6, false),
    400: mix(r, g, b, 0.3, false),
    500: `rgb(${r}, ${g}, ${b})`, // Base
    600: mix(r, g, b, 0.1, true),
    700: mix(r, g, b, 0.3, true),
    800: mix(r, g, b, 0.5, true),
    900: mix(r, g, b, 0.7, true),
  };
}

const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, children, userProfile }) => {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Desktop sidebar state
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [customColor, setCustomColor] = useState(getThemeColor());
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    // Initialize Theme Color from Storage
    const savedColor = getThemeColor();
    if (savedColor) updateTheme(savedColor);

    // Initialize Font Size
    const savedFontSize = (localStorage.getItem('lovelya_font_size') || 'normal') as any;
    updateGlobalFontSize(savedFontSize);
  }, []);

  const updateGlobalFontSize = (size: 'normal' | 'medium' | 'large') => {
    try {
      const root = document.documentElement;
      let baseSize = '14px'; // Changed from 16px to 14px for a premium, less cramped look
      if (size === 'medium') baseSize = '15px';
      if (size === 'large') baseSize = '16px';
      root.style.fontSize = baseSize;
      // Force a repaint for some browsers
      root.style.display = 'none';
      root.offsetHeight; // no-op
      root.style.display = '';
    } catch (e) {
      console.error("Failed to update font size", e);
    }
  };

  const updateTheme = (color: string) => {
    setCustomColor(color);
    saveThemeColor(color); // Persist
    const shades = generateShades(color);
    const root = document.documentElement;
    if (shades && root) {
      Object.keys(shades).forEach(key => {
        root.style.setProperty(`--color-lovelya-${key}`, shades[key as any]);
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (mainContentRef.current) {
        setShowScrollTop(mainContentRef.current.scrollTop > 300);
      }
    };
    const div = mainContentRef.current;
    if (div) div.addEventListener('scroll', handleScroll);
    return () => { if (div) div.removeEventListener('scroll', handleScroll); };
  }, []);

  const scrollToTop = () => {
    mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const refreshApp = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    await requestAppRefresh();
  };

  const navGroups = [
    {
      title: 'Main Menu',
      items: [
        { id: AppView.HOME, label: 'Dashboard', icon: 'fa-house' },
        { id: AppView.ROADMAP, label: 'Learning Roadmap', icon: 'fa-map-marked-alt' },
        { id: AppView.PROFILE, label: 'My Profile', icon: 'fa-user-circle' },
      ]
    },
    {
      title: 'Practice',
      items: [
        { id: AppView.READING, label: 'Reading', icon: 'fa-book-open-reader' },
        { id: AppView.LISTENING, label: 'Listening', icon: 'fa-headphones-simple' },
        { id: AppView.SHADOWING, label: 'Shadowing Lab', icon: 'fa-microphone-lines' },
        { id: AppView.GRAMMAR, label: 'Grammar', icon: 'fa-wand-magic-sparkles' },
        { id: AppView.VOCAB, label: 'Vocabulary', icon: 'fa-shapes' },
        { id: AppView.LIVE, label: 'Live Practice', icon: 'fa-comments' },
      ]
    },
    {
      title: 'Tools',
      items: [
        { id: AppView.DIARY, label: 'My Diary', icon: 'fa-book-bookmark' },
        { id: AppView.CHAT, label: 'AI Tutor', icon: 'fa-message' },
        { id: AppView.TRANSLATE, label: 'Translate', icon: 'fa-language' },
        { id: AppView.GAMES, label: 'Game Center', icon: 'fa-gamepad' },
        { id: AppView.SETTINGS, label: 'Settings', icon: 'fa-cog' },
      ]
    }
  ];

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col md:flex-row font-sans text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      {/* Mobile Header - Redesigned to match desktop style */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40 shadow-sm shrink-0">
        <button onClick={() => onNavigate(AppView.HOME)} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg shadow-lovelya-500/30 overflow-hidden border border-gray-100 dark:border-gray-800">
            <img
              src="/logo.svg?v=1.0.2"
              alt="Lovelya Logo"
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div className="text-left">
            <h1 className="text-sm font-black text-gray-900 dark:text-white tracking-tight leading-none uppercase">LovSpeak</h1>
            <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">AI Partner</span>
          </div>
        </button>

        <div className="flex items-center gap-1">
          <FeedbackNotifications user={user} />
          <button
            onClick={refreshApp}
            disabled={isRefreshing}
            className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-lovelya-600 disabled:opacity-60 transition"
            aria-label="Refresh app"
            title="Refresh App"
          >
            <i className={`fas fa-rotate-right text-[10px] ${isRefreshing ? 'fa-spin' : ''}`}></i>
          </button>

          <button
            onClick={() => setIsDark(!isDark)}
            className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-lovelya-600 transition"
          >
            <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'} text-[10px]`}></i>
          </button>

          <button
            onClick={() => {
              audioService.play('nav');
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-lovelya-600 transition"
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-[10px]`}></i>
          </button>
        </div>
      </div>

      {/* Backdrop for Mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar - Enhanced UI with Desktop Collapsible Logic & Independent Scroll */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 z-50 flex flex-col
        bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800
        transition-all duration-300 ease-in-out
        shadow-2xl md:shadow-none
        h-full
        
        /* Mobile Behavior */
        w-72 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        
        /* Desktop Behavior */
        md:translate-x-0
        ${isSidebarOpen ? 'md:w-72' : 'md:w-0 md:overflow-hidden'}
      `}>
        {/* Inner Wrapper with fixed width to prevent content squishing during transition */}
        <div className="w-72 flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-8 pb-6 flex justify-between items-center shrink-0">
            <button onClick={() => onNavigate(AppView.HOME)} className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg shadow-lovelya-500/30 group-hover:scale-110 transition-transform duration-300 overflow-hidden border border-gray-100 dark:border-gray-800">
                <img
                  src="/logo.svg?v=1.0.2"
                  alt="Lovelya Logo"
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-none group-hover:text-lovelya-600 transition-colors">LovSpeak</h1>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">AI Partner</span>
              </div>
            </button>
            <FeedbackNotifications user={user} />
          </div>

          {/* Navigation - Scrollable Area */}
          <nav data-tour="bottom-nav" className="flex-1 px-4 py-2 space-y-8 overflow-y-auto custom-scrollbar pb-4">
            {navGroups.map((group, idx) => (
              <div key={idx}>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-4 opacity-80">{group.title}</div>

                {/* Insert Timer specifically for the first group (Main Menu) */}
                {idx === 0 && <SidebarTimer />}

                <div className="space-y-1.5">
                  {group.items.map((item) => {
                    const isActive = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        data-tour={item.id === AppView.ROADMAP ? 'roadmap-nav' : undefined}
                        onClick={() => {
                          audioService.play('nav');
                          onNavigate(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`
                            w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative
                            ${isActive
                            ? 'bg-lovelya-50 dark:bg-lovelya-900/10 text-lovelya-600 dark:text-lovelya-400 font-bold shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200 font-medium'}
                          `}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-lovelya-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                        )}

                        <div className={`
                            w-8 h-8 flex items-center justify-center rounded-lg text-lg transition-all duration-300
                            ${isActive
                            ? 'bg-white dark:bg-gray-800 shadow-sm text-lovelya-500 scale-110'
                            : 'bg-transparent group-hover:bg-white dark:group-hover:bg-gray-800 group-hover:shadow-sm group-hover:scale-110'}
                          `}>
                          <i className={`fas ${item.icon}`}></i>
                        </div>

                        <span className="tracking-wide text-sm">{item.label}</span>

                        {isActive && <i className="fas fa-chevron-right ml-auto text-xs opacity-50"></i>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Settings Footer - Fixed at bottom of Sidebar */}
          <div className="p-4 mx-4 mb-4 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 shrink-0">
            <div className="flex flex-col gap-3">
              <button
                onClick={refreshApp}
                disabled={isRefreshing}
                className="w-full h-10 rounded-xl bg-white dark:bg-gray-700 shadow-sm border border-gray-100 dark:border-gray-600 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-300 hover:text-lovelya-600 dark:hover:text-lovelya-400 disabled:opacity-60 transition-colors"
                aria-label="Refresh app"
                title="Check for updates and refresh"
              >
                <i className={`fas fa-rotate-right text-xs ${isRefreshing ? 'fa-spin' : ''}`}></i>
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {isRefreshing ? 'Refreshing...' : 'Refresh App'}
                </span>
              </button>

              <div className="flex justify-between items-center px-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Appearance</span>
                <button
                  onClick={() => {
                    audioService.play('toggle');
                    setIsDark(!isDark);
                  }}
                  className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-300 transition-colors"
                >
                  <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
                </button>
              </div>

              {/* Custom Color Picker */}
              <div className="relative w-full h-10 rounded-xl overflow-hidden cursor-pointer shadow-sm border border-gray-200 dark:border-gray-600 group">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => updateTheme(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                  className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none transition-all duration-300 group-hover:opacity-90"
                  style={{ backgroundColor: customColor }}
                >
                  <span className="text-white text-[10px] font-bold uppercase tracking-wider drop-shadow-md">Theme Color</span>
                  <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <i className="fas fa-palette text-[8px] text-white"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* FIXED Toggle Button (Vertically Centered & Always Visible) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`
            hidden md:flex items-center justify-center
            fixed top-1/2 z-[60]
            w-6 h-14
            bg-white dark:bg-gray-800
            border-y border-r border-gray-200 dark:border-gray-700
            rounded-r-xl shadow-[2px_0_15px_rgba(0,0,0,0.08)]
            text-gray-400 hover:text-lovelya-600 dark:hover:text-lovelya-400
            hover:w-8
            transition-all duration-300 ease-in-out
            focus:outline-none
            ${isSidebarOpen ? 'left-72' : 'left-0'}
            -translate-y-1/2
        `}
        style={{ transitionProperty: 'left, width, color, background-color' }}
        aria-label={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        title={isSidebarOpen ? "Collapse Menu" : "Expand Menu"}
      >
        <div className="flex flex-col gap-1 items-center">
          <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
          <i className={`fas ${isSidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'} text-[10px]`}></i>
          <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
        </div>
      </button>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-mesh dark:bg-mesh-dark bg-fixed">
        <div ref={mainContentRef} className="flex-1 overflow-y-auto scroll-smooth pb-20 md:pb-0">
          <div className="max-w-6xl mx-auto p-5 md:p-8 lg:p-10 min-h-[calc(100vh-80px)]">
            {children}
          </div>

          <footer className="py-8 text-center">
            <a href="https://instagram.com/lovelya.jbi" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-sm border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-lovelya-600 dark:hover:text-lovelya-400 hover:scale-105 transition-all group">
              <i className="fab fa-instagram text-xl group-hover:text-pink-500 transition-colors"></i>
              <span className="font-bold text-xs tracking-widest uppercase">@lovelya.jbi</span>
            </a>
          </footer>
        </div>

        {/* Bottom Navigation for Mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 px-2 py-1.5 flex justify-around items-center z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          {[
            { id: AppView.HOME, label: 'Home', icon: 'fa-house' },
            { id: AppView.ROADMAP, label: 'Roadmap', icon: 'fa-map-marked-alt' },
            { id: AppView.GAMES, label: 'Games', icon: 'fa-gamepad' },
            { id: AppView.PROFILE, label: 'Profile', icon: 'fa-user-circle' },
            { id: AppView.SETTINGS, label: 'Settings', icon: 'fa-cog' },
          ].map(item => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  audioService.play('nav');
                  onNavigate(item.id);
                }}
                className={`flex flex-col items-center gap-0.5 transition-all duration-300 ${isActive ? 'text-lovelya-600 scale-105' : 'text-gray-400'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[13px] ${isActive ? 'bg-lovelya-50 dark:bg-lovelya-900/20' : ''}`}>
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <span className="text-[7px] font-black uppercase tracking-wider">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global Timer Floating Widget */}
        <GlobalTimer />

        <button
          onClick={scrollToTop}
          className={`
            absolute bottom-8 right-8 w-12 h-12 bg-white dark:bg-gray-800 text-lovelya-600 rounded-full shadow-lg border border-gray-100 dark:border-gray-700
            flex items-center justify-center text-lg transition-all duration-300 hover:scale-110 z-30 hover:shadow-xl
            ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
          `}
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      </main>
    </div>
  );
};

export default Layout;
