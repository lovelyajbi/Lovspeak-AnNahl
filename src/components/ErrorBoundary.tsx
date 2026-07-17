
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    // Navigate to root and force a full page reload to reset all React state
    window.location.href = window.location.origin;
  };

  private handleClearAndReload = () => {
    // Nuclear option: clear potentially corrupted cache/state and reload
    try {
      // Only clear app-specific keys, preserve auth
      const keysToPreserve = ['lovelya_user_uid', 'lovelya_activated', 'lovelya_gemini_keys'];
      const preserved: Record<string, string> = {};
      keysToPreserve.forEach(key => {
        const val = localStorage.getItem(key);
        if (val) preserved[key] = val;
      });

      // Clear all
      localStorage.clear();
      sessionStorage.clear();

      // Restore critical keys
      Object.entries(preserved).forEach(([key, val]) => {
        localStorage.setItem(key, val);
      });
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }

    window.location.href = window.location.origin;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 bg-mesh dark:bg-mesh-dark p-6 text-center">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl p-8 md:p-10 border border-gray-100 dark:border-gray-700">
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Oops! Terjadi Kesalahan</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mb-8 leading-relaxed">
              Aplikasi mengalami kendala teknis. Silakan coba salah satu opsi di bawah ini untuk kembali ke aplikasi.
            </p>

            <div className="space-y-3">
              {/* Primary: Reload */}
              <button 
                onClick={this.handleReload}
                className="w-full bg-lovelya-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-lovelya-200/30 hover:bg-lovelya-700 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <i className="fas fa-redo"></i> Muat Ulang Halaman
              </button>

              {/* Secondary: Go Home */}
              <button 
                onClick={this.handleGoHome}
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-2xl font-black text-sm shadow-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <i className="fas fa-home"></i> Kembali ke Beranda
              </button>

              {/* Tertiary: Clear & Reload */}
              <button 
                onClick={this.handleClearAndReload}
                className="w-full border-2 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 py-3.5 rounded-2xl font-bold text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <i className="fas fa-broom"></i> Bersihkan Cache & Muat Ulang
              </button>
            </div>

            {/* Tips */}
            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30 text-left">
              <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1.5">💡 Tips</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                Jika masalah terus berlanjut, coba "Bersihkan Cache" di atas. Data belajar utama Anda akan tetap aman jika sudah terhubung dengan akun.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-xl text-left text-xs overflow-auto max-h-40 text-rose-600 dark:text-rose-400 font-mono">
                {this.state.error?.toString()}
              </pre>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">LovSpeak Error Recovery</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
