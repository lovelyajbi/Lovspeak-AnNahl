import React, { useEffect, useMemo, useState } from 'react';
import { User } from 'firebase/auth';
import { ActivityLog, AdminFeedback, AdminReply, AppView, DailyTask } from '../../types';
import { MASTER_CURRICULUM } from '../../data/curriculum';
import {
  AdminAccessRecord, AdminUser, AdminUserDetail, deleteFeedback, deleteReply, getAdminAccess, getAdminUserDetail,
  getAdminUsers, getReplies, grantAdminAccess, revokeAdminAccess, sendFeedback, sendReply, tasksForPlan
} from '../../services/admin';

type Period = 'week' | 'month' | 'all';
type Section = 'overview' | 'users' | 'attention' | 'comments' | 'access';
type ThemeMode = 'light' | 'dark';
type Accent = 'lovelya' | 'violet' | 'blue' | 'emerald';
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
const SCORABLE = new Set<AppView>([AppView.READING, AppView.LISTENING, AppView.GRAMMAR, AppView.VOCAB, AppView.TRANSLATE, AppView.ASSESSMENT, AppView.GAMES, AppView.SHADOWING]);
const CATEGORY_LABELS: Record<string, string> = {
  [AppView.READING]: 'Reading', [AppView.LISTENING]: 'Listening', [AppView.GRAMMAR]: 'Grammar', [AppView.SHADOWING]: 'Shadowing',
  [AppView.VOCAB]: 'Vocabulary', [AppView.TRANSLATE]: 'Translation', [AppView.ASSESSMENT]: 'Assessment'
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

const metricForUser = (user: AdminUser, detail: AdminUserDetail | undefined, period: Period): UserMetric => {
  const allActivities = detail?.activities || [];
  const activities = allActivities.filter(item => withinPeriod(item.date, period));
  const scored = activities.filter(isScored);
  const dailyTasks = detail?.plan?.dailyTasks || [];
  const roadmapSteps = MASTER_CURRICULUM.find(item => item.level === user.level)?.units.flatMap(unit => unit.steps) || [];
  const roadmapCompleted = roadmapSteps.filter(step => detail?.roadmapUnits.includes(step.id)).length;
  const roadmapTotal = roadmapSteps.length;
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

const AdminPortal: React.FC<{ user: User; isAdmin: boolean; onLogout: () => Promise<void> }> = ({ user, isAdmin, onLogout }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [details, setDetails] = useState<Record<string, AdminUserDetail>>({});
  const [adminAccess, setAdminAccess] = useState<AdminAccessRecord[]>([]);
  const [period, setPeriod] = useState<Period>('month');
  const [section, setSection] = useState<Section>('overview');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState<ThemeMode>(() => (localStorage.getItem('lovspeak_admin_theme') as ThemeMode) || 'light');
  const [accent, setAccent] = useState<Accent>(() => (localStorage.getItem('lovspeak_admin_accent') as Accent) || 'lovelya');
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

  const refresh = async () => {
    setLoading(true);
    setMessage('');
    try {
      const [list, accessList] = await Promise.all([getAdminUsers(), getAdminAccess()]);
      setUsers(list);
      setAdminAccess(accessList);
      setLastUpdated(new Date());
      const entries = await Promise.all(list.map(async item => [item.uid, await getAdminUserDetail(item)] as const));
      setDetails(Object.fromEntries(entries));
    } catch (error) {
      console.error(error);
      setMessage('Data belum dapat dimuat. Periksa koneksi dan aturan Firebase, lalu coba muat ulang.');
    } finally { setLoading(false); }
  };

  useEffect(() => { if (isAdmin) void refresh(); }, [isAdmin]);
  useEffect(() => {
    if (!selected) return;
    const feedbackItems = details[selected.uid]?.feedback || [];
    void Promise.all(feedbackItems.map(async item => [item.id, await getReplies(item.id)] as const))
      .then(items => setReplies(Object.fromEntries(items))).catch(console.error);
  }, [selected, details]);

  const metrics = useMemo(() => users.map(item => metricForUser(item, details[item.uid], period)), [users, details, period]);
  const filtered = useMemo(() => metrics.filter(item => `${item.user.name} ${item.user.email}`.toLowerCase().includes(query.toLowerCase())), [metrics, query]);
  const ordered = useMemo(() => [...filtered].sort((a, b) => ((b.average ?? -1) - (a.average ?? -1)) || b.completionRate - a.completionRate), [filtered]);
  const attention = useMemo(() => metrics.filter(item => item.attentionReason).sort((a, b) => Number(b.trend === 'down') - Number(a.trend === 'down') || (a.average ?? 101) - (b.average ?? 101)), [metrics]);
  const activeCount = users.filter(item => item.isOnline).length;
  const validScores = metrics.map(item => item.average).filter((value): value is number => value !== null).sort((a, b) => a - b);
  const median = validScores.length ? validScores[Math.floor(validScores.length / 2)] : null;
  const dailyPlanUsers = metrics.filter(item => item.dailyTasks.length > 0);
  const dailyPlanFinished = dailyPlanUsers.filter(item => item.dailyTasks.every(task => task.isCompleted)).length;
  const periodLabel = period === 'week' ? '7 hari terakhir' : period === 'month' ? '30 hari terakhir' : 'semua waktu';
  const selectedMetric = selected ? metrics.find(item => item.user.uid === selected.uid) : undefined;
  const selectedDetail = selected ? details[selected.uid] : undefined;
  const selectedActivities = selectedMetric?.activities || [];
  const selectedScored = selectedActivities.filter(isScored);
  const selectedSpeaking = selectedActivities.filter(isSpeaking);

  const saveTheme = (next: ThemeMode) => { setTheme(next); localStorage.setItem('lovspeak_admin_theme', next); };
  const saveAccent = (next: Accent) => { setAccent(next); localStorage.setItem('lovspeak_admin_accent', next); };
  const openUser = (target: AdminUser, tab: DetailTab = 'progress') => { setSelected(target); setDetailTab(tab); setFeedback(''); setTaskId(''); };
  const submitFeedback = async () => {
    if (!selected || !feedback.trim()) return;
    const task = tasksForPlan(selectedDetail?.plan || null).find(item => item.id === taskId);
    try {
      await sendFeedback({ recipientId: selected.uid, authorId: user.uid, authorName: user.displayName || user.email || 'Admin', message: feedback.trim(), scope: feedbackScope, ...(feedbackScope === 'task' ? { taskId: task?.id, taskTitle: task?.title } : {}) });
      setFeedback(''); setTaskId(''); setMessage('Komentar terkirim. User akan melihat notifikasi di aplikasi LovSpeak.');
      await refresh();
    } catch { setMessage('Komentar belum terkirim. Silakan coba lagi.'); }
  };
  const submitReply = async (feedbackId: string) => {
    const text = replyDrafts[feedbackId]?.trim();
    if (!text) return;
    try {
      await sendReply(feedbackId, { authorId: user.uid, authorName: user.displayName || user.email || 'Admin', message: text });
      setReplyDrafts(current => ({ ...current, [feedbackId]: '' }));
      setReplies(current => ({ ...current, [feedbackId]: [...(current[feedbackId] || []), { id: `${Date.now()}`, authorId: user.uid, authorName: user.displayName || user.email || 'Admin', message: text, createdAt: new Date().toISOString() }] }));
    } catch { setMessage('Balasan belum terkirim. Silakan coba lagi.'); }
  };
  const removeFeedback = async (feedbackId: string) => {
    if (!window.confirm('Hapus komentar ini beserta balasannya?')) return;
    await deleteFeedback(feedbackId);
    if (selected) setDetails(current => ({ ...current, [selected.uid]: { ...current[selected.uid], feedback: current[selected.uid].feedback.filter(item => item.id !== feedbackId) } }));
  };
  const removeReply = async (feedbackId: string, replyId: string) => {
    if (!window.confirm('Hapus balasan ini?')) return;
    await deleteReply(feedbackId, replyId);
    setReplies(current => ({ ...current, [feedbackId]: (current[feedbackId] || []).filter(item => item.id !== replyId) }));
  };

  if (!isAdmin) return <div className="min-h-screen grid place-items-center p-6 bg-slate-50 text-slate-900"><div className="max-w-sm text-center"><div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 grid place-items-center mx-auto"><i className="fas fa-lock" /></div><h1 className="text-xl font-black mt-5">Akses admin tidak tersedia</h1><p className="text-sm text-slate-500 mt-2">Akun ini belum memiliki hak akses admin LovSpeak.</p><button onClick={onLogout} className="mt-5 px-4 py-3 rounded-xl bg-slate-900 text-white font-bold">Keluar</button></div></div>;

  const navItems: { id: Section; icon: string; label: string; count?: number }[] = [
    { id: 'overview', icon: 'fa-grid-2', label: 'Overview' }, { id: 'users', icon: 'fa-users', label: 'Semua User', count: users.length },
    { id: 'attention', icon: 'fa-triangle-exclamation', label: 'Perlu Perhatian', count: attention.length }, { id: 'comments', icon: 'fa-message', label: 'Komentar' }
    , { id: 'access', icon: 'fa-shield-halved', label: 'Akses Admin', count: adminAccess.length + 1 }
  ];

  return <div className={`admin-root admin-${theme} admin-accent-${accent}`}>
    <style>{`
      .admin-root{--accent:#e9458b;--accent-soft:#fff0f6;--accent-strong:#c7286c;--page:#f7f8fb;--panel:#fff;--subtle:#f4f6fa;--text:#172033;--muted:#65718a;--line:#e7eaf0;--shadow:0 10px 28px rgba(22,32,51,.06);min-height:100vh;background:var(--page);color:var(--text);font-family:inherit}.admin-dark{--page:#10131b;--panel:#181d28;--subtle:#212735;--text:#f4f6fb;--muted:#aab3c5;--line:#2b3343;--shadow:0 12px 30px rgba(0,0,0,.22)}.admin-accent-violet{--accent:#7c5ce5;--accent-soft:#f1efff;--accent-strong:#6241ca}.admin-accent-blue{--accent:#2d7ff9;--accent-soft:#edf5ff;--accent-strong:#1762d2}.admin-accent-emerald{--accent:#14a88b;--accent-soft:#eafaf6;--accent-strong:#08856d}.admin-dark.admin-accent-lovelya{--accent-soft:#3a1d2c}.admin-dark.admin-accent-violet{--accent-soft:#27203f}.admin-dark.admin-accent-blue{--accent-soft:#172c48}.admin-dark.admin-accent-emerald{--accent-soft:#12372f}.admin-layout{max-width:1440px;margin:auto;min-height:100vh;display:grid;grid-template-columns:232px minmax(0,1fr)}.admin-side{padding:24px 16px;border-right:1px solid var(--line);display:flex;flex-direction:column;gap:24px}.admin-brand{display:flex;gap:10px;align-items:center;padding:4px 8px}.admin-brand-mark{width:35px;height:35px;border-radius:12px;background:linear-gradient(135deg,var(--accent),#9d6bff);color:white;display:grid;place-items:center;box-shadow:0 8px 18px color-mix(in srgb,var(--accent) 28%,transparent)}.admin-brand b{font-size:15px}.admin-brand span{display:block;color:var(--muted);font-size:10px;margin-top:2px}.admin-nav{display:grid;gap:5px}.admin-nav button{width:100%;border:0;background:transparent;color:var(--muted);text-align:left;padding:11px 12px;border-radius:12px;font-weight:700;font-size:13px;display:flex;align-items:center;gap:11px;cursor:pointer}.admin-nav button:hover{background:var(--subtle);color:var(--text)}.admin-nav button.active{background:var(--accent-soft);color:var(--accent-strong)}.admin-nav .count{margin-left:auto;background:color-mix(in srgb,var(--accent) 12%,transparent);font-size:10px;padding:2px 7px;border-radius:100px}.admin-side-bottom{margin-top:auto}.admin-return{border:1px solid var(--line);background:var(--panel);color:var(--text);width:100%;padding:11px;border-radius:12px;font:inherit;font-size:12px;font-weight:700;cursor:pointer}.admin-main{min-width:0;padding:26px 32px 40px}.admin-top{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:27px}.admin-eyebrow{font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:var(--accent-strong);font-weight:800}.admin-top h1{font-size:27px;line-height:1.1;margin:5px 0 0;font-weight:900;letter-spacing:-.035em}.admin-top p{margin:6px 0 0;font-size:13px;color:var(--muted)}.admin-tools{display:flex;align-items:center;gap:8px}.admin-icon-button,.admin-tools select{height:38px;border:1px solid var(--line);background:var(--panel);color:var(--text);border-radius:10px;padding:0 11px;font:inherit;font-size:12px;cursor:pointer}.admin-icon-button{width:38px;padding:0}.admin-card{background:var(--panel);border:1px solid var(--line);border-radius:18px;box-shadow:var(--shadow)}.admin-alert{padding:12px 15px;background:#fff7e6;color:#946200;border:1px solid #f6dfab;border-radius:12px;font-size:13px;margin-bottom:16px}.admin-dark .admin-alert{background:#3c3019;color:#f6d17a;border-color:#5c4a26}.admin-kpis{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:18px}.admin-kpi{padding:17px}.admin-kpi-icon{height:30px;width:30px;border-radius:10px;background:var(--accent-soft);color:var(--accent-strong);display:grid;place-items:center;font-size:12px}.admin-kpi .value{font-size:23px;line-height:1;margin-top:17px;font-weight:900;letter-spacing:-.04em}.admin-kpi .label{font-size:11px;color:var(--muted);font-weight:700;margin-top:7px}.admin-overview-grid{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(290px,.8fr);gap:18px}.admin-card-head{padding:20px 20px 0;display:flex;justify-content:space-between;gap:12px}.admin-card-head h2{font-size:16px;margin:5px 0 0;letter-spacing:-.02em}.admin-card-head p{font-size:12px;color:var(--muted);margin:5px 0 0}.admin-period{display:flex;gap:4px;padding:3px;border:1px solid var(--line);background:var(--subtle);border-radius:10px;height:max-content}.admin-period button{padding:6px 8px;border:0;background:transparent;border-radius:7px;color:var(--muted);font-size:11px;font-weight:700;cursor:pointer}.admin-period button.active{color:white;background:var(--accent)}.performance-map{height:350px;position:relative;margin:23px 20px 20px;border-left:1px solid var(--line);border-bottom:1px solid var(--line);background-image:linear-gradient(to right,var(--line) 1px,transparent 1px),linear-gradient(to bottom,var(--line) 1px,transparent 1px);background-size:25% 25%;border-radius:0 0 0 13px}.map-axis-y{position:absolute;left:-30px;top:45%;transform:rotate(-90deg);font-size:10px;color:var(--muted);white-space:nowrap}.map-axis-x{position:absolute;right:0;bottom:-25px;font-size:10px;color:var(--muted)}.map-zone{position:absolute;font-size:10px;color:var(--muted);opacity:.85}.map-dot{position:absolute;width:11px;height:11px;border:2px solid var(--panel);border-radius:50%;transform:translate(-50%,50%);cursor:pointer;box-shadow:0 2px 5px rgba(0,0,0,.15);padding:0}.map-dot:hover,.map-dot.selected{outline:3px solid color-mix(in srgb,var(--accent) 28%,transparent);z-index:3;transform:translate(-50%,50%) scale(1.25)}.map-dot.up{background:#22a986}.map-dot.steady{background:#4385ee}.map-dot.down{background:#e66262}.map-dot.none{background:#a4adbd}.map-legend{display:flex;flex-wrap:wrap;gap:11px;padding:0 20px 19px;font-size:11px;color:var(--muted)}.map-legend span{display:flex;align-items:center;gap:5px}.map-legend i{height:8px;width:8px;border-radius:50%;display:inline-block}.attention-list{padding:10px 14px 15px}.attention-row{width:100%;display:flex;align-items:center;gap:10px;border:0;border-bottom:1px solid var(--line);background:transparent;color:var(--text);padding:13px 6px;text-align:left;cursor:pointer}.attention-row:last-child{border-bottom:0}.attention-avatar,.user-avatar{display:grid;place-items:center;border-radius:50%;font-weight:900;background:var(--accent-soft);color:var(--accent-strong);flex:0 0 auto}.attention-avatar{width:31px;height:31px;font-size:11px}.attention-row b{font-size:12px;display:block}.attention-row small{font-size:10px;color:var(--muted);display:block;margin-top:3px}.attention-score{margin-left:auto;font-size:12px;font-weight:900}.admin-empty{padding:34px 20px;color:var(--muted);font-size:13px;text-align:center}.admin-table-card{margin-top:18px}.admin-table-toolbar{padding:18px 20px;display:flex;align-items:center;gap:10px;justify-content:space-between}.admin-search{height:38px;max-width:315px;width:100%;border:1px solid var(--line);color:var(--text);background:var(--subtle);padding:0 12px;border-radius:10px;outline:none;font:inherit;font-size:12px}.admin-table-wrap{overflow:auto}.admin-table{width:100%;border-collapse:collapse;font-size:12px;min-width:760px}.admin-table th{font-weight:800;text-align:left;color:var(--muted);font-size:10px;letter-spacing:.06em;text-transform:uppercase;padding:11px 20px;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.admin-table td{padding:13px 20px;border-bottom:1px solid var(--line)}.admin-table tbody tr{cursor:pointer}.admin-table tbody tr:hover{background:var(--subtle)}.user-cell{display:flex;align-items:center;gap:10px}.user-avatar{width:32px;height:32px;font-size:11px}.user-cell b{display:block}.user-cell span{font-size:10px;color:var(--muted);display:block;margin-top:3px}.status-dot{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:5px}.status-online{background:#22a986}.status-offline{background:#a4adbd}.metric-trend{font-weight:800}.metric-trend.up{color:#149978}.metric-trend.down{color:#d94d54}.metric-trend.steady{color:#4385ee}.metric-trend.none{color:var(--muted)}.admin-pill{font-size:10px;font-weight:800;padding:5px 8px;border-radius:99px;background:var(--subtle);color:var(--muted)}.admin-panel-overlay{position:fixed;inset:0;background:rgba(13,18,29,.32);z-index:50}.admin-detail{position:absolute;right:0;top:0;height:100%;width:min(560px,100%);background:var(--panel);border-left:1px solid var(--line);overflow-y:auto;padding:26px}.detail-head{display:flex;justify-content:space-between;gap:16px}.detail-head h2{font-size:23px;margin:6px 0 0;letter-spacing:-.04em}.detail-close{border:0;background:var(--subtle);color:var(--muted);height:34px;width:34px;border-radius:10px;cursor:pointer}.detail-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:20px 0}.detail-stat{background:var(--subtle);padding:11px;border-radius:12px}.detail-stat b{font-size:15px;display:block}.detail-stat span{font-size:9px;color:var(--muted);font-weight:700;display:block;margin-top:5px}.detail-section{border-top:1px solid var(--line);padding:19px 0}.detail-section h3{font-size:13px;margin:0 0 12px}.category-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.category-item{padding:10px;border-radius:11px;background:var(--subtle)}.category-item span{display:block;font-size:10px;color:var(--muted)}.category-item b{display:block;font-size:16px;margin-top:5px}.mini-bars{height:130px;display:flex;align-items:end;gap:6px;border-bottom:1px solid var(--line);padding:0 2px}.mini-bar{flex:1;min-width:7px;display:flex;align-items:end;height:100%;background:transparent;border:0;padding:0;cursor:default}.mini-bar i{width:100%;background:var(--accent);border-radius:6px 6px 2px 2px;display:block}.mini-labels{display:flex;gap:6px;margin-top:5px}.mini-labels span{flex:1;min-width:7px;font-size:8px;color:var(--muted);white-space:nowrap;overflow:hidden}.feedback-controls{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px}.feedback-controls button,.feedback-send{border:0;background:var(--subtle);color:var(--muted);border-radius:9px;padding:8px 10px;font:inherit;font-size:11px;font-weight:800;cursor:pointer}.feedback-controls button.active,.feedback-send{background:var(--accent);color:white}.feedback-textarea,.reply-input,.feedback-select{width:100%;box-sizing:border-box;border:1px solid var(--line);background:var(--subtle);color:var(--text);border-radius:11px;padding:10px;font:inherit;font-size:12px;outline:none}.feedback-textarea{min-height:84px;resize:vertical}.feedback-select{margin-bottom:8px}.feedback-send{margin-top:8px;padding:10px 13px}.feedback-item{padding:13px 0;border-bottom:1px solid var(--line)}.feedback-item:last-child{border-bottom:0}.feedback-meta{display:flex;justify-content:space-between;gap:8px;color:var(--muted);font-size:10px}.feedback-item p{font-size:12px;line-height:1.55;margin:8px 0}.reply{margin:7px 0 0 12px;padding:8px 10px;background:var(--subtle);border-radius:9px;font-size:11px}.reply-form{display:flex;gap:6px;margin-top:9px}.reply-form button,.delete-text{border:0;background:transparent;color:var(--accent-strong);font:inherit;font-size:10px;font-weight:800;cursor:pointer}.delete-text{color:#d94d54;margin-top:7px}.admin-mobile-bar{display:none}@media(max-width:960px){.admin-layout{grid-template-columns:1fr}.admin-side{display:none}.admin-main{padding:20px}.admin-mobile-bar{display:flex;overflow:auto;gap:7px;padding-bottom:15px}.admin-mobile-bar button{flex:0 0 auto;border:1px solid var(--line);background:var(--panel);color:var(--muted);border-radius:10px;padding:8px 10px;font:inherit;font-size:11px;font-weight:800}.admin-mobile-bar button.active{color:var(--accent-strong);background:var(--accent-soft);border-color:transparent}.admin-overview-grid{grid-template-columns:1fr}.admin-kpis{grid-template-columns:repeat(3,1fr)}}@media(max-width:620px){.admin-main{padding:16px}.admin-top{align-items:flex-start;flex-direction:column;margin-bottom:18px}.admin-tools{width:100%;justify-content:flex-end}.admin-kpis{grid-template-columns:repeat(2,1fr);gap:9px}.admin-kpi:last-child{grid-column:span 2}.admin-kpi{padding:14px}.admin-kpi .value{font-size:20px;margin-top:13px}.performance-map{height:265px;margin:19px 16px 18px}.admin-card-head{padding:16px 16px 0}.admin-period button{padding:6px}.admin-table-toolbar{padding:15px 16px;align-items:stretch;flex-direction:column}.admin-search{max-width:none}.admin-detail{padding:20px}.detail-summary{grid-template-columns:repeat(2,1fr)}.category-grid{grid-template-columns:repeat(2,1fr)}}
    `}</style><style>{`.detail-notice{display:flex;gap:8px;align-items:flex-start;background:#fff6e5;color:#8a5a00;padding:10px 11px;border-radius:11px;font-size:11px;margin:0 0 16px}.admin-dark .detail-notice{background:#3b301d;color:#f1cf81}.detail-tabs{display:flex;gap:4px;border-bottom:1px solid var(--line);margin:0 -26px;padding:0 26px}.detail-tabs button{border:0;background:transparent;color:var(--muted);padding:11px 4px;margin-right:14px;font:inherit;font-size:11px;font-weight:800;border-bottom:2px solid transparent;cursor:pointer}.detail-tabs button.active{color:var(--accent-strong);border-color:var(--accent)}.detail-period{font-size:10px;color:var(--muted);margin:12px 0 -4px}.task-source{display:grid;grid-template-columns:1fr 1fr;gap:10px}.task-source-card{background:var(--subtle);border-radius:12px;padding:12px}.task-source-card b{font-size:17px;display:block}.task-source-card span{font-size:10px;color:var(--muted);display:block;margin-top:4px}.task-list{margin-top:12px;border-top:1px solid var(--line)}.task-line{display:flex;align-items:center;gap:8px;padding:9px 0;border-bottom:1px solid var(--line);font-size:11px}.task-line i{font-size:12px}.task-line small{display:block;color:var(--muted);margin-top:2px}.answer-details{margin-top:5px}.answer-details summary{font-size:10px;color:var(--accent-strong);font-weight:800;cursor:pointer}.answer-details p{margin:6px 0 0;font-size:11px;line-height:1.45;color:var(--muted);white-space:pre-wrap}.access-row{display:flex;align-items:center;gap:10px;padding:14px 6px;border-bottom:1px solid var(--line)}.access-row:last-child{border-bottom:0}.access-row b{font-size:12px;display:block}.access-row small{font-size:10px;color:var(--muted);display:block;margin-top:3px}.admin-access-form{margin:18px 20px 4px;display:flex;align-items:center;gap:8px}.admin-access-form .feedback-select{margin:0;max-width:410px}.admin-access-form .feedback-send{margin:0;white-space:nowrap}@media(max-width:620px){.detail-tabs{margin:0 -20px;padding:0 20px}.admin-access-form{margin:16px;align-items:stretch;flex-direction:column}.admin-access-form .feedback-select{max-width:none}.task-source{grid-template-columns:1fr}}`}</style>
    <style>{`.task-source-card b em{font-style:normal;font-size:12px;font-weight:700;color:var(--muted)}.task-source-card small{display:block;color:var(--muted);font-size:10px;margin-top:6px}.score-chart{height:190px;display:flex;gap:8px;margin-top:14px}.score-y-axis{height:160px;display:flex;flex-direction:column;justify-content:space-between;color:var(--muted);font-size:9px;padding-bottom:20px}.score-plot{position:relative;display:flex;align-items:end;justify-content:space-around;gap:10px;flex:1;height:160px;border-left:1px solid var(--line);border-bottom:1px solid var(--line);background:repeating-linear-gradient(to bottom,transparent 0,transparent 39px,var(--line) 40px)}.score-column{height:100%;width:30px;display:flex;flex-direction:column;justify-content:end;align-items:center;gap:5px}.score-value{font-size:10px;font-weight:900;color:var(--accent-strong)}.score-bar{width:26px;min-height:5px;background:var(--accent);border-radius:6px 6px 2px 2px}.score-label{font-size:9px;color:var(--muted);white-space:nowrap;transform:translateY(20px)}@media(max-width:620px){.score-chart{height:175px}.score-plot,.score-y-axis{height:145px}}`}</style>
    <style>{`.detail-readable h3{font-size:15px}.detail-readable .task-line{font-size:14px;padding:13px 0}.detail-readable .task-line small{font-size:12px}.detail-readable .answer-details summary{font-size:12px}.detail-readable .answer-details p{font-size:13px}.detail-readable .feedback-textarea,.detail-readable .reply-input{font-size:14px}.detail-readable .feedback-controls button,.detail-readable .feedback-send{font-size:13px;padding:10px 12px}.chart-select{border:1px solid var(--line);background:var(--subtle);color:var(--text);border-radius:9px;padding:7px 9px;font:inherit;font-size:11px;font-weight:700;max-width:130px}`}</style>
    <div className="admin-layout">
      <aside className="admin-side"><div className="admin-brand"><div className="admin-brand-mark"><i className="fas fa-heart" /></div><div><b>LOVSPEAK</b><span>ADMIN CONSOLE</span></div></div><nav className="admin-nav">{navItems.map(item => <button key={item.id} onClick={() => setSection(item.id)} className={section === item.id ? 'active' : ''}><i className={`fas ${item.icon}`} />{item.label}{item.count !== undefined && <span className="count">{item.count}</span>}</button>)}</nav><div className="admin-side-bottom"><button className="admin-return" onClick={() => window.location.assign('/')}><i className="fas fa-arrow-left mr-2" />Kembali ke LovSpeak</button></div></aside>
      <main className="admin-main">
        <div className="admin-mobile-bar">{navItems.map(item => <button key={item.id} onClick={() => setSection(item.id)} className={section === item.id ? 'active' : ''}>{item.label}{item.count !== undefined ? ` · ${item.count}` : ''}</button>)}</div>
        <header className="admin-top"><div><span className="admin-eyebrow">LovSpeak LMS</span><h1>{section === 'overview' ? 'Overview kelas' : section === 'users' ? 'Semua user' : section === 'attention' ? 'Perlu perhatian' : section === 'comments' ? 'Komentar user' : 'Akses admin'}</h1><p>{section === 'overview' ? 'Pantau kondisi kelas dan temukan user yang perlu dibantu.' : section === 'access' ? 'Kelola hak akses tanpa mencampurkannya dengan monitoring user.' : 'Data diperbarui dari aktivitas LovSpeak.'}</p></div><div className="admin-tools"><button className="admin-icon-button" onClick={refresh} title="Muat ulang data"><i className={`fas fa-rotate-right ${loading ? 'fa-spin' : ''}`} /></button><button className="admin-icon-button" onClick={() => saveTheme(theme === 'light' ? 'dark' : 'light')} title="Ganti mode"><i className={`fas fa-${theme === 'light' ? 'moon' : 'sun'}`} /></button><select aria-label="Warna aksen" value={accent} onChange={event => saveAccent(event.target.value as Accent)}><option value="lovelya">Aksen LovSpeak</option><option value="violet">Ungu</option><option value="blue">Biru</option><option value="emerald">Hijau</option></select><button className="admin-icon-button" onClick={onLogout} title="Keluar"><i className="fas fa-arrow-right-from-bracket" /></button></div></header>
        {message && <div className="admin-alert">{message}</div>}
        {loading && !users.length ? <div className="admin-card admin-empty"><i className="fas fa-circle-notch fa-spin mr-2" />Memuat data user...</div> : <>
          {section === 'overview' && <>
            <div className="admin-kpis">{[
              ['fa-users', String(users.length), 'Total user', `Semua akun LovSpeak${lastUpdated ? ` · ${lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}` : ''}`],
              ['fa-circle', String(activeCount), 'Sedang online', 'Status saat ini'],
              ['fa-chart-line', median === null ? '—' : `${median}%`, 'Median nilai', `User bernilai · ${periodLabel}`],
              ['fa-check', `${dailyPlanFinished} dari ${dailyPlanUsers.length}`, 'Daily Plan selesai hari ini', 'User dengan seluruh task selesai'],
              ['fa-triangle-exclamation', String(attention.length), 'Perlu perhatian', 'Nilai rendah atau tidak aktif']
            ].map(([icon, value, label, hint]) => <button type="button" className="admin-card admin-kpi" key={label} onClick={() => { if (label === 'Perlu perhatian') setSection('attention'); else if (label === 'Daily Plan selesai hari ini') { setSection('users'); setUserFilter('daily-incomplete'); } }} style={{ textAlign: 'left', width: '100%' }}><div className="admin-kpi-icon"><i className={`fas ${icon}`} /></div><div className="value">{value}</div><div className="label">{label}</div><div className="hint" style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4, lineHeight: 1.35 }}>{hint}</div></button>)}</div>
            <div className="admin-overview-grid"><section className="admin-card"><div className="admin-card-head"><div><span className="admin-eyebrow">Grafik utama</span><h2>Peta performa user</h2><p>Posisi menunjukkan nilai dan penyelesaian Daily Plan. Warna menunjukkan tren nilai.</p></div><div className="admin-period">{(['week', 'month', 'all'] as Period[]).map(item => <button key={item} className={period === item ? 'active' : ''} onClick={() => setPeriod(item)}>{item === 'week' ? '7 hari' : item === 'month' ? '30 hari' : 'Semua'}</button>)}</div></div><PerformanceMap metrics={metrics} selectedId={selected?.uid} onSelect={openUser} /><div className="map-legend"><span><i style={{ background: '#22a986' }} />Meningkat</span><span><i style={{ background: '#4385ee' }} />Stabil</span><span><i style={{ background: '#e66262' }} />Menurun</span><span><i style={{ background: '#a4adbd' }} />Belum cukup data</span></div></section>
              <section className="admin-card"><div className="admin-card-head"><div><span className="admin-eyebrow">Tindakan cepat</span><h2>Perlu perhatian</h2><p>User yang sebaiknya diperiksa terlebih dahulu.</p></div><span className="admin-pill">{attention.length} user</span></div><div className="attention-list">{attention.slice(0, 7).map(item => <AttentionRow key={item.user.uid} item={item} onClick={() => openUser(item.user)} />)}{!attention.length && <div className="admin-empty">Belum ada user yang memerlukan perhatian pada periode ini.</div>}</div></section></div>
            <EnhancedUserTable metrics={metrics} query={query} setQuery={setQuery} onSelect={openUser} title="User terbaru" subtitle="Lihat ringkasan user tanpa meninggalkan overview." showSearch={false} filter="all" setFilter={setUserFilter} sort={userSort} setSort={setUserSort} /></>}
          {section === 'users' && <EnhancedUserTable metrics={metrics} query={query} setQuery={setQuery} onSelect={openUser} title="Daftar user" subtitle="Klik baris user untuk melihat perkembangan, jawaban, dan komentar." showSearch filter={userFilter} setFilter={setUserFilter} sort={userSort} setSort={setUserSort} />}
          {section === 'attention' && <section className="admin-card admin-table-card"><div className="admin-card-head"><div><span className="admin-eyebrow">Prioritas pendampingan</span><h2>Daftar user yang perlu diperiksa</h2><p>Urut berdasarkan penurunan nilai, nilai rendah, task tertinggal, atau tidak aktif.</p></div></div><div className="attention-list">{attention.map(item => <AttentionRow key={item.user.uid} item={item} onClick={() => openUser(item.user)} />)}{!attention.length && <div className="admin-empty">Tidak ada perhatian khusus pada periode yang dipilih.</div>}</div></section>}
          {section === 'comments' && <section className="admin-card admin-table-card"><div className="admin-card-head"><div><span className="admin-eyebrow">Komunikasi</span><h2>Komentar dan balasan</h2><p>Pilih user untuk menulis komentar atau melanjutkan percakapan.</p></div></div><div className="attention-list">{metrics.filter(item => (item.detail?.feedback || []).length).sort((a, b) => (b.detail?.feedback.length || 0) - (a.detail?.feedback.length || 0)).map(item => <button className="attention-row" key={item.user.uid} onClick={() => openUser(item.user, 'comments')}><div className="attention-avatar">{item.user.name.slice(0, 1).toUpperCase()}</div><div><b>{item.user.name}</b><small>{item.detail?.feedback.length} komentar · terakhir {formatShortDate(item.detail?.feedback[0]?.createdAt)}</small></div><i className="fas fa-chevron-right ml-auto text-[10px]" /></button>)}{!metrics.some(item => item.detail?.feedback.length) && <div className="admin-empty">Belum ada komentar yang dikirim.</div>}</div></section>}
          {section === 'access' && <section className="admin-card admin-table-card"><div className="admin-card-head"><div><span className="admin-eyebrow">Keamanan</span><h2>Kelola akses admin</h2><p>Hanya user yang sudah memiliki akun LovSpeak yang dapat diberikan akses admin.</p></div></div><div className="admin-access-form"><select className="feedback-select" value={accessUserId} onChange={event => setAccessUserId(event.target.value)}><option value="">Pilih user yang akan diberi akses</option>{users.filter(item => item.uid !== user.uid && !adminAccess.some(access => access.uid === item.uid)).map(item => <option key={item.uid} value={item.uid}>{item.name} · {item.email || 'tanpa email'}</option>)}</select><button className="feedback-send" onClick={async () => { const target = users.find(item => item.uid === accessUserId); if (!target || !window.confirm(`Berikan hak akses admin kepada ${target.name}?`)) return; await grantAdminAccess(target, user.uid); setAccessUserId(''); setMessage(`${target.name} kini memiliki hak akses admin.`); await refresh(); }}>Berikan akses admin</button></div><div className="attention-list"><div className="access-row"><div className="attention-avatar">L</div><div><b>Lovelya Trial</b><small>lovelyatrial@gmail.com · Admin utama</small></div><span className="admin-pill">Tidak dapat dihapus</span></div>{adminAccess.map(access => <div className="access-row" key={access.uid}><div className="attention-avatar">{(access.name || access.email).slice(0, 1).toUpperCase()}</div><div><b>{access.name || 'Admin'}</b><small>{access.email || 'Email tidak tersedia'} · ditambahkan {formatShortDate(access.createdAt)}</small></div><button className="delete-text ml-auto" onClick={async () => { if (!window.confirm(`Cabut akses admin dari ${access.name || access.email}?`)) return; await revokeAdminAccess(access.uid); setMessage('Akses admin dicabut.'); await refresh(); }}>Cabut akses</button></div>)}</div></section>}
        </>}
      </main>
    </div>
    {selected && selectedMetric && <DetailPanelV2 user={selected} metric={selectedMetric} detail={selectedDetail} activities={selectedActivities} scored={selectedScored} speaking={selectedSpeaking} period={period} tab={detailTab} setTab={setDetailTab} feedback={feedback} setFeedback={setFeedback} feedbackScope={feedbackScope} setFeedbackScope={setFeedbackScope} taskId={taskId} setTaskId={setTaskId} onClose={() => setSelected(null)} onSubmitFeedback={submitFeedback} replies={replies} replyDrafts={replyDrafts} setReplyDrafts={setReplyDrafts} onReply={submitReply} onDeleteFeedback={removeFeedback} onDeleteReply={removeReply} />}
  </div>;
};

