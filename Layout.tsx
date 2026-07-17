
import React, { useState, useEffect } from 'react';
import { AppView } from './types';
import GlobalTimer from './components/GlobalTimer';

interface LayoutProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, onNavigate, children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const navItems = [
    { id: AppView.HOME, label: 'Home', icon: 'fa-home' },
    { id: AppView.PROFILE, label: 'My Profile', icon: 'fa-user-circle' },
    { id: AppView.READING, label: 'Reading', icon: 'fa-book-open' },
    { id: AppView.GRAMMAR, label: 'Grammar', icon: 'fa-spell-check' },
    { id: AppView.VOCAB, label: 'Vocabulary', icon: 'fa-list-ul' },
    { id: AppView.TRANSLATE, label: 'Translate', icon: 'fa-language' },
    { id: AppView.LIVE, label: 'Live Practice', icon: 'fa-microphone-alt' },
    { id: AppView.GAMES, label: 'Game Center', icon: 'fa-gamepad' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row font-sans transition-colors duration-200">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm z-20">
        <h1 className="text-xl font-bold text-lovelya-600 dark:text-lovelya-300">Lovelya</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 dark:text-gray-200">
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 ease-in-out z-10 flex flex-col
      `}>
        <div className="p-6 text-center border-b border-gray-100 dark:border-gray-700 hidden md:block">
          <h1 className="text-2xl font-bold text-lovelya-600 dark:text-lovelya-300">Lovelya</h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">AI Speaking Partner</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                ${currentView === item.id 
                  ? 'bg-lovelya-100 text-lovelya-700 dark:bg-lovelya-900/30 dark:text-lovelya-300 font-medium' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}
              `}
            >
              <i className={`fas ${item.icon} w-6 text-center`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
           <button 
             onClick={() => setIsDark(!isDark)}
             className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
           >
             <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
             <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto min-h-[calc(100vh-160px)]">
            {children}
          </div>
        </div>

        {/* Global Floating Timer (Persistent across modules) */}
        <GlobalTimer />

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
             <i className="fab fa-instagram text-lovelya-500"></i>
             <a 
               href="https://www.instagram.com/lovelya.jbi/" 
               target="_blank" 
               rel="noreferrer"
               className="hover:text-lovelya-600 dark:hover:text-lovelya-300 font-medium"
             >
               @lovelya.jbi
             </a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Layout;
