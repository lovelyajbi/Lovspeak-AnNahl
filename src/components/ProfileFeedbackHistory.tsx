import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { User } from 'firebase/auth';
import { AdminFeedback, AdminReply } from '../../types';
import { deleteFeedback, deleteReply, getReplies, getUserFeedback, markFeedbackRead, sendReply } from '../../services/admin';

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

const ProfileFeedbackHistory: React.FC<{ user: User | null }> = ({ user }) => {
  const [items, setItems] = useState<AdminFeedback[]>([]);
  const [replies, setReplies] = useState<Record<string, AdminReply[]>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [shown, setShown] = useState(10);
  useEffect(() => { if (!open) setShown(10); }, [open]);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const feedback = await getUserFeedback(user.uid);
      setItems(feedback);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (open) load(); }, [open, user]);
  useEffect(() => {
    // Replies load lazily for the visible items only, so opening the inbox stays fast
    // even when a student has a long comment history.
    if (!open) return;
    const visibleItems = items.slice(0, shown).filter(item => !replies[item.id]);
    if (!visibleItems.length) return;
    Promise.all(visibleItems.map(async item => [item.id, await getReplies(item.id)] as const))
      .then(pairs => setReplies(current => ({ ...current, ...Object.fromEntries(pairs) })))
      .catch(console.error);
  }, [open, items, shown]);
  useEffect(() => { if (!open) return; const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [open]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  if (!user) return null;

  const unreadCount = items.filter(item => !item.readAt).length;

  const reply = async (feedbackId: string) => {
    const message = drafts[feedbackId]?.trim();
    if (!message || sending) return;
    setSending(feedbackId);
    const authorName = user.displayName || user.email || 'User';
    const created = { id: `${Date.now()}`, authorId: user.uid, authorName, message, createdAt: new Date().toISOString() };
    try {
      await sendReply(feedbackId, { authorId: user.uid, authorName, message });
      setReplies(current => ({ ...current, [feedbackId]: [...(current[feedbackId] || []), created] }));
      setDrafts(current => ({ ...current, [feedbackId]: '' }));
    } catch (error) { console.error(error); }
    finally { setSending(null); }
  };

  const markRead = async (item: AdminFeedback) => {
    if (item.readAt) return;
    try { await markFeedbackRead(item.id); setItems(current => current.map(entry => entry.id === item.id ? { ...entry, readAt: new Date().toISOString() } : entry)); } catch (error) { console.error(error); }
  };

  const toggleExpand = (item: AdminFeedback) => {
    setExpanded(current => current === item.id ? null : item.id);
    if (!item.readAt) void markRead(item);
  };

  const removeFeedback = async (id: string) => {
    if (!window.confirm('Hapus komentar ini dan seluruh balasannya?')) return;
    const previous = items;
    setItems(current => current.filter(item => item.id !== id));
    try { await deleteFeedback(id); } catch { setItems(previous); }
  };

  const removeReply = async (feedbackId: string, replyId: string) => {
    if (!window.confirm('Hapus balasan ini?')) return;
    const previous = replies[feedbackId];
    setReplies(current => ({ ...current, [feedbackId]: (current[feedbackId] || []).filter(item => item.id !== replyId) }));
    try { await deleteReply(feedbackId, replyId); } catch { setReplies(current => ({ ...current, [feedbackId]: previous || [] })); }
  };

  return <>
    <button type="button" onClick={() => setOpen(true)} className="relative w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-lovelya-500 to-pink-500 text-white text-xs font-black shadow-lg shadow-lovelya-500/25 hover:shadow-xl hover:shadow-lovelya-500/35 active:scale-[.98] transition-all">
      <span className="flex items-center gap-2"><i className="fas fa-inbox text-sm"></i>Inbox Komentar Admin</span>
      <span className="flex items-center gap-2">
        {unreadCount > 0 && <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-white text-lovelya-600 text-[10px] font-black">{unreadCount}</span>}
        <i className="fas fa-arrow-right text-[10px]"></i>
      </span>
    </button>

    {open && ReactDOM.createPortal(<div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_.18s_ease-out]" onClick={() => setOpen(false)}>
      <div onClick={event => event.stopPropagation()} className="w-full sm:max-w-2xl h-[92vh] sm:h-[min(720px,88vh)] bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-[slideUp_.25s_cubic-bezier(.2,.7,.3,1)]">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-lovelya-50 to-pink-50 dark:from-lovelya-900/20 dark:to-pink-900/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lovelya-500 to-pink-500 text-white grid place-items-center shadow-md">
              <i className="fas fa-inbox"></i>
            </div>
            <div>
              <b className="block text-base font-black text-gray-900 dark:text-white">Inbox Komentar</b>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{items.length ? `${items.length} komentar${unreadCount ? ` · ${unreadCount} belum dibaca` : ''}` : 'Semua komentar dari admin muncul di sini'}</p>
            </div>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="w-9 h-9 rounded-xl bg-white/70 dark:bg-gray-800 text-gray-500 hover:text-gray-800 dark:hover:text-white grid place-items-center transition" aria-label="Tutup">
            <i className="fas fa-xmark"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 space-y-3">
          {loading && <div className="text-center py-10 text-gray-400 text-sm"><i className="fas fa-circle-notch fa-spin mr-2"></i>Memuat inbox...</div>}
          {!loading && !items.length && <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-lovelya-50 dark:bg-lovelya-900/20 grid place-items-center mb-4"><i className="fas fa-inbox text-3xl text-lovelya-400"></i></div>
            <b className="block text-gray-800 dark:text-gray-200 text-sm">Belum ada komentar admin</b>
            <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto">Komentar dari admin/guru tentang progress belajar Anda akan muncul di sini.</p>
          </div>}
          {items.slice(0, shown).map(item => {
            const isOpen = expanded === item.id;
            const itemReplies = replies[item.id] || [];
            return <div key={item.id} className={`rounded-2xl border transition-all ${item.readAt ? 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/40' : 'border-lovelya-200 dark:border-lovelya-800/50 bg-gradient-to-br from-lovelya-50/60 to-pink-50/40 dark:from-lovelya-900/15 dark:to-pink-900/15 shadow-md shadow-lovelya-200/20'}`}>
              <button type="button" onClick={() => toggleExpand(item)} className="w-full flex items-start gap-3 p-4 text-left">
                <div className={`w-9 h-9 flex-shrink-0 rounded-xl grid place-items-center ${item.readAt ? 'bg-gray-100 dark:bg-gray-700 text-gray-500' : 'bg-lovelya-500 text-white shadow-md'}`}>
                  <i className={`fas ${item.scope === 'task' ? 'fa-tasks' : 'fa-comment-dots'} text-sm`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${item.readAt ? 'text-gray-400' : 'text-lovelya-600 dark:text-lovelya-300'}`}>{item.scope === 'task' ? `Task · ${item.taskTitle || 'Umum'}` : 'Komentar umum'}</span>
                    {!item.readAt && <span className="w-2 h-2 rounded-full bg-lovelya-500"></span>}
                    <span className="ml-auto text-[10px] text-gray-400 flex-shrink-0">{formatDate(item.createdAt)}</span>
                  </div>
                  <p className={`text-sm ${item.readAt ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white font-medium'} ${!isOpen && 'line-clamp-2'}`}>{item.message}</p>
                  {itemReplies.length > 0 && !isOpen && <div className="mt-2 text-[10px] text-gray-400"><i className="fas fa-reply mr-1"></i>{itemReplies.length} balasan</div>}
                </div>
                <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} text-gray-400 text-xs mt-1.5 flex-shrink-0`}></i>
              </button>

              {isOpen && <div className="px-4 pb-4 space-y-3 border-t border-gray-100 dark:border-gray-700/50 pt-3">
                {itemReplies.length > 0 && <div className="space-y-2">
                  {itemReplies.map(replyItem => {
                    const isMine = replyItem.authorId === user.uid;
                    return <div key={replyItem.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs ${isMine ? 'bg-lovelya-500 text-white rounded-br-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md'}`}>
                        <div className={`flex items-center justify-between gap-3 mb-0.5 text-[9px] ${isMine ? 'text-white/70' : 'text-gray-500'}`}>
                          <b>{replyItem.authorName}</b>
                          <button onClick={event => { event.stopPropagation(); void removeReply(item.id, replyItem.id); }} className={`${isMine ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-red-500'}`} aria-label="Hapus balasan"><i className="fas fa-trash text-[9px]"></i></button>
                        </div>
                        <p className="whitespace-pre-wrap leading-snug">{replyItem.message}</p>
                      </div>
                    </div>;
                  })}
                </div>}

                <div className="flex gap-2">
                  <input value={drafts[item.id] || ''} onChange={event => setDrafts(current => ({ ...current, [item.id]: event.target.value }))} onClick={event => event.stopPropagation()} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void reply(item.id); } }} placeholder="Tulis balasan..." className="min-w-0 flex-1 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-xs outline-none focus:border-lovelya-400 focus:ring-2 focus:ring-lovelya-100 dark:focus:ring-lovelya-900/30"/>
                  <button type="button" disabled={sending === item.id || !(drafts[item.id] || '').trim()} onClick={event => { event.stopPropagation(); void reply(item.id); }} className="rounded-xl bg-lovelya-500 disabled:bg-gray-300 dark:disabled:bg-gray-700 px-4 text-xs font-black text-white transition disabled:cursor-not-allowed">{sending === item.id ? <i className="fas fa-circle-notch fa-spin"></i> : 'Balas'}</button>
                </div>

                <button type="button" onClick={event => { event.stopPropagation(); void removeFeedback(item.id); }} className="text-[10px] font-bold text-gray-400 hover:text-red-500 inline-flex items-center gap-1"><i className="fas fa-trash text-[9px]"></i>Hapus komentar ini</button>
              </div>}
            </div>;
          })}
          {items.length > shown && <button type="button" onClick={() => setShown(current => current + 10)} className="w-full rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-3 text-xs font-black text-lovelya-600 hover:bg-lovelya-50 dark:hover:bg-lovelya-900/20 transition">Muat lebih banyak ({items.length - shown} tersisa)</button>}
        </div>
      </div>
    </div>, document.body)}

    <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}.line-clamp-2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}`}</style>
  </>;
};

export default ProfileFeedbackHistory;
