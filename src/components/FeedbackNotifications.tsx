import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { AdminFeedback } from '../../types';
import { deleteFeedback, deleteReply, getReplies, getUserFeedback, markFeedbackRead, sendReply } from '../../services/admin';

const FeedbackNotifications: React.FC<{ user: User | null }> = ({ user }) => {
  const [items, setItems] = useState<AdminFeedback[]>([]);
  const [open, setOpen] = useState(false);
  const [replies, setReplies] = useState<Record<string, { authorName: string; message: string; id: string }[]>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  useEffect(() => {
    if (!user) return;
    const load = () => getUserFeedback(user.uid).then(async feedback => {
      setItems(feedback);
      const response = await Promise.all(feedback.map(async item => [item.id, await getReplies(item.id)] as const));
      setReplies(Object.fromEntries(response));
    }).catch(() => {});
    load(); const interval = window.setInterval(load, 45000); return () => window.clearInterval(interval);
  }, [user]);
  if (!user) return null;
  const unreadItems = items.filter(item => !item.readAt);
  const readAll = async () => { await Promise.all(unreadItems.map(item => markFeedbackRead(item.id))); setItems(current => current.map(item => unreadItems.some(unread => unread.id === item.id) ? { ...item, readAt: new Date().toISOString() } : item)); };
  const reply = async (feedbackId: string) => {
    const message = drafts[feedbackId]?.trim();
    if (!message) return;
    await sendReply(feedbackId, { authorId: user.uid, authorName: user.displayName || user.email || 'User', message });
    setReplies(current => ({ ...current, [feedbackId]: [...(current[feedbackId] || []), { id: `${Date.now()}`, authorName: user.displayName || user.email || 'User', message }] }));
    setDrafts(current => ({ ...current, [feedbackId]: '' }));
  };
  const removeFeedback = async (feedbackId: string) => {
    if (!window.confirm('Hapus komentar ini dan seluruh balasannya?')) return;
    await deleteFeedback(feedbackId);
    setItems(current => current.filter(item => item.id !== feedbackId));
  };
  const removeReply = async (feedbackId: string, replyId: string) => {
    if (!window.confirm('Hapus balasan ini?')) return;
    await deleteReply(feedbackId, replyId);
    setReplies(current => ({ ...current, [feedbackId]: (current[feedbackId] || []).filter(item => item.id !== replyId) }));
  };
  return <div className="relative">
    <button onClick={() => setOpen(!open)} className="relative w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-lovelya-600" aria-label="Notifikasi feedback admin"><i className="fas fa-bell text-[11px]"></i>{items.length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-white dark:border-gray-900"></span>}</button>
    {open && <div className="absolute right-0 top-10 z-[100] w-80 max-h-[min(34rem,80vh)] overflow-y-auto rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-700 p-4"><div className="flex justify-between gap-3 items-center"><div><b>Komentar Admin</b><p className="text-[10px] text-gray-400 mt-0.5">Riwayat tersimpan di akun Anda</p></div>{unreadItems.length > 0 && <button onClick={readAll} className="text-xs text-lovelya-600 font-bold">Tandai dibaca</button>}</div>{items.length ? <div className="mt-3 space-y-3">{items.map(item => <div key={item.id} className={`rounded-xl p-3 text-sm border ${item.readAt ? 'bg-gray-50 dark:bg-gray-800 border-transparent' : 'bg-lovelya-50/60 dark:bg-lovelya-900/20 border-lovelya-200 dark:border-lovelya-700'}`}><div className="flex justify-between gap-2"><p className="text-[10px] font-black uppercase text-lovelya-600">{item.scope === 'task' ? item.taskTitle || 'Task' : 'Komentar umum'}</p><span className="text-[10px] text-gray-400">{new Date(item.createdAt).toLocaleDateString('id-ID')}</span></div><p className="mt-1 whitespace-pre-wrap">{item.message}</p>{(replies[item.id] || []).map(replyItem => <div key={replyItem.id} className="mt-2 flex items-start gap-2 rounded-lg bg-white/70 dark:bg-gray-700 p-2 text-xs"><p className="flex-1"><b>{replyItem.authorName}:</b> {replyItem.message}</p><button onClick={() => removeReply(item.id, replyItem.id)} className="text-gray-400 hover:text-red-500" aria-label="Hapus balasan"><i className="fas fa-trash text-[10px]"></i></button></div>)}<div className="mt-2 flex gap-2"><input value={drafts[item.id] || ''} onChange={event => setDrafts(current => ({ ...current, [item.id]: event.target.value }))} placeholder="Balas komentar..." className="min-w-0 flex-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1.5 text-xs"/><button onClick={() => reply(item.id)} className="rounded-lg bg-lovelya-600 px-2 text-xs font-bold text-white">Kirim</button></div><button onClick={() => removeFeedback(item.id)} className="mt-2 text-[10px] font-bold text-gray-400 hover:text-red-500"><i className="fas fa-trash mr-1"></i>Hapus komentar</button></div>)}</div> : <p className="text-sm text-gray-400 mt-3">Belum ada komentar.</p>}</div>}
  </div>;
};
export default FeedbackNotifications;
