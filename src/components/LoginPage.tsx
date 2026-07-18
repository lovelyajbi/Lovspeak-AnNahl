import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithCustomToken } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';

/** Focused entry screen for both learners and staff. */
const LoginPage: React.FC = () => {
  const { login, isLoggingIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [error, setError] = useState('');

  const submitAdmin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setAdminLoading(true);
    try {
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.token) throw new Error(result.error || 'Login gagal');
      await signInWithCustomToken(auth, result.token);
      window.location.assign('/admin');
    } catch {
      setError('Username atau password admin tidak valid.');
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-lovelya-50 px-5 py-10 text-slate-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 dark:text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/60 dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/30 md:grid-cols-[1.05fr_.95fr]">
          <div className="hidden bg-gradient-to-br from-lovelya-600 to-indigo-700 p-10 text-white md:flex md:flex-col md:justify-between">
            <div>
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl"><i className="fas fa-language" /></div>
              <p className="text-xs font-black uppercase tracking-[.25em] text-white/70">LOVSPEAK LMS</p>
              <h1 className="mt-3 text-4xl font-black leading-tight">Belajar bahasa Inggris dengan terarah.</h1>
              <p className="mt-5 max-w-sm text-sm leading-6 text-white/80">Masuk untuk melanjutkan daily plan, roadmap, dan perkembangan belajar Anda.</p>
            </div>
            <p className="text-xs text-white/60">Satu pintu masuk untuk siswa dan admin sekolah.</p>
          </div>

          <div className="p-7 sm:p-10">
            <p className="text-xs font-black uppercase tracking-[.22em] text-lovelya-600 dark:text-lovelya-300">Selamat datang</p>
            <h2 className="mt-2 text-3xl font-black">Masuk ke LovSpeak</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">Pilih cara masuk sesuai akun Anda.</p>

            <button type="button" onClick={() => login()} disabled={isLoggingIn} className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 font-bold text-slate-700 shadow-sm transition hover:border-lovelya-300 hover:bg-lovelya-50 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
              <i className="fab fa-google text-lg text-[#4285F4]" />
              {isLoggingIn ? 'Membuka Google...' : 'Masuk dengan Google'}
            </button>

            <div className="my-7 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-400"><span className="h-px flex-1 bg-slate-200 dark:bg-gray-700" />atau admin<span className="h-px flex-1 bg-slate-200 dark:bg-gray-700" /></div>

            <form onSubmit={submitAdmin} className="space-y-4">
              <label className="block text-sm font-bold">Username admin<input required value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-lovelya-500 focus:ring-2 focus:ring-lovelya-500/20 dark:border-gray-700 dark:bg-gray-800" /></label>
              <label className="block text-sm font-bold">Password<input required type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-lovelya-500 focus:ring-2 focus:ring-lovelya-500/20 dark:border-gray-700 dark:bg-gray-800" /></label>
              {error && <p role="alert" className="text-sm font-semibold text-rose-600">{error}</p>}
              <button disabled={adminLoading} className="w-full rounded-xl bg-slate-900 py-3.5 font-black text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-lovelya-600 dark:hover:bg-lovelya-500">{adminLoading ? 'Memproses...' : 'Masuk sebagai Admin'}</button>
            </form>
            <p className="mt-6 text-center text-xs text-slate-400">Akun Google admin tetap masuk ke LovSpeak terlebih dahulu. Dashboard admin tersedia dari menu Profil.</p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