const PerformanceMap: React.FC<{ metrics: UserMetric[]; selectedId?: string; onSelect: (user: AdminUser) => void }> = ({ metrics, selectedId, onSelect }) => <div className="performance-map"><span className="map-axis-y">Nilai</span><span className="map-axis-x">Penyelesaian Daily Plan →</span><span className="map-zone" style={{ left: '7%', top: '9%' }}>Perlu dijaga</span><span className="map-zone" style={{ right: '7%', top: '9%' }}>Performa unggul</span><span className="map-zone" style={{ left: '7%', bottom: '9%' }}>Perlu perhatian</span><span className="map-zone" style={{ right: '7%', bottom: '9%' }}>Rajin, perlu bantuan</span>{metrics.map(item => { const x = item.totalTasks ? Math.max(4, Math.min(96, item.completionRate)) : 5; const y = item.average === null ? 7 : Math.max(7, Math.min(96, item.average)); return <button aria-label={`Detail ${item.user.name}`} key={item.user.uid} title={`${item.user.name} · ${item.average === null ? 'belum ada nilai' : `${item.average}%`} · ${item.completionRate}% Daily Plan`} className={`map-dot ${item.trend} ${selectedId === item.user.uid ? 'selected' : ''}`} onClick={() => onSelect(item.user)} style={{ left: `${x}%`, bottom: `${y}%` }} />; })}</div>;

