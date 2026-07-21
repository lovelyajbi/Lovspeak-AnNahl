import React, { useMemo, useState } from 'react';
import { User } from 'firebase/auth';
import { AppView, UserAssignment } from '../types';
import { markUserAssignmentRead } from '../services/admin';

type Filter = 'all' | 'active' | 'needs_retake' | 'completed' | 'expired';

interface TasksModuleProps {
  user: User | null;
  assignments: UserAssignment[];
  onStartAssignment: (assignment: UserAssignment) => void;
  onMarkRead: (assignmentId: string) => void;
}

const dayjs = (iso?: string | null) => (iso ? new Date(iso) : null);

const isExpired = (assignment: UserAssignment) => {
  if (!assignment.dueAt) return false;
  if (assignment.status === 'completed') return false;
  return new Date(assignment.dueAt).getTime() < Date.now();
};

const effectiveStatus = (assignment: UserAssignment): Filter => {
  if (assignment.status === 'completed') return 'completed';
  if (assignment.status === 'needs_retake') return 'needs_retake';
  if (isExpired(assignment)) return 'expired';
  return 'active';
};

const statusMeta: Record<Filter, { label: string; badgeClass: string; iconClass: string }> = {
  all: { label: 'Semua', badgeClass: '', iconClass: '' },
  active: {
    label: 'Belum selesai',
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    iconClass: 'fa-circle-notch text-amber-500'
  },
  needs_retake: {
    label: 'Perlu retake',
    badgeClass: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    iconClass: 'fa-rotate-right text-rose-500'
  },
  completed: {
    label: 'Selesai',
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    iconClass: 'fa-check-circle text-emerald-500'
  },
  expired: {
    label: 'Terlewat tenggat',
    badgeClass: 'bg-slate-200 text-slate-600 dark:bg-gray-700 dark:text-gray-400',
    iconClass: 'fa-clock text-slate-400'
  }
};

