
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { requestAppRefresh } from '../../services/appRefresh';
import InstallPrompt from './InstallPrompt';

const LandingPage: React.FC = () => {
  const { login, isLoggingIn } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshApp = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    await requestAppRefresh();
  };

  const faqs = [
    { q: "What is LovSpeak?", a: "LovSpeak is an AI-powered English learning tool by Lovelya designed to help you master speaking, grammar, and vocabulary while integrating Islamic values and content." },
    { q: "How does the AI Speaking Partner work?", a: "Our AI uses advanced natural language processing to simulate real conversations. It provides instant feedback on your pronunciation, grammar, and fluency in real-time." },
    { q: "Is there Islamic content included?", a: "Yes! We believe in 'Where Language Meets Faith'. You'll find thematic bridges, stories of prophets, and Islamic adab integrated into your English lessons." },
    { q: "Can I track my progress?", a: "Absolutely. Your XP, badges, diary entries, and vocabulary are all synced to your Google account, so you can pick up right where you left off on any device." }
  ];

  const screenshots = [
    { title: "AI Conversation", img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80", desc: "Interactive chat with real-time feedback." },
    { title: "Islamic Themes", img: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=80", desc: "Learn English through faith-based content." },
    { title: "Progress Tracking", img: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80", desc: "Detailed analytics of your learning journey." }
  ];

  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const Modal: React.FC<{ title: string; isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ title, isOpen, onClose, children }) => (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
          >
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{title}</h3>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-gray-600 transition">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar text-gray-600 dark:text-gray-400 font-medium leading-relaxed space-y-4">
              {children}
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 text-center">
              <button onClick={onClose} className="bg-lovelya-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-lovelya-700 transition">
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-mesh dark:bg-mesh-dark bg-fixed overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-lg shadow-lovelya-200 overflow-hidden border border-gray-100 dark:border-gray-700">
              <img 
                src="/logo.svg?v=1.0.2" 
                alt="Lovelya Logo" 
                className="w-full h-full object-contain p-1" 
              />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-xs font-black text-lovelya-600 uppercase tracking-tighter">Lovelya</span>
              <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">LovSpeak</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshApp}
              disabled={isRefreshing}
              className="w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-lovelya-600 disabled:opacity-60 transition"
              aria-label="Refresh app"
              title="Check for updates and refresh"
            >
              <i className={`fas fa-rotate-right text-xs ${isRefreshing ? 'fa-spin' : ''}`}></i>
            </button>
            <button
              onClick={async () => {
                try {
                  await login();
                } catch (e: any) {
                  // Error handling is now in AuthContext alert, but we can add more specific guidance here
                  if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') {
                    const confirmNewTab = window.confirm("Kendala saat masuk? Coba buka di Tab Baru untuk akses yang lebih stabil. Buka sekarang?");
                    if (confirmNewTab) window.open(window.location.href, '_blank');
                  }
                }
              }}
              disabled={isLoggingIn}
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <i className="fas fa-circle-notch animate-spin"></i>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-lovelya-50 dark:bg-lovelya-900/30 text-lovelya-600 dark:text-lovelya-400 rounded-full text-xs font-black uppercase tracking-widest mb-6">
              Where Language Meets Faith
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 dark:text-white mb-8 leading-[1.1]">
              Master English with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lovelya-600 to-purple-600">
                AI Speaking Partner
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              Elevate your English proficiency through interactive AI conversations, personalized grammar coaching, and Islamic-integrated curriculum.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={async () => {
                  try {
                    await login();
                  } catch (e: any) {
                    if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') {
                      const confirmNewTab = window.confirm("Kendala saat masuk? Buka di Tab Baru untuk akses stabil?");
                      if (confirmNewTab) window.open(window.location.href, '_blank');
                    }
                  }
                }}
                disabled={isLoggingIn}
                className="w-full sm:w-auto bg-lovelya-600 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-lovelya-200 hover:bg-lovelya-700 transition active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? (
                  <i className="fas fa-circle-notch animate-spin"></i>
                ) : (
                  <i className="fab fa-google"></i>
                )}
                {isLoggingIn ? 'Signing In...' : 'Get Started'}
              </button>
              <a href="#about" className="w-full sm:w-auto px-10 py-5 rounded-2xl font-bold text-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                Learn More
              </a>
            </div>
            <div className="mt-6 space-y-2">
              <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                <i className="fas fa-shield-halved text-lovelya-500"></i>
                Secure login powered by Google & Firebase.
              </p>
              <p className="text-[9px] text-lovelya-500 font-bold uppercase tracking-widest animate-pulse">
                Tip: If login doesn't respond, please open this app in a new tab.
              </p>
            </div>
          </motion.div>

          {/* App Showcase Carousel */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-700 p-4 md:p-6 overflow-hidden">
              <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-gray-900">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentScreenshot}
                    src={screenshots[currentScreenshot].img} 
                    alt={screenshots[currentScreenshot].title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
                <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/60 to-transparent text-white text-left">
                  <h3 className="text-2xl font-black mb-1">{screenshots[currentScreenshot].title}</h3>
                  <p className="text-sm font-medium opacity-90">{screenshots[currentScreenshot].desc}</p>
                </div>
                
                {/* Carousel Controls */}
                <div className="absolute top-1/2 -translate-y-1/2 inset-x-4 flex justify-between pointer-events-none">
                  <button 
                    onClick={() => setCurrentScreenshot((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1))}
                    className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto hover:bg-white/40 transition"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button 
                    onClick={() => setCurrentScreenshot((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1))}
                    className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto hover:bg-white/40 transition"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Carousel Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {screenshots.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentScreenshot(i)}
                  className={`h-2 rounded-full transition-all ${currentScreenshot === i ? 'w-8 bg-lovelya-600' : 'w-2 bg-gray-300 dark:bg-gray-700'}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section (Informative Learn More) */}
      <section id="about" className="py-24 px-6 bg-white dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-lovelya-600 font-black uppercase tracking-widest text-sm">About LovSpeak</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mt-4 mb-8">A New Way to Learn English with Purpose</h2>
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                <p>
                  LovSpeak isn't just another language app. It's a comprehensive ecosystem designed by <strong>Lovelya</strong> to bridge the gap between linguistic excellence and spiritual growth.
                </p>
                <p>
                  By leveraging the power of <strong>AI</strong>, we provide a safe, non-judgmental environment for you to practice speaking. Whether you're a beginner or an advanced learner, our AI adapts to your level, correcting your mistakes and encouraging your progress.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <h4 className="text-2xl font-black text-lovelya-600 mb-2">100%</h4>
                    <p className="text-sm font-bold opacity-70 uppercase tracking-wider">Privacy Focused</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <h4 className="text-2xl font-black text-purple-600 mb-2">AI</h4>
                    <p className="text-sm font-bold opacity-70 uppercase tracking-wider">Powered by AI</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-lovelya-200 to-purple-200 dark:from-lovelya-900/20 dark:to-purple-900/20 rounded-[3rem] blur-2xl opacity-50"></div>
              <img 
                src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80" 
                alt="Learning with LovSpeak" 
                className="relative rounded-[3rem] shadow-2xl border border-white/20"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">Everything you need to excel</h2>
            <p className="text-gray-500 font-medium">Personalized learning path powered by advanced AI.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: 'fa-microphone-alt', title: 'Live Practice', desc: 'Real-time conversation with AI to boost your speaking confidence.', color: 'bg-rose-50 text-rose-600' },
              { icon: 'fa-spell-check', title: 'Grammar Mastery', desc: 'In-depth lessons and instant feedback on your writing.', color: 'bg-purple-50 text-purple-600' },
              { icon: 'fa-book-open', title: 'Islamic Content', desc: 'Learn English through thematic bridges and Islamic insights.', color: 'bg-lovelya-50 text-lovelya-600' },
              { icon: 'fa-map-location-dot', title: 'Personalized Roadmap', desc: 'A tailored learning path that evolves with your progress.', color: 'bg-blue-50 text-blue-600' },
              { icon: 'fa-gamepad', title: 'Interactive Games', desc: 'Master vocabulary and grammar through fun, engaging challenges.', color: 'bg-orange-50 text-orange-600' },
              { icon: 'fa-cloud-arrow-up', title: 'Cloud Sync', desc: 'Your progress and settings are safe and synced across all devices.', color: 'bg-cyan-50 text-cyan-600' }
            ].map((feature, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group">
                <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-transform`}>
                  <i className={`fas ${feature.icon}`}></i>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-500 font-medium">Everything you need to know about LovSpeak.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <span className="text-lg font-black text-gray-900 dark:text-white">{faq.q}</span>
                  <i className={`fas fa-chevron-down transition-transform ${activeFaq === i ? 'rotate-180' : ''}`}></i>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-6 text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
              <img 
                src="/logo.svg?v=1.0.2" 
                alt="Lovelya Logo" 
                className="w-full h-full object-contain p-1" 
              />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-[10px] font-black text-lovelya-600 uppercase tracking-tighter">Lovelya</span>
              <span className="text-xl font-black tracking-tighter">LovSpeak</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-500 text-sm font-medium">© 2026 LovSpeak by Lovelya. All rights reserved.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowPrivacy(true)} className="text-[10px] font-bold text-gray-400 hover:text-lovelya-600 uppercase tracking-widest transition">Privacy Policy</button>
              <span className="text-gray-200 dark:text-gray-800">•</span>
              <button onClick={() => setShowTerms(true)} className="text-[10px] font-bold text-gray-400 hover:text-lovelya-600 uppercase tracking-widest transition">Terms of Service</button>
            </div>
          </div>
          <div className="flex gap-6">
            <a 
              href="https://www.instagram.com/lovelya.jbi/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-500 transition"
            >
              <i className="fab fa-instagram text-2xl"></i>
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <Modal title="Privacy Policy" isOpen={showPrivacy} onClose={() => setShowPrivacy(false)}>
        <p>At <strong>LovSpeak by Lovelya</strong>, we take your privacy seriously. This policy explains how we handle your information.</p>
        <h4 className="text-gray-900 dark:text-white font-black">1. Information Collection</h4>
        <p>We use Google Authentication to manage your account. We only receive your email address and profile name to personalize your learning experience.</p>
        <h4 className="text-gray-900 dark:text-white font-black">2. Data Storage</h4>
        <p>Your learning progress (XP, badges, diary entries) is stored securely on Google Firebase servers. Your AI API Key is stored locally on your device and is never sent to our servers.</p>
        <h4 className="text-gray-900 dark:text-white font-black">3. Third-Party Services</h4>
        <p>We use Google AI services to power our speaking partner. Your voice data is processed according to Google's privacy standards for AI services.</p>
        <h4 className="text-gray-900 dark:text-white font-black">4. Security</h4>
        <p>We implement industry-standard security measures to protect your data from unauthorized access.</p>
      </Modal>

      <Modal title="Terms of Service" isOpen={showTerms} onClose={() => setShowTerms(false)}>
        <p>Welcome to <strong>LovSpeak</strong>. By using our application, you agree to the following terms.</p>
        <h4 className="text-gray-900 dark:text-white font-black">1. Acceptable Use</h4>
        <p>LovSpeak is designed for English language learning. Users are expected to maintain respectful behavior and follow the Islamic values integrated into the platform.</p>
        <h4 className="text-gray-900 dark:text-white font-black">2. AI API Usage</h4>
        <p>Users are responsible for providing and managing their own AI API Keys. LovSpeak is not responsible for any costs incurred through your AI provider.</p>
        <h4 className="text-gray-900 dark:text-white font-black">3. Intellectual Property</h4>
        <p>The content, design, and branding of LovSpeak are the property of <strong>Lovelya</strong>. You may not reproduce or redistribute our content without permission.</p>
        <h4 className="text-gray-900 dark:text-white font-black">4. Limitation of Liability</h4>
        <p>LovSpeak provides an AI-powered learning experience "as is". We do not guarantee specific learning outcomes or 100% accuracy of AI-generated content.</p>
      </Modal>
      <InstallPrompt />
    </div>
  );
};

export default LandingPage;
