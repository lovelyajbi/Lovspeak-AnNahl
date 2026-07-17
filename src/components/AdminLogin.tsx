import React, { useState } from 'react';
import { signInWithEmail, signInWithGoogle } from '../firebase';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setLoading(true);
    try { await signInWithEmail(email, password); }
    catch { setError('Email atau password admin tidak valid.'); }
    finally { setLoading(false); }
  };

  const loginOwner = async () => {
    setError(''); setLoading(true);
    try { await signInWithGoogle(); }
    catch { setError('Login Google tidak dapat diproses.'); }
    finally { setLoading(false); }
  };

  return <main className="min-h-screen grid place-items-center bg-slate-950 p-5 text-white">
    <form onSubmit={submit} className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900 p-7 md:p-9 shadow-2xl">
      <div className="w-14 h-14 rounded-2xl bg-violet-500/20 text-violet-300 grid place-items-center mb-6"><i className="fas fa-shield-halved text-2xl"></i></div>
      <p className="text-xs font-black uppercase tracking-[.25em] text-violet-300">LovSpeak LMS</p><h1 className="text-3xl font-black mt-1">Login Admin</h1><p className="text-slate-400 mt-2 text-sm">Gunakan akun admin dengan email dan password khusus.</p>
      <label className="block mt-6 text-sm font-bold">Email admin<input required type="email" value={email} onChange={event => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-400" /></label>
      <label className="block mt-4 text-sm font-bold">Password<input required type="password" value={password} onChange={event => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-400" /></label>
      {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}
      <button disabled={loading} className="mt-6 w-full rounded-xl bg-violet-500 py-3.5 font-black disabled:opacity-60">{loading ? 'Memproses...' : 'Masuk sebagai Admin'}</button>
      <button type="button" disabled={loading} onClick={loginOwner} className="mt-3 w-full rounded-xl border border-slate-700 py-3 font-bold text-sm text-slate-200 disabled:opacity-60"><i className="fab fa-google mr-2"></i>Masuk Google sebagai pemilik</button>
      <a href="/" className="mt-5 block text-center text-sm text-slate-400 hover:text-white">Kembali ke LovSpeak</a>
    </form>
  </main>;
};

export default AdminLogin;