const AttentionRow: React.FC<{ item: UserMetric; onClick: () => void }> = ({ item, onClick }) => <button className="attention-row" onClick={onClick}><div className="attention-avatar">{item.user.name.slice(0, 1).toUpperCase()}</div><div><b>{item.user.name}</b><small>{item.attentionReason}</small></div><span className="attention-score">{item.average === null ? '—' : `${item.average}%`}</span></button>;

const UserTable: React.FC<{ metrics: UserMetric[]; query: string; setQuery: (value: string) => void; onSelect: (user: AdminUser) => void; title: string; subtitle: string; showSearch: boolean }> = ({ metrics, query, setQuery, onSelect, title, subtitle, showSearch }) => <section className="admin-card admin-table-card"><div className="admin-table-toolbar"><div><span className="admin-eyebrow">Monitoring</span><h2 className="text-[16px] font-black mt-1 mb-0">{title}</h2><p className="text-[12px] text-[var(--muted)] mt-1 mb-0">{subtitle}</p></div>{showSearch && <input className="admin-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Cari nama atau email..." />}</div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>User</th><th>Nilai</th><th>Progress</th><th>Speaking</th><th>Tren</th><th>Fokus</th><th>Aktivitas</th></tr></thead><tbody>{metrics.map(item => <tr key={item.user.uid} onClick={() => onSelect(item.user)}><td><div className="user-cell"><div className="user-avatar">{item.user.name.slice(0, 1).toUpperCase()}</div><div><b><i className={`status-dot ${item.user.isOnline ? 'status-online' : 'status-offline'}`} title={item.user.isOnline ? 'Online' : 'Offline'} />{item.user.name}</b><span>{item.user.email || 'Email belum tersedia'}</span></div></div></td><td className="font-black">{item.average === null ? 'Belum ada' : `${item.average}%`}</td><td>{item.completed}/{item.totalTasks} <span className="text-[var(--muted)]">({item.completionRate}%)</span></td><td className="font-bold">{formatDuration(item.speakingSeconds)}</td><td><span className={`metric-trend ${item.trend}`}>{trendIcon(item.trend)} {trendText(item.trend)}</span></td><td><span className={item.attentionReason ? 'admin-pill text-[#b34b30]' : 'admin-pill'}>{item.attentionReason || 'On track'}</span></td><td className="text-[var(--muted)]">{formatShortDate(item.lastActivity)}</td></tr>)}{!metrics.length && <tr><td colSpan={7} className="text-center text-[var(--muted)] py-10">Tidak ada user yang sesuai.</td></tr>}</tbody></table></div></section>;