const formatDate = (iso?: string | null) => {
  const d = dayjs(iso);
  if (!d) return null;
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const relativeDue = (iso?: string | null): { text: string; danger: boolean } | null => {
  const d = dayjs(iso);
  if (!d) return null;
  const diff = d.getTime() - Date.now();
  const days = Math.round(diff / (1000 * 60 * 60 * 24));
  if (diff < 0) return { text: `Lewat ${Math.abs(days)} hari`, danger: true };
  if (days === 0) return { text: 'Tenggat hari ini', danger: true };
  if (days === 1) return { text: 'Tenggat besok', danger: true };
  if (days <= 3) return { text: `Tenggat ${days} hari lagi`, danger: true };
  return { text: `Tenggat ${days} hari lagi`, danger: false };
};

const kindLabel = (kind: string) => ({
  roadmap_pack: 'Roadmap',
  reading: 'Reading',
  listening: 'Listening',
  shadowing: 'Shadowing',
  grammar: 'Grammar',
  vocabulary: 'Vocabulary',
  live: 'Live Practice',
  chat: 'AI Tutor'
} as Record<string, string>)[kind] || kind;

const TasksModule: React.FC<TasksModuleProps> = ({ user, assignments, onStartAssignment, onMarkRead }) => {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: assignments.length, active: 0, needs_retake: 0, completed: 0, expired: 0 };
    assignments.forEach(a => { c[effectiveStatus(a)] += 1; });
    return c;
  }, [assignments]);

  const stats = useMemo(() => {
    const scored = assignments.filter(a => typeof a.bestScore === 'number');
    const avgScore = scored.length ? Math.round(scored.reduce((sum, a) => sum + (a.bestScore || 0), 0) / scored.length) : null;
    const completionRate = assignments.length ? Math.round((counts.completed / assignments.length) * 100) : 0;
    return { avgScore, completionRate, scoredCount: scored.length };
  }, [assignments, counts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return assignments
      .filter(a => filter === 'all' || effectiveStatus(a) === filter)
      .filter(a => !q || `${a.title} ${a.description || ''} ${a.target.packTitle || ''} ${a.target.title || ''} ${a.target.theme || ''}`.toLowerCase().includes(q))
      .sort((a, b) => {
        // Active tasks first (with nearest due), then retake, expired, completed last.
        const rank: Record<Filter, number> = { active: 0, needs_retake: 1, expired: 2, completed: 3, all: 99 };
        const ra = rank[effectiveStatus(a)];
        const rb = rank[effectiveStatus(b)];
        if (ra !== rb) return ra - rb;
        // Within same status: nearest due first, otherwise newest first.
        if (a.dueAt && b.dueAt) return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
        if (a.dueAt) return -1;
        if (b.dueAt) return 1;
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [assignments, filter, query]);

  const toggle = (assignment: UserAssignment) => {
    setExpandedId(current => current === assignment.id ? null : assignment.id);
    if (!assignment.readAt && user) {
      markUserAssignmentRead(user.uid, assignment.id).catch(() => undefined);
      onMarkRead(assignment.id);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header + KPI cards */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-lovelya-500 via-lovelya-600 to-indigo-600 p-6 text-white shadow-lg md:p-8 dark:border-gray-800">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-4 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm md:h-14 md:w-14">
            <i className="fas fa-clipboard-check text-xl md:text-2xl" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Modul Tugas</p>
            <h1 className="text-xl font-black leading-tight md:text-2xl lg:text-3xl">Tugas dari Admin</h1>
          </div>
        </div>
        <p className="relative mt-3 max-w-xl text-xs text-white/85 md:text-sm">Semua tugas dari admin/guru — kelompokkan, cari, dan pantau progressmu di satu tempat.</p>

        <div className="relative mt-5 grid grid-cols-3 gap-2 md:mt-6 md:gap-3">
          <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm md:p-4">
            <p className="text-lg font-black md:text-2xl">{counts.all}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-white/70 md:text-[10px]">Total tugas</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm md:p-4">
            <p className="text-lg font-black md:text-2xl">{stats.completionRate}%</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-white/70 md:text-[10px]">Selesai</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm md:p-4">
            <p className="text-lg font-black md:text-2xl">{stats.avgScore === null ? '—' : `${stats.avgScore}`}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-white/70 md:text-[10px]">Rata-rata nilai{stats.avgScore !== null && ` · ${stats.scoredCount}`}</p>
          </div>
        </div>
      </div>

      {/* Search + Filter chips */}
      <div className="space-y-3">
        <div className="relative">
          <i className="fas fa-search pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari tugas berdasarkan judul, kelompok, atau topik..."
            className="w-full rounded-2xl border border-gray-100 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-lovelya-300 focus:ring-2 focus:ring-lovelya-200 dark:border-gray-700 dark:bg-gray-800"
          />
        </div>

        <div className="-mx-1 flex flex-wrap gap-2 overflow-x-auto pb-1">
          {(['all', 'active', 'needs_retake', 'completed', 'expired'] as Filter[]).map(key => {
            const active = filter === key;
            const meta = statusMeta[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`inline-flex flex-shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-black transition ${active
                  ? 'border-lovelya-500 bg-lovelya-500 text-white shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-lovelya-300 hover:text-lovelya-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
              >
                <span>{meta.label}</span>
                <span className={`grid min-w-5 place-items-center rounded-full px-1.5 text-[10px] ${active ? 'bg-white/25' : 'bg-gray-100 dark:bg-gray-700'}`}>{counts[key]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white py-14 text-center dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-lovelya-50 text-lovelya-500 dark:bg-lovelya-900/30">
            <i className="fas fa-inbox text-2xl" />
          </div>
          <p className="text-sm font-black text-gray-800 dark:text-white">{assignments.length === 0 ? 'Belum ada tugas' : 'Tidak ada tugas cocok'}</p>
          <p className="mx-auto mt-2 max-w-xs text-xs text-gray-500">{assignments.length === 0 ? 'Kalau admin/guru mengirim tugas, akan muncul di sini.' : 'Coba ubah filter atau kata pencarian.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(assignment => {
            const status = effectiveStatus(assignment);
            const meta = statusMeta[status];
            const due = relativeDue(assignment.dueAt);
            const targetLabel = assignment.target.packTitle || assignment.target.title || assignment.target.topic || assignment.target.theme || kindLabel(assignment.target.kind);
            const isOpen = expandedId === assignment.id;
            const isUnread = !assignment.readAt;

            return (
              <div
                key={assignment.id}
                className={`overflow-hidden rounded-2xl border bg-white transition dark:bg-gray-800 ${isUnread
                  ? 'border-lovelya-300 shadow-md shadow-lovelya-100 ring-2 ring-lovelya-50 dark:border-lovelya-800/70 dark:ring-lovelya-900/20'
                  : 'border-gray-100 dark:border-gray-700'}`}
              >
                <button type="button" onClick={() => toggle(assignment)} className="w-full p-4 text-left md:p-5">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl text-base md:h-12 md:w-12 md:text-lg ${status === 'completed'
                      ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/30'
                      : status === 'needs_retake'
                        ? 'bg-rose-50 text-rose-500 dark:bg-rose-900/30'
                        : status === 'expired'
                          ? 'bg-slate-100 text-slate-400 dark:bg-gray-700 dark:text-gray-500'
                          : 'bg-lovelya-50 text-lovelya-600 dark:bg-lovelya-900/30'}`}>
                      <i className={`fas ${status === 'completed' ? 'fa-check' : status === 'needs_retake' ? 'fa-rotate-right' : status === 'expired' ? 'fa-clock' : 'fa-clipboard-list'}`} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${meta.badgeClass}`}>
                          <i className={`fas ${meta.iconClass.split(' ')[0]}`} /> {meta.label}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-gray-500 dark:bg-gray-700 dark:text-gray-400">{kindLabel(assignment.target.kind)}</span>
                        {isUnread && <span className="rounded-full bg-lovelya-500 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">Baru</span>}
                      </div>

                      <h3 className="mt-1.5 text-sm font-black text-gray-900 dark:text-white md:text-base">{assignment.title}</h3>
                      <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">{targetLabel}</p>

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold text-gray-400">
                        <span><i className="far fa-calendar-plus mr-1" />Ditugaskan {formatDate(assignment.createdAt)}</span>
                        {due && <span className={due.danger ? 'text-rose-500' : ''}><i className="far fa-clock mr-1" />{due.text}</span>}
                        {typeof assignment.bestScore === 'number' && <span className="text-emerald-600"><i className="fas fa-star mr-1" />Nilai {assignment.bestScore}</span>}
                        {assignment.attempts > 0 && <span><i className="fas fa-repeat mr-1" />{assignment.attempts}× dicoba</span>}
                      </div>
                    </div>

                    <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} mt-1 text-xs text-gray-400`} />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40 md:p-5">
                    {assignment.description && <p className="mb-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{assignment.description}</p>}

                    <dl className="grid grid-cols-2 gap-3 text-xs md:grid-cols-4">
                      <div>
                        <dt className="text-[9px] font-black uppercase tracking-wider text-gray-400">Kelompok</dt>
                        <dd className="mt-1 font-bold text-gray-800 dark:text-gray-200">{kindLabel(assignment.target.kind)}</dd>
                      </div>
                      {assignment.target.minScore !== undefined && (
                        <div>
                          <dt className="text-[9px] font-black uppercase tracking-wider text-gray-400">Nilai minimum</dt>
                          <dd className="mt-1 font-bold text-gray-800 dark:text-gray-200">{assignment.target.minScore}</dd>
                        </div>
                      )}
                      {assignment.target.targetDurationSeconds !== undefined && (
                        <div>
                          <dt className="text-[9px] font-black uppercase tracking-wider text-gray-400">Durasi target</dt>
                          <dd className="mt-1 font-bold text-gray-800 dark:text-gray-200">{Math.ceil(assignment.target.targetDurationSeconds / 60)} menit</dd>
                        </div>
                      )}
                      {assignment.dueAt && (
                        <div>
                          <dt className="text-[9px] font-black uppercase tracking-wider text-gray-400">Tenggat</dt>
                          <dd className={`mt-1 font-bold ${due?.danger ? 'text-rose-500' : 'text-gray-800 dark:text-gray-200'}`}>{formatDate(assignment.dueAt)}</dd>
                        </div>
                      )}
                      {assignment.completedAt && (
                        <div>
                          <dt className="text-[9px] font-black uppercase tracking-wider text-gray-400">Diselesaikan</dt>
                          <dd className="mt-1 font-bold text-emerald-600">{formatDate(assignment.completedAt)}</dd>
                        </div>
                      )}
                      {typeof assignment.bestDurationSeconds === 'number' && (
                        <div>
                          <dt className="text-[9px] font-black uppercase tracking-wider text-gray-400">Durasi terbaik</dt>
                          <dd className="mt-1 font-bold text-gray-800 dark:text-gray-200">{Math.round(assignment.bestDurationSeconds / 60)}m {assignment.bestDurationSeconds % 60}d</dd>
                        </div>
                      )}
                    </dl>

                    {assignment.progressLabel && <p className="mt-3 text-[11px] text-gray-500">{assignment.progressLabel}</p>}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {status !== 'completed' && (
                        <button
                          type="button"
                          onClick={() => onStartAssignment(assignment)}
                          className="inline-flex items-center gap-2 rounded-xl bg-lovelya-600 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-lovelya-500/25 transition hover:bg-lovelya-700 active:scale-95"
                        >
                          <i className="fas fa-play" /> {status === 'needs_retake' ? 'Retake tugas' : 'Mulai kerjakan'}
                        </button>
                      )}
                      {status === 'completed' && (
                        <button
                          type="button"
                          onClick={() => onStartAssignment(assignment)}
                          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-black text-gray-700 transition hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        >
                          <i className="fas fa-eye" /> Buka ulang
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Export view id so the router in App.tsx and Layout can reference it consistently.
export const TASKS_VIEW: AppView = AppView.TASKS;

export default TasksModule;
