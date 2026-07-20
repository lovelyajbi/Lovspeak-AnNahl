import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { AdminFeedback, UserNotification } from '../../types';
import { deleteFeedback, deleteReply, getReplies, getUserFeedback, getUserNotifications, markFeedbackRead, markNotificationRead, sendReply } from '../../services/admin';

const FeedbackNotifications: React.FC<{ user: User | null }> = ({ user }) => {
  const [items, setItems] = useState<AdminFeedback[]>([]);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [open, setOpen] = useState(false);
  const [replies, setReplies] = useState<Record<string, { authorName: string; message: string; id: string }[]>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  useEffect(() => {
    if (!user) return;
    const load = () => Promise.all([getUserFeedback(user.uid), getUserNotifications(user.uid)]).then(async ([feedback, inbox]) => {
      setItems(feedback);
      setNotifications(inbox);
      const response = await Promise.all(feedback.map(async item => [item.id, await getReplies(item.id)] as const));
      setReplies(Object.fromEntries(response));
    }).catch(() => {});
    load(); const interval = window.setInterval(load, 45000); return () => window.clearInterval(interval);
  }, [user]);
  if (!user) return null;
  const unreadItems = items.filter(item => !item.readAt);
  const unreadNotifications = notifications.filter(item => !item.readAt);
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
  const readNotifications = async () => { await Promise.all(unreadNotifications.map(item => markNotificationRead(user.uid, item.id).catch(() => undefined))); setNotifications(current => current.map(item => unreadNotifications.some(unread => unread.id === item.id) ? { ...item, readAt: new Date().toISOString() } : item)); };
  return <div className="relative">
    <button onClick={() => setOpen(!open)} className="relative w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-lovelya-600" aria-label="Notifikasi LovSpeak"><i className="fas fa-bell text-[11px]"></i>{(unreadItems.length + unreadNotifications.length) > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-white dark:border-gray-900"></span>}</button>
    {open && <><div onClick={() => setOpen(false)} className="fixed inset-0 z-[99] sm:hidden bg-black/30 backdrop-blur-sm" /><div className="fixed sm:absolute z-[100] left-3 right-3 top-[68px] sm:left-auto sm:right-0 sm:top-10 sm:w-[360px] max-h-[min(78vh,32rem)] overflow-y-auto rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-700 p-4"><div className="flex justify-between gap-3 items-center"><div><b>Notifikasi</b><p className="text-[10px] text-gray-400 mt-0.5">Komentar dan tugas tersimpan di sini</p></div>{(unreadItems.length + unreadNotifications.length) > 0 && <button onClick={() => { void readAll(); void readNotifications(); }} className="text-xs text-lovelya-600 font-bold">Tandai dibaca</button>}</div>{(items.length || notifications.length) ? <div className="mt-3 space-y-3">{notifications.map(item => <div key={item.id} className={`rounded-xl p-3 border ${item.readAt ? 'bg-gray-50 dark:bg-gray-800 border-transparent' : 'bg-lovelya-50/60 dark:bg-lovelya-900/20 border-lovelya-200 dark:border-lovelya-700'}`}><p className="text-[10px] font-black uppercase text-lovelya-600">{item.kind === 'assignment' ? 'Tugas baru' : 'Pesan admin'}</p><p className="mt-1 text-sm font-bold">{item.title}</p><p className="mt-1 text-xs whitespace-pre-wrap">{item.message}</p></div>)}{items.map(item => <div key={item.id} className={`rounded-xl p-3 text-sm border ${item.readAt ? 'bg-gray-50 dark:bg-gray-800 border-transparent' : 'bg-lovelya-50/60 dark:bg-lovelya-900/20 border-lovelya-200 dark:border-lovelya-700'}`}><div className="flex justify-between gap-2"><p className="text-[10px] font-black uppercase text-lovelya-600">{item.scope === 'task' ? item.taskTitle || 'Task' : 'Komentar umum'}</p><span className="text-[10px] text-gray-400">{new Date(item.createdAt).toLocaleDateString('id-ID')}</span></div><p className="mt-1 whitespace-pre-wrap">{item.message}</p>{(replies[item.id] || []).map(replyItem => <div key={replyItem.id} className="mt-2 flex items-start gap-2 rounded-lg bg-white/70 dark:bg-gray-700 p-2 text-xs"><p className="flex-1"><b>{replyItem.authorName}:</b> {replyItem.message}</p><button onClick={() => removeReply(item.id, replyItem.id)} className="text-gray-400 hover:text-red-500" aria-label="Hapus balasan"><i className="fas fa-trash text-[10px]"></i></button></div>)}<div className="mt-2 flex gap-2"><input value={drafts[item.id] || ''} onChange={event => setDrafts(current => ({ ...current, [item.id]: event.target.value }))} placeholder="Balas komentar..." className="min-w-0 flex-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1.5 text-xs"/><button onClick={() => reply(item.id)} className="rounded-lg bg-lovelya-600 px-2 text-xs font-bold text-white">Kirim</button></div><button onClick={() => removeFeedback(item.id)} className="mt-2 text-[10px] font-bold text-gray-400 hover:text-red-500"><i className="fas fa-trash mr-1"></i>Hapus komentar</button></div>)}</div> : <p className="text-sm text-gray-400 mt-3">Belum ada notifikasi.</p>}</div></>}
  </div>;
};
export default FeedbackNotifications;