const DetailPanel: React.FC<{ user: AdminUser; metric: UserMetric; detail?: AdminUserDetail; scored: ActivityLog[]; speaking: ActivityLog[]; feedback: string; setFeedback: (value: string) => void; feedbackScope: 'general' | 'task'; setFeedbackScope: (value: 'general' | 'task') => void; taskId: string; setTaskId: (value: string) => void; onClose: () => void; onSubmitFeedback: () => void; replies: Record<string, AdminReply[]>; replyDrafts: Record<string, string>; setReplyDrafts: React.Dispatch<React.SetStateAction<Record<string, string>>>; onReply: (id: string) => void; onDeleteFeedback: (id: string) => void; onDeleteReply: (feedbackId: string, replyId: string) => void; onGrantAdmin: () => Promise<void> }> = props => {
  const { user, metric, detail, scored, speaking, feedback, setFeedback, feedbackScope, setFeedbackScope, taskId, setTaskId, onClose, onSubmitFeedback, replies, replyDrafts, setReplyDrafts, onReply, onDeleteFeedback, onDeleteReply, onGrantAdmin } = props;
  const chart = [...scored].sort((a, b) => a.date.localeCompare(b.date)).slice(-10);
  return <div className="admin-panel-overlay" onMouseDown={onClose}><aside className="admin-detail" onMouseDown={event => event.stopPropagation()}><div className="detail-head"><div><span className="admin-eyebrow">Detail user</span><h2>{user.name}</h2><p className="text-[12px] text-[var(--muted)] mt-1">{user.email || 'Email belum tersedia'}</p></div><button className="detail-close" onClick={onClose}><i className="fas fa-xmark" /></button></div><div className="detail-summary"><div className="detail-stat"><b>{metric.average === null ? '—' : `${metric.average}%`}</b><span>NILAI</span></div><div className="detail-stat"><b>{metric.completionRate}%</b><span>TASK</span></div><div className="detail-stat"><b>{formatDuration(metric.speakingSeconds)}</b><span>SPEAKING</span></div><div className="detail-stat"><b className={`metric-trend ${metric.trend}`}>{trendIcon(metric.trend)}</b><span>{trendText(metric.trend).toUpperCase()}</span></div></div><section className="detail-section"><h3>Performa per kategori</h3><div className="category-grid">{Object.entries(metric.categories).filter(([, value]) => value !== null).map(([type, value]) => <div className="category-item" key={type}><span>{CATEGORY_LABELS[type]}</span><b>{value}%</b></div>)}{!Object.values(metric.categories).some(value => value !== null) && <p className="text-[12px] text-[var(--muted)]">Belum ada nilai kategori.</p>}</div></section><section className="detail-section"><h3>Perkembangan nilai</h3>{chart.length ? <><div className="mini-bars">{chart.map(item => <div className="mini-bar" key={item.id} title={`${formatShortDate(item.date)}: ${item.score}%`}><i style={{ height: `${Math.max(7, item.score)}%` }} /></div>)}</div><div className="mini-labels">{chart.map(item => <span key={item.id}>{formatShortDate(item.date)}</span>)}</div></> : <p className="text-[12px] text-[var(--muted)]">Belum ada aktivitas yang memiliki nilai.</p>}</section><section className="detail-section"><h3>Speaking dan aktivitas terakhir</h3><p className="text-[12px] text-[var(--muted)]">Total speaking: <b className="text-[var(--text)]">{formatDuration(speaking.reduce((sum, item) => sum + item.durationSeconds, 0))}</b></p><div className="mt-3 max-h-44 overflow-auto">{[...detail?.activities || []].slice(0, 12).map(item => <div className="border-b border-[var(--line)] py-2 text-[11px]" key={item.id}><div className="flex justify-between gap-2"><b>{activityName(item)}</b><span>{isSpeaking(item) ? formatDuration(item.durationSeconds) : isScored(item) ? `${item.score}%` : 'Aktivitas'}</span></div><span className="text-[10px] text-[var(--muted)]">{formatShortDate(item.date)}</span>{item.details && <p className="mt-1 text-[var(--muted)] whitespace-pre-wrap">{item.details}</p>}</div>)}</div></section><section className="detail-section"><h3>Kirim komentar</h3><div className="feedback-controls"><button className={feedbackScope === 'general' ? 'active' : ''} onClick={() => setFeedbackScope('general')}>Umum</button><button className={feedbackScope === 'task' ? 'active' : ''} onClick={() => setFeedbackScope('task')}>Tentang task</button></div>{feedbackScope === 'task' && <select className="feedback-select" value={taskId} onChange={event => setTaskId(event.target.value)}><option value="">Pilih task</option>{tasksForPlan(detail?.plan || null).map(task => <option key={task.id} value={task.id}>{task.title}</option>)}</select>}<textarea className="feedback-textarea" value={feedback} onChange={event => setFeedback(event.target.value)} placeholder="Tulis arahan atau apresiasi…" /><button className="feedback-send" onClick={onSubmitFeedback}>Kirim komentar</button></section><section className="detail-section"><h3>Riwayat komentar</h3>{(detail?.feedback || []).map(item => <div className="feedback-item" key={item.id}><div className="feedback-meta"><span>{item.scope === 'task' ? `Task · ${item.taskTitle || 'Tanpa judul'}` : 'Komentar umum'}</span><span>{formatShortDate(item.createdAt)}</span></div><p>{item.message}</p>{(replies[item.id] || []).map(reply => <div className="reply" key={reply.id}><b>{reply.authorName}</b> · {reply.message}<button className="delete-text ml-2" onClick={() => onDeleteReply(item.id, reply.id)}>Hapus</button></div>)}<div className="reply-form"><input className="reply-input" value={replyDrafts[item.id] || ''} onChange={event => setReplyDrafts(current => ({ ...current, [item.id]: event.target.value }))} placeholder="Balas…" /><button onClick={() => onReply(item.id)}>Kirim</button></div><button className="delete-text" onClick={() => onDeleteFeedback(item.id)}>Hapus komentar</button></div>)}{!(detail?.feedback || []).length && <p className="text-[12px] text-[var(--muted)]">Belum ada komentar untuk user ini.</p>}</section><section className="detail-section"><button className="delete-text" onClick={() => void onGrantAdmin()}>Jadikan {user.name} sebagai admin tambahan</button></section></aside></div>;
};

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
  replies: Record<string, AdminReply[]>;
  replyDrafts: Record<string, string>;
  setReplyDrafts: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onReply: (id: string) => void;
  onDeleteFeedback: (id: string) => void;
  onDeleteReply: (feedbackId: string, replyId: string) => void;
};

