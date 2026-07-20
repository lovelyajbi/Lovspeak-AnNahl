import React, { useEffect, useMemo, useState } from 'react';
import { User } from 'firebase/auth';
import { ActivityLog, AdminAssignment, AdminFeedback, AdminReply, AppView, AssignmentKind, AssignmentTarget, DailyTask, UserAssignment } from '../../types';
import { MASTER_CURRICULUM } from '../../data/curriculum';
import { SHADOWING_DATA } from '../constants/shadowingData';
import {
  AdminAccessRecord, AdminUser, AdminUserDetail, deleteFeedback, deleteReply, getAdminAccess, getAdminUserDetail,
  createAdminAssignment, createAdminBroadcast, getAdminUsers, getReplies, grantAdminAccess, retakeAssignment, revokeAdminAccess, sendFeedback, sendReply, tasksForPlan,
  AdminAssignmentSummary, AdminBroadcastSummary, listAssignments, listBroadcasts, deleteAssignment, deleteBroadcast
} from '../../services/admin';

type Period = 'week' | 'month' | 'all';
type Section = 'overview' | 'users' | 'attention' | 'comments' | 'assignments' | 'access';
type ThemeMode = 'light' | 'dark';
type DetailTab = 'progress' | 'tasks' | 'comments';
type UserFilter = 'all' | 'attention' | 'online' | 'low-score' | 'inactive' | 'daily-incomplete';
type UserSort = 'score-desc' | 'score-asc' | 'progress-desc' | 'progress-asc' | 'recent';

type UserMetric = {
  user: AdminUser;
  detail?: AdminUserDetail;
  activities: ActivityLog[];
  average: number | null;
  total: number;
  completed: number;
  totalTasks: number;
  completionRate: number;
  dailyTasks: DailyTask[];
  dailyCompleted: number;
  roadmapCompleted: number;
  roadmapTotal: number;
  liveSeconds: number;
  shadowingSeconds: number;
  speakingSeconds: number;
  lastActivity?: string;
  trend: 'up' | 'steady' | 'down' | 'none';
  attentionReason?: string;
  categories: Record<string, number | null>;
};

const DAY = 86_400_000;
const MASTER_ADMIN_EMAIL = ((import.meta as { env?: Record<string, string | undefined> }).env?.VITE_ADMIN_MASTER_EMAIL) || 'lovelyatrial@gmail.com';
const SCORABLE = new Set<AppView>([AppView.READING, AppView.LISTENING, AppView.GRAMMAR, AppView.VOCAB, AppView.TRANSLATE, AppView.ASSESSMENT, AppView.GAMES, AppView.SHADOWING]);
const CATEGORY_LABELS: Record<string, string> = {
  [AppView.READING]: 'Reading', [AppView.LISTENING]: 'Listening', [AppView.GRAMMAR]: 'Grammar', [AppView.SHADOWING]: 'Shadowing',
  [AppView.VOCAB]: 'Vocabulary', [AppView.TRANSLATE]: 'Translation', [AppView.ASSESSMENT]: 'Assessment', [AppView.GAMES]: 'Games'
};

const formatDuration = (seconds = 0) => {
  const whole = Math.max(0, Math.round(seconds));
  const hour = Math.floor(whole / 3600);
  const minute = Math.floor((whole % 3600) / 60);
  const second = whole % 60;
  return hour ? `${hour}j ${minute}m` : `${minute}m ${second}dtk`;
};
const formatShortDate = (date?: string) => date ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(new Date(date)) : '—';
const formatLastSeen = (value?: number | null) => value ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value)) : 'Belum tercatat';
const isSpeaking = (activity: ActivityLog) => activity.type === AppView.LIVE || activity.type === AppView.SHADOWING;
const isScored = (activity: ActivityLog) => SCORABLE.has(activity.type);
const withinPeriod = (date: string, period: Period) => period === 'all' || Date.now() - new Date(date).getTime() <= (period === 'week' ? 7 : 30) * DAY;
const average = (items: ActivityLog[]) => items.length ? Math.round(items.reduce((total, item) => total + item.score, 0) / items.length) : null;
const activityName = (activity: ActivityLog) => CATEGORY_LABELS[activity.type] || (isSpeaking(activity) ? 'Speaking' : activity.type.replace('_', ' '));

const avatarPalette = (name: string): { bg: string; fg: string } => {
  const text = name || '?';
  let hash = 0;
  for (let index = 0; index < text.length; index++) hash = text.charCodeAt(index) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return { bg: `hsl(${hue}, 68%, 92%)`, fg: `hsl(${hue}, 55%, 38%)` };
};
const AvatarBubble: React.FC<{ name: string; size?: number; className?: string }> = ({ name, size = 32, className }) => {
  const palette = avatarPalette(name);
  return <div className={className || 'user-avatar'} style={{ width: size, height: size, background: palette.bg, color: palette.fg, fontSize: Math.max(10, size * 0.36) }}>{(name || '?').slice(0, 1).toUpperCase()}</div>;
};
const SectionIcons: Record<Section, string> = { overview: 'fa-grid-2', users: 'fa-users', attention: 'fa-triangle-exclamation', comments: 'fa-message', assignments: 'fa-clipboard-check', access: 'fa-shield-halved' };

const PAGE_SIZE = 10;
const usePaged = <T,>(items: T[], size = PAGE_SIZE) => {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / size));
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [page, pageCount]);
  return { visible: items.slice((page - 1) * size, page * size), page, pageCount, setPage, total: items.length };
};
const Pager: React.FC<{ page: number; pageCount: number; setPage: React.Dispatch<React.SetStateAction<number>>; total?: number }> = ({ page, pageCount, setPage, total }) =>
  pageCount > 1 ? <div className="admin-pagination"><button type="button" disabled={page === 1} onClick={() => setPage(current => current - 1)}>Sebelumnya</button><span>Halaman {page} dari {pageCount}{total !== undefined ? ` · ${total} data` : ''}</span><button type="button" disabled={page === pageCount} onClick={() => setPage(current => current + 1)}>Berikutnya</button></div> : null;

const metricForUser = (user: AdminUser, detail: AdminUserDetail | undefined, period: Period): UserMetric => {
  const allActivities = detail?.activities || [];
  const activities = allActivities.filter(item => withinPeriod(item.date, period));
  const scored = activities.filter(isScored);
  const dailyTasks = detail?.plan?.dailyTasks || [];
  const roadmapPacks = MASTER_CURRICULUM.find(item => item.level === user.level)?.units || [];
  const roadmapCompleted = roadmapPacks.filter(pack => pack.steps.length > 0 && pack.steps.every(step => detail?.roadmapUnits.includes(step.id))).length;
  const roadmapTotal = roadmapPacks.length;
  const tasks = dailyTasks;
  const categoryValues = Object.keys(CATEGORY_LABELS).reduce<Record<string, number | null>>((result, key) => {
    result[key] = average(scored.filter(item => item.type === key));
    return result;
  }, {});
  const recent = allActivities.filter(item => Date.now() - new Date(item.date).getTime() <= 14 * DAY && isScored(item));
  const current = recent.filter(item => Date.now() - new Date(item.date).getTime() <= 7 * DAY);
  const previous = recent.filter(item => { const age = Date.now() - new Date(item.date).getTime(); return age > 7 * DAY && age <= 14 * DAY; });
  const currentAverage = average(current);
  const previousAverage = average(previous);
  const trend: UserMetric['trend'] = currentAverage === null || previousAverage === null ? 'none' : currentAverage >= previousAverage + 5 ? 'up' : currentAverage <= previousAverage - 5 ? 'down' : 'steady';
  const lastActivity = allActivities.map(item => item.date).sort().at(-1);
  const dailyCompleted = tasks.filter(task => task.isCompleted).length;
  const totalAssigned = tasks.length;
  const completionRate = totalAssigned ? Math.round((dailyCompleted / totalAssigned) * 100) : 0;
  const liveSeconds = activities.filter(item => item.type === AppView.LIVE).reduce((sum, item) => sum + (item.durationSeconds || 0), 0);
  const shadowingSeconds = activities.filter(item => item.type === AppView.SHADOWING).reduce((sum, item) => sum + (item.durationSeconds || 0), 0);
  const speakingSeconds = liveSeconds + shadowingSeconds;
  const inactive = !lastActivity || Date.now() - new Date(lastActivity).getTime() > 7 * DAY;
  const lowScore = scored.length > 0 && (average(scored) || 0) < 60;
  const attentionReason = inactive ? 'Tidak ada aktivitas selama 7 hari' : trend === 'down' ? 'Nilai turun dibanding minggu lalu' : lowScore ? 'Nilai rata-rata masih di bawah 60' : totalAssigned > 0 && completionRate < 40 ? 'Daily Plan masih rendah' : undefined;
  return {
    user, detail, activities, average: average(scored), total: scored.reduce((sum, item) => sum + item.score, 0),
    completed: dailyCompleted, totalTasks: totalAssigned, completionRate, dailyTasks, dailyCompleted, roadmapCompleted, roadmapTotal, liveSeconds, shadowingSeconds, speakingSeconds,
    lastActivity, trend, attentionReason, categories: categoryValues
  };
};

const trendIcon = (trend: UserMetric['trend']) => trend === 'up' ? '↗' : trend === 'down' ? '↘' : trend === 'steady' ? '→' : '—';
const trendText = (trend: UserMetric['trend']) => trend === 'up' ? 'Meningkat' : trend === 'down' ? 'Menurun' : trend === 'steady' ? 'Stabil' : 'Belum cukup data';

