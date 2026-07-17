import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { AdminFeedback, AdminReply } from '../../types';
import { deleteFeedback, deleteReply, getReplies, getUserFeedback, sendReply } from '../../services/admin';

const ProfileFeedbackHistory: React.FC<{ user: User | null }> = ({ user }) => {
  const [items, setItems] = useState<AdminFeedback[]>([]);
  const [replies, setReplies] = useState<Record<string, AdminReply[]>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const feedback = await getUserFeedback(user.uid);
      setItems(feedback);
      const replyPairs = await Promise.all(feedback.map(async item => [item.id, await getReplies(item.id)] as const));
      setReplies(Object.fromEntries(replyPairs));
    } finally { setLoading(false); }
  };

  useEffect(() => { if (open) load().catch(console.error); }, [open, user]);
  if (!user) return null;

  const reply = async (feedbackId: string) => {
    const message = drafts[feedbackId]?.trim();
    if (!message) return;
    const authorName = user.displayName || user.email || 'User';
    const created = { id: `${Date.now()}`, authorId: user.uid, authorName, message, createdAt: new Date().toISOString() };
    await sendReply(feedbackId, { authorId: user.uid, authorName, message });
    setReplies(current => ({ ...current, [feedbackId]: [...(current[feedbackId] || []), created] }));
    setDrafts(current => ({ ...current, [feedbackId]: '' }));
  };

  const removeFeedback = async (id: string) => {
    if (!window.confirm('Hapus komentar ini dan seluruh balasannya?')) return;
    await deleteFeedback(id);
    setItems(current => current.filter(item => item.id !== id));
  };

  const removeReply = async (feedbackId: string, replyId: string) => {
    if (!window.confirm('Hapus balasan ini?')) return;
    await deleteReply(feedbackId, replyId);
    setReplies(current => ({ ...current, [feedbackId]: (current[feedbackId] || []).filter(item => item.id !== replyId) }));
  };

  return <div className="mt-3">
    <button type="button" onClick={() => setOpen(current => !current)} className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-lovelya-50 dark:bg-lovelya-900/20 text-lovelya-600 dark:text-lovelya-300 border border-lovelya-100 dark:border-lovelya-900/30 text-[9px] font-black uppercase tracking-widest">
      <span><i className="fas fa-comments mr-2"></i>Riwayat Komentar Admin</span><i className={`fas fa-chevron-${open ? 'up' : 'down'}`}></i>
    </button>
    {open && <div className="mt-2 rounded-xl border border-gray-100 dark:border-gray-700 bg-white/70 dark:bg-gray-900/30 p-3 max-h-72 overflow-y-auto space-y-3">
      {loading && <p className="text-xs text-gray-400">Memuat riwayat...</p>}
      {!loading && !items.length && <p className="text-xs text-gray-400">Belum ada komentar admin.</p>}
      {items.map(item => <div key={item.id} className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-xs">
        <div className="flex justify-between gap-2 text-[9px] text-gray-400"><b className="uppercase text-lovelya-600">{item.scope === 'task' ? item.taskTitle || 'Task' : 'Komentar umum'}</b><span>{new Date(item.createdAt).toLocaleDateString('id-ID')}</span></div>
        <p className="mt-1 whitespace-pre-wrap text-gray-700 dark:text-gray-200">{item.message}</p>
        {(replies[item.id] || []).map(replyItem => <div key={replyItem.id} className="mt-2 flex items-start gap-2 rounded-lg bg-white dark:bg-gray-700 p-2"><p className="flex-1"><b>{replyItem.authorName}:</b> {replyItem.message}</p><button type="button" onClick={() => removeReply(item.id, replyItem.id)} className="text-gray-400 hover:text-red-500" aria-label="Hapus balasan"><i className="fas fa-trash text-[9px]"></i></button></div>)}
        <div className="mt-2 flex gap-2"><input value={drafts[item.id] || ''} onChange={event => setDrafts(current => ({ ...current, [item.id]: event.target.value }))} placeholder="Balas..." className="min-w-0 flex-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1.5 text-xs"/><button type="button" onClick={() => reply(item.id)} className="rounded-lg bg-lovelya-600 px-2 text-[10px] font-bold text-white">Kirim</button></div>
        <button type="button" onClick={() => removeFeedback(item.id)} className="mt-2 text-[10px] font-bold text-gray-400 hover:text-red-500"><i className="fas fa-trash mr-1"></i>Hapus komentar</button>
      </div>)}
    </div>}
  </div>;
};

export default ProfileFeedbackHistory;