const ScoreTrendChart: React.FC<{ points: { date: string; score: number }[] }> = ({ points }) => <div className="score-chart" aria-label="Grafik rata-rata nilai per hari"><div className="score-y-axis"><span>100</span><span>50</span><span>0</span></div><div className="score-plot">{points.map(point => <div className="score-column" key={point.date} title={`${formatShortDate(point.date)}: ${point.score}%`}><span className="score-value">{point.score}%</span><i className="score-bar" style={{ height: `${Math.max(5, point.score)}%` }} /><span className="score-label">{formatShortDate(point.date)}</span></div>)}</div></div>;

const DetailPanelV2: React.FC<DetailPanelV2Props> = ({
  user, metric, detail, activities, scored, speaking, period, tab, setTab, feedback, setFeedback, feedbackScope,
  setFeedbackScope, taskId, setTaskId, onClose, onSubmitFeedback, replies, replyDrafts, setReplyDrafts, onReply,
  onDeleteFeedback, onDeleteReply
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
  const lastSpeaking = [...speaking].sort((a, b) => b.date.localeCompare(a.date))[0];
  const tabs: { id: DetailTab; label: string }[] = [
    { id: 'progress', label: 'Perkembangan' }, { id: 'tasks', label: 'Task & Jawaban' }, { id: 'comments', label: 'Komentar' }
  ];

  return <div className="admin-panel-overlay" onMouseDown={onClose}>
    <aside className="admin-detail detail-readable" onMouseDown={event => event.stopPropagation()}>
      <div className="detail-head">
        <div><span className="admin-eyebrow">Detail user</span><h2><i className={`status-dot ${user.isOnline ? 'status-online' : 'status-offline'}`} />{user.name}</h2><p className="text-[12px] text-[var(--muted)] mt-1">{user.email || 'Email belum tersedia'} · {user.level || 'Level belum dipilih'} · aktif {formatLastSeen(user.lastSeenAt)}</p></div>
        <button className="detail-close" onClick={onClose} aria-label="Tutup detail"><i className="fas fa-xmark" /></button>
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
        <section className="detail-section"><h3>Performa per kategori</h3><p className="text-[10px] text-[var(--muted)] mb-3">Kategori yang belum dikerjakan tetap ditampilkan sebagai tanda strip.</p><div className="category-grid">{[AppView.READING, AppView.LISTENING, AppView.GRAMMAR, AppView.SHADOWING].map(type => <div className="category-item" key={type}><span>{CATEGORY_LABELS[type]}</span><b>{metric.categories[type] === null ? '—' : `${metric.categories[type]}%`}</b><small>{metric.categories[type] === null ? 'Belum ada data' : 'Nilai rata-rata'}</small></div>)}<div className="category-item"><span>Speaking Live</span><b>{metric.liveSeconds ? formatDuration(metric.liveSeconds) : '—'}</b><small>{metric.liveSeconds ? `${activities.filter(item => item.type === AppView.LIVE).length} sesi · durasi latihan` : 'Belum ada data'}</small></div></div></section>
        <section className="detail-section"><div className="flex items-start justify-between gap-3"><div><h3>Perkembangan nilai harian</h3><p className="text-[10px] text-[var(--muted)] mb-1">Pilih kategori untuk melihat perkembangan yang lebih spesifik.</p></div><select className="chart-select" aria-label="Kategori grafik" value={chartMode} onChange={event => setChartMode(event.target.value as 'average' | AppView)}><option value="average">Semua nilai</option><option value={AppView.READING}>Reading</option><option value={AppView.LISTENING}>Listening</option><option value={AppView.GRAMMAR}>Grammar</option><option value={AppView.SHADOWING}>Shadowing</option></select></div>{dailyScores.length ? <ScoreTrendChart points={dailyScores} /> : <p className="text-[12px] text-[var(--muted)]">Belum ada nilai untuk kategori ini pada periode yang dipilih.</p>}</section>
        <section className="detail-section"><h3>Latihan berbicara</h3><div className="task-source"><div className="task-source-card"><b>{formatDuration(metric.liveSeconds)}</b><span>SPEAKING LIVE</span><small>{activities.filter(item => item.type === AppView.LIVE).length} sesi · durasi percakapan</small></div><div className="task-source-card"><b>{metric.categories[AppView.SHADOWING] === null ? '—' : `${metric.categories[AppView.SHADOWING]}%`}</b><span>SHADOWING</span><small>{activities.filter(item => item.type === AppView.SHADOWING).length} sesi · skor rata-rata</small></div></div><p className="text-[11px] text-[var(--muted)] mt-3 mb-0">Sesi terakhir: <b className="text-[var(--text)]">{lastSpeaking ? `${formatShortDate(lastSpeaking.date)} · ${activityName(lastSpeaking)} · ${formatDuration(lastSpeaking.durationSeconds)}` : 'Belum ada sesi pada periode ini'}</b></p></section>
      </>}

      {tab === 'tasks' && <>
        <p className="detail-period">Progress roadmap bersifat keseluruhan; Daily Plan adalah rencana aktif saat ini.</p>
        <section className="detail-section"><h3>Sumber progress</h3><div className="task-source"><div className="task-source-card"><b>{metric.dailyCompleted}/{metric.dailyTasks.length}</b><span>DAILY PLAN SELESAI</span><small>{metric.dailyTasks.length ? 'Rencana aktif saat ini' : 'Belum ada rencana aktif'}</small></div><div className="task-source-card"><b>{metric.roadmapCompleted} <em>dari {metric.roadmapTotal}</em></b><span>LANGKAH ROADMAP · {user.level || 'LEVEL'}</span><small>{metric.roadmapTotal} langkah tersedia pada level ini</small></div></div></section>
        <section className="detail-section"><h3>Daily Plan aktif</h3><div className="task-list">{metric.dailyTasks.map(task => <div className="task-line" key={task.id}><i className={`fas ${task.isCompleted ? 'fa-circle-check text-emerald-500' : 'fa-circle text-[var(--muted)]'}`} /><div className="flex-1"><b>{task.title}</b><small>{task.moduleView} · {task.isCompleted ? 'Selesai' : 'Belum selesai'}</small></div></div>)}{!metric.dailyTasks.length && <p className="text-[12px] text-[var(--muted)] py-2">Belum ada Daily Plan aktif.</p>}</div></section>
        <section className="detail-section"><h3>Jawaban dan catatan terbaru</h3>{answers.map(item => <div className="task-line" key={item.id}><i className="fas fa-file-lines text-[var(--accent-strong)]" /><div className="flex-1"><b>{activityName(item)}</b><small>{formatShortDate(item.date)} · {isScored(item) ? `${item.score}%` : isSpeaking(item) ? formatDuration(item.durationSeconds) : 'Aktivitas'}</small><details className="answer-details"><summary>Lihat jawaban atau catatan</summary><p>{item.details}</p></details></div></div>)}{!answers.length && <p className="text-[12px] text-[var(--muted)]">Belum ada jawaban atau catatan yang tersimpan pada periode ini.</p>}</section>
      </>}

      {tab === 'comments' && <>
        <section className="detail-section"><h3>Kirim komentar</h3><div className="feedback-controls"><button className={feedbackScope === 'general' ? 'active' : ''} onClick={() => setFeedbackScope('general')}>Umum</button><button className={feedbackScope === 'task' ? 'active' : ''} onClick={() => setFeedbackScope('task')}>Tentang task</button></div>{feedbackScope === 'task' && <select className="feedback-select" value={taskId} onChange={event => setTaskId(event.target.value)}><option value="">Pilih task</option>{tasksForPlan(detail?.plan || null).map(task => <option key={task.id} value={task.id}>{task.title}</option>)}</select>}<textarea className="feedback-textarea" value={feedback} onChange={event => setFeedback(event.target.value)} placeholder="Tulis arahan atau apresiasi…" /><button className="feedback-send" onClick={onSubmitFeedback}>Kirim komentar</button></section>
        <section className="detail-section"><h3>Riwayat komentar</h3>{(detail?.feedback || []).map(item => <div className="feedback-item" key={item.id}><div className="feedback-meta"><span>{item.scope === 'task' ? `Task · ${item.taskTitle || 'Tanpa judul'}` : 'Komentar umum'}</span><span>{formatShortDate(item.createdAt)}</span></div><p>{item.message}</p>{(replies[item.id] || []).map(reply => <div className="reply" key={reply.id}><b>{reply.authorName}</b> · {reply.message}<button className="delete-text ml-2" onClick={() => onDeleteReply(item.id, reply.id)}>Hapus</button></div>)}<div className="reply-form"><input className="reply-input" value={replyDrafts[item.id] || ''} onChange={event => setReplyDrafts(current => ({ ...current, [item.id]: event.target.value }))} placeholder="Balas…" /><button onClick={() => onReply(item.id)}>Kirim</button></div><button className="delete-text" onClick={() => onDeleteFeedback(item.id)}>Hapus komentar</button></div>)}{!(detail?.feedback || []).length && <p className="text-[12px] text-[var(--muted)]">Belum ada komentar untuk user ini.</p>}</section>
      </>}
    </aside>
  </div>;
};