const AdminAssignmentsPanel: React.FC<{ users: AdminUser[]; adminUid: string; onMessage: (message: string) => void; initialRecipientIds?: string[] | null; onConsumePrefill?: () => void }> = ({ users, adminUid, onMessage, initialRecipientIds, onConsumePrefill }) => {
  const [mode, setMode] = useState<'assignment' | 'broadcast'>('assignment');
  const [recipientMode, setRecipientMode] = useState<'all' | 'selected'>('all');
  const [recipientIds, setRecipientIds] = useState<string[]>([]);
  const [recipientQuery, setRecipientQuery] = useState('');
  useEffect(() => {
    if (initialRecipientIds && initialRecipientIds.length) {
      setRecipientMode('selected');
      setRecipientIds(initialRecipientIds);
      onConsumePrefill?.();
    }
  }, [initialRecipientIds]);
  const [kind, setKind] = useState<AssignmentKind>('roadmap_pack');
  const [targetKey, setTargetKey] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('');
  const [shadowThemeId, setShadowThemeId] = useState('');
  const [shadowingTaskId, setShadowingTaskId] = useState('');
  const [minScore, setMinScore] = useState('');
  const [duration, setDuration] = useState('');
  const [dueAt, setDueAt] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { levelPacks, moduleSteps } = useMemo(() => {
    const packs = MASTER_CURRICULUM.flatMap(level => level.units.map(unit => ({ id: unit.id, title: `${level.level} · Pack ${unit.unitNumber}: ${unit.title}`, level: level.level, stepIds: unit.steps.map(step => step.id) })));
    const allSteps = MASTER_CURRICULUM.flatMap(level => level.units.flatMap(unit => unit.steps.map(step => ({ ...step, level: level.level }))));
    const modules = allSteps.filter(step => ({ grammar_lesson: AppView.GRAMMAR, reading_task: AppView.READING, listening_task: AppView.LISTENING, speaking_practice: AppView.LIVE } as Record<string, AppView>)[step.type]);
    return { levelPacks: packs, moduleSteps: modules };
  }, []);
  const selectedUsers = recipientMode === 'all' ? users : users.filter(item => recipientIds.includes(item.uid));
  const targetStep = moduleSteps.find(step => step.id === targetKey);
  const targetPack = levelPacks.find(pack => pack.id === targetKey);
  const selectedShadowTheme = SHADOWING_DATA.find(themeItem => themeItem.id === shadowThemeId);
  const selectedShadowTask = selectedShadowTheme?.tasks.find(task => task.id === shadowingTaskId);
  const toggleRecipient = (uid: string) => setRecipientIds(current => current.includes(uid) ? current.filter(id => id !== uid) : [...current, uid]);
  const kindLabel: Record<AssignmentKind, string> = { roadmap_pack: 'Roadmap Pack', grammar: 'Grammar + kuis', reading: 'Reading tema', listening: 'Listening + kuis', speaking: 'Speaking topik', shadowing: 'Shadowing' };
  const submit = async () => {
    if (!selectedUsers.length) { onMessage('Pilih minimal satu penerima.'); return; }
    const ids = selectedUsers.map(item => item.uid);
    const recipientLabel = recipientMode === 'all' ? `SEMUA user (${ids.length})` : `${ids.length} user terpilih`;
    if (mode === 'broadcast') {
      if (!title.trim() || !broadcastMessage.trim()) { onMessage('Judul dan isi broadcast wajib diisi.'); return; }
      const preview = `Kirim BROADCAST ke ${recipientLabel}?\n\nJudul: ${title.trim()}\nIsi:\n${broadcastMessage.trim().slice(0, 200)}${broadcastMessage.length > 200 ? '…' : ''}\n\nTindakan ini tidak bisa dibatalkan. Yakin kirim?`;
      if (!window.confirm(preview)) return;
    } else {
      if (kind === 'roadmap_pack' && !targetPack) { onMessage('Pilih pack roadmap terlebih dahulu.'); return; }
      if (kind === 'shadowing' && !selectedShadowTask) { onMessage('Pilih judul materi Shadowing terlebih dahulu.'); return; }
      if (kind !== 'roadmap_pack' && !targetStep && !theme.trim() && kind !== 'shadowing') { onMessage('Pilih materi atau isi tema/topik tugas.'); return; }
      const targetPreview = kind === 'roadmap_pack' ? targetPack?.title : targetStep?.title || selectedShadowTask?.title || theme || '—';
      const duePreview = dueAt ? new Date(dueAt).toLocaleString('id-ID', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : 'tanpa tenggat';
      const preview = `Kirim TUGAS ke ${recipientLabel}?\n\nJudul: ${title.trim() || '(otomatis)'}\nJenis: ${kindLabel[kind]}\nTarget: ${targetPreview}\nTenggat: ${duePreview}${minScore ? `\nNilai minimum: ${minScore}%` : ''}${duration ? `\nTarget durasi: ${duration} menit` : ''}\n\nYakin kirim?`;
      if (!window.confirm(preview)) return;
    }
    setSending(true);
    try {
      if (mode === 'broadcast') {
        await createAdminBroadcast({ title, message: broadcastMessage, createdBy: adminUid, recipientIds: ids });
        onMessage(`Broadcast terkirim ke ${ids.length} user.`); setTitle(''); setBroadcastMessage(''); return;
      }
      const target: AssignmentTarget = kind === 'roadmap_pack'
        ? { kind, packId: targetPack?.id, packTitle: targetPack?.title, packStepIds: targetPack?.stepIds, moduleView: AppView.ROADMAP }
        : { kind, stepId: targetStep?.id, shadowingTaskId: kind === 'shadowing' ? selectedShadowTask?.id : undefined, title: targetStep?.title || selectedShadowTask?.title || theme || title, theme: ['reading', 'listening'].includes(kind) ? theme : undefined, topic: kind === 'speaking' ? theme : undefined, moduleView: targetStep ? ({ grammar_lesson: AppView.GRAMMAR, reading_task: AppView.READING, listening_task: AppView.LISTENING, speaking_practice: AppView.LIVE } as Record<string, AppView>)[targetStep.type] : kind === 'shadowing' ? AppView.SHADOWING : undefined, minScore: minScore ? Number(minScore) : undefined, targetDurationSeconds: kind === 'speaking' && duration ? Number(duration) * 60 : undefined, requireQuiz: ['grammar', 'listening'].includes(kind) };
      await createAdminAssignment({ title: title || `Tugas ${target.packTitle || target.title || target.kind}`, description, target, dueAt: dueAt ? new Date(dueAt).toISOString() : null, createdBy: adminUid, recipientMode, recipientIds: ids });
      onMessage(`Tugas berhasil dibagikan ke ${ids.length} user.`); setTitle(''); setDescription(''); setTargetKey(''); setTheme(''); setShadowThemeId(''); setShadowingTaskId(''); setMinScore(''); setDuration(''); setDueAt('');
    } catch (error) { console.error(error); onMessage('Tugas/broadcast belum terkirim. Periksa koneksi Firebase.'); }
    finally { setSending(false); }
  };
  return <section className="admin-card admin-table-card">
    <div className="admin-card-head"><div><span className="admin-eyebrow">Penugasan & komunikasi</span><h2>Kirim tugas atau pesan</h2><p>Buat satu tugas lalu bagikan ke seluruh kelas atau user tertentu. Tenggat bersifat opsional.</p></div><div className="feedback-controls"><button className={mode === 'assignment' ? 'active' : ''} onClick={() => setMode('assignment')}>Tugas</button><button className={mode === 'broadcast' ? 'active' : ''} onClick={() => setMode('broadcast')}>Broadcast</button></div></div>
    <div className="admin-assignment-form">
      <div className="feedback-controls"><button className={recipientMode === 'all' ? 'active' : ''} onClick={() => setRecipientMode('all')}>Semua user ({users.length})</button><button className={recipientMode === 'selected' ? 'active' : ''} onClick={() => setRecipientMode('selected')}>Pilih user</button></div>
      {recipientMode === 'selected' && <>
        <input className="feedback-select" value={recipientQuery} onChange={event => setRecipientQuery(event.target.value)} placeholder={`Cari nama atau email... (${recipientIds.length} dari ${users.length} terpilih)`} />
        <div className="admin-recipient-grid">{users.filter(item => `${item.name} ${item.email}`.toLowerCase().includes(recipientQuery.toLowerCase())).map(item => <label key={item.uid}><input type="checkbox" checked={recipientIds.includes(item.uid)} onChange={() => toggleRecipient(item.uid)} />{item.name}<small>{item.email || 'tanpa email'}</small></label>)}</div>
      </>}
      <input className="feedback-select" value={title} onChange={event => setTitle(event.target.value)} placeholder={mode === 'broadcast' ? 'Judul pesan' : 'Judul tugas, misalnya: Selesaikan Pack 1'} />
      {mode === 'broadcast' ? <textarea className="feedback-textarea" value={broadcastMessage} onChange={event => setBroadcastMessage(event.target.value)} placeholder="Tulis pesan untuk semua penerima…" /> : <>
        <select className="feedback-select" value={kind} onChange={event => { setKind(event.target.value as AssignmentKind); setTargetKey(''); setShadowThemeId(''); setShadowingTaskId(''); }}><option value="roadmap_pack">Roadmap · satu pack</option><option value="grammar">Grammar · materi + kuis</option><option value="reading">Reading · tema</option><option value="listening">Listening · tema + kuis</option><option value="speaking">Speaking · topik + durasi</option><option value="shadowing">Shadowing · materi + nilai minimum</option></select>
        {kind === 'roadmap_pack' && <select className="feedback-select" value={targetKey} onChange={event => setTargetKey(event.target.value)}><option value="">Pilih pack roadmap</option>{levelPacks.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select>}
        {kind === 'grammar' && <select className="feedback-select" value={targetKey} onChange={event => setTargetKey(event.target.value)}><option value="">Pilih materi grammar</option>{moduleSteps.filter(step => step.type === 'grammar_lesson').map(step => <option key={step.id} value={step.id}>{step.level} · {step.title}</option>)}</select>}
        {kind === 'shadowing' && <><select className="feedback-select" value={shadowThemeId} onChange={event => { setShadowThemeId(event.target.value); setShadowingTaskId(''); }}><option value="">Pilih tema Shadowing</option>{SHADOWING_DATA.map(themeItem => <option key={themeItem.id} value={themeItem.id}>{themeItem.title} · {themeItem.subCategory || themeItem.category}</option>)}</select>{selectedShadowTheme && <select className="feedback-select" value={shadowingTaskId} onChange={event => setShadowingTaskId(event.target.value)}><option value="">Pilih judul tugas spesifik</option>{selectedShadowTheme.tasks.map(task => <option key={task.id} value={task.id}>{task.title} · {task.difficulty}</option>)}</select>}</>}
        {!['roadmap_pack', 'grammar', 'shadowing'].includes(kind) && <input className="feedback-select" value={theme} onChange={event => setTheme(event.target.value)} placeholder={kind === 'speaking' ? 'Topik speaking (contoh: memperkenalkan diri)' : 'Tema yang akan dibuat oleh modul'} />}
        {['grammar', 'listening', 'shadowing'].includes(kind) && <input className="feedback-select" type="number" min="0" max="100" value={minScore} onChange={event => setMinScore(event.target.value)} placeholder="Nilai minimum (opsional), contoh 70" />}
        {kind === 'speaking' && <input className="feedback-select" type="number" min="1" value={duration} onChange={event => setDuration(event.target.value)} placeholder="Target durasi menit (opsional)" />}
        <input className="feedback-select" type="datetime-local" value={dueAt} onChange={event => setDueAt(event.target.value)} /><textarea className="feedback-textarea" value={description} onChange={event => setDescription(event.target.value)} placeholder="Instruksi singkat untuk user (opsional)" />
      </>}
      <button className="feedback-send" disabled={sending} onClick={() => void submit()}>{sending ? 'Mengirim…' : mode === 'broadcast' ? 'Kirim broadcast' : 'Bagikan tugas'}</button>
    </div>
  </section>;
};

const AdminPortal: React.FC<{ user: User; isAdmin: boolean; onLogout: () => Promise<void> }> = ({ user, isAdmin, onLogout }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [details, setDetails] = useState<Record<string, AdminUserDetail>>({});
  const [adminAccess, setAdminAccess] = useState<AdminAccessRecord[]>([]);
  const [period, setPeriod] = useState<Period>('month');
  const [section, setSection] = useState<Section>('overview');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailRevision, setDetailRevision] = useState(0);
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState<ThemeMode>(() => (localStorage.getItem('lovspeak_admin_theme') as ThemeMode) || 'light');
  const [feedback, setFeedback] = useState('');
  const [feedbackScope, setFeedbackScope] = useState<'general' | 'task'>('general');
  const [taskId, setTaskId] = useState('');
  const [replies, setReplies] = useState<Record<string, AdminReply[]>>({});
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [detailTab, setDetailTab] = useState<DetailTab>('progress');
  const [accessUserId, setAccessUserId] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [userFilter, setUserFilter] = useState<UserFilter>('all');
  const [userSort, setUserSort] = useState<UserSort>('score-desc');
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);
  const [bulkCommentOpen, setBulkCommentOpen] = useState(false);
  const [bulkCommentText, setBulkCommentText] = useState('');
  const [bulkSending, setBulkSending] = useState(false);
  const [prefilledRecipients, setPrefilledRecipients] = useState<string[] | null>(null);
  const [assignmentTab, setAssignmentTab] = useState<'compose' | 'history'>('compose');
  const [moreOpen, setMoreOpen] = useState(false);
  const [assignmentHistory, setAssignmentHistory] = useState<AdminAssignmentSummary[]>([]);
  const [broadcastHistory, setBroadcastHistory] = useState<AdminBroadcastSummary[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const [assignments, broadcasts] = await Promise.all([listAssignments(), listBroadcasts()]);
      setAssignmentHistory(assignments);
      setBroadcastHistory(broadcasts);
    } catch (error) { console.error(error); setMessage('Riwayat tidak dapat dimuat.'); }
    finally { setHistoryLoading(false); }
  };
  useEffect(() => { if (section === 'assignments' && assignmentTab === 'history') void loadHistory(); }, [section, assignmentTab]);

  const handleDeleteAssignment = async (item: AdminAssignmentSummary) => {
    if (!window.confirm(`Hapus tugas "${item.title}" beserta salinannya di ${item.recipientCount} user?`)) return;
    const previous = assignmentHistory;
    setAssignmentHistory(current => current.filter(entry => entry.id !== item.id));
    try { await deleteAssignment(item.id, item.recipientIds || []); }
    catch { setAssignmentHistory(previous); setMessage('Tugas tidak dapat dihapus. Coba lagi.'); }
  };
  const handleDeleteBroadcast = async (item: AdminBroadcastSummary) => {
    if (!window.confirm(`Hapus broadcast "${item.title}"? Notifikasi yang sudah terkirim tetap ada di sisi user.`)) return;
    const previous = broadcastHistory;
    setBroadcastHistory(current => current.filter(entry => entry.id !== item.id));
    try { await deleteBroadcast(item.id); }
    catch { setBroadcastHistory(previous); setMessage('Broadcast tidak dapat dihapus. Coba lagi.'); }
  };

  const refresh = async ({ resetDetails = false }: { resetDetails?: boolean } = {}) => {
    setLoading(true);
    setMessage('');
    try {
      const [list, accessList] = await Promise.all([getAdminUsers(), getAdminAccess()]);
      setUsers(list);
      setAdminAccess(accessList);
      setLastUpdated(new Date());
      if (resetDetails) {
        setDetails({});
        setDetailRevision(value => value + 1);
      }
      setLoading(false);
      setDetailLoading(false);
    } catch (error) {
      console.error(error);
      setMessage('Data belum dapat dimuat. Periksa koneksi dan aturan Firebase, lalu coba muat ulang.');
      setDetailLoading(false);
    } finally { setLoading(false); }
  };
  const loadDetailsFor = async (targets: AdminUser[]) => {
    const missing = targets.filter(item => !details[item.uid]);
    if (!missing.length) return;
    setDetailLoading(true);
    try {
      for (let index = 0; index < missing.length; index += 8) {
        const batch = missing.slice(index, index + 8);
        const entries = await Promise.all(batch.map(async item => [item.uid, await getAdminUserDetail(item)] as const));
        setDetails(current => ({ ...current, ...Object.fromEntries(entries) }));
      }
    } catch (error) {
      console.error(error);
      setMessage('Sebagian detail user belum termuat. Coba muat ulang atau buka user tersebut lagi.');
    } finally { setDetailLoading(false); }
  };

  useEffect(() => { if (isAdmin) void refresh(); }, [isAdmin]);
  useEffect(() => {
    // The full user list needs complete metrics for ranking and filters.
    // Keep that heavier load out of the initial overview screen.
    if (isAdmin && ['users', 'attention', 'comments'].includes(section) && users.length) void loadDetailsFor(users);
  }, [isAdmin, section, users.length]);
  useEffect(() => {
    if (!selected || detailTab !== 'comments') return;
    const feedbackItems = details[selected.uid]?.feedback || [];
    if (!feedbackItems.length) return;
    void Promise.all(feedbackItems.map(async item => [item.id, await getReplies(item.id)] as const))
      .then(items => setReplies(Object.fromEntries(items))).catch(console.error);
  }, [selected, detailTab, details]);
  useEffect(() => { setSelected(null); }, [section]);

  const metrics = useMemo(() => users.map(item => metricForUser(item, details[item.uid], period)), [users, details, period]);
  const attention = useMemo(() => metrics.filter(item => item.attentionReason).sort((a, b) => Number(b.trend === 'down') - Number(a.trend === 'down') || (a.average ?? 101) - (b.average ?? 101)), [metrics]);
  const activeCount = users.filter(item => item.isOnline).length;
  const validScores = metrics.map(item => item.average).filter((value): value is number => value !== null);
  const meanScore = validScores.length ? Math.round(validScores.reduce((sum, value) => sum + value, 0) / validScores.length) : null;
  const dailyPlanUsers = metrics.filter(item => item.dailyTasks.length > 0);
  const dailyPlanFinished = dailyPlanUsers.filter(item => item.dailyTasks.every(task => task.isCompleted)).length;
  const periodLabel = period === 'week' ? '7 hari terakhir' : period === 'month' ? '30 hari terakhir' : 'semua waktu';
  const selectedMetric = selected ? metrics.find(item => item.user.uid === selected.uid) : undefined;
  const selectedDetail = selected ? details[selected.uid] : undefined;
  const selectedActivities = selectedMetric?.activities || [];
  const selectedScored = selectedActivities.filter(isScored);
  const selectedSpeaking = selectedActivities.filter(isSpeaking);

  const saveTheme = (next: ThemeMode) => { setTheme(next); localStorage.setItem('lovspeak_admin_theme', next); };
  const applyUserFilterSort = (items: UserMetric[]) => items.filter(item => {
    if (!`${item.user.name} ${item.user.email}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (userFilter === 'attention') return Boolean(item.attentionReason);
    if (userFilter === 'online') return item.user.isOnline;
    if (userFilter === 'low-score') return item.average !== null && item.average < 60;
    if (userFilter === 'inactive') return !item.lastActivity || Date.now() - new Date(item.lastActivity).getTime() > 7 * DAY;
    if (userFilter === 'daily-incomplete') return item.dailyTasks.length > 0 && !item.dailyTasks.every(task => task.isCompleted);
    return true;
  }).sort((a, b) => userSort === 'score-asc' ? (a.average ?? 101) - (b.average ?? 101) : userSort === 'progress-desc' ? b.completionRate - a.completionRate : userSort === 'progress-asc' ? a.completionRate - b.completionRate : userSort === 'recent' ? (b.lastActivity || '').localeCompare(a.lastActivity || '') : (b.average ?? -1) - (a.average ?? -1) || b.completionRate - a.completionRate);
  const exportReport = () => {
    const scope = userFilter === 'all' && !query ? metrics : applyUserFilterSort(metrics);
    const headers = ['Peringkat', 'Nama', 'Email', 'Status', 'Nilai rata-rata', 'Progress Daily Plan', 'Durasi speaking', 'Tren', 'Fokus', 'Aktivitas terakhir'];
    const rows = scope.map((item, index) => [
      index + 1, item.user.name, item.user.email || '', item.user.isOnline ? 'Online' : 'Offline', item.average === null ? '' : `${item.average}%`,
      `${item.completionRate}%`, formatDuration(item.speakingSeconds), trendText(item.trend), item.attentionReason || 'On track', formatShortDate(item.lastActivity)
    ]);
    const csv = [headers, ...rows].map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `lovspeak-monitoring-${new Date().toISOString().slice(0, 10)}.csv`; anchor.click(); URL.revokeObjectURL(url);
  };
  const openUser = (target: AdminUser, tab: DetailTab = 'progress') => { setSelected(target); setDetailTab(tab); setFeedback(''); setTaskId(''); void loadDetailsFor([target]); };
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [submittingReplyId, setSubmittingReplyId] = useState<string | null>(null);
  const [accessBusy, setAccessBusy] = useState(false);
  const refreshAccess = async () => {
    try { setAdminAccess(await getAdminAccess()); } catch (error) { console.error(error); }
  };
  const submitFeedback = async () => {
    if (submittingFeedback || !selected || !feedback.trim()) return;
    const task = tasksForPlan(selectedDetail?.plan || null).find(item => item.id === taskId);
    if (feedbackScope === 'task' && !task) { setMessage('Pilih task terlebih dahulu sebelum mengirim komentar tentang task.'); return; }
    setSubmittingFeedback(true);
    try {
      await sendFeedback({ recipientId: selected.uid, authorId: user.uid, authorName: user.displayName || user.email || 'Admin', message: feedback.trim(), scope: feedbackScope, ...(feedbackScope === 'task' ? { taskId: task?.id, taskTitle: task?.title } : {}) });
      setFeedback(''); setTaskId(''); setMessage('Komentar terkirim. User akan melihat notifikasi di aplikasi LovSpeak.');
      setDetails(current => { const next = { ...current }; delete next[selected.uid]; return next; });
      await loadDetailsFor([selected]);
    } catch { setMessage('Komentar belum terkirim. Silakan coba lagi.'); }
    finally { setSubmittingFeedback(false); }
  };
  const submitReply = async (feedbackId: string) => {
    if (submittingReplyId) return;
    const text = replyDrafts[feedbackId]?.trim();
    if (!text) return;
    setSubmittingReplyId(feedbackId);
    try {
      await sendReply(feedbackId, { authorId: user.uid, authorName: user.displayName || user.email || 'Admin', message: text });
      setReplyDrafts(current => ({ ...current, [feedbackId]: '' }));
      setReplies(current => ({ ...current, [feedbackId]: [...(current[feedbackId] || []), { id: `${Date.now()}`, authorId: user.uid, authorName: user.displayName || user.email || 'Admin', message: text, createdAt: new Date().toISOString() }] }));
    } catch { setMessage('Balasan belum terkirim. Silakan coba lagi.'); }
    finally { setSubmittingReplyId(null); }
  };
  const removeFeedback = async (feedbackId: string) => {
    if (!window.confirm('Hapus komentar ini beserta balasannya?')) return;
    const previous = selected ? details[selected.uid]?.feedback : undefined;
    if (selected) setDetails(current => ({ ...current, [selected.uid]: { ...current[selected.uid], feedback: current[selected.uid].feedback.filter(item => item.id !== feedbackId) } }));
    try { await deleteFeedback(feedbackId); }
    catch {
      if (selected && previous) setDetails(current => ({ ...current, [selected.uid]: { ...current[selected.uid], feedback: previous } }));
      setMessage('Komentar tidak dapat dihapus. Coba lagi setelah beberapa saat.');
    }
  };
  const removeReply = async (feedbackId: string, replyId: string) => {
    if (!window.confirm('Hapus balasan ini?')) return;
    const previous = replies[feedbackId];
    setReplies(current => ({ ...current, [feedbackId]: (current[feedbackId] || []).filter(item => item.id !== replyId) }));
    try { await deleteReply(feedbackId, replyId); }
    catch {
      setReplies(current => ({ ...current, [feedbackId]: previous || [] }));
      setMessage('Balasan tidak dapat dihapus. Coba lagi.');
    }
  };
  const handleGrantAdmin = async () => {
    const target = users.find(item => item.uid === accessUserId);
    if (!target || accessBusy) return;
    if (!window.confirm(`Berikan hak akses admin kepada ${target.name}?`)) return;
    setAccessBusy(true);
    try {
      await grantAdminAccess(target, user.uid);
      setAccessUserId('');
      setMessage(`${target.name} kini memiliki hak akses admin.`);
      await refreshAccess();
    } catch { setMessage('Akses admin belum dapat diberikan. Coba lagi.'); }
    finally { setAccessBusy(false); }
  };
  const handleRevokeAdmin = async (access: AdminAccessRecord) => {
    if (accessBusy) return;
    if (!window.confirm(`Cabut akses admin dari ${access.name || access.email}?`)) return;
    setAccessBusy(true);
    try {
      await revokeAdminAccess(access.uid);
      setMessage('Akses admin dicabut.');
      await refreshAccess();
    } catch { setMessage('Akses admin belum dapat dicabut. Coba lagi.'); }
    finally { setAccessBusy(false); }
  };
  const handleBulkSendComment = async () => {
    const text = bulkCommentText.trim();
    if (!text || !bulkSelected.length || bulkSending) return;
    setBulkSending(true);
    try {
      await Promise.all(bulkSelected.map(uid => sendFeedback({ recipientId: uid, authorId: user.uid, authorName: user.displayName || user.email || 'Admin', message: text, scope: 'general' })));
      setMessage(`Komentar terkirim ke ${bulkSelected.length} user.`);
      setBulkCommentText(''); setBulkCommentOpen(false); setBulkSelected([]);
    } catch { setMessage('Sebagian komentar gagal terkirim. Coba lagi.'); }
    finally { setBulkSending(false); }
  };
  const handleBulkAssign = () => {
    if (!bulkSelected.length) return;
    setPrefilledRecipients(bulkSelected);
    setSection('assignments');
  };
  const printUserReport = (target: AdminUser) => {
    const targetDetail = details[target.uid];
    const targetMetric = metrics.find(item => item.user.uid === target.uid);
    if (!targetMetric) { setMessage('Detail user belum termuat. Coba buka user tersebut dulu.'); return; }
    const scored = targetMetric.activities.filter(isScored);
    const scoresByCategory = Object.entries(targetMetric.categories).map(([type, value]) => ({ label: CATEGORY_LABELS[type] || type, value }));
    const dailyScores = Array.from(scored.reduce((map, item) => {
      const key = item.date.slice(0, 10);
      const value = map.get(key) || { total: 0, count: 0 };
      value.total += item.score; value.count += 1; map.set(key, value); return map;
    }, new Map<string, { total: number; count: number }>()).entries())
      .sort(([a], [b]) => a.localeCompare(b)).slice(-14)
      .map(([date, value]) => ({ date, score: Math.round(value.total / value.count) }));
    const assignments = targetDetail?.assignments || [];
    const feedback = targetDetail?.feedback || [];
    const esc = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
    const win = window.open('', '_blank', 'width=900,height=1100');
    if (!win) { setMessage('Popup diblokir browser. Izinkan popup untuk mencetak rapor.'); return; }
    const barChart = dailyScores.length ? `<div class="chart">${dailyScores.map(point => `<div class="col"><span class="val">${point.score}%</span><i style="height:${Math.max(6, point.score)}%"></i><span class="lbl">${formatShortDate(point.date)}</span></div>`).join('')}</div>` : '<p class="muted">Belum ada nilai untuk periode ini.</p>';
    const html = `<!doctype html><html lang="id"><head><meta charset="utf-8" /><title>Rapor ${esc(target.name)} · LovSpeak</title><style>
      *{box-sizing:border-box}body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:#172033;margin:0;padding:32px 40px;background:#fff}
      .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #e9458b;padding-bottom:16px;margin-bottom:24px}
      .logo{font-size:22px;font-weight:900;color:#e9458b;letter-spacing:-.02em}.logo small{display:block;font-size:10px;color:#65718a;font-weight:700;letter-spacing:.15em}
      .header .meta{text-align:right;font-size:11px;color:#65718a}h1{font-size:26px;margin:0 0 4px;font-weight:900;letter-spacing:-.03em}
      .subline{color:#65718a;font-size:12px;margin:0 0 20px}
      .summary{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:0 0 24px}
      .stat{background:#f7f8fb;border:1px solid #e7eaf0;border-radius:12px;padding:12px}.stat b{font-size:20px;display:block;font-weight:900}.stat span{font-size:9px;color:#65718a;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
      h2{font-size:14px;margin:28px 0 10px;padding-bottom:6px;border-bottom:1px solid #e7eaf0}
      .categories{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.categories div{background:#f7f8fb;border-radius:10px;padding:10px;text-align:center}.categories b{font-size:16px;display:block}.categories span{font-size:9px;color:#65718a}
      .chart{height:140px;display:flex;align-items:flex-end;gap:6px;border-bottom:1px solid #e7eaf0;border-left:1px solid #e7eaf0;padding:10px 6px}.col{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%}.col .val{font-size:9px;color:#e9458b;font-weight:800}.col i{width:100%;background:#e9458b;border-radius:4px 4px 0 0;display:block;margin-top:4px}.col .lbl{font-size:8px;color:#65718a;margin-top:4px;white-space:nowrap}
      table{width:100%;border-collapse:collapse;font-size:11px}th,td{text-align:left;padding:8px;border-bottom:1px solid #e7eaf0}th{background:#f7f8fb;font-weight:800;font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#65718a}
      .muted{color:#65718a;font-size:11px;font-style:italic}
      .footer{margin-top:40px;padding-top:12px;border-top:1px solid #e7eaf0;display:flex;justify-content:space-between;font-size:10px;color:#65718a}
      .print{position:fixed;top:14px;right:14px;background:#e9458b;color:#fff;border:0;padding:10px 18px;border-radius:12px;font-weight:800;cursor:pointer;box-shadow:0 6px 16px rgba(233,69,139,.35)}@media print{.print{display:none}body{padding:20px 30px}}
    </style></head><body>
      <button class="print" onclick="window.print()">🖨️ Cetak / Simpan PDF</button>
      <div class="header"><div class="logo">LOVSPEAK<small>LAPORAN BELAJAR MURID</small></div><div class="meta">Dicetak: ${new Date().toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}<br/>Periode: ${periodLabel}</div></div>
      <h1>${esc(target.name)}</h1>
      <p class="subline">${esc(target.email || 'Email belum tersedia')} · Level ${esc(target.level || 'belum dipilih')} · Aktif ${formatLastSeen(target.lastSeenAt)}</p>
      <div class="summary">
        <div class="stat"><b>${targetMetric.average === null ? '—' : `${targetMetric.average}%`}</b><span>Rata-rata nilai</span></div>
        <div class="stat"><b>${targetMetric.completionRate}%</b><span>Progress Daily Plan</span></div>
        <div class="stat"><b>${formatDuration(targetMetric.speakingSeconds)}</b><span>Total speaking</span></div>
        <div class="stat"><b>${trendText(targetMetric.trend)}</b><span>Tren nilai</span></div>
      </div>
      <h2>Nilai per kategori</h2>
      <div class="categories">${scoresByCategory.map(item => `<div><b>${item.value === null ? '—' : `${item.value}%`}</b><span>${esc(item.label)}</span></div>`).join('')}</div>
      <h2>Grafik perkembangan nilai (14 sesi terakhir)</h2>
      ${barChart}
      <h2>Tugas dari admin (${assignments.length})</h2>
      ${assignments.length ? `<table><thead><tr><th>Judul</th><th>Jenis</th><th>Status</th><th>Tenggat</th></tr></thead><tbody>${assignments.slice(0, 20).map(item => `<tr><td>${esc(item.title)}</td><td>${esc(item.target?.kind || '—')}</td><td>${item.status === 'completed' ? '✅ Selesai' : item.status === 'needs_retake' ? '↻ Retake' : '⏳ Belum'}</td><td>${item.dueAt ? esc(formatShortDate(item.dueAt)) : '—'}</td></tr>`).join('')}</tbody></table>` : '<p class="muted">Belum ada tugas dari admin.</p>'}
      <h2>Roadmap</h2>
      <p style="font-size:12px">Menyelesaikan <b>${targetMetric.roadmapCompleted}</b> dari <b>${targetMetric.roadmapTotal}</b> pack di level ${esc(target.level || '—')}.</p>
      <h2>Catatan dari admin (${feedback.length})</h2>
      ${feedback.length ? feedback.slice(0, 10).map(item => `<div style="border-left:3px solid #e9458b;padding:6px 12px;margin:8px 0;background:#fff0f6;border-radius:0 8px 8px 0"><b style="font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#c7286c">${item.scope === 'task' ? `Task · ${esc(item.taskTitle || 'Umum')}` : 'Komentar umum'}</b> <span style="font-size:10px;color:#65718a">${formatShortDate(item.createdAt)}</span><p style="margin:4px 0 0;font-size:12px;white-space:pre-wrap">${esc(item.message)}</p></div>`).join('') : '<p class="muted">Belum ada catatan dari admin.</p>'}
      <div class="footer"><span>LovSpeak · Islamic English Learning</span><span>Rapor otomatis · dicetak oleh admin</span></div>
    </body></html>`;
    win.document.open(); win.document.write(html); win.document.close();
  };
  const handleRetakeAssignment = async (assignmentId: string) => {
    if (!selected) return;
    try {
      await retakeAssignment(selected.uid, assignmentId);
      const retakeAt = new Date().toISOString();
      setDetails(current => ({ ...current, [selected.uid]: { ...current[selected.uid], assignments: (current[selected.uid]?.assignments || []).map(item => item.id === assignmentId ? { ...item, status: 'assigned', attempts: 0, completedAt: null, retakeAt } as UserAssignment : item) } }));
      setMessage('Tugas dikembalikan ke user untuk retake.');
    } catch { setMessage('Retake belum dapat disimpan.'); }
  };

  if (!isAdmin) return <div className="min-h-screen grid place-items-center p-6 bg-slate-50 text-slate-900"><div className="max-w-sm text-center"><div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 grid place-items-center mx-auto"><i className="fas fa-lock" /></div><h1 className="text-xl font-black mt-5">Akses admin tidak tersedia</h1><p className="text-sm text-slate-500 mt-2">Akun ini belum memiliki hak akses admin LovSpeak.</p><button onClick={onLogout} className="mt-5 px-4 py-3 rounded-xl bg-slate-900 text-white font-bold">Keluar</button></div></div>;

  const commentUsers = useMemo(() => metrics.filter(item => (item.detail?.feedback || []).length && `${item.user.name} ${item.user.email}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => (b.detail?.feedback.length || 0) - (a.detail?.feedback.length || 0)), [metrics, query]);
  const historyItems = useMemo(() => [
    ...assignmentHistory.map(item => ({ type: 'assignment' as const, assignment: item, broadcast: null as AdminBroadcastSummary | null, createdAt: item.createdAt || '' })),
    ...broadcastHistory.map(item => ({ type: 'broadcast' as const, assignment: null as AdminAssignmentSummary | null, broadcast: item, createdAt: item.createdAt || '' }))
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [assignmentHistory, broadcastHistory]);
  const attentionPager = usePaged(attention);
  const commentsPager = usePaged(commentUsers);
  const historyPager = usePaged(historyItems);
  const accessPager = usePaged(adminAccess);
  const resetPagers = [attentionPager.setPage, commentsPager.setPage, historyPager.setPage, accessPager.setPage];
  useEffect(() => { resetPagers.forEach(reset => reset(1)); }, [section]);

  const navItems: { id: Section; icon: string; label: string; count?: number }[] = [
    { id: 'overview', icon: 'fa-grid-2', label: 'Overview' }, { id: 'users', icon: 'fa-users', label: 'Semua User', count: users.length },
    { id: 'attention', icon: 'fa-triangle-exclamation', label: 'Perlu Perhatian', count: attention.length }, { id: 'comments', icon: 'fa-message', label: 'Komentar' }, { id: 'assignments', icon: 'fa-clipboard-check', label: 'Tugas & Broadcast' }
    , { id: 'access', icon: 'fa-shield-halved', label: 'Akses Admin', count: adminAccess.length + 1 }
  ];

  return <div className={`admin-root admin-${theme}`}>
    <style>{`
      .admin-root{--accent:#e9458b;--accent-2:#ff7fb0;--accent-soft:#fff0f6;--accent-strong:#c7286c;--page:#f7f8fb;--panel:#fff;--subtle:#f4f6fa;--text:#172033;--muted:#65718a;--line:#e7eaf0;--shadow:0 10px 28px rgba(22,32,51,.06);--shadow-hover:0 20px 40px rgba(233,69,139,.12);min-height:100vh;background:radial-gradient(1200px 500px at 10% -10%,rgba(233,69,139,.06),transparent 60%),radial-gradient(900px 400px at 100% 0%,rgba(157,107,255,.05),transparent 60%),var(--page);color:var(--text);font-family:inherit}.admin-dark{--page:#0e1119;--panel:#181d28;--subtle:#212735;--text:#f4f6fb;--muted:#aab3c5;--line:#2b3343;--shadow:0 12px 30px rgba(0,0,0,.32);--shadow-hover:0 20px 40px rgba(233,69,139,.22);--accent-soft:#4a2436}.admin-dark.admin-root{background:radial-gradient(1200px 500px at 10% -10%,rgba(233,69,139,.12),transparent 60%),radial-gradient(900px 400px at 100% 0%,rgba(157,107,255,.08),transparent 60%),var(--page)}.admin-layout{max-width:1440px;margin:auto;min-height:100vh;display:grid;grid-template-columns:232px minmax(0,1fr)}.admin-side{padding:24px 16px;border-right:1px solid var(--line);display:flex;flex-direction:column;gap:24px}.admin-brand{display:flex;gap:10px;align-items:center;padding:4px 8px}.admin-brand-mark{width:35px;height:35px;border-radius:12px;background:linear-gradient(135deg,var(--accent),#9d6bff);color:white;display:grid;place-items:center;box-shadow:0 8px 18px color-mix(in srgb,var(--accent) 28%,transparent)}.admin-brand b{font-size:15px}.admin-brand span{display:block;color:var(--muted);font-size:10px;margin-top:2px}.admin-nav{display:grid;gap:5px}.admin-nav button{width:100%;border:0;background:transparent;color:var(--muted);text-align:left;padding:11px 12px;border-radius:12px;font-weight:700;font-size:13px;display:flex;align-items:center;gap:11px;cursor:pointer}.admin-nav button:hover{background:var(--subtle);color:var(--text)}.admin-nav button.active{background:var(--accent-soft);color:var(--accent-strong)}.admin-nav .count{margin-left:auto;background:color-mix(in srgb,var(--accent) 12%,transparent);font-size:10px;padding:2px 7px;border-radius:100px}.admin-side-bottom{margin-top:auto}.admin-return{border:1px solid var(--line);background:var(--panel);color:var(--text);width:100%;padding:11px;border-radius:12px;font:inherit;font-size:12px;font-weight:700;cursor:pointer}.admin-main{min-width:0;padding:26px 32px 40px}.admin-top{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:27px}.admin-eyebrow{font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:var(--accent-strong);font-weight:800}.admin-top h1{font-size:27px;line-height:1.1;margin:5px 0 0;font-weight:900;letter-spacing:-.035em}.admin-top p{margin:6px 0 0;font-size:13px;color:var(--muted)}.admin-tools{display:flex;align-items:center;gap:8px}.admin-icon-button,.admin-tools select{height:38px;border:1px solid var(--line);background:var(--panel);color:var(--text);border-radius:10px;padding:0 11px;font:inherit;font-size:12px;cursor:pointer}.admin-icon-button{width:38px;padding:0}.admin-card{background:var(--panel);border:1px solid var(--line);border-radius:18px;box-shadow:var(--shadow)}.admin-alert{padding:12px 15px;background:#fff7e6;color:#946200;border:1px solid #f6dfab;border-radius:12px;font-size:13px;margin-bottom:16px}.admin-dark .admin-alert{background:#3c3019;color:#f6d17a;border-color:#5c4a26}.admin-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px}.admin-kpi{padding:17px}.admin-kpi-icon{height:30px;width:30px;border-radius:10px;background:var(--accent-soft);color:var(--accent-strong);display:grid;place-items:center;font-size:12px}.admin-kpi .value{font-size:23px;line-height:1;margin-top:17px;font-weight:900;letter-spacing:-.04em}.admin-kpi .label{font-size:11px;color:var(--muted);font-weight:700;margin-top:7px}.admin-overview-grid{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(290px,.8fr);gap:18px}.admin-card-head{padding:20px 20px 0;display:flex;justify-content:space-between;gap:12px}.admin-card-head h2{font-size:16px;margin:5px 0 0;letter-spacing:-.02em}.admin-card-head p{font-size:12px;color:var(--muted);margin:5px 0 0}.admin-period{display:flex;gap:4px;padding:3px;border:1px solid var(--line);background:var(--subtle);border-radius:10px;height:max-content}.admin-period button{padding:6px 8px;border:0;background:transparent;border-radius:7px;color:var(--muted);font-size:11px;font-weight:700;cursor:pointer}.admin-period button.active{color:white;background:var(--accent)}.performance-map{height:350px;position:relative;margin:23px 20px 20px;border-left:1px solid var(--line);border-bottom:1px solid var(--line);background-image:linear-gradient(to right,var(--line) 1px,transparent 1px),linear-gradient(to bottom,var(--line) 1px,transparent 1px);background-size:25% 25%;border-radius:0 0 0 13px}.map-axis-y{position:absolute;left:-30px;top:45%;transform:rotate(-90deg);font-size:10px;color:var(--muted);white-space:nowrap}.map-axis-x{position:absolute;right:0;bottom:-25px;font-size:10px;color:var(--muted)}.map-zone{position:absolute;font-size:10px;color:var(--muted);opacity:.85}.map-dot{position:absolute;width:11px;height:11px;border:2px solid var(--panel);border-radius:50%;transform:translate(-50%,50%);cursor:pointer;box-shadow:0 2px 5px rgba(0,0,0,.15);padding:0}.map-dot:hover,.map-dot.selected{outline:3px solid color-mix(in srgb,var(--accent) 28%,transparent);z-index:3;transform:translate(-50%,50%) scale(1.25)}.map-dot.up{background:#22a986}.map-dot.steady{background:#4385ee}.map-dot.down{background:#e66262}.map-dot.none{background:#a4adbd}.map-legend{display:flex;flex-wrap:wrap;gap:11px;padding:0 20px 19px;font-size:11px;color:var(--muted)}.map-legend span{display:flex;align-items:center;gap:5px}.map-legend i{height:8px;width:8px;border-radius:50%;display:inline-block}.attention-list{padding:10px 14px 15px}.attention-row{width:100%;display:flex;align-items:center;gap:10px;border:0;border-bottom:1px solid var(--line);background:transparent;color:var(--text);padding:13px 6px;text-align:left;cursor:pointer}.attention-row:last-child{border-bottom:0}.attention-avatar,.user-avatar{display:grid;place-items:center;border-radius:50%;font-weight:900;background:var(--accent-soft);color:var(--accent-strong);flex:0 0 auto}.attention-avatar{width:31px;height:31px;font-size:11px}.attention-row b{font-size:12px;display:block}.attention-row small{font-size:10px;color:var(--muted);display:block;margin-top:3px}.attention-score{margin-left:auto;font-size:12px;font-weight:900}.admin-empty{padding:34px 20px;color:var(--muted);font-size:13px;text-align:center}.admin-table-card{margin-top:18px}.admin-table-toolbar{padding:18px 20px;display:flex;align-items:center;gap:10px;justify-content:space-between}.admin-search{height:38px;max-width:315px;width:100%;border:1px solid var(--line);color:var(--text);background:var(--subtle);padding:0 12px;border-radius:10px;outline:none;font:inherit;font-size:12px}.admin-table-wrap{overflow:auto}.admin-table{width:100%;border-collapse:collapse;font-size:12px;min-width:760px}.admin-table th{font-weight:800;text-align:left;color:var(--muted);font-size:10px;letter-spacing:.06em;text-transform:uppercase;padding:11px 20px;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.admin-table td{padding:13px 20px;border-bottom:1px solid var(--line)}.admin-table tbody tr{cursor:pointer}.admin-table tbody tr:hover{background:var(--subtle)}.user-cell{display:flex;align-items:center;gap:10px}.user-avatar{width:32px;height:32px;font-size:11px}.user-cell b{display:block}.user-cell span{font-size:10px;color:var(--muted);display:block;margin-top:3px}.status-dot{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:5px}.status-online{background:#22a986}.status-offline{background:#a4adbd}.metric-trend{font-weight:800}.metric-trend.up{color:#149978}.metric-trend.down{color:#d94d54}.metric-trend.steady{color:#4385ee}.metric-trend.none{color:var(--muted)}.admin-pill{font-size:10px;font-weight:800;padding:5px 8px;border-radius:99px;background:var(--subtle);color:var(--muted)}.admin-panel-overlay{position:fixed;inset:0;background:rgba(13,18,29,.32);z-index:50}.admin-detail{position:absolute;right:0;top:0;height:100%;width:min(560px,100%);background:var(--panel);border-left:1px solid var(--line);overflow-y:auto;padding:26px}.detail-head{display:flex;justify-content:space-between;gap:16px}.detail-head h2{font-size:23px;margin:6px 0 0;letter-spacing:-.04em}.detail-close{border:0;background:var(--subtle);color:var(--muted);height:34px;width:34px;border-radius:10px;cursor:pointer}.detail-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:20px 0}.detail-stat{background:var(--subtle);padding:11px;border-radius:12px}.detail-stat b{font-size:15px;display:block}.detail-stat span{font-size:9px;color:var(--muted);font-weight:700;display:block;margin-top:5px}.detail-section{border-top:1px solid var(--line);padding:19px 0}.detail-section h3{font-size:13px;margin:0 0 12px}.category-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.category-item{padding:10px;border-radius:11px;background:var(--subtle)}.category-item span{display:block;font-size:10px;color:var(--muted)}.category-item b{display:block;font-size:16px;margin-top:5px}.mini-bars{height:130px;display:flex;align-items:end;gap:6px;border-bottom:1px solid var(--line);padding:0 2px}.mini-bar{flex:1;min-width:7px;display:flex;align-items:end;height:100%;background:transparent;border:0;padding:0;cursor:default}.mini-bar i{width:100%;background:var(--accent);border-radius:6px 6px 2px 2px;display:block}.mini-labels{display:flex;gap:6px;margin-top:5px}.mini-labels span{flex:1;min-width:7px;font-size:8px;color:var(--muted);white-space:nowrap;overflow:hidden}.feedback-controls{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px}.feedback-controls button,.feedback-send{border:0;background:var(--subtle);color:var(--muted);border-radius:9px;padding:8px 10px;font:inherit;font-size:11px;font-weight:800;cursor:pointer}.feedback-controls button.active,.feedback-send{background:var(--accent);color:white}.feedback-textarea,.reply-input,.feedback-select{width:100%;box-sizing:border-box;border:1px solid var(--line);background:var(--subtle);color:var(--text);border-radius:11px;padding:10px;font:inherit;font-size:12px;outline:none}.feedback-textarea{min-height:84px;resize:vertical}.feedback-select{margin-bottom:8px}.feedback-send{margin-top:8px;padding:10px 13px}.feedback-item{padding:13px 0;border-bottom:1px solid var(--line)}.feedback-item:last-child{border-bottom:0}.feedback-meta{display:flex;justify-content:space-between;gap:8px;color:var(--muted);font-size:10px}.feedback-item p{font-size:12px;line-height:1.55;margin:8px 0}.reply{margin:7px 0 0 12px;padding:8px 10px;background:var(--subtle);border-radius:9px;font-size:11px}.reply-form{display:flex;gap:6px;margin-top:9px}.reply-form button,.delete-text{border:0;background:transparent;color:var(--accent-strong);font:inherit;font-size:10px;font-weight:800;cursor:pointer}.delete-text{color:#d94d54;margin-top:7px}.admin-mobile-bar{display:none}@media(max-width:960px){.admin-layout{grid-template-columns:1fr}.admin-side{display:none}.admin-main{padding:20px}.admin-mobile-bar{display:flex;overflow:auto;gap:7px;padding-bottom:15px}.admin-mobile-bar button{flex:0 0 auto;border:1px solid var(--line);background:var(--panel);color:var(--muted);border-radius:10px;padding:8px 10px;font:inherit;font-size:11px;font-weight:800}.admin-mobile-bar button.active{color:var(--accent-strong);background:var(--accent-soft);border-color:transparent}.admin-overview-grid{grid-template-columns:1fr}.admin-kpis{grid-template-columns:repeat(3,1fr)}}@media(max-width:620px){.admin-main{padding:16px}.admin-top{align-items:flex-start;flex-direction:column;margin-bottom:18px}.admin-tools{width:100%;justify-content:flex-end}.admin-kpis{grid-template-columns:repeat(2,1fr);gap:9px}.admin-kpi:last-child{grid-column:span 2}.admin-kpi{padding:14px}.admin-kpi .value{font-size:20px;margin-top:13px}.performance-map{height:265px;margin:19px 16px 18px}.admin-card-head{padding:16px 16px 0}.admin-period button{padding:6px}.admin-table-toolbar{padding:15px 16px;align-items:stretch;flex-direction:column}.admin-search{max-width:none}.admin-detail{padding:20px}.detail-summary{grid-template-columns:repeat(2,1fr)}.category-grid{grid-template-columns:repeat(2,1fr)}}
.detail-notice{display:flex;gap:8px;align-items:flex-start;background:#fff6e5;color:#8a5a00;padding:10px 11px;border-radius:11px;font-size:11px;margin:0 0 16px}.admin-dark .detail-notice{background:#3b301d;color:#f1cf81}.detail-tabs{display:flex;gap:4px;border-bottom:1px solid var(--line);margin:0 -26px;padding:0 26px}.detail-tabs button{border:0;background:transparent;color:var(--muted);padding:11px 4px;margin-right:14px;font:inherit;font-size:11px;font-weight:800;border-bottom:2px solid transparent;cursor:pointer}.detail-tabs button.active{color:var(--accent-strong);border-color:var(--accent)}.detail-period{font-size:10px;color:var(--muted);margin:12px 0 -4px}.task-source{display:grid;grid-template-columns:1fr 1fr;gap:10px}.task-source-card{background:var(--subtle);border-radius:12px;padding:12px}.task-source-card b{font-size:17px;display:block}.task-source-card span{font-size:10px;color:var(--muted);display:block;margin-top:4px}.task-list{margin-top:12px;border-top:1px solid var(--line)}.task-line{display:flex;align-items:center;gap:8px;padding:9px 0;border-bottom:1px solid var(--line);font-size:11px}.task-line i{font-size:12px}.task-line small{display:block;color:var(--muted);margin-top:2px}.answer-details{margin-top:5px}.answer-details summary{font-size:10px;color:var(--accent-strong);font-weight:800;cursor:pointer}.answer-details p{margin:6px 0 0;font-size:11px;line-height:1.45;color:var(--muted);white-space:pre-wrap}.access-row{display:flex;align-items:center;gap:10px;padding:14px 6px;border-bottom:1px solid var(--line)}.access-row:last-child{border-bottom:0}.access-row b{font-size:12px;display:block}.access-row small{font-size:10px;color:var(--muted);display:block;margin-top:3px}.admin-access-form{margin:18px 20px 4px;display:flex;align-items:center;gap:8px}.admin-access-form .feedback-select{margin:0;max-width:410px}.admin-access-form .feedback-send{margin:0;white-space:nowrap}@media(max-width:620px){.detail-tabs{margin:0 -20px;padding:0 20px}.admin-access-form{margin:16px;align-items:stretch;flex-direction:column}.admin-access-form .feedback-select{max-width:none}.task-source{grid-template-columns:1fr}}.task-source-card b em{font-style:normal;font-size:12px;font-weight:700;color:var(--muted)}.task-source-card small{display:block;color:var(--muted);font-size:10px;margin-top:6px}.score-chart{height:190px;display:flex;gap:8px;margin-top:14px}.score-y-axis{height:160px;display:flex;flex-direction:column;justify-content:space-between;color:var(--muted);font-size:9px;padding-bottom:20px}.score-plot{position:relative;display:flex;align-items:end;justify-content:space-around;gap:10px;flex:1;height:160px;border-left:1px solid var(--line);border-bottom:1px solid var(--line);background:repeating-linear-gradient(to bottom,transparent 0,transparent 39px,var(--line) 40px)}.score-column{height:100%;width:30px;display:flex;flex-direction:column;justify-content:end;align-items:center;gap:5px}.score-value{font-size:10px;font-weight:900;color:var(--accent-strong)}.score-bar{width:26px;min-height:5px;background:var(--accent);border-radius:6px 6px 2px 2px}.score-label{font-size:9px;color:var(--muted);white-space:nowrap;transform:translateY(20px)}@media(max-width:620px){.score-chart{height:175px}.score-plot,.score-y-axis{height:145px}}.detail-readable h3{font-size:15px}.detail-readable .task-line{font-size:14px;padding:13px 0}.detail-readable .task-line small{font-size:12px}.detail-readable .answer-details summary{font-size:12px}.detail-readable .answer-details p{font-size:13px}.detail-readable .feedback-textarea,.detail-readable .reply-input{font-size:14px}.detail-readable .feedback-controls button,.detail-readable .feedback-send{font-size:13px;padding:10px 12px}.chart-select{border:1px solid var(--line);background:var(--subtle);color:var(--text);border-radius:9px;padding:7px 9px;font:inherit;font-size:11px;font-weight:700;max-width:130px}

/* --- ARAH 1 POLISH: Modern & Warm --- */
.admin-brand-mark{background:linear-gradient(135deg,var(--accent) 0%,#9d6bff 60%,#ff7fb0 100%);box-shadow:0 10px 24px color-mix(in srgb,var(--accent) 35%,transparent),inset 0 -3px 8px rgba(255,255,255,.15)}
.admin-nav button{position:relative;transition:background .18s ease,color .18s ease,transform .12s ease}
.admin-nav button:hover{transform:translateX(2px)}
.admin-nav button.active::before{content:'';position:absolute;left:-16px;top:8px;bottom:8px;width:4px;background:linear-gradient(180deg,var(--accent),var(--accent-2));border-radius:0 4px 4px 0;box-shadow:0 4px 12px color-mix(in srgb,var(--accent) 45%,transparent)}
.admin-nav button.active i{color:var(--accent-strong)}
.admin-top h1 i.section-icon{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:14px;background:linear-gradient(135deg,var(--accent-soft),color-mix(in srgb,var(--accent) 12%,var(--panel)));color:var(--accent-strong);font-size:17px;margin-right:12px;vertical-align:-6px}
.admin-icon-button{transition:transform .12s ease,box-shadow .2s ease,background .2s ease}
.admin-icon-button:hover{transform:translateY(-1px);background:var(--accent-soft);color:var(--accent-strong)}

.admin-kpi{position:relative;overflow:hidden;transition:transform .2s cubic-bezier(.2,.7,.3,1),box-shadow .25s ease;cursor:pointer}
.admin-kpi:hover{transform:translateY(-3px);box-shadow:var(--shadow-hover)}
.admin-kpi::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 6%,transparent) 0%,transparent 55%);pointer-events:none}
.admin-kpi-icon{background:linear-gradient(135deg,var(--accent-soft),color-mix(in srgb,var(--accent) 15%,var(--panel)));box-shadow:0 6px 14px color-mix(in srgb,var(--accent) 20%,transparent);height:36px;width:36px;font-size:14px}
.admin-kpi .value{background:linear-gradient(135deg,var(--text),var(--accent-strong));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;font-size:26px;margin-top:14px}
.admin-kpi .label{margin-top:4px;font-size:11px}
.admin-kpi .hint{font-size:10px;color:var(--muted);margin-top:6px;line-height:1.4}
.admin-kpi:nth-child(2)::before{background:linear-gradient(135deg,rgba(78,155,242,.08) 0%,transparent 55%)}
.admin-kpi:nth-child(3)::before{background:linear-gradient(135deg,rgba(34,169,134,.08) 0%,transparent 55%)}
.admin-kpi:nth-child(4)::before{background:linear-gradient(135deg,rgba(230,98,98,.09) 0%,transparent 55%)}

.admin-card{transition:box-shadow .25s ease}
.admin-table tbody tr{transition:background .15s ease}
.admin-table tbody tr:hover{background:linear-gradient(90deg,var(--accent-soft),transparent 60%)}
.attention-row{transition:background .15s ease,transform .12s ease}
.attention-row:hover{background:var(--accent-soft);transform:translateX(2px)}

.feedback-send{background:linear-gradient(135deg,var(--accent),var(--accent-strong));box-shadow:0 6px 16px color-mix(in srgb,var(--accent) 30%,transparent);transition:transform .12s ease,box-shadow .2s ease,filter .15s ease}
.feedback-send:hover:not(:disabled){transform:translateY(-1px);filter:brightness(1.05)}
.feedback-send:active:not(:disabled){transform:translateY(0)}
.feedback-send:disabled{background:var(--subtle);color:var(--muted);box-shadow:none;cursor:not-allowed}

.map-dot{transition:transform .15s ease,box-shadow .2s ease}
.performance-map{background-image:linear-gradient(to right,color-mix(in srgb,var(--line) 60%,transparent) 1px,transparent 1px),linear-gradient(to bottom,color-mix(in srgb,var(--line) 60%,transparent) 1px,transparent 1px)}

.admin-panel-overlay{background:rgba(13,18,29,.42);backdrop-filter:blur(3px);animation:fadeIn .18s ease-out}
.admin-detail{animation:slideInRight .28s cubic-bezier(.2,.7,.3,1);box-shadow:-20px 0 50px rgba(0,0,0,.15)}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideInRight{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}

.skeleton{position:relative;overflow:hidden;background:var(--subtle);border-radius:10px}
.skeleton::after{content:'';position:absolute;inset:0;transform:translateX(-100%);background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--accent) 12%,transparent),transparent);animation:shimmer 1.4s infinite}
@keyframes shimmer{100%{transform:translateX(100%)}}
.skeleton-row{display:flex;align-items:center;gap:12px;padding:14px 20px;border-bottom:1px solid var(--line)}
.skeleton-row .skeleton{height:14px;flex:1}
.skeleton-row .skeleton.circle{width:32px;height:32px;flex:0 0 auto;border-radius:50%}
.skeleton-row .skeleton.short{flex:0 0 60px}
.skeleton-kpi{padding:17px;border-radius:18px;background:var(--panel);border:1px solid var(--line);box-shadow:var(--shadow)}
.skeleton-kpi .skeleton{height:12px;margin-bottom:10px}
.skeleton-kpi .skeleton.big{height:26px;width:70%}

.empty-illustration{width:120px;height:120px;margin:0 auto 16px;display:block}

.admin-pagination{display:flex;justify-content:space-between;align-items:center;padding:12px 20px;gap:10px;font-size:12px;color:var(--muted)}
.admin-pagination button{border:1px solid var(--line);background:var(--panel);color:var(--text);padding:8px 14px;border-radius:10px;font-weight:800;font-size:11px;cursor:pointer;transition:all .15s ease}
.admin-pagination button:hover:not(:disabled){background:var(--accent-soft);color:var(--accent-strong);border-color:transparent}
.admin-pagination button:disabled{opacity:.4;cursor:not-allowed}

.admin-table-controls{display:flex;gap:8px;flex-wrap:wrap}
.admin-filter{height:38px;border:1px solid var(--line);background:var(--subtle);color:var(--text);border-radius:10px;padding:0 10px;font:inherit;font-size:12px;font-weight:700;cursor:pointer;transition:border-color .15s ease}
.admin-filter:hover{border-color:var(--accent)}
.admin-filter:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 20%,transparent)}

.admin-recipient-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;max-height:280px;overflow-y:auto;padding:12px;background:var(--subtle);border-radius:12px;margin-bottom:8px}
.admin-recipient-grid label{display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--panel);border-radius:8px;font-size:12px;cursor:pointer;transition:background .12s ease}
.admin-recipient-grid label:hover{background:var(--accent-soft)}
.admin-recipient-grid label small{display:block;color:var(--muted);font-size:10px;margin-top:2px}
.admin-recipient-grid input{margin:0}

/* --- Prominent "Back to LovSpeak" button --- */
.admin-back-btn{display:inline-flex;align-items:center;gap:8px;height:38px;padding:0 14px;border:0;background:linear-gradient(135deg,var(--accent),var(--accent-strong));color:#fff;border-radius:10px;font:inherit;font-size:12px;font-weight:800;cursor:pointer;box-shadow:0 6px 16px color-mix(in srgb,var(--accent) 30%,transparent);transition:transform .12s ease,box-shadow .2s ease,filter .15s ease;white-space:nowrap}
.admin-back-btn:hover{transform:translateY(-1px);filter:brightness(1.06)}
.admin-back-btn:active{transform:translateY(0)}
.admin-back-btn i{font-size:11px}

/* --- Canva-style bottom navigation (mobile & tablet) --- */
.admin-bottom-nav{display:none}
.admin-more-overlay{position:fixed;inset:0;z-index:80;background:rgba(13,18,29,.45);backdrop-filter:blur(3px);animation:fadeIn .18s ease-out}
.admin-more-sheet{position:fixed;left:0;right:0;bottom:0;z-index:81;background:var(--panel);border-radius:22px 22px 0 0;padding:10px 18px calc(18px + env(safe-area-inset-bottom));box-shadow:0 -16px 44px rgba(0,0,0,.22);animation:sheetUp .26s cubic-bezier(.2,.7,.3,1)}
@keyframes sheetUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}
.admin-more-grab{width:42px;height:5px;border-radius:99px;background:var(--line);margin:4px auto 12px}
.admin-more-title{display:block;font-size:13px;font-weight:900;margin-bottom:10px;color:var(--text)}
.admin-more-list{display:grid;gap:2px}
.admin-more-list button{display:flex;align-items:center;gap:13px;width:100%;border:0;background:transparent;color:var(--text);font:inherit;font-size:14px;font-weight:700;padding:13px 8px;border-radius:12px;cursor:pointer;text-align:left}
.admin-more-list button:hover{background:var(--subtle)}
.admin-more-list button i{width:22px;text-align:center;font-size:15px}
.admin-more-list button.danger{color:#d94d54}
.admin-more-count{margin-left:auto;background:var(--accent-soft);color:var(--accent-strong);font-size:11px;font-weight:800;padding:2px 9px;border-radius:99px}
.admin-more-divider{height:1px;background:var(--line);margin:6px 0}
.load-more{display:block;width:100%;margin-top:10px;border:1px dashed var(--line);background:var(--subtle);color:var(--accent-strong);border-radius:10px;padding:9px;font:inherit;font-size:11px;font-weight:800;cursor:pointer;transition:background .15s ease,border-color .15s ease}
.load-more:hover{background:var(--accent-soft);border-color:var(--accent)}

/* --- Responsive polish (mobile & tablet) --- */
@media(max-width:960px){
  .mobile-hide{display:none!important}
  .admin-mobile-bar{display:none}
  .admin-main{padding-bottom:100px}
  .admin-bottom-nav{position:fixed;left:0;right:0;bottom:0;z-index:60;display:grid;grid-template-columns:repeat(4,1fr);gap:2px;background:var(--panel);border-top:1px solid var(--line);padding:8px 8px calc(8px + env(safe-area-inset-bottom));box-shadow:0 -10px 30px rgba(0,0,0,.10)}
  .admin-bottom-nav button{border:0;background:transparent;color:var(--muted);font:inherit;font-size:10px;font-weight:800;display:flex;flex-direction:column;align-items:center;gap:4px;padding:7px 2px 5px;border-radius:14px;cursor:pointer;transition:color .15s ease,background .15s ease}
  .admin-bottom-nav button i{font-size:17px}
  .admin-bottom-nav button.active{color:var(--accent-strong);background:var(--accent-soft)}

  .admin-top{gap:12px}
  .admin-top h1 i.section-icon{width:32px;height:32px;font-size:14px;border-radius:11px;margin-right:9px;vertical-align:-4px}
  .admin-top h1{font-size:22px}
  .admin-back-btn span{display:none}
  .admin-back-btn{width:38px;padding:0;justify-content:center}
  .admin-back-btn i{font-size:12px}
  .admin-mobile-bar{margin-bottom:4px}
  .admin-mobile-bar button{border-radius:99px;padding:9px 13px;display:inline-flex;align-items:center;gap:5px}
  .admin-mobile-bar button.active{box-shadow:0 4px 12px color-mix(in srgb,var(--accent) 25%,transparent)}
  .empty-illustration{width:90px;height:90px;margin-bottom:12px}
  .admin-recipient-grid{grid-template-columns:1fr 1fr;max-height:220px}
}
@media(max-width:620px){
  .admin-main{padding:14px 12px 28px}
  .admin-top{margin-bottom:16px;flex-direction:row;align-items:flex-start}
  .admin-tools{width:auto;flex-shrink:0}
  .admin-top h1{font-size:20px}
  .admin-top h1 i.section-icon{width:28px;height:28px;font-size:12px;border-radius:9px;margin-right:8px;vertical-align:-4px}
  .admin-top p{font-size:12px}
  .admin-tools{gap:6px;flex-wrap:wrap}
  .admin-icon-button{height:36px;width:36px}
  .admin-back-btn{height:36px;width:36px}
  .admin-kpi{padding:12px}
  .admin-kpi .value{font-size:18px;margin-top:11px}
  .admin-kpi .label{font-size:10px}
  .admin-kpi .hint{font-size:9px}
  .admin-kpi-icon{height:30px;width:30px;font-size:12px}
  .performance-map{height:230px;margin:16px 12px 14px}
  .map-axis-y{display:none}
  .map-axis-x{display:none}
  .map-zone{font-size:9px}
  .admin-card-head{flex-direction:column;padding:14px 14px 0}
  .admin-card-head h2{font-size:14px}
  .admin-card-head p{font-size:11px}
  .attention-list{padding:6px 10px 10px}
  .attention-row{padding:11px 4px}
  .empty-illustration{width:72px;height:72px}
  .admin-recipient-grid{grid-template-columns:1fr;max-height:180px;padding:8px}
  .admin-recipient-grid label{padding:10px}
  .admin-table{font-size:11px;min-width:640px}
  .admin-table th{padding:9px 14px;font-size:9px}
  .admin-table td{padding:11px 14px}
  .admin-pagination{padding:10px 14px;font-size:11px;flex-wrap:wrap;justify-content:center}
  .admin-detail{padding:18px 16px}
  .detail-head h2{font-size:19px}
  .detail-summary{gap:6px;margin:16px 0}
  .detail-stat{padding:9px}
  .detail-stat b{font-size:13px}
  .score-chart{margin-top:10px}
  .feedback-controls button{padding:8px 12px;font-size:12px}
  .admin-alert{font-size:12px;padding:10px 13px}
}
@media(max-width:420px){
  .admin-kpis{grid-template-columns:1fr;gap:8px}
  .admin-kpi:last-child{grid-column:auto}
  .admin-kpi{padding:14px 16px}
  .admin-kpi .value{font-size:22px}
  .admin-recipient-grid label{font-size:13px}
}
`}</style>
    <div className="admin-layout">
      <aside className="admin-side"><div className="admin-brand"><div className="admin-brand-mark"><i className="fas fa-heart" /></div><div><b>LOVSPEAK</b><span>ADMIN CONSOLE</span></div></div><nav className="admin-nav">{navItems.map(item => <button key={item.id} onClick={() => setSection(item.id)} className={section === item.id ? 'active' : ''}><i className={`fas ${item.icon}`} />{item.label}{item.count !== undefined && <span className="count">{item.count}</span>}</button>)}</nav><div className="admin-side-bottom"><button className="admin-return" onClick={() => window.location.assign('/')}><i className="fas fa-arrow-left mr-2" />Kembali ke LovSpeak</button></div></aside>
      <main className="admin-main">
        <header className="admin-top"><div><span className="admin-eyebrow">LovSpeak LMS</span><h1><i className={`fas ${SectionIcons[section]} section-icon`} />{section === 'overview' ? 'Overview kelas' : section === 'users' ? 'Semua user' : section === 'attention' ? 'Perlu perhatian' : section === 'comments' ? 'Komentar user' : section === 'assignments' ? 'Tugas & broadcast' : 'Akses admin'}</h1><p>{section === 'overview' ? 'Pantau kondisi kelas dan temukan user yang perlu dibantu.' : section === 'access' ? 'Kelola hak akses tanpa mencampurkannya dengan monitoring user.' : section === 'assignments' ? 'Bagikan tugas terarah, tenggat, dan pesan kelas dari satu tempat.' : 'Data diperbarui dari aktivitas LovSpeak.'}</p></div><div className="admin-tools"><button className="admin-back-btn mobile-hide" onClick={() => window.location.assign('/')} title="Kembali ke LovSpeak"><i className="fas fa-arrow-left" /><span>Kembali ke LovSpeak</span></button><button className="admin-icon-button" onClick={() => void refresh({ resetDetails: true })} title="Muat ulang data"><i className={`fas fa-rotate-right ${loading || detailLoading ? 'fa-spin' : ''}`} /></button><button className="admin-icon-button mobile-hide" onClick={exportReport} title="Unduh laporan Excel-compatible"><i className="fas fa-file-export" /></button><button className="admin-icon-button mobile-hide" onClick={() => saveTheme(theme === 'light' ? 'dark' : 'light')} title="Ganti mode"><i className={`fas fa-${theme === 'light' ? 'moon' : 'sun'}`} /></button><button className="admin-icon-button mobile-hide" onClick={onLogout} title="Keluar"><i className="fas fa-arrow-right-from-bracket" /></button></div></header>
        {message && <div className="admin-alert">{message}</div>}
        {detailLoading && <div className="admin-alert" style={{ background: 'var(--accent-soft)', color: 'var(--accent-strong)', borderColor: 'var(--line)' }}>Ringkasan user sudah tampil. Detail nilai dan aktivitas sedang dilengkapi…</div>}
        {loading && !users.length ? <>
          <div className="admin-kpis">{[0, 1, 2, 3].map(index => <div key={index} className="skeleton-kpi"><div className="skeleton" style={{ width: 36, height: 36, borderRadius: 10 }} /><div className="skeleton big" style={{ marginTop: 16 }} /><div className="skeleton" style={{ width: '50%' }} /></div>)}</div>
          <div className="admin-card">{[0, 1, 2, 3, 4].map(index => <div key={index} className="skeleton-row"><div className="skeleton circle" /><div><div className="skeleton" style={{ width: 140, marginBottom: 6 }} /><div className="skeleton" style={{ width: 90, height: 10 }} /></div><div className="skeleton short" style={{ marginLeft: 'auto' }} /></div>)}</div>
        </> : !users.length ? <div className="admin-card admin-empty"><svg className="empty-illustration" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="60" r="58" fill="var(--accent-soft)" /><circle cx="60" cy="48" r="18" fill="var(--accent)" opacity="0.15" /><circle cx="60" cy="48" r="12" fill="var(--accent)" /><path d="M30 92c0-16 13-28 30-28s30 12 30 28" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.35" /><path d="M85 30l4 4M31 30l-4 4M60 22v-4" stroke="var(--accent-strong)" strokeWidth="2.5" strokeLinecap="round" /></svg><b style={{ display: 'block', color: 'var(--text)', fontSize: 15, marginBottom: 6 }}>Belum ada user terdaftar</b>Bagikan link LovSpeak untuk mulai mengundang murid.<br />Data pantau muncul otomatis setelah user pertama masuk.</div> : <>
          {section === 'overview' && <>
            <div className="admin-kpis">{[
              ['fa-users', `${users.length}`, 'Total user', `${activeCount} online${lastUpdated ? ` · diperbarui ${lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}` : ''}`],
              ['fa-chart-line', meanScore === null ? '—' : `${meanScore}%`, 'Rata-rata nilai', `User bernilai · ${periodLabel}`],
              ['fa-check', `${dailyPlanFinished} dari ${dailyPlanUsers.length}`, 'Daily Plan aktif selesai', 'Rencana aktif saat ini · bukan riwayat semua hari'],
              ['fa-triangle-exclamation', String(attention.length), 'Perlu perhatian', 'Nilai rendah atau tidak aktif']
            ].map(([icon, value, label, hint]) => <button type="button" className="admin-card admin-kpi" key={label} onClick={() => { if (label === 'Perlu perhatian') setSection('attention'); else if (label === 'Daily Plan aktif selesai') { setSection('users'); setUserFilter('daily-incomplete'); } }} style={{ textAlign: 'left', width: '100%' }}><div className="admin-kpi-icon"><i className={`fas ${icon}`} /></div><div className="value">{value}</div><div className="label">{label}</div><div className="hint" style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4, lineHeight: 1.35 }}>{hint}</div></button>)}</div>
            <div className="admin-overview-grid"><section className="admin-card"><div className="admin-card-head"><div><span className="admin-eyebrow">Grafik utama</span><h2>Peta performa user</h2><p>Posisi menunjukkan nilai dan penyelesaian Daily Plan. Warna menunjukkan tren nilai.</p></div><div className="admin-period">{(['week', 'month', 'all'] as Period[]).map(item => <button key={item} className={period === item ? 'active' : ''} onClick={() => setPeriod(item)}>{item === 'week' ? '7 hari' : item === 'month' ? '30 hari' : 'Semua'}</button>)}</div></div><PerformanceMap metrics={metrics} selectedId={selected?.uid} onSelect={openUser} /><div className="map-legend"><span><i style={{ background: '#22a986' }} />Meningkat</span><span><i style={{ background: '#4385ee' }} />Stabil</span><span><i style={{ background: '#e66262' }} />Menurun</span><span><i style={{ background: '#a4adbd' }} />Belum cukup data</span></div></section>
              <section className="admin-card"><div className="admin-card-head"><div><span className="admin-eyebrow">Tindakan cepat</span><h2>Perlu perhatian</h2><p>User yang sebaiknya diperiksa terlebih dahulu.</p></div><span className="admin-pill">{attention.length} user</span></div><div className="attention-list">{attention.slice(0, 7).map(item => <AttentionRow key={item.user.uid} item={item} onClick={() => openUser(item.user)} />)}{!attention.length && <div className="admin-empty">Belum ada user yang memerlukan perhatian pada periode ini.</div>}</div></section></div>
            <EnhancedUserTable metrics={metrics} query={query} setQuery={setQuery} onSelect={openUser} onVisibleUsers={loadDetailsFor} reloadToken={detailRevision} title="User terbaru" subtitle="Ringkasan dimuat per halaman; klik user untuk detail lengkap." showSearch={false} filter="all" setFilter={setUserFilter} sort={userSort} setSort={setUserSort} /></>}
          {section === 'users' && <EnhancedUserTable metrics={metrics} query={query} setQuery={setQuery} onSelect={openUser} onVisibleUsers={loadDetailsFor} reloadToken={detailRevision} title="Daftar user" subtitle="Detail nilai, task, jawaban, dan komentar dimuat saat diperlukan." showSearch filter={userFilter} setFilter={setUserFilter} sort={userSort} setSort={setUserSort} bulkSelected={bulkSelected} setBulkSelected={setBulkSelected} onBulkComment={() => setBulkCommentOpen(true)} onBulkAssign={handleBulkAssign} />}
          {section === 'attention' && <section className="admin-card admin-table-card"><div className="admin-card-head"><div><span className="admin-eyebrow">Prioritas pendampingan</span><h2>Daftar user yang perlu diperiksa</h2><p>Urut berdasarkan penurunan nilai, nilai rendah, task tertinggal, atau tidak aktif.</p></div></div><div className="attention-list">{attentionPager.visible.map(item => <AttentionRow key={item.user.uid} item={item} onClick={() => openUser(item.user)} />)}{!attention.length && <div className="admin-empty"><svg className="empty-illustration" viewBox="0 0 120 120" fill="none"><circle cx="60" cy="60" r="58" fill="var(--accent-soft)" /><path d="M40 60l14 14 28-28" stroke="#22a986" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg><b style={{ display: 'block', color: 'var(--text)', fontSize: 14, marginBottom: 4 }}>Semua user aman!</b>Tidak ada yang perlu perhatian khusus pada periode ini.</div>}</div><Pager {...attentionPager} /></section>}
          {section === 'comments' && <section className="admin-card admin-table-card"><div className="admin-table-toolbar"><div><span className="admin-eyebrow">Komunikasi</span><h2 className="text-[16px] font-black mt-1 mb-0">Komentar dan balasan</h2><p className="text-[12px] text-[var(--muted)] mt-1 mb-0">Pilih user untuk menulis komentar atau melanjutkan percakapan.</p></div><input className="admin-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Cari user berkomentar..." /></div><div className="attention-list">{commentsPager.visible.map(item => <button className="attention-row" key={item.user.uid} onClick={() => openUser(item.user, 'comments')}><AvatarBubble name={item.user.name} size={31} className="attention-avatar" /><div><b>{item.user.name}</b><small>{item.detail?.feedback.length} komentar · terakhir {formatShortDate(item.detail?.feedback[0]?.createdAt)}</small></div><i className="fas fa-chevron-right ml-auto text-[10px]" /></button>)}{!commentUsers.length && <div className="admin-empty">Belum ada komentar yang dikirim.</div>}</div><Pager {...commentsPager} /></section>}
          {section === 'assignments' && <>
            <div className="feedback-controls" style={{ marginBottom: 12 }}>
              <button className={assignmentTab === 'compose' ? 'active' : ''} onClick={() => setAssignmentTab('compose')}>Buat baru</button>
              <button className={assignmentTab === 'history' ? 'active' : ''} onClick={() => setAssignmentTab('history')}>Riwayat kiriman</button>
            </div>
            {assignmentTab === 'compose' && <AdminAssignmentsPanel users={users} adminUid={user.uid} onMessage={setMessage} initialRecipientIds={prefilledRecipients} onConsumePrefill={() => setPrefilledRecipients(null)} />}
            {assignmentTab === 'history' && <section className="admin-card admin-table-card">
              <div className="admin-table-toolbar"><div><span className="admin-eyebrow">Audit trail</span><h2 className="text-[16px] font-black mt-1 mb-0">Riwayat tugas & broadcast</h2><p className="text-[12px] text-[var(--muted)] mt-1 mb-0">Semua yang pernah dikirim, terbaru dulu. Hapus jika perlu bersihkan riwayat.</p></div><button className="admin-icon-button" onClick={() => void loadHistory()} title="Muat ulang riwayat"><i className={`fas fa-rotate-right ${historyLoading ? 'fa-spin' : ''}`} /></button></div>
              <div className="attention-list">
                {historyLoading && !assignmentHistory.length && !broadcastHistory.length && <div className="admin-empty"><i className="fas fa-circle-notch fa-spin mr-2" />Memuat riwayat…</div>}
                {!historyLoading && !assignmentHistory.length && !broadcastHistory.length && <div className="admin-empty">Belum ada tugas atau broadcast yang pernah dikirim.</div>}
                {historyPager.visible.map(entry => entry.type === 'assignment' && entry.assignment ? <div key={`a-${entry.assignment.id}`} className="attention-row" style={{ cursor: 'default' }}>
                  <div className="attention-avatar" style={{ background: '#e0f2fe', color: '#0284c7' }}><i className="fas fa-clipboard-check" /></div>
                  <div style={{ flex: 1 }}>
                    <b>{entry.assignment.title}</b>
                    <small>Tugas · {entry.assignment.target?.kind || '—'} · {entry.assignment.recipientCount} penerima · {formatShortDate(entry.assignment.createdAt)}{entry.assignment.dueAt ? ` · tenggat ${formatShortDate(entry.assignment.dueAt)}` : ''}</small>
                  </div>
                  <button className="delete-text" onClick={() => void handleDeleteAssignment(entry.assignment!)}>Hapus</button>
                </div> : entry.broadcast ? <div key={`b-${entry.broadcast.id}`} className="attention-row" style={{ cursor: 'default' }}>
                  <div className="attention-avatar" style={{ background: '#fef3c7', color: '#b45309' }}><i className="fas fa-bullhorn" /></div>
                  <div style={{ flex: 1 }}>
                    <b>{entry.broadcast.title}</b>
                    <small>Broadcast · {entry.broadcast.recipientCount} penerima · {formatShortDate(entry.broadcast.createdAt)}</small>
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--muted)', whiteSpace: 'pre-wrap' }}>{entry.broadcast.message.slice(0, 120)}{entry.broadcast.message.length > 120 ? '…' : ''}</p>
                  </div>
                  <button className="delete-text" onClick={() => void handleDeleteBroadcast(entry.broadcast!)}>Hapus</button>
                </div> : null)}
              </div>
              <Pager {...historyPager} />
            </section>}
          </>}
          {section === 'access' && <section className="admin-card admin-table-card"><div className="admin-card-head"><div><span className="admin-eyebrow">Keamanan</span><h2>Kelola akses admin</h2><p>Hanya user yang sudah memiliki akun LovSpeak yang dapat diberikan akses admin.</p></div></div><div className="admin-access-form"><select className="feedback-select" value={accessUserId} onChange={event => setAccessUserId(event.target.value)}><option value="">Pilih user yang akan diberi akses</option>{users.filter(item => item.uid !== user.uid && !adminAccess.some(access => access.uid === item.uid)).map(item => <option key={item.uid} value={item.uid}>{item.name} · {item.email || 'tanpa email'}</option>)}</select><button className="feedback-send" disabled={accessBusy || !accessUserId} onClick={() => void handleGrantAdmin()}>{accessBusy ? 'Memproses…' : 'Berikan akses admin'}</button></div><div className="attention-list"><div className="access-row"><div className="attention-avatar">{MASTER_ADMIN_EMAIL.slice(0, 1).toUpperCase()}</div><div><b>Admin Utama</b><small>{MASTER_ADMIN_EMAIL} · tidak dapat dicabut</small></div><span className="admin-pill">Bawaan sistem</span></div>{accessPager.visible.map(access => <div className="access-row" key={access.uid}><AvatarBubble name={access.name || access.email} size={31} className="attention-avatar" /><div><b>{access.name || 'Admin'}</b><small>{access.email || 'Email tidak tersedia'} · ditambahkan {formatShortDate(access.createdAt)}</small></div><button className="delete-text ml-auto" disabled={accessBusy} onClick={() => void handleRevokeAdmin(access)}>Cabut akses</button></div>)}</div><Pager {...accessPager} /></section>}
        </>}
      </main>
    </div>
    <nav className="admin-bottom-nav">
      {([['overview', 'fa-grid-2', 'Overview'], ['users', 'fa-users', 'User'], ['assignments', 'fa-clipboard-check', 'Tugas']] as [Section, string, string][]).map(([id, icon, label]) => <button key={id} className={section === id && !moreOpen ? 'active' : ''} onClick={() => { setMoreOpen(false); setSection(id); }}><i className={`fas ${icon}`} /><span>{label}</span></button>)}
      <button className={moreOpen || ['attention', 'comments', 'access'].includes(section) ? 'active' : ''} onClick={() => setMoreOpen(current => !current)}><i className="fas fa-ellipsis" /><span>Lainnya</span></button>
    </nav>
    {moreOpen && <div className="admin-more-overlay" onClick={() => setMoreOpen(false)}>
      <div className="admin-more-sheet" onClick={event => event.stopPropagation()}>
        <div className="admin-more-grab" />
        <b className="admin-more-title">Menu lainnya</b>
        <div className="admin-more-list">
          <button onClick={() => { setSection('attention'); setMoreOpen(false); }}><i className="fas fa-triangle-exclamation" style={{ color: '#e66262' }} />Perlu Perhatian{attention.length > 0 && <span className="admin-more-count">{attention.length}</span>}</button>
          <button onClick={() => { setSection('comments'); setMoreOpen(false); }}><i className="fas fa-message" style={{ color: '#4385ee' }} />Komentar</button>
          <button onClick={() => { setSection('access'); setMoreOpen(false); }}><i className="fas fa-shield-halved" style={{ color: '#7c5ce5' }} />Akses Admin<span className="admin-more-count">{adminAccess.length + 1}</span></button>
          <div className="admin-more-divider" />
          <button onClick={() => { exportReport(); setMoreOpen(false); }}><i className="fas fa-file-export" style={{ color: '#14a88b' }} />Unduh laporan Excel</button>
          <button onClick={() => saveTheme(theme === 'light' ? 'dark' : 'light')}><i className={`fas fa-${theme === 'light' ? 'moon' : 'sun'}`} style={{ color: '#f0a020' }} />{theme === 'light' ? 'Mode malam' : 'Mode terang'}</button>
          <div className="admin-more-divider" />
          <button onClick={() => window.location.assign('/')}><i className="fas fa-arrow-left" style={{ color: 'var(--accent-strong)' }} />Kembali ke LovSpeak</button>
          <button className="danger" onClick={() => void onLogout()}><i className="fas fa-arrow-right-from-bracket" />Keluar</button>
        </div>
      </div>
    </div>}
    {bulkCommentOpen && <div className="admin-panel-overlay" onMouseDown={() => !bulkSending && setBulkCommentOpen(false)}>
      <div onMouseDown={event => event.stopPropagation()} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'min(440px,92%)', background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 18, padding: 22, boxShadow: 'var(--shadow)' }}>
        <span className="admin-eyebrow">Bulk komentar</span>
        <h3 style={{ margin: '6px 0 4px', fontSize: 17 }}>Kirim komentar ke {bulkSelected.length} user</h3>
        <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>Komentar umum yang sama akan dikirim ke setiap user terpilih.</p>
        <textarea className="feedback-textarea" style={{ marginTop: 12 }} value={bulkCommentText} onChange={event => setBulkCommentText(event.target.value)} placeholder="Tulis komentar untuk semua user terpilih…" />
        <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
          <button className="feedback-controls" onClick={() => setBulkCommentOpen(false)} disabled={bulkSending} style={{ background: 'var(--subtle)', color: 'var(--muted)', border: 0, borderRadius: 9, padding: '8px 14px', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>Batal</button>
          <button className="feedback-send" onClick={() => void handleBulkSendComment()} disabled={bulkSending || !bulkCommentText.trim()}>{bulkSending ? 'Mengirim…' : `Kirim ke ${bulkSelected.length} user`}</button>
        </div>
      </div>
    </div>}
    {selected && selectedMetric && <DetailPanelV2 user={selected} metric={selectedMetric} detail={selectedDetail} activities={selectedActivities} scored={selectedScored} speaking={selectedSpeaking} period={period} tab={detailTab} setTab={setDetailTab} feedback={feedback} setFeedback={setFeedback} feedbackScope={feedbackScope} setFeedbackScope={setFeedbackScope} taskId={taskId} setTaskId={setTaskId} onClose={() => setSelected(null)} onSubmitFeedback={submitFeedback} submittingFeedback={submittingFeedback} submittingReplyId={submittingReplyId} replies={replies} replyDrafts={replyDrafts} setReplyDrafts={setReplyDrafts} onReply={submitReply} onDeleteFeedback={removeFeedback} onDeleteReply={removeReply} onRetakeAssignment={handleRetakeAssignment} onPrintReport={() => printUserReport(selected)} />}
  </div>;
};

const PerformanceMap: React.FC<{ metrics: UserMetric[]; selectedId?: string; onSelect: (user: AdminUser) => void }> = ({ metrics, selectedId, onSelect }) => {
  const plotted = metrics.filter(item => item.average !== null);
  const noData = metrics.length - plotted.length;
  return <><div className="performance-map"><span className="map-axis-y">Nilai</span><span className="map-axis-x">Penyelesaian Daily Plan →</span><span className="map-zone" style={{ left: '7%', top: '9%' }}>Perlu dijaga</span><span className="map-zone" style={{ right: '7%', top: '9%' }}>Performa unggul</span><span className="map-zone" style={{ left: '7%', bottom: '9%' }}>Perlu perhatian</span><span className="map-zone" style={{ right: '7%', bottom: '9%' }}>Rajin, perlu bantuan</span>{plotted.map(item => { const x = item.totalTasks ? Math.max(4, Math.min(96, item.completionRate)) : 5; const y = Math.max(7, Math.min(96, item.average as number)); return <button aria-label={`Detail ${item.user.name}`} key={item.user.uid} title={`${item.user.name} · ${item.average}% · ${item.completionRate}% Daily Plan`} className={`map-dot ${item.trend} ${selectedId === item.user.uid ? 'selected' : ''}`} onClick={() => onSelect(item.user)} style={{ left: `${x}%`, bottom: `${y}%` }} />; })}</div>{noData > 0 && <p style={{ padding: '0 20px', margin: '6px 0 0', fontSize: 10, color: 'var(--muted)' }}><i className="fas fa-circle-info mr-1" />{noData} user belum memiliki nilai — tidak ditampilkan pada peta.</p>}</>;
};

const AttentionRow: React.FC<{ item: UserMetric; onClick: () => void }> = ({ item, onClick }) => <button className="attention-row" onClick={onClick}><AvatarBubble name={item.user.name} size={31} className="attention-avatar" /><div><b>{item.user.name}</b><small>{item.attentionReason}</small></div><span className="attention-score">{item.average === null ? '—' : `${item.average}%`}</span></button>;

type DetailPanelV2Props = {
  user: AdminUser;
  metric: UserMetric;
  detail?: AdminUserDetail;
  activities: ActivityLog[];
  scored: ActivityLog[];
  speaking: ActivityLog[];
  period: Period;
  tab: DetailTab;
  setTab: (tab: DetailTab) => void;
  feedback: string;
  setFeedback: (value: string) => void;
  feedbackScope: 'general' | 'task';
  setFeedbackScope: (value: 'general' | 'task') => void;
  taskId: string;
  setTaskId: (value: string) => void;
  onClose: () => void;
  onSubmitFeedback: () => void;
  submittingFeedback: boolean;
  submittingReplyId: string | null;
  replies: Record<string, AdminReply[]>;
  replyDrafts: Record<string, string>;
  setReplyDrafts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onReply: (id: string) => void;
  onDeleteFeedback: (id: string) => void;
  onDeleteReply: (feedbackId: string, replyId: string) => void;
  onRetakeAssignment: (assignmentId: string) => void;
  onPrintReport: () => void;
};

const ScoreTrendChart: React.FC<{ points: { date: string; score: number }[] }> = ({ points }) => {
  const width = 320;
  const height = 160;
  const padX = 14;
  const padY = 10;
  const step = points.length > 1 ? (width - padX * 2) / (points.length - 1) : 0;
  const coord = (index: number, score: number) => ({ x: padX + index * step, y: padY + (height - padY * 2) * (1 - Math.max(0, Math.min(100, score)) / 100) });
  const path = points.map((point, index) => { const { x, y } = coord(index, point.score); return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`; }).join(' ');
  const area = points.length > 1 ? `${path} L${(padX + (points.length - 1) * step).toFixed(1)} ${height - padY} L${padX} ${height - padY} Z` : '';
  const gradientId = `scoreGrad-${Math.random().toString(36).slice(2, 8)}`;
  return <div className="score-chart" aria-label="Grafik rata-rata nilai per hari"><svg viewBox={`0 0 ${width} ${height + 22}`} width="100%" height={height + 22} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
    <defs>
      <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
      </linearGradient>
    </defs>
    {[0, 50, 100].map(value => { const y = padY + (height - padY * 2) * (1 - value / 100); return <g key={value}><line x1={padX} x2={width - padX} y1={y} y2={y} stroke="var(--line)" strokeDasharray="2 3" /><text x={0} y={y + 3} fontSize={9} fill="var(--muted)">{value}</text></g>; })}
    {area && <path d={area} fill={`url(#${gradientId})`} />}
    <path d={path} fill="none" stroke="var(--accent)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 2px 6px color-mix(in srgb,var(--accent) 40%,transparent))' }} />
    {points.map((point, index) => { const { x, y } = coord(index, point.score); return <g key={point.date}><circle cx={x} cy={y} r={4} fill="var(--panel)" stroke="var(--accent)" strokeWidth={2.5}><title>{`${formatShortDate(point.date)}: ${point.score}%`}</title></circle><text x={x} y={height + 14} fontSize={9} fill="var(--muted)" textAnchor="middle">{formatShortDate(point.date)}</text></g>; })}
  </svg></div>;
};

const DetailPanelV2: React.FC<DetailPanelV2Props> = ({
  user, metric, detail, activities, scored, speaking, period, tab, setTab, feedback, setFeedback, feedbackScope,
  setFeedbackScope, taskId, setTaskId, onClose, onSubmitFeedback, submittingFeedback, submittingReplyId, replies, replyDrafts, setReplyDrafts, onReply,
  onDeleteFeedback, onDeleteReply, onRetakeAssignment, onPrintReport
}) => {
  const [chartMode, setChartMode] = useState<'average' | AppView>('average');
  const periodLabel = period === 'week' ? '7 hari terakhir' : period === 'month' ? '30 hari terakhir' : 'semua waktu';
  const chartActivities = chartMode === 'average' ? scored : scored.filter(item => item.type === chartMode);
  const dailyScores = Array.from(chartActivities.reduce((map, item) => {
    const key = item.date.slice(0, 10);
    const value = map.get(key) || { total: 0, count: 0 };
    value.total += item.score;
    value.count += 1;
    map.set(key, value);
    return map;
  }, new Map<string, { total: number; count: number }>()).entries())
    .sort(([a], [b]) => a.localeCompare(b)).slice(-10)
    .map(([date, value]) => ({ date, score: Math.round(value.total / value.count) }));
  const answers = activities.filter(item => Boolean(item.details)).slice(0, 8);
  const [assignmentLimit, setAssignmentLimit] = useState(PAGE_SIZE);
  const [feedbackLimit, setFeedbackLimit] = useState(PAGE_SIZE);
  useEffect(() => { setAssignmentLimit(PAGE_SIZE); setFeedbackLimit(PAGE_SIZE); }, [user.uid]);
  const allAssignments = detail?.assignments || [];
  const allFeedback = detail?.feedback || [];
  const lastSpeaking = [...speaking].sort((a, b) => b.date.localeCompare(a.date))[0];
  const tabs: { id: DetailTab; label: string }[] = [
    { id: 'progress', label: 'Perkembangan' }, { id: 'tasks', label: 'Task & Jawaban' }, { id: 'comments', label: 'Komentar' }
  ];

  return <div className="admin-panel-overlay" onMouseDown={onClose}>
    <aside className="admin-detail detail-readable" onMouseDown={event => event.stopPropagation()}>
      <div className="detail-head">
        <div><span className="admin-eyebrow">Detail user</span><h2><i className={`status-dot ${user.isOnline ? 'status-online' : 'status-offline'}`} />{user.name}</h2><p className="text-[12px] text-[var(--muted)] mt-1">{user.email || 'Email belum tersedia'} · {user.level || 'Level belum dipilih'} · aktif {formatLastSeen(user.lastSeenAt)}</p></div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="detail-close" onClick={onPrintReport} aria-label="Cetak rapor" title="Cetak rapor / simpan PDF"><i className="fas fa-print" /></button>
          <button className="detail-close" onClick={onClose} aria-label="Tutup detail"><i className="fas fa-xmark" /></button>
        </div>
      </div>
      {metric.attentionReason && <div className="detail-notice"><i className="fas fa-triangle-exclamation mt-[1px]" /><span><b>Perlu perhatian:</b> {metric.attentionReason}</span></div>}
      <div className="detail-summary">
        <div className="detail-stat"><b>{metric.average === null ? '—' : `${metric.average}%`}</b><span>NILAI</span></div>
        <div className="detail-stat"><b>{metric.completionRate}%</b><span>PROGRESS</span></div>
        <div className="detail-stat"><b>{formatDuration(metric.speakingSeconds)}</b><span>SPEAKING</span></div>
        <div className="detail-stat"><b className={`metric-trend ${metric.trend}`}>{trendIcon(metric.trend)}</b><span>{trendText(metric.trend).toUpperCase()}</span></div>
      </div>
      <div className="detail-tabs">{tabs.map(item => <button key={item.id} className={tab === item.id ? 'active' : ''} onClick={() => setTab(item.id)}>{item.label}</button>)}</div>

      {tab === 'progress' && <>
        <p className="detail-period">Data untuk {periodLabel}</p>
        <section className="detail-section"><h3>Performa per kategori</h3><p className="text-[10px] text-[var(--muted)] mb-3">Kategori yang belum dikerjakan tetap ditampilkan sebagai tanda strip.</p><div className="category-grid">{Object.entries(metric.categories).map(([type, value]) => <div className="category-item" key={type}><span>{CATEGORY_LABELS[type] || type}</span><b>{value === null ? '—' : `${value}%`}</b><small>{value === null ? 'Belum ada data' : 'Nilai rata-rata'}</small></div>)}<div className="category-item"><span>Speaking Live</span><b>{metric.liveSeconds ? formatDuration(metric.liveSeconds) : '—'}</b><small>{metric.liveSeconds ? `${activities.filter(item => item.type === AppView.LIVE).length} sesi · durasi latihan` : 'Belum ada data'}</small></div></div></section>
        <section className="detail-section"><div className="flex items-start justify-between gap-3"><div><h3>Perkembangan nilai harian</h3><p className="text-[10px] text-[var(--muted)] mb-1">Pilih kategori untuk melihat perkembangan yang lebih spesifik.</p></div><select className="chart-select" aria-label="Kategori grafik" value={chartMode} onChange={event => setChartMode(event.target.value as 'average' | AppView)}><option value="average">Semua nilai</option><option value={AppView.READING}>Reading</option><option value={AppView.LISTENING}>Listening</option><option value={AppView.GRAMMAR}>Grammar</option><option value={AppView.SHADOWING}>Shadowing</option></select></div>{dailyScores.length ? <ScoreTrendChart points={dailyScores} /> : <p className="text-[12px] text-[var(--muted)]">Belum ada nilai untuk kategori ini pada periode yang dipilih.</p>}</section>
        <section className="detail-section"><h3>Latihan berbicara</h3><div className="task-source"><div className="task-source-card"><b>{formatDuration(metric.liveSeconds)}</b><span>SPEAKING LIVE</span><small>{activities.filter(item => item.type === AppView.LIVE).length} sesi · durasi percakapan</small></div><div className="task-source-card"><b>{metric.categories[AppView.SHADOWING] === null ? '—' : `${metric.categories[AppView.SHADOWING]}%`}</b><span>SHADOWING</span><small>{activities.filter(item => item.type === AppView.SHADOWING).length} sesi · skor rata-rata</small></div></div><p className="text-[11px] text-[var(--muted)] mt-3 mb-0">Sesi terakhir: <b className="text-[var(--text)]">{lastSpeaking ? `${formatShortDate(lastSpeaking.date)} · ${activityName(lastSpeaking)} · ${formatDuration(lastSpeaking.durationSeconds)}` : 'Belum ada sesi pada periode ini'}</b></p></section>
      </>}

      {tab === 'tasks' && <>
        <p className="detail-period">Progress roadmap bersifat keseluruhan; Daily Plan adalah rencana aktif saat ini.</p>
        <section className="detail-section"><h3>Sumber progress</h3><div className="task-source"><div className="task-source-card"><b>{metric.dailyCompleted}/{metric.dailyTasks.length}</b><span>DAILY PLAN SELESAI</span><small>{metric.dailyTasks.length ? 'Rencana aktif saat ini' : 'Belum ada rencana aktif'}</small></div><div className="task-source-card"><b>{metric.roadmapCompleted} <em>dari {metric.roadmapTotal}</em></b><span>PACK ROADMAP · {user.level || 'LEVEL'}</span><small>{metric.roadmapTotal} pack tersedia pada level ini · pack selesai jika semua misinya selesai</small></div></div></section>
        <section className="detail-section"><h3>Daily Plan aktif</h3><div className="task-list">{metric.dailyTasks.map(task => <div className="task-line" key={task.id}><i className={`fas ${task.isCompleted ? 'fa-circle-check text-emerald-500' : 'fa-circle text-[var(--muted)]'}`} /><div className="flex-1"><b>{task.title}</b><small>{task.moduleView} · {task.isCompleted ? 'Selesai' : 'Belum selesai'}</small></div></div>)}{!metric.dailyTasks.length && <p className="text-[12px] text-[var(--muted)] py-2">Belum ada Daily Plan aktif.</p>}</div></section>
        <section className="detail-section"><h3>Tugas khusus admin</h3>{allAssignments.slice(0, assignmentLimit).map(item => <div className="task-line" key={item.id}><i className={`fas ${item.status === 'completed' ? 'fa-circle-check text-emerald-500' : item.status === 'needs_retake' ? 'fa-rotate text-amber-500' : 'fa-clipboard-check text-[var(--accent-strong)]'}`} /><div className="flex-1"><b>{item.title}</b><small>{item.target.packTitle || item.target.title || item.target.topic || item.target.theme || 'Tugas terarah'} · {item.status === 'completed' ? 'Target tercapai' : item.status === 'needs_retake' ? 'Perlu retake' : 'Belum tercapai'}</small></div>{item.status === 'completed' && <button className="delete-text" onClick={() => onRetakeAssignment(item.id)}>Beri retake</button>}</div>)}{allAssignments.length > assignmentLimit && <button className="load-more" onClick={() => setAssignmentLimit(current => current + PAGE_SIZE)}>Muat {Math.min(PAGE_SIZE, allAssignments.length - assignmentLimit)} tugas lagi ({allAssignments.length - assignmentLimit} tersisa)</button>}{!allAssignments.length && <p className="text-[12px] text-[var(--muted)]">Belum ada tugas khusus dari admin.</p>}</section>
        <section className="detail-section"><h3>Jawaban dan catatan terbaru</h3>{answers.map(item => <div className="task-line" key={item.id}><i className="fas fa-file-lines text-[var(--accent-strong)]" /><div className="flex-1"><b>{activityName(item)}</b><small>{formatShortDate(item.date)} · {isScored(item) ? `${item.score}%` : isSpeaking(item) ? formatDuration(item.durationSeconds) : 'Aktivitas'}</small><details className="answer-details"><summary>Lihat jawaban atau catatan</summary><p>{item.details}</p></details></div></div>)}{!answers.length && <p className="text-[12px] text-[var(--muted)]">Belum ada jawaban atau catatan yang tersimpan pada periode ini.</p>}</section>
      </>}

      {tab === 'comments' && <>
        <section className="detail-section"><h3>Kirim komentar</h3><div className="feedback-controls"><button className={feedbackScope === 'general' ? 'active' : ''} onClick={() => setFeedbackScope('general')}>Umum</button><button className={feedbackScope === 'task' ? 'active' : ''} onClick={() => setFeedbackScope('task')}>Tentang task</button></div>{feedbackScope === 'task' && <select className="feedback-select" value={taskId} onChange={event => setTaskId(event.target.value)}><option value="">Pilih task</option>{tasksForPlan(detail?.plan || null).map(task => <option key={task.id} value={task.id}>{task.title}</option>)}</select>}<textarea className="feedback-textarea" value={feedback} onChange={event => setFeedback(event.target.value)} placeholder="Tulis arahan atau apresiasi…" /><button className="feedback-send" disabled={submittingFeedback || !feedback.trim()} onClick={onSubmitFeedback}>{submittingFeedback ? 'Mengirim…' : 'Kirim komentar'}</button></section>
        <section className="detail-section"><h3>Riwayat komentar</h3>{allFeedback.slice(0, feedbackLimit).map(item => <div className="feedback-item" key={item.id}><div className="feedback-meta"><span>{item.scope === 'task' ? `Task · ${item.taskTitle || 'Tanpa judul'}` : 'Komentar umum'}</span><span>{formatShortDate(item.createdAt)}</span></div><p>{item.message}</p>{(replies[item.id] || []).map(reply => <div className="reply" key={reply.id}><b>{reply.authorName}</b> · {reply.message}<button className="delete-text ml-2" onClick={() => onDeleteReply(item.id, reply.id)}>Hapus</button></div>)}<div className="reply-form"><input className="reply-input" value={replyDrafts[item.id] || ''} onChange={event => setReplyDrafts(current => ({ ...current, [item.id]: event.target.value }))} placeholder="Balas…" /><button disabled={submittingReplyId === item.id || !(replyDrafts[item.id] || '').trim()} onClick={() => onReply(item.id)}>{submittingReplyId === item.id ? '…' : 'Kirim'}</button></div><button className="delete-text" onClick={() => onDeleteFeedback(item.id)}>Hapus komentar</button></div>)}{allFeedback.length > feedbackLimit && <button className="load-more" onClick={() => setFeedbackLimit(current => current + PAGE_SIZE)}>Muat {Math.min(PAGE_SIZE, allFeedback.length - feedbackLimit)} komentar lagi ({allFeedback.length - feedbackLimit} tersisa)</button>}{!allFeedback.length && <p className="text-[12px] text-[var(--muted)]">Belum ada komentar untuk user ini.</p>}</section>
      </>}
    </aside>
  </div>;
};

const EnhancedUserTable: React.FC<{
  metrics: UserMetric[]; query: string; setQuery: (value: string) => void; onSelect: (user: AdminUser) => void; onVisibleUsers?: (users: AdminUser[]) => void; reloadToken?: number;
  title: string; subtitle: string; showSearch: boolean; filter: UserFilter; setFilter: (value: UserFilter) => void;
  sort: UserSort; setSort: (value: UserSort) => void;
  bulkSelected?: string[]; setBulkSelected?: React.Dispatch<React.SetStateAction<string[]>>; onBulkComment?: () => void; onBulkAssign?: () => void;
}> = ({ metrics, query, setQuery, onSelect, onVisibleUsers, reloadToken, title, subtitle, showSearch, filter, setFilter, sort, setSort, bulkSelected, setBulkSelected, onBulkComment, onBulkAssign }) => {
  const bulkEnabled = Boolean(setBulkSelected);
  const selectedSet = new Set(bulkSelected || []);
  const toggle = (uid: string) => setBulkSelected?.(current => current.includes(uid) ? current.filter(id => id !== uid) : [...current, uid]);
  const filteredMetrics = metrics.filter(item => {
    if (!`${item.user.name} ${item.user.email}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (filter === 'attention') return Boolean(item.attentionReason);
    if (filter === 'online') return item.user.isOnline;
    if (filter === 'low-score') return item.average !== null && item.average < 60;
    if (filter === 'inactive') return !item.lastActivity || Date.now() - new Date(item.lastActivity).getTime() > 7 * DAY;
    if (filter === 'daily-incomplete') return item.dailyTasks.length > 0 && !item.dailyTasks.every(task => task.isCompleted);
    return true;
  }).sort((a, b) => sort === 'score-asc' ? (a.average ?? 101) - (b.average ?? 101) : sort === 'progress-desc' ? b.completionRate - a.completionRate : sort === 'progress-asc' ? a.completionRate - b.completionRate : sort === 'recent' ? (b.lastActivity || '').localeCompare(a.lastActivity || '') : (b.average ?? -1) - (a.average ?? -1) || b.completionRate - a.completionRate);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(filteredMetrics.length / pageSize));
  useEffect(() => setPage(1), [query, filter, sort]);
  const visible = filteredMetrics.slice((page - 1) * pageSize, page * pageSize);
  const visibleIds = visible.map(item => item.user.uid).join(',');
  useEffect(() => { if (onVisibleUsers && visible.length) onVisibleUsers(visible.map(item => item.user)); }, [visibleIds, reloadToken]);
  const visibleAllSelected = bulkEnabled && visible.length > 0 && visible.every(item => selectedSet.has(item.user.uid));
  const toggleAllVisible = () => setBulkSelected?.(current => visibleAllSelected ? current.filter(id => !visible.some(item => item.user.uid === id)) : Array.from(new Set([...current, ...visible.map(item => item.user.uid)])));
  const colSpan = bulkEnabled ? 8 : 7;
  return <section className="admin-card admin-table-card">
    <div className="admin-table-toolbar">
      <div><span className="admin-eyebrow">Monitoring · {filteredMetrics.length} user</span><h2 className="text-[16px] font-black mt-1 mb-0">{title}</h2><p className="text-[12px] text-[var(--muted)] mt-1 mb-0">{subtitle}</p></div>
      {showSearch && <div className="admin-table-controls"><input className="admin-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Cari nama atau email..." /><select className="admin-filter" aria-label="Filter user" value={filter} onChange={event => setFilter(event.target.value as UserFilter)}><option value="all">Semua user</option><option value="attention">Perlu perhatian</option><option value="online">Sedang online</option><option value="low-score">Nilai di bawah 60%</option><option value="inactive">Tidak aktif 7 hari</option><option value="daily-incomplete">Daily Plan belum selesai</option></select><select className="admin-filter" aria-label="Urutkan user" value={sort} onChange={event => setSort(event.target.value as UserSort)}><option value="score-desc">Nilai tertinggi</option><option value="score-asc">Nilai terendah</option><option value="progress-desc">Progress tertinggi</option><option value="progress-asc">Progress terendah</option><option value="recent">Aktivitas terbaru</option></select></div>}
    </div>
    {bulkEnabled && (bulkSelected?.length || 0) > 0 && <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--accent-soft)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <b style={{ fontSize: 12, color: 'var(--accent-strong)' }}>{bulkSelected!.length} user terpilih</b>
      <button className="feedback-send" style={{ margin: 0, padding: '7px 12px', fontSize: 11 }} onClick={onBulkComment}><i className="fas fa-comment mr-1" />Kirim komentar</button>
      <button className="feedback-send" style={{ margin: 0, padding: '7px 12px', fontSize: 11 }} onClick={onBulkAssign}><i className="fas fa-clipboard-check mr-1" />Beri tugas</button>
      <button onClick={() => setBulkSelected?.([])} style={{ marginLeft: 'auto', background: 'transparent', border: 0, color: 'var(--muted)', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>Batal pilih</button>
    </div>}
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr>
      {bulkEnabled && <th style={{ width: 36 }}><input type="checkbox" checked={visibleAllSelected} onChange={toggleAllVisible} aria-label="Pilih semua di halaman ini" /></th>}
      <th>User</th><th>Nilai</th><th>Progress</th><th>Speaking</th><th>Tren</th><th>Fokus</th><th>Aktivitas</th>
    </tr></thead><tbody>{visible.map(item => <tr key={item.user.uid} onClick={event => { if ((event.target as HTMLElement).tagName === 'INPUT') return; onSelect(item.user); }}>
      {bulkEnabled && <td onClick={event => event.stopPropagation()}><input type="checkbox" checked={selectedSet.has(item.user.uid)} onChange={() => toggle(item.user.uid)} aria-label={`Pilih ${item.user.name}`} /></td>}
      <td><div className="user-cell"><AvatarBubble name={item.user.name} size={32} /><div><b><i className={`status-dot ${item.user.isOnline ? 'status-online' : 'status-offline'}`} title={item.user.isOnline ? 'Online' : 'Offline'} />{item.user.name}</b><span>{item.user.email || 'Email belum tersedia'}</span></div></div></td><td className="font-black">{item.average === null ? 'Belum ada' : `${item.average}%`}</td><td>{item.completed}/{item.totalTasks} <span className="text-[var(--muted)]">({item.completionRate}%)</span></td><td className="font-bold">{formatDuration(item.speakingSeconds)}</td><td><span className={`metric-trend ${item.trend}`}>{trendIcon(item.trend)} {trendText(item.trend)}</span></td><td><span className={item.attentionReason ? 'admin-pill text-[#b34b30]' : 'admin-pill'}>{item.attentionReason || 'On track'}</span></td><td className="text-[var(--muted)]">{formatShortDate(item.lastActivity)}</td>
    </tr>)}{!visible.length && <tr><td colSpan={colSpan} className="text-center text-[var(--muted)] py-10">Tidak ada user yang sesuai.</td></tr>}</tbody></table></div>
    {pageCount > 1 && <div className="admin-pagination"><button type="button" disabled={page === 1} onClick={() => setPage(current => current - 1)}>Sebelumnya</button><span>Halaman {page} dari {pageCount}</span><button type="button" disabled={page === pageCount} onClick={() => setPage(current => current + 1)}>Berikutnya</button></div>}
  </section>;
};

export default AdminPortal;