const EnhancedUserTable: React.FC<{
  metrics: UserMetric[]; query: string; setQuery: (value: string) => void; onSelect: (user: AdminUser) => void;
  title: string; subtitle: string; showSearch: boolean; filter: UserFilter; setFilter: (value: UserFilter) => void;
  sort: UserSort; setSort: (value: UserSort) => void;
}> = ({ metrics, query, setQuery, onSelect, title, subtitle, showSearch, filter, setFilter, sort, setSort }) => {
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
  return <section className="admin-card admin-table-card"><div className="admin-table-toolbar"><div><span className="admin-eyebrow">Monitoring · {filteredMetrics.length} user</span><h2 className="text-[16px] font-black mt-1 mb-0">{title}</h2><p className="text-[12px] text-[var(--muted)] mt-1 mb-0">{subtitle}</p></div>{showSearch && <div className="admin-table-controls"><input className="admin-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Cari nama atau email..." /><select className="admin-filter" aria-label="Filter user" value={filter} onChange={event => setFilter(event.target.value as UserFilter)}><option value="all">Semua user</option><option value="attention">Perlu perhatian</option><option value="online">Sedang online</option><option value="low-score">Nilai di bawah 60%</option><option value="inactive">Tidak aktif 7 hari</option><option value="daily-incomplete">Daily Plan belum selesai</option></select><select className="admin-filter" aria-label="Urutkan user" value={sort} onChange={event => setSort(event.target.value as UserSort)}><option value="score-desc">Nilai tertinggi</option><option value="score-asc">Nilai terendah</option><option value="progress-desc">Progress tertinggi</option><option value="progress-asc">Progress terendah</option><option value="recent">Aktivitas terbaru</option></select></div>}</div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>User</th><th>Nilai</th><th>Progress</th><th>Speaking</th><th>Tren</th><th>Fokus</th><th>Aktivitas</th></tr></thead><tbody>{visible.map(item => <tr key={item.user.uid} onClick={() => onSelect(item.user)}><td><div className="user-cell"><div className="user-avatar">{item.user.name.slice(0, 1).toUpperCase()}</div><div><b><i className={`status-dot ${item.user.isOnline ? 'status-online' : 'status-offline'}`} title={item.user.isOnline ? 'Online' : 'Offline'} />{item.user.name}</b><span>{item.user.email || 'Email belum tersedia'}</span></div></div></td><td className="font-black">{item.average === null ? 'Belum ada' : `${item.average}%`}</td><td>{item.completed}/{item.totalTasks} <span className="text-[var(--muted)]">({item.completionRate}%)</span></td><td className="font-bold">{formatDuration(item.speakingSeconds)}</td><td><span className={`metric-trend ${item.trend}`}>{trendIcon(item.trend)} {trendText(item.trend)}</span></td><td><span className={item.attentionReason ? 'admin-pill text-[#b34b30]' : 'admin-pill'}>{item.attentionReason || 'On track'}</span></td><td className="text-[var(--muted)]">{formatShortDate(item.lastActivity)}</td></tr>)}{!visible.length && <tr><td colSpan={7} className="text-center text-[var(--muted)] py-10">Tidak ada user yang sesuai.</td></tr>}</tbody></table></div>{pageCount > 1 && <div className="admin-pagination"><button type="button" disabled={page === 1} onClick={() => setPage(current => current - 1)}>Sebelumnya</button><span>Halaman {page} dari {pageCount}</span><button type="button" disabled={page === pageCount} onClick={() => setPage(current => current + 1)}>Berikutnya</button></div>}</section>;
};

export default AdminPortal;
