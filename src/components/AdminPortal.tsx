import React, { useEffect, useMemo, useState } from 'react';
import { User } from 'firebase/auth';
import { makeBarChart, makeBarSeries, makeChartSpace, makeLineChart } from '@office-kit/xlsx/chart';
import { addChartAt, makeColor, makeShapeProperties, makeSolidFill, makeSrgbColor } from '@office-kit/xlsx/drawing';
import { workbookToBytes } from '@office-kit/xlsx/io';
import { addWorksheet, createWorkbook } from '@office-kit/xlsx/workbook';
import { addExcelTable, setColumnWidths, setFreezePanes, writeRange } from '@office-kit/xlsx/worksheet';
import { formatAsHeader, setRangeAlignment, setRangeBackgroundColor, setRangeFont, setRangeNumberFormat, setRangeWrapText } from '@office-kit/xlsx/styles';
import { ActivityLog, AdminReply, AppView, AssignmentKind, AssignmentTarget, DailyTask, UserAssignment } from '../../types';
import { MASTER_CURRICULUM } from '../../data/curriculum';
import { READING_MANIFEST } from '../../data/readingManifest';
import { LISTENING_MANIFEST } from '../../data/listeningManifest';
import { THEMES } from '../../constants';
import TourGuide, { ADMIN_TOUR_STEPS, TOUR_KEY_ADMIN } from './TourGuide';
import { SHADOWING_DATA } from '../constants/shadowingData';
import {
  AdminAccessRecord, AdminUser, AdminUserDetail, deleteFeedback, deleteReply, getAdminAccess, getAdminUserDetail,
  createAdminAssignment, createAdminBroadcast, getAdminUsers, getReplies, grantAdminAccess, retakeAssignment, revokeAdminAccess, sendFeedback, sendReply, tasksForPlan,
  AdminAssignmentRecipientResult, AdminAssignmentSummary, AdminBroadcastSummary, getAssignmentRecipientResults, listAssignments, listBroadcasts, deleteAssignment, deleteBroadcast,
  subscribeToAdminUserActivity, migrateLearningData, ADMIN_REPORT_ACTIVITY_LIMIT
} from '../../services/admin';
import { isAdminAssignmentActivity, isDailyPlanActivity } from '../../services/activitySource';

type Period = 'week' | 'month' | 'all';
type ExportRange = 'today' | 'week' | 'month' | 'calendar-month' | 'all' | 'custom';
type DateWindow = { from: number; to: number };
type ExportMode = 'summary' | 'full';
type Section = 'overview' | 'users' | 'attention' | 'communication' | 'assignments' | 'access';
type ThemeMode = 'light' | 'dark';
type DetailTab = 'assignment' | 'daily' | 'comments';
type UserFilter = 'all' | 'attention' | 'online' | 'low-score' | 'overdue' | 'retake' | 'not-started';
type UserSort = 'score-desc' | 'score-asc' | 'progress-desc' | 'progress-asc' | 'recent';
type HistoryRange = 'today' | 'week' | 'month' | 'date' | 'all';

type UserMetric = {
  user: AdminUser;
  detail?: AdminUserDetail;
  /** Daily Plan is supporting engagement context, never the comparison baseline. */
  activities: ActivityLog[];
  /** Only activity tied to an exact admin assignment. */
  assignmentActivities: ActivityLog[];
  assignments: UserAssignment[];
  /** Primary academic score: one best score per comparable, scored assignment. */
  average: number | null;
  assignmentAverage: number | null;
  assignmentCompleted: number;
  assignmentTotal: number;
  assignmentCompletionRate: number;
  assignmentRetake: number;
  assignmentOverdue: number;
  /** Action counters across every assignment, independent from the comparison baseline. */
  attentionRetake: number;
  attentionOverdue: number;
  assignmentNotStarted: number;
  assignmentOnTime: number;
  assignmentCompletedWithDue: number;
  total: number;
  completed: number;
  totalTasks: number;
  completionRate: number;
  dailyTasks: DailyTask[];
  dailyCompleted: number;
  dailyCompletionRate: number;
  dailyAverage: number | null;
  dailyLastActivity?: string;
  dailyTrend: 'up' | 'steady' | 'down' | 'none';
  dailyCategories: Record<string, number | null>;
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
const ASSIGNMENT_SCORE_TYPES = [AppView.GRAMMAR, AppView.READING, AppView.LISTENING, AppView.SHADOWING] as const;
const ASSIGNMENT_KIND_LABELS: Record<AssignmentKind, string> = {
  roadmap_pack: 'Roadmap Pack', grammar: 'Grammar', reading: 'Reading', listening: 'Listening', speaking: 'Speaking', shadowing: 'Shadowing'
};

const formatDuration = (seconds = 0) => {
  const whole = Math.max(0, Math.round(seconds));
  const hour = Math.floor(whole / 3600);
  const minute = Math.floor((whole % 3600) / 60);
  const second = whole % 60;
  return hour ? `${hour}j ${minute}m` : `${minute}m ${second}dtk`;
};
const formatShortDate = (date?: string) => date ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(new Date(date)) : '—';
const formatExportDateTime = (date?: string | null) => {
  if (!date) return '—';
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return String(date);
  return `${localDateKey(value)} ${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`;
};
const formatLastSeen = (value?: number | null) => value ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value)) : 'Belum tercatat';
const localDateKey = (value: Date) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
const matchesHistoryRange = (value: string, range: HistoryRange, selectedDate: string) => {
  if (!value || range === 'all') return true;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  if (range === 'today') return localDateKey(date) === localDateKey(now);
  if (range === 'date') return Boolean(selectedDate) && localDateKey(date) === selectedDate;
  if (range === 'month') return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - 6);
  return date >= weekStart && date <= now;
};
const isSpeaking = (activity: ActivityLog) => activity.type === AppView.LIVE || activity.type === AppView.SHADOWING;
const isScored = (activity: ActivityLog) => SCORABLE.has(activity.type);
const withinPeriod = (date: string, period: Period | DateWindow) => {
  if (typeof period === 'object') {
    const time = new Date(date).getTime();
    return Number.isFinite(time) && time >= period.from && time <= period.to;
  }
  return period === 'all' || Date.now() - new Date(date).getTime() <= (period === 'week' ? 7 : 30) * DAY;
};
const exportWindow = (range: ExportRange, startDate = '', endDate = ''): DateWindow | undefined => {
  if (range === 'all') return undefined;
  const now = new Date();
  if (range === 'today') {
    const from = new Date(now); from.setHours(0, 0, 0, 0);
    const to = new Date(now); to.setHours(23, 59, 59, 999);
    return { from: from.getTime(), to: to.getTime() };
  }
  if (range === 'week' || range === 'month') return { from: Date.now() - (range === 'week' ? 7 : 30) * DAY, to: Date.now() };
  if (range === 'calendar-month') {
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { from: from.getTime(), to: to.getTime() };
  }
  if (!startDate || !endDate) return undefined;
  const from = new Date(`${startDate}T00:00:00`);
  const to = new Date(`${endDate}T23:59:59.999`);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from > to) return undefined;
  return { from: from.getTime(), to: to.getTime() };
};
const exportRangeLabel = (range: ExportRange, startDate = '', endDate = '') => range === 'today' ? 'Hari ini' : range === 'week' ? '7 hari terakhir' : range === 'month' ? '30 hari terakhir' : range === 'calendar-month' ? 'Bulan kalender berjalan' : range === 'custom' ? `${startDate || '…'} s/d ${endDate || '…'}` : 'Semua waktu';
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
const SectionIcons: Record<Section, string> = { overview: 'fa-chart-pie', users: 'fa-users', attention: 'fa-triangle-exclamation', communication: 'fa-comments', assignments: 'fa-clipboard-check', access: 'fa-shield-halved' };

const PAGE_SIZE = 10;
const usePaged = <T,>(items: T[], size = PAGE_SIZE) => {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / size));
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [page, pageCount]);
  return { visible: items.slice((page - 1) * size, page * size), page, pageCount, setPage, total: items.length };
};
const Pager: React.FC<{ page: number; pageCount: number; setPage: React.Dispatch<React.SetStateAction<number>>; total?: number }> = ({ page, pageCount, setPage, total }) =>
  pageCount > 1 ? <div className="admin-pagination"><button type="button" disabled={page === 1} onClick={() => setPage(current => current - 1)}>Sebelumnya</button><span>Halaman {page} dari {pageCount}{total !== undefined ? ` · ${total} data` : ''}</span><button type="button" disabled={page === pageCount} onClick={() => setPage(current => current + 1)}>Berikutnya</button></div> : null;

const metricForUser = (user: AdminUser, detail: AdminUserDetail | undefined, period: Period | DateWindow, assignmentScope: 'common' | string = 'common'): UserMetric => {
  const allActivities = detail?.activities || [];
  // Only these two attributable lanes are visible to admins. Manual learning
  // and standalone Roadmap work remain private learning activity.
  const activities = allActivities.filter(item => isDailyPlanActivity(item) && withinPeriod(item.date, period));
  const periodAssignmentActivities = allActivities.filter(item => isAdminAssignmentActivity(item) && withinPeriod(item.date, period));
  const scored = activities.filter(isScored);
  const dailyTasks = detail?.plan?.dailyTasks || [];
  const allAssignments = detail?.assignments || [];
  const periodAssignments = allAssignments.filter(item => withinPeriod(item.createdAt, period));
  const assignments = assignmentScope === 'common'
    ? periodAssignments.filter(item => item.recipientMode === 'all')
    : periodAssignments.filter(item => item.id === assignmentScope);
  const assignmentIds = new Set(assignments.map(item => item.id));
  const assignmentActivities = periodAssignmentActivities.filter(item => assignmentIds.has(String(item.metadata?.assignmentId || '')));
  const scoredAssignments = assignments.filter(item => typeof item.bestScore === 'number');
  const assignmentCompleted = assignments.filter(item => item.status === 'completed').length;
  const assignmentTotal = assignments.length;
  const assignmentCompletionRate = assignmentTotal ? Math.round((assignmentCompleted / assignmentTotal) * 100) : 0;
  const assignmentRetake = assignments.filter(item => item.status === 'needs_retake' || (item.attempts > 0 && item.target.minScore !== undefined && typeof item.bestScore === 'number' && item.bestScore < item.target.minScore)).length;
  const assignmentOverdue = assignments.filter(item => item.status === 'expired' || (item.status !== 'completed' && Boolean(item.dueAt) && new Date(item.dueAt as string).getTime() < Date.now())).length;
  const assignmentNotStarted = assignments.filter(item => item.status !== 'completed' && !item.readAt && item.attempts === 0).length;
  const assignmentCompletedWithDue = assignments.filter(item => item.status === 'completed' && Boolean(item.dueAt)).length;
  const assignmentOnTime = assignments.filter(item => item.status === 'completed' && Boolean(item.dueAt) && Boolean(item.completedAt) && new Date(item.completedAt as string).getTime() <= new Date(item.dueAt as string).getTime()).length;
  const tasks = dailyTasks;
  const dailyCategoryValues = Object.keys(CATEGORY_LABELS).reduce<Record<string, number | null>>((result, key) => {
    result[key] = average(scored.filter(item => item.type === key));
    return result;
  }, {});
  const categoryValues = ASSIGNMENT_SCORE_TYPES.reduce<Record<string, number | null>>((result, key) => {
    const kind = key === AppView.SHADOWING ? 'shadowing' : key.toLowerCase();
    const values = scoredAssignments.filter(item => item.target.kind === kind).map(item => item.bestScore as number);
    result[key] = values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : null;
    return result;
  }, {});
  const assignmentScore = scoredAssignments.length ? Math.round(scoredAssignments.reduce((sum, item) => sum + (item.bestScore as number), 0) / scoredAssignments.length) : null;
  const assignmentDate = (item: UserAssignment) => item.completedAt || item.createdAt;
  const trendAssignments = assignmentScope === 'common' ? allAssignments.filter(item => item.recipientMode === 'all') : allAssignments.filter(item => item.id === assignmentScope);
  const recentAssignments = trendAssignments.filter(item => typeof item.bestScore === 'number' && Date.now() - new Date(assignmentDate(item)).getTime() <= 14 * DAY);
  const currentAssignmentScores = recentAssignments.filter(item => Date.now() - new Date(assignmentDate(item)).getTime() <= 7 * DAY).map(item => item.bestScore as number);
  const previousAssignmentScores = recentAssignments.filter(item => { const age = Date.now() - new Date(assignmentDate(item)).getTime(); return age > 7 * DAY && age <= 14 * DAY; }).map(item => item.bestScore as number);
  const currentAverage = currentAssignmentScores.length ? Math.round(currentAssignmentScores.reduce((sum, value) => sum + value, 0) / currentAssignmentScores.length) : null;
  const previousAverage = previousAssignmentScores.length ? Math.round(previousAssignmentScores.reduce((sum, value) => sum + value, 0) / previousAssignmentScores.length) : null;
  const trend: UserMetric['trend'] = currentAverage === null || previousAverage === null ? 'none' : currentAverage >= previousAverage + 5 ? 'up' : currentAverage <= previousAverage - 5 ? 'down' : 'steady';
  const recentDaily = allActivities.filter(item => isDailyPlanActivity(item) && Date.now() - new Date(item.date).getTime() <= 14 * DAY && isScored(item));
  const currentDailyAverage = average(recentDaily.filter(item => Date.now() - new Date(item.date).getTime() <= 7 * DAY));
  const previousDailyAverage = average(recentDaily.filter(item => { const age = Date.now() - new Date(item.date).getTime(); return age > 7 * DAY && age <= 14 * DAY; }));
  const dailyTrend: UserMetric['dailyTrend'] = currentDailyAverage === null || previousDailyAverage === null ? 'none' : currentDailyAverage >= previousDailyAverage + 5 ? 'up' : currentDailyAverage <= previousDailyAverage - 5 ? 'down' : 'steady';
  const lastActivity = [...assignmentActivities.map(item => item.date), ...assignments.map(assignmentDate)].sort().at(-1);
  const dailyLastActivity = activities.map(item => item.date).sort().at(-1);
  const dailyCompleted = tasks.filter(task => task.isCompleted).length;
  const totalAssigned = tasks.length;
  const dailyCompletionRate = totalAssigned ? Math.round((dailyCompleted / totalAssigned) * 100) : 0;
  const liveSeconds = activities.filter(item => item.type === AppView.LIVE).reduce((sum, item) => sum + (item.durationSeconds || 0), 0);
  const shadowingSeconds = activities.filter(item => item.type === AppView.SHADOWING).reduce((sum, item) => sum + (item.durationSeconds || 0), 0);
  const speakingSeconds = liveSeconds + shadowingSeconds;
  const attentionRetake = allAssignments.filter(item => item.status === 'needs_retake' || (item.attempts > 0 && item.target.minScore !== undefined && typeof item.bestScore === 'number' && item.bestScore < item.target.minScore)).length;
  const attentionOverdue = allAssignments.filter(item => item.status === 'expired' || (item.status !== 'completed' && Boolean(item.dueAt) && new Date(item.dueAt as string).getTime() < Date.now())).length;
  const retakeAssignment = allAssignments.find(item => item.status === 'needs_retake' || (item.attempts > 0 && item.target.minScore !== undefined && typeof item.bestScore === 'number' && item.bestScore < item.target.minScore));
  const overdueAssignment = allAssignments.find(item => item.status === 'expired' || (item.status !== 'completed' && Boolean(item.dueAt) && new Date(item.dueAt as string).getTime() < Date.now()));
  const repeatedFailure = allAssignments.find(item => item.status !== 'completed' && item.attempts >= 3);
  const dueSoonNotStarted = allAssignments.find(item => item.status !== 'completed' && !item.readAt && item.attempts === 0 && Boolean(item.dueAt) && new Date(item.dueAt as string).getTime() >= Date.now() && new Date(item.dueAt as string).getTime() - Date.now() <= 2 * DAY);
  const attentionReason = overdueAssignment ? `Terlambat: ${overdueAssignment.title}` : retakeAssignment ? `Perlu retake: ${retakeAssignment.title}` : repeatedFailure ? `Belum lulus setelah ${repeatedFailure.attempts} percobaan: ${repeatedFailure.title}` : dueSoonNotStarted ? `Belum mulai, tenggat mendekat: ${dueSoonNotStarted.title}` : undefined;
  return {
    user, detail, activities, assignmentActivities, assignments, average: assignmentScore, assignmentAverage: assignmentScore,
    assignmentCompleted, assignmentTotal, assignmentCompletionRate, assignmentRetake, assignmentOverdue, attentionRetake, attentionOverdue, assignmentNotStarted, assignmentOnTime, assignmentCompletedWithDue,
    total: scoredAssignments.reduce((sum, item) => sum + (item.bestScore as number), 0), completed: assignmentCompleted, totalTasks: assignmentTotal,
    completionRate: assignmentCompletionRate, dailyTasks, dailyCompleted, dailyCompletionRate, dailyAverage: average(scored), dailyLastActivity, dailyTrend, dailyCategories: dailyCategoryValues,
    liveSeconds, shadowingSeconds, speakingSeconds, lastActivity, trend, attentionReason, categories: categoryValues
  };
};

type ExportCell = string | number | boolean | null | undefined;
type ExportRows = {
  assignmentSummary: ExportCell[][];
  dailySummary: ExportCell[][];
  assignmentActivities: ExportCell[][];
  dailyActivities: ExportCell[][];
  dailyByDate: ExportCell[][];
  assignments: ExportCell[][];
  comments: ExportCell[][];
};

type DashboardRows = {
  scoreBands: ExportCell[][];
  top: ExportCell[][];
  attention: ExportCell[][];
  categories: ExportCell[][];
  daily: ExportCell[][];
};

type ExportChartSpec = {
  title: string;
  seriesTitle: string;
  categories: string[];
  values: number[];
  type: 'bar' | 'line';
  color: string;
  valueMax?: number;
  note: string;
};

const excelColumn = (index: number) => {
  let value = index;
  let label = '';
  while (value > 0) { const remainder = (value - 1) % 26; label = String.fromCharCode(65 + remainder) + label; value = Math.floor((value - 1) / 26); }
  return label;
};

const quotedSheet = (name: string) => `'${name.replace(/'/g, "''")}'`;

const writeExportTable = (
  workbook: ReturnType<typeof createWorkbook>,
  title: string,
  headers: string[],
  rows: ExportCell[][],
  widths: number[],
  tableName: string,
  chartSpec?: ExportChartSpec
) => {
  const worksheet = addWorksheet(workbook, title);
  const tableHeaderRow = 22;
  const tableLastRow = tableHeaderRow + rows.length;
  writeRange(worksheet, 'A1', [[`LOVSPEAK LMS · ${title}`], [chartSpec?.note || 'Data belum cukup untuk membuat grafik yang bermakna.'], [], ['Data lengkap']]);
  writeRange(worksheet, `A${tableHeaderRow}`, [headers, ...rows]);
  setColumnWidths(worksheet, widths);
  setFreezePanes(worksheet, `A${tableHeaderRow + 1}`);
  const lastColumn = excelColumn(headers.length);
  setRangeFont(workbook, worksheet, 'A1', { name: 'Aptos Display', size: 16, bold: true, color: { rgb: 'C7286C' } });
  setRangeFont(workbook, worksheet, 'A2', { name: 'Aptos', size: 10, color: { rgb: '667085' } });
  setRangeBackgroundColor(workbook, worksheet, `A4:${lastColumn}4`, 'FCE7F3');
  setRangeFont(workbook, worksheet, `A4:${lastColumn}4`, { name: 'Aptos', size: 11, bold: true, color: { rgb: '9D174D' } });
  formatAsHeader(workbook, worksheet, `A${tableHeaderRow}:${lastColumn}${tableHeaderRow}`, { fillColor: 'C7286C', fontColor: 'FFFFFF' });
  setRangeWrapText(workbook, worksheet, `A${tableHeaderRow}:${lastColumn}${Math.max(tableHeaderRow, tableLastRow)}`, true);
  setRangeAlignment(workbook, worksheet, `A${tableHeaderRow}:${lastColumn}${Math.max(tableHeaderRow, tableLastRow)}`, { vertical: 'center' });
  if (rows.length) headers.forEach((header, index) => {
    const column = excelColumn(index + 1);
    if (header === 'Penyelesaian' || header === 'Penyelesaian plan aktif') {
      setRangeNumberFormat(workbook, worksheet, `${column}${tableHeaderRow + 1}:${column}${tableLastRow}`, '0%');
    } else if (/Nilai|Reading|Listening|Grammar|Akurasi/.test(header) || header === 'Shadowing') {
      setRangeNumberFormat(workbook, worksheet, `${column}${tableHeaderRow + 1}:${column}${tableLastRow}`, '0');
    }
  });
  if (rows.length) addExcelTable(workbook, worksheet, { name: tableName, ref: `A${tableHeaderRow}:${lastColumn}${tableLastRow}`, columns: headers, style: 'TableStyleMedium2' });

  if (chartSpec?.categories.length && chartSpec.categories.length === chartSpec.values.length) {
    const helperRow = tableLastRow + 3;
    writeRange(worksheet, `A${helperRow}`, [[chartSpec.seriesTitle, 'Nilai'], ...chartSpec.categories.map((category, index) => [category, chartSpec.values[index]])]);
    formatAsHeader(workbook, worksheet, `A${helperRow}:B${helperRow}`, { fillColor: 'F3A6C6', fontColor: '671236' });
    setRangeNumberFormat(workbook, worksheet, `B${helperRow + 1}:B${helperRow + chartSpec.values.length}`, '#,##0');
    const sheetRef = quotedSheet(title);
    const series = chartSeries(makeBarSeries({
      idx: 0,
      tx: { kind: 'literal', value: chartSpec.seriesTitle },
      cat: { ref: `${sheetRef}!$A$${helperRow + 1}:$A$${helperRow + chartSpec.categories.length}`, cacheKind: 'str', cache: chartSpec.categories },
      val: { ref: `${sheetRef}!$B$${helperRow + 1}:$B$${helperRow + chartSpec.values.length}`, cache: chartSpec.values }
    }), chartSpec.color);
    const chart = chartSpec.type === 'line'
      ? makeLineChart({ grouping: 'standard', series: [{ ...series, marker: { symbol: 'circle' as const, size: 5 } }] as never })
      : makeBarChart({ barDir: chartSpec.categories.length > 6 ? 'bar' : 'col', grouping: 'clustered', series: [series] });
    addDashboardChart(worksheet, chart, chartSpec.title, 'A6', 920, 280, chartSpec.valueMax);
  }
  return worksheet;
};

const buildDashboardRows = (metrics: UserMetric[]): DashboardRows => {
  const scoreBands = [
    ['Belum ada nilai', metrics.filter(item => item.average === null).length],
    ['0–59', metrics.filter(item => item.average !== null && item.average < 60).length],
    ['60–74', metrics.filter(item => item.average !== null && item.average >= 60 && item.average < 75).length],
    ['75–89', metrics.filter(item => item.average !== null && item.average >= 75 && item.average < 90).length],
    ['90–100', metrics.filter(item => item.average !== null && item.average >= 90).length]
  ];
  const ranked = metrics.filter(item => item.average !== null).sort((a, b) => (b.average || 0) - (a.average || 0)).slice(0, 10);
  const top = ranked.map(item => [item.user.name, item.average || 0, item.completionRate]);
  const attention = metrics.filter(item => item.attentionReason)
    .sort((a, b) => (a.average ?? -1) - (b.average ?? -1)).slice(0, 10)
    .map(item => [item.user.name, item.average === null ? '—' : item.average, item.attentionReason || '—']);
  const categories = metrics.length === 1
    ? Object.entries(metrics[0].categories).map(([key, value]) => [CATEGORY_LABELS[key] || key, value === null ? '—' : value, value === null ? 'Belum ada data' : 'Nilai rata-rata'])
    : [];
  const dailyMap = new Map<string, { total: number; count: number; users: Set<string> }>();
  metrics.forEach(item => item.assignments.filter(assignment => typeof assignment.bestScore === 'number').forEach(assignment => {
    const date = (assignment.completedAt || assignment.createdAt).slice(0, 10);
    const row = dailyMap.get(date) || { total: 0, count: 0, users: new Set<string>() };
    row.total += assignment.bestScore as number; row.count += 1; row.users.add(item.user.uid); dailyMap.set(date, row);
  }));
  const daily = Array.from(dailyMap.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([date, row]) => [date, Math.round(row.total / row.count), row.users.size]);
  return { scoreBands, top, attention, categories, daily };
};

const addDashboardChart = (worksheet: ReturnType<typeof addWorksheet>, chart: Parameters<typeof makeChartSpace>[0]['plotArea']['chart'], title: string, at: string, widthPx: number, heightPx: number, valMax?: number) => {
  addChartAt(worksheet, at, { space: makeChartSpace({ plotArea: { chart, valAx: { axId: 2, crossAx: 1, ...(valMax ? { scaling: { min: 0, max: valMax }, majorUnit: valMax === 100 ? 20 : undefined } : {}), majorGridlines: true } }, title, legend: { position: 'r' }, spPr: makeShapeProperties({ fill: makeSolidFill(makeColor(makeSrgbColor('FFFFFF'))) }) }) }, { widthPx, heightPx });
};
const chartSeries = (series: ReturnType<typeof makeBarSeries>, color: string) => ({ ...series, spPr: makeShapeProperties({ fill: makeSolidFill(makeColor(makeSrgbColor(color))) }) });

const writeDashboard = (workbook: ReturnType<typeof createWorkbook>, metrics: UserMetric[], periodLabel: string, scopeLabel: string) => {
  const worksheet = addWorksheet(workbook, 'Dashboard', { index: 0 });
  const dashboard = buildDashboardRows(metrics);
  const validScores = metrics.map(item => item.average).filter((value): value is number => value !== null);
  const meanScore = validScores.length ? Math.round(validScores.reduce((sum, value) => sum + value, 0) / validScores.length) : null;
  const completedAssignments = metrics.reduce((sum, item) => sum + item.assignmentCompleted, 0);
  const totalAssignments = metrics.reduce((sum, item) => sum + item.assignmentTotal, 0);
  const onTimeAssignments = metrics.reduce((sum, item) => sum + item.assignmentOnTime, 0);
  const completedWithDue = metrics.reduce((sum, item) => sum + item.assignmentCompletedWithDue, 0);
  const overdueAssignments = metrics.reduce((sum, item) => sum + item.assignmentOverdue, 0);
  const retakeAssignments = metrics.reduce((sum, item) => sum + item.assignmentRetake, 0);
  writeRange(worksheet, 'A1', [
    ['LOVSPEAK LMS · Ringkasan laporan'],
    ['Cakupan', scopeLabel],
    ['Periode', periodLabel],
    [],
    ['Indikator', 'Nilai', 'Keterangan'],
    ['Total user', metrics.length, 'User yang masuk dalam laporan'],
    ['Rata-rata nilai Assignment', meanScore === null ? '—' : meanScore, 'Satu nilai terbaik untuk setiap Assignment yang memiliki nilai'],
    ['Target Assignment tercapai', `${completedAssignments}/${totalAssignments}`, 'Roadmap dan Speaking dihitung sebagai penyelesaian, bukan rata-rata nilai'],
    ['Selesai tepat waktu', completedWithDue ? `${onTimeAssignments}/${completedWithDue}` : '—', 'Hanya Assignment selesai yang memiliki tenggat'],
    ['Assignment terlambat', overdueAssignments, 'Belum selesai dan sudah melewati tenggat'],
    ['Perlu retake', retakeAssignments, 'Sudah mencoba tetapi belum mencapai target']
  ]);
  setRangeBackgroundColor(workbook, worksheet, 'A1:C1', 'FCE7F3');
  setRangeAlignment(workbook, worksheet, 'A1:C11', { vertical: 'center' });
  setRangeWrapText(workbook, worksheet, 'A1:C11', true);
  formatAsHeader(workbook, worksheet, 'A5:C5', { fillColor: 'E9458B', fontColor: 'FFFFFF' });
  setRangeNumberFormat(workbook, worksheet, 'B6:B11', '#,##0');
  setRangeFont(workbook, worksheet, 'A1:C1', { name: 'Aptos Display', size: 16, bold: true, color: { rgb: 'C7286C' } });
  setColumnWidths(worksheet, [24, 20, 42, 24, 20, 20, 24, 20, 24, 16, 16, 16]);
  setFreezePanes(worksheet, 'A5');
  writeRange(worksheet, 'A46', [['Rentang nilai', 'Jumlah user'], ...dashboard.scoreBands]);
  writeRange(worksheet, 'D46', metrics.length === 1
    ? [['Kategori', 'Nilai rata-rata', 'Keterangan'], ...dashboard.categories]
    : [['User dengan nilai Assignment tertinggi', 'Nilai Assignment', 'Penyelesaian Assignment'], ...dashboard.top]);
  writeRange(worksheet, 'G46', [['User perlu perhatian', 'Nilai Assignment', 'Tindak lanjut Assignment'], ...dashboard.attention]);
  writeRange(worksheet, 'J46', [['Tanggal', 'Nilai Assignment', 'User dinilai'], ...dashboard.daily]);
  if (dashboard.scoreBands.length) {
    addExcelTable(workbook, worksheet, { name: 'DashboardScoreBands', ref: `A46:B${46 + dashboard.scoreBands.length}`, columns: ['Rentang nilai', 'Jumlah user'], style: 'TableStyleMedium2' });
    addDashboardChart(worksheet, makeBarChart({ barDir: 'col', grouping: 'clustered', series: [chartSeries(makeBarSeries({ idx: 0, tx: { kind: 'literal', value: 'Jumlah user' }, cat: { ref: `Dashboard!$A$47:$A$51`, cacheKind: 'str', cache: dashboard.scoreBands.map(row => String(row[0])) }, val: { ref: `Dashboard!$B$47:$B$51`, cache: dashboard.scoreBands.map(row => Number(row[1]) || 0) } }), 'E9458B')] }), 'Distribusi nilai Assignment', 'A11', 560, 290);
  }
  if (dashboard.top.length && metrics.length > 1) {
    addExcelTable(workbook, worksheet, { name: 'DashboardTopUsers', ref: `D46:F${46 + dashboard.top.length}`, columns: ['User dengan nilai Assignment tertinggi', 'Nilai Assignment', 'Penyelesaian Assignment'], style: 'TableStyleMedium2' });
    addDashboardChart(worksheet, makeBarChart({ barDir: 'bar', grouping: 'clustered', series: [chartSeries(makeBarSeries({ idx: 0, tx: { kind: 'literal', value: 'Nilai Assignment' }, cat: { ref: `Dashboard!$D$47:$D$${46 + dashboard.top.length}`, cacheKind: 'str', cache: dashboard.top.map(row => String(row[0])) }, val: { ref: `Dashboard!$E$47:$E$${46 + dashboard.top.length}`, cache: dashboard.top.map(row => Number(row[1]) || 0) } }), '4385EE')] }), '10 user dengan nilai Assignment tertinggi', 'G11', 620, 290, 100);
  }
  if (dashboard.categories.length) {
    addExcelTable(workbook, worksheet, { name: 'DashboardCategoryScores', ref: `D46:F${46 + dashboard.categories.length}`, columns: ['Kategori', 'Nilai rata-rata', 'Keterangan'], style: 'TableStyleMedium2' });
    addDashboardChart(worksheet, makeBarChart({ barDir: 'col', grouping: 'clustered', series: [chartSeries(makeBarSeries({ idx: 0, tx: { kind: 'literal', value: 'Nilai rata-rata' }, cat: { ref: `Dashboard!$D$47:$D$${46 + dashboard.categories.length}`, cacheKind: 'str', cache: dashboard.categories.map(row => String(row[0])) }, val: { ref: `Dashboard!$E$47:$E$${46 + dashboard.categories.length}`, cache: dashboard.categories.map(row => Number(row[1]) || 0) } }), '7C5CE5')] }), 'Performa per kategori', 'G11', 620, 290, 100);
  }
  if (dashboard.attention.length) addExcelTable(workbook, worksheet, { name: 'DashboardAttentionUsers', ref: `G46:I${46 + dashboard.attention.length}`, columns: ['User perlu perhatian', 'Nilai Assignment', 'Tindak lanjut Assignment'], style: 'TableStyleMedium2' });
  if (dashboard.daily.length) {
    addExcelTable(workbook, worksheet, { name: 'DashboardAssignmentTrend', ref: `J46:L${46 + dashboard.daily.length}`, columns: ['Tanggal', 'Nilai Assignment', 'User dinilai'], style: 'TableStyleMedium2' });
    const trendSeries = {
      ...chartSeries(makeBarSeries({ idx: 0, tx: { kind: 'literal', value: 'Nilai assignment' }, cat: { ref: `Dashboard!$J$47:$J$${46 + dashboard.daily.length}`, cacheKind: 'str', cache: dashboard.daily.map(row => String(row[0])) }, val: { ref: `Dashboard!$K$47:$K$${46 + dashboard.daily.length}`, cache: dashboard.daily.map(row => Number(row[1]) || 0) } }), 'E9458B'),
      marker: { symbol: 'circle' as const, size: 5 }
    };
    addDashboardChart(worksheet, makeLineChart({ grouping: 'standard', series: [trendSeries] as never }), 'Perkembangan nilai Assignment', 'A28', 1100, 300, 100);
  }
  return worksheet;
};

const assignmentFollowUpLabel = (item: UserMetric) => item.attentionReason || (item.assignmentTotal ? 'Tidak perlu tindak lanjut' : 'Belum ada Assignment');
const assignmentFollowUpTone = (item: UserMetric) => item.attentionReason ? 'attention' : item.assignmentTotal ? 'success' : 'neutral';

const buildExportRows = (metrics: UserMetric[], details: Record<string, AdminUserDetail>, window?: DateWindow): ExportRows => {
  const categoryKeys = [AppView.READING, AppView.LISTENING, AppView.GRAMMAR, AppView.SHADOWING];
  const assignmentSummary = metrics.map((item, index) => [
    metrics.length > 1 ? index + 1 : '—', item.user.name, item.user.email || '', item.user.level || '—',
    item.user.isOnline ? 'Online' : 'Offline', formatLastSeen(item.user.lastSeenAt), item.assignmentAverage === null ? '—' : item.assignmentAverage,
    item.assignmentTotal ? `${item.assignmentCompleted}/${item.assignmentTotal}` : '—', item.assignmentCompletionRate / 100,
    item.assignmentCompletedWithDue ? `${item.assignmentOnTime}/${item.assignmentCompletedWithDue}` : '—', item.assignmentOverdue, item.assignmentRetake, item.assignmentNotStarted,
    ...categoryKeys.map(key => item.categories[key] === null ? '—' : item.categories[key]),
    trendText(item.trend), assignmentFollowUpLabel(item)
  ]);
  const dailySummary = metrics.map(item => [
    item.user.name, item.user.email || '', item.user.level || '—',
    item.dailyTasks.length ? `${item.dailyCompleted}/${item.dailyTasks.length}` : '—', item.dailyCompletionRate / 100,
    item.dailyAverage === null ? '—' : item.dailyAverage,
    ...categoryKeys.map(key => item.dailyCategories[key] === null ? '—' : item.dailyCategories[key]),
    trendText(item.dailyTrend), formatDuration(item.liveSeconds), formatDuration(item.shadowingSeconds), formatDuration(item.speakingSeconds), formatShortDate(item.dailyLastActivity)
  ]);

  const assignmentActivities: ExportCell[][] = [];
  const dailyActivities: ExportCell[][] = [];
  const dailyMap = new Map<string, { user: UserMetric['user']; date: string; total: number; count: number; category: Record<string, { total: number; count: number }> }>();
  const assignments: ExportCell[][] = [];
  const comments: ExportCell[][] = [];
  metrics.forEach(item => {
    const detail = details[item.user.uid];
    const assignmentTitles = new Map((detail?.assignments || []).map(assignment => [assignment.id, assignment.title]));
    const dailyTasks = tasksForPlan(detail?.plan || null);
    const dailyTaskTitles = new Map(dailyTasks.map(task => [task.id, task.title]));
    item.assignmentActivities.forEach(activity => {
      const assignmentId = String(activity.metadata?.assignmentId || '');
      assignmentActivities.push([
        item.user.name, item.user.email || '', formatExportDateTime(activity.date), assignmentId || '—', assignmentTitles.get(assignmentId) || activity.metadata?.assignmentTitle || '—',
        activityName(activity), activity.type, activity.metadata?.title || activity.metadata?.topic || activity.metadata?.theme || '—', activity.details || '',
        typeof activity.score === 'number' ? activity.score : '—', typeof activity.accuracy === 'number' ? activity.accuracy : '—', formatDuration(activity.durationSeconds)
      ]);
    });
    item.activities.forEach(activity => {
      const planTaskId = String(activity.metadata?.planTaskId || activity.metadata?.taskId || '');
      dailyActivities.push([
        item.user.name, item.user.email || '', formatExportDateTime(activity.date), planTaskId || '—', dailyTaskTitles.get(planTaskId) || activity.metadata?.taskTitle || '—',
        activityName(activity), activity.type, activity.metadata?.title || activity.metadata?.topic || activity.metadata?.theme || '—', activity.details || '',
        typeof activity.score === 'number' ? activity.score : '—', typeof activity.accuracy === 'number' ? activity.accuracy : '—', formatDuration(activity.durationSeconds)
      ]);
      if (isScored(activity)) {
        const key = `${item.user.uid}|${activity.date.slice(0, 10)}`;
        const row = dailyMap.get(key) || { user: item.user, date: activity.date.slice(0, 10), total: 0, count: 0, category: {} };
        row.total += activity.score; row.count += 1;
        const category = row.category[activity.type] || { total: 0, count: 0 };
        category.total += activity.score; category.count += 1; row.category[activity.type] = category;
        dailyMap.set(key, row);
      }
    });
    (detail?.assignments || []).filter(assignment => !window || withinPeriod(assignment.createdAt, window)).forEach(assignment => {
      const status = assignmentResultStatus(assignment);
      assignments.push([
        item.user.name, item.user.email || '', assignment.id, assignment.title, ASSIGNMENT_KIND_LABELS[assignment.target.kind] || assignment.target.kind,
        assignment.target.packTitle || assignment.target.title || assignment.target.topic || assignment.target.theme || '—',
        assignment.target.minScore ?? '—', assignment.target.targetDurationSeconds ? formatDuration(assignment.target.targetDurationSeconds) : '—',
        assignment.bestScore ?? '—', assignment.lastScore ?? '—', assignment.bestDurationSeconds ? formatDuration(assignment.bestDurationSeconds) : '—', assignment.lastDurationSeconds ? formatDuration(assignment.lastDurationSeconds) : '—',
        status.label, assignment.progressLabel || status.detail, assignment.attempts || 0,
        formatExportDateTime(assignment.lastAttemptAt), formatExportDateTime(assignment.createdAt), formatExportDateTime(assignment.dueAt), formatExportDateTime(assignment.completedAt),
        assignment.recipientMode === 'all' ? 'Seluruh user' : 'User terpilih'
      ]);
    });
    (detail?.feedback || []).filter(feedback => !window || withinPeriod(feedback.createdAt, window)).forEach(feedback => comments.push([
      item.user.name, item.user.email || '', formatExportDateTime(feedback.createdAt), feedback.authorName,
      feedback.scope === 'task' ? 'Tentang tugas' : 'Umum', feedback.taskTitle || '—', feedback.message, feedback.readAt ? 'Sudah dibaca' : 'Belum dibaca'
    ]));
  });
  assignmentActivities.sort((a, b) => String(b[2]).localeCompare(String(a[2])) || String(a[0]).localeCompare(String(b[0])));
  dailyActivities.sort((a, b) => String(b[2]).localeCompare(String(a[2])) || String(a[0]).localeCompare(String(b[0])));
  assignments.sort((a, b) => String(b[16]).localeCompare(String(a[16])) || String(a[0]).localeCompare(String(b[0])));
  comments.sort((a, b) => String(b[2]).localeCompare(String(a[2])) || String(a[0]).localeCompare(String(b[0])));
  const dailyByDate = Array.from(dailyMap.values()).sort((a, b) => b.date.localeCompare(a.date) || a.user.name.localeCompare(b.user.name)).map(row => [
    row.date, row.user.name, row.user.email || '', Math.round(row.total / row.count),
    ...categoryKeys.map(key => row.category[key] ? Math.round(row.category[key].total / row.category[key].count) : '—'), row.count
  ]);
  return { assignmentSummary, dailySummary, assignmentActivities, dailyActivities, dailyByDate, assignments, comments };
};

const exportChartSpecs = (metrics: UserMetric[], rows: ExportRows) => {
  const limitedUsers = metrics.slice(0, 12);
  const assignmentUsers = limitedUsers.filter(item => item.assignmentAverage !== null);
  const dailyUsers = limitedUsers.filter(item => item.dailyTasks.length > 0 || item.dailyAverage !== null);
  const statusCounts = new Map<string, number>();
  rows.assignments.forEach(row => statusCounts.set(String(row[12]), (statusCounts.get(String(row[12])) || 0) + 1));
  const moduleCounts = new Map<string, number>();
  rows.dailyActivities.forEach(row => moduleCounts.set(String(row[5]), (moduleCounts.get(String(row[5])) || 0) + 1));
  const commentCounts = new Map<string, number>();
  rows.comments.forEach(row => commentCounts.set(String(row[7]), (commentCounts.get(String(row[7])) || 0) + 1));
  const aggregateScoresByDate = (sourceRows: ExportCell[][], dateIndex: number, scoreIndex: number) => {
    const values = new Map<string, { total: number; count: number }>();
    sourceRows.forEach(row => {
      const score = row[scoreIndex];
      if (typeof score !== 'number') return;
      const date = String(row[dateIndex]).slice(0, 10);
      const current = values.get(date) || { total: 0, count: 0 };
      current.total += score; current.count += 1; values.set(date, current);
    });
    return Array.from(values.entries()).sort(([a], [b]) => a.localeCompare(b)).slice(-30)
      .map(([date, value]) => [date, Math.round(value.total / value.count)] as const);
  };
  const assignmentTrend = aggregateScoresByDate(rows.assignmentActivities, 2, 9);
  const dailyTrend = aggregateScoresByDate(rows.dailyByDate, 0, 3);
  const mapChart = (title: string, seriesTitle: string, entries: Array<[string, number]>, type: 'bar' | 'line', color: string, valueMax?: number, note = ''): ExportChartSpec | undefined =>
    entries.length ? { title, seriesTitle, categories: entries.map(([label]) => label), values: entries.map(([, value]) => value), type, color, valueMax, note } : undefined;
  return {
    assignmentSummary: mapChart('Nilai Assignment per user', 'Nilai Assignment', assignmentUsers.map(item => [item.user.name, item.assignmentAverage as number]), 'bar', 'E9458B', 100, 'Perbandingan nilai Assignment untuk user yang memiliki hasil.'),
    dailySummary: mapChart('Penyelesaian Daily Plan per user', 'Penyelesaian (%)', dailyUsers.map(item => [item.user.name, item.dailyCompletionRate]), 'bar', '14A88B', 100, 'Daily Plan adalah konteks aktivitas pribadi dan tidak dipakai sebagai peringkat utama.'),
    assignments: mapChart('Distribusi status Assignment', 'Jumlah Assignment', Array.from(statusCounts.entries()).sort((a, b) => b[1] - a[1]), 'bar', '7C5CE5', undefined, 'Ringkasan jumlah Assignment berdasarkan status terbaru.'),
    assignmentActivities: mapChart('Perkembangan nilai Assignment', 'Nilai rata-rata', assignmentTrend.map(([date, value]) => [date, value]), 'line', 'E9458B', 100, 'Rata-rata nilai aktivitas Assignment per hari untuk periode laporan.'),
    dailyByDate: mapChart('Perkembangan nilai Daily Plan', 'Nilai pribadi rata-rata', dailyTrend.map(([date, value]) => [date, value]), 'line', '14A88B', 100, 'Perkembangan nilai aktivitas Daily Plan per hari.'),
    dailyActivities: mapChart('Aktivitas Daily Plan per modul', 'Jumlah aktivitas', Array.from(moduleCounts.entries()).sort((a, b) => b[1] - a[1]), 'bar', 'F0A020', undefined, 'Jumlah aktivitas Daily Plan berdasarkan modul.'),
    comments: mapChart('Status komentar admin', 'Jumlah komentar', Array.from(commentCounts.entries()).sort((a, b) => b[1] - a[1]), 'bar', '4385EE', undefined, 'Perbandingan komentar yang sudah dan belum dibaca user.')
  };
};

const trendIcon = (trend: UserMetric['trend']) => trend === 'up' ? '↗' : trend === 'down' ? '↘' : trend === 'steady' ? '→' : '—';
const trendText = (trend: UserMetric['trend']) => trend === 'up' ? 'Meningkat' : trend === 'down' ? 'Menurun' : trend === 'steady' ? 'Stabil' : 'Belum cukup data';
const assignmentWriteError = (error: unknown) => {
  const detail = error as { code?: string; message?: string };
  const message = detail?.message || '';
  if (detail?.code === 'permission-denied' || message.toLowerCase().includes('permission')) return 'Pengiriman ditolak oleh aturan akses Firebase. Pastikan aturan terbaru sudah diterapkan dan akun ini masih memiliki akses admin.';
  if (message.includes('Unsupported field value') || message.includes('undefined')) return 'Data tugas belum lengkap. Pilih target tugas lalu coba lagi.';
  if (detail?.code === 'unavailable' || message.toLowerCase().includes('network')) return 'Firebase sedang tidak dapat dijangkau. Periksa koneksi lalu coba lagi.';
  return 'Tugas belum terkirim. Coba lagi; bila tetap gagal, muat ulang halaman admin.';
};

const assignmentResultStatus = (assignment: UserAssignment | null, failedToLoad = false) => {
  if (failedToLoad) return { label: 'Tidak dapat dimuat', detail: 'Coba muat ulang hasil tugas.', tone: 'muted' };
  if (!assignment) return { label: 'Belum tersedia', detail: 'Salinan tugas tidak ditemukan.', tone: 'muted' };
  const target = assignment.target;
  const scoreDetail = typeof assignment.bestScore === 'number'
    ? `Terbaik ${Math.round(assignment.bestScore)}%${typeof assignment.lastScore === 'number' ? ` · terakhir ${Math.round(assignment.lastScore)}%` : ''}${target.minScore !== undefined ? ` · target ${target.minScore}%` : ''}`
    : null;
  const durationDetail = typeof assignment.bestDurationSeconds === 'number'
    ? `Terbaik ${formatDuration(assignment.bestDurationSeconds)}${typeof assignment.lastDurationSeconds === 'number' ? ` · terakhir ${formatDuration(assignment.lastDurationSeconds)}` : ''}${target.targetDurationSeconds ? ` · target ${formatDuration(target.targetDurationSeconds)}` : ''}`
    : null;
  if (assignment.status === 'completed') return { label: target.kind === 'roadmap_pack' ? 'Selesai' : target.kind === 'speaking' ? 'Target tercapai' : 'Lulus', detail: scoreDetail || durationDetail || assignment.progressLabel || 'Target tugas tercapai.', tone: 'passed' };
  const isLate = assignment.status === 'expired' || Boolean(assignment.dueAt && new Date(assignment.dueAt).getTime() < Date.now());
  if (isLate) return { label: assignment.status === 'needs_retake' ? 'Terlambat · retake' : 'Terlambat', detail: scoreDetail || durationDetail || assignment.progressLabel || 'Tenggat terlewati dan target belum tercapai.', tone: 'late' };
  if (assignment.status === 'needs_retake') return { label: 'Perlu retake', detail: scoreDetail || durationDetail || assignment.progressLabel || 'Perlu mengulang tugas.', tone: 'retake' };
  if (scoreDetail || durationDetail) return { label: 'Belum lulus', detail: scoreDetail || durationDetail || 'Target belum tercapai.', tone: 'pending' };
  if (assignment.readAt || assignment.status === 'in_progress') return { label: 'Sedang dikerjakan', detail: assignment.progressLabel || 'Tugas sudah dibuka user.', tone: 'progress' };
  return { label: 'Belum dikerjakan', detail: assignment.progressLabel || 'Belum ada aktivitas pada tugas ini.', tone: 'pending' };
};

const AdminAssignmentsPanel: React.FC<{ users: AdminUser[]; adminUid: string; onMessage: (message: string) => void; mode?: 'assignment' | 'broadcast'; initialRecipientIds?: string[] | null; onConsumePrefill?: () => void }> = ({ users, adminUid, onMessage, mode = 'assignment', initialRecipientIds, onConsumePrefill }) => {
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
  const [roadmapLevel, setRoadmapLevel] = useState('');
  const [grammarLevel, setGrammarLevel] = useState('');
  const [contentMode, setContentMode] = useState<'library' | 'custom'>('library');
  const [contentLevel, setContentLevel] = useState('');
  const [contentThemeId, setContentThemeId] = useState('');
  const [contentItemId, setContentItemId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('');
  const [shadowThemeId, setShadowThemeId] = useState('');
  const [shadowingTaskId, setShadowingTaskId] = useState('');
  const [minScore, setMinScore] = useState('75');
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
  const contentItems = kind === 'reading' ? READING_MANIFEST : kind === 'listening' ? LISTENING_MANIFEST : [];
  const contentLevels = Array.from(new Set(contentItems.map(item => item.level))).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const contentThemeIds = Array.from(new Set(contentItems.filter(item => !contentLevel || item.level === contentLevel).map(item => item.themeId))).sort();
  const selectedContentItem = contentItems.find(item => item.id === contentItemId);
  const themeLabel = (themeId: string) => THEMES.find(item => item.id === themeId)?.name || themeId;
  const visiblePacks = levelPacks.filter(item => !roadmapLevel || item.level === roadmapLevel);
  const visibleGrammarSteps = moduleSteps.filter(step => step.type === 'grammar_lesson' && (!grammarLevel || step.level === grammarLevel));
  const toggleRecipient = (uid: string) => setRecipientIds(current => current.includes(uid) ? current.filter(id => id !== uid) : [...current, uid]);
  const kindLabel: Record<AssignmentKind, string> = { ...ASSIGNMENT_KIND_LABELS, grammar: 'Grammar + kuis', reading: 'Reading tema', listening: 'Listening + kuis', speaking: 'Speaking topik' };
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
      if (kind === 'grammar' && !targetStep) { onMessage('Pilih materi grammar terlebih dahulu.'); return; }
      if (kind === 'shadowing' && !selectedShadowTask) { onMessage('Pilih judul materi Shadowing terlebih dahulu.'); return; }
      if (['reading', 'listening'].includes(kind) && contentMode === 'library' && !selectedContentItem) { onMessage('Pilih level, tema, lalu judul materi terlebih dahulu.'); return; }
      if (['reading', 'listening'].includes(kind) && contentMode === 'custom' && !theme.trim()) { onMessage('Isi tema khusus terlebih dahulu.'); return; }
      if (kind === 'speaking' && !theme.trim()) { onMessage('Isi topik speaking terlebih dahulu.'); return; }
      if (['grammar', 'reading', 'listening', 'shadowing'].includes(kind) && (!minScore || Number(minScore) < 0 || Number(minScore) > 100)) { onMessage('Tentukan nilai minimum antara 0–100 untuk tugas ini.'); return; }
      if (kind === 'speaking' && (!duration || Number(duration) <= 0)) { onMessage('Tentukan target durasi speaking dalam menit.'); return; }
      const targetPreview = kind === 'roadmap_pack' ? targetPack?.title : targetStep?.title || selectedContentItem?.title || selectedShadowTask?.title || theme || '—';
      const duePreview = dueAt ? new Date(dueAt).toLocaleString('id-ID', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : 'tanpa tenggat';
      const preview = `Kirim TUGAS ke ${recipientLabel}?\n\nJudul: ${title.trim() || '(otomatis)'}\nJenis: ${kindLabel[kind]}\nTarget: ${targetPreview}\nTenggat: ${duePreview}${minScore ? `\nNilai minimum: ${minScore}%` : ''}${duration ? `\nTarget durasi: ${duration} menit` : ''}\n\nPastikan penerima dan target sudah benar. Yakin kirim?`;
      if (!window.confirm(preview)) return;
    }
    setSending(true);
    try {
      if (mode === 'broadcast') {
        await createAdminBroadcast({ title, message: broadcastMessage, createdBy: adminUid, recipientIds: ids });
        onMessage(`Broadcast terkirim ke ${ids.length} user.`); setTitle(''); setBroadcastMessage(''); return;
      }
      const moduleViewByKind: Record<Exclude<AssignmentKind, 'roadmap_pack'>, AppView> = {
        grammar: AppView.GRAMMAR,
        reading: AppView.READING,
        listening: AppView.LISTENING,
        speaking: AppView.LIVE,
        shadowing: AppView.SHADOWING
      };
      const target: AssignmentTarget = kind === 'roadmap_pack'
        ? { kind, packId: targetPack?.id, packTitle: targetPack?.title, packStepIds: targetPack?.stepIds, moduleView: AppView.ROADMAP }
        : {
          kind,
          stepId: targetStep?.id,
          targetLessonId: selectedContentItem?.id || targetStep?.targetId,
          shadowingTaskId: kind === 'shadowing' ? selectedShadowTask?.id : undefined,
          title: targetStep?.title || selectedContentItem?.title || selectedShadowTask?.title || theme || title,
          theme: ['reading', 'listening'].includes(kind) ? (selectedContentItem ? themeLabel(selectedContentItem.themeId) : theme) : undefined,
          topic: kind === 'speaking' ? theme : undefined,
          promptContext: targetStep?.promptContext || selectedContentItem?.title || theme || undefined,
          moduleView: targetStep
            ? ({ grammar_lesson: AppView.GRAMMAR, reading_task: AppView.READING, listening_task: AppView.LISTENING, speaking_practice: AppView.LIVE } as Record<string, AppView>)[targetStep.type]
            : moduleViewByKind[kind],
          minScore: minScore ? Number(minScore) : undefined,
          targetDurationSeconds: kind === 'speaking' && duration ? Number(duration) * 60 : undefined,
          requireQuiz: ['grammar', 'listening'].includes(kind)
        };
      await createAdminAssignment({ title: title || `Tugas ${target.packTitle || target.title || target.kind}`, description, target, dueAt: dueAt ? new Date(dueAt).toISOString() : null, createdBy: adminUid, recipientMode, recipientIds: ids });
      onMessage(`Tugas berhasil dibagikan ke ${ids.length} user.`); setTitle(''); setDescription(''); setTargetKey(''); setTheme(''); setRoadmapLevel(''); setGrammarLevel(''); setContentLevel(''); setContentThemeId(''); setContentItemId(''); setShadowThemeId(''); setShadowingTaskId(''); setMinScore(['grammar', 'reading', 'listening', 'shadowing'].includes(kind) ? '75' : ''); setDuration(''); setDueAt('');
    } catch (error) { console.error('Admin assignment write failed:', error); onMessage(assignmentWriteError(error)); }
    finally { setSending(false); }
  };
  return <section className="admin-card admin-table-card">
    <div className="admin-card-head"><div><span className="admin-eyebrow">{mode === 'assignment' ? 'Penugasan terarah' : 'Komunikasi kelas'}</span><h2>{mode === 'assignment' ? 'Buat Assignment baru' : 'Kirim broadcast'}</h2><p>{mode === 'assignment' ? 'Tentukan materi, target keberhasilan, penerima, dan tenggat yang sama agar hasil dapat dibandingkan secara adil.' : 'Sampaikan pengumuman kepada seluruh user atau penerima tertentu tanpa mencampurkannya dengan data penilaian.'}</p></div></div>
    <div className="admin-assignment-form">
      <div className="feedback-controls"><button className={recipientMode === 'all' ? 'active' : ''} onClick={() => setRecipientMode('all')}>Semua user ({users.length})</button><button className={recipientMode === 'selected' ? 'active' : ''} onClick={() => setRecipientMode('selected')}>Pilih user</button></div>
      {recipientMode === 'selected' && <>
        <input className="feedback-select" value={recipientQuery} onChange={event => setRecipientQuery(event.target.value)} placeholder={`Cari nama atau email… (${recipientIds.length} dari ${users.length} terpilih)`} />
        <div className="admin-recipient-grid">{users.filter(item => `${item.name} ${item.email}`.toLowerCase().includes(recipientQuery.toLowerCase())).map(item => <label key={item.uid}><input type="checkbox" checked={recipientIds.includes(item.uid)} onChange={() => toggleRecipient(item.uid)} />{item.name}<small>{item.email || 'tanpa email'}</small></label>)}</div>
      </>}
      <div className="assignment-grid">
        <input className="feedback-select" value={title} onChange={event => setTitle(event.target.value)} placeholder={mode === 'broadcast' ? 'Judul pesan' : 'Judul tugas (opsional)'} />
        {mode === 'assignment' && <select className="feedback-select" value={kind} onChange={event => { const nextKind = event.target.value as AssignmentKind; setKind(nextKind); setTargetKey(''); setRoadmapLevel(''); setGrammarLevel(''); setContentMode('library'); setContentLevel(''); setContentThemeId(''); setContentItemId(''); setTheme(''); setShadowThemeId(''); setShadowingTaskId(''); setMinScore(['grammar', 'reading', 'listening', 'shadowing'].includes(nextKind) ? '75' : ''); setDuration(''); }}><option value="roadmap_pack">Roadmap · satu pack</option><option value="grammar">Grammar · materi + kuis</option><option value="reading">Reading</option><option value="listening">Listening + kuis</option><option value="speaking">Speaking · topik + durasi</option><option value="shadowing">Shadowing · materi + nilai minimum</option></select>}
      </div>
      {mode === 'broadcast' ? <textarea className="feedback-textarea" value={broadcastMessage} onChange={event => setBroadcastMessage(event.target.value)} placeholder="Tulis pesan untuk semua penerima…" /> : <>
        {kind === 'roadmap_pack' && <div className="assignment-grid"><select className="feedback-select" value={roadmapLevel} onChange={event => { setRoadmapLevel(event.target.value); setTargetKey(''); }}><option value="">Semua level roadmap</option>{['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(level => <option key={level} value={level}>{level}</option>)}</select><select className="feedback-select" value={targetKey} onChange={event => setTargetKey(event.target.value)}><option value="">Pilih pack roadmap</option>{visiblePacks.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></div>}
        {kind === 'grammar' && <div className="assignment-grid"><select className="feedback-select" value={grammarLevel} onChange={event => { setGrammarLevel(event.target.value); setTargetKey(''); }}><option value="">Pilih level grammar</option>{['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(level => <option key={level} value={level}>{level}</option>)}</select><select className="feedback-select" value={targetKey} onChange={event => setTargetKey(event.target.value)} disabled={!grammarLevel}><option value="">{grammarLevel ? 'Pilih materi grammar' : 'Pilih level terlebih dahulu'}</option>{visibleGrammarSteps.map(step => <option key={step.id} value={step.id}>{step.title.replace(/^Grammar:\s*/i, '')}</option>)}</select></div>}
        {['reading', 'listening'].includes(kind) && <div className="assignment-target-picker"><div className="assignment-picker-head"><b>Materi {kind === 'reading' ? 'Reading' : 'Listening'}</b><div className="feedback-controls assignment-choice"><button className={contentMode === 'library' ? 'active' : ''} onClick={() => setContentMode('library')}>Pilih dari koleksi</button><button className={contentMode === 'custom' ? 'active' : ''} onClick={() => setContentMode('custom')}>Tema khusus</button></div></div>{contentMode === 'library' ? <div className="assignment-grid assignment-grid-three"><select className="feedback-select" value={contentLevel} onChange={event => { setContentLevel(event.target.value); setContentThemeId(''); setContentItemId(''); }}><option value="">Level</option>{contentLevels.map(level => <option key={level} value={level}>{level}</option>)}</select><select className="feedback-select" value={contentThemeId} onChange={event => { setContentThemeId(event.target.value); setContentItemId(''); }} disabled={!contentLevel}><option value="">{contentLevel ? 'Tema' : 'Pilih level dahulu'}</option>{contentThemeIds.map(themeId => <option key={themeId} value={themeId}>{themeLabel(themeId)}</option>)}</select><select className="feedback-select" value={contentItemId} onChange={event => setContentItemId(event.target.value)} disabled={!contentThemeId}><option value="">{contentThemeId ? 'Judul materi' : 'Pilih tema dahulu'}</option>{contentItems.filter(item => item.level === contentLevel && item.themeId === contentThemeId).map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></div> : <input className="feedback-select" value={theme} onChange={event => setTheme(event.target.value)} placeholder="Tema khusus yang akan dibuat oleh modul" />}</div>}
        {kind === 'shadowing' && <div className="assignment-grid"><select className="feedback-select" value={shadowThemeId} onChange={event => { setShadowThemeId(event.target.value); setShadowingTaskId(''); }}><option value="">Pilih tema Shadowing</option>{SHADOWING_DATA.map(themeItem => <option key={themeItem.id} value={themeItem.id}>{themeItem.title} · {themeItem.subCategory || themeItem.category}</option>)}</select><select className="feedback-select" value={shadowingTaskId} onChange={event => setShadowingTaskId(event.target.value)} disabled={!selectedShadowTheme}><option value="">{selectedShadowTheme ? 'Pilih judul tugas spesifik' : 'Pilih tema terlebih dahulu'}</option>{selectedShadowTheme?.tasks.map(task => <option key={task.id} value={task.id}>{task.title} · {task.difficulty}</option>)}</select></div>}
        {kind === 'speaking' && <input className="feedback-select" value={theme} onChange={event => setTheme(event.target.value)} placeholder="Topik speaking, contoh: memperkenalkan diri" />}
        <div className="assignment-grid">{['grammar', 'reading', 'listening', 'shadowing'].includes(kind) && <input className="feedback-select" type="number" min="0" max="100" value={minScore} onChange={event => setMinScore(event.target.value)} placeholder="Nilai minimum untuk lulus" />}{kind === 'speaking' && <input className="feedback-select" type="number" min="1" value={duration} onChange={event => setDuration(event.target.value)} placeholder="Target durasi menit" />}<input className="feedback-select" type="datetime-local" value={dueAt} onChange={event => setDueAt(event.target.value)} /></div><textarea className="feedback-textarea" value={description} onChange={event => setDescription(event.target.value)} placeholder="Instruksi singkat untuk user (opsional)" />
      </>}
      <button className="feedback-send" disabled={sending} onClick={() => void submit()}>{sending ? 'Mengirim…' : mode === 'broadcast' ? 'Kirim broadcast' : 'Bagikan tugas'}</button>
    </div>
  </section>;
};

const AssignmentResultsModal: React.FC<{
  assignment: AdminAssignmentSummary;
  users: AdminUser[];
  results: AdminAssignmentRecipientResult[];
  loading: boolean;
  onClose: () => void;
}> = ({ assignment, users, results, loading, onClose }) => {
  const [resultFilter, setResultFilter] = useState<'all' | 'passed' | 'action' | 'pending'>('all');
  const [resultSort, setResultSort] = useState<'status' | 'score' | 'name'>('status');
  const counts = useMemo(() => results.reduce((current, result) => {
    const status = assignmentResultStatus(result.assignment, result.error);
    if (status.tone === 'passed') current.passed += 1;
    else if (status.tone === 'retake') current.retake += 1;
    else if (status.tone === 'late') current.late += 1;
    else if (status.label === 'Belum dikerjakan') current.notStarted += 1;
    else if (result.assignment) current.inProgress += 1;
    else current.unavailable += 1;
    return current;
  }, { passed: 0, inProgress: 0, notStarted: 0, retake: 0, late: 0, unavailable: 0 }), [results]);
  const visibleResults = useMemo(() => results.filter(result => {
    const status = assignmentResultStatus(result.assignment, result.error);
    if (resultFilter === 'passed') return status.tone === 'passed';
    if (resultFilter === 'action') return status.tone === 'retake' || status.tone === 'late';
    if (resultFilter === 'pending') return status.tone === 'progress' || status.tone === 'pending';
    return true;
  }).sort((a, b) => {
    if (resultSort === 'score') return (b.assignment?.bestScore ?? -1) - (a.assignment?.bestScore ?? -1);
    if (resultSort === 'name') return (users.find(item => item.uid === a.uid)?.name || '').localeCompare(users.find(item => item.uid === b.uid)?.name || '');
    const rank = (result: AdminAssignmentRecipientResult) => ({ late: 0, retake: 1, pending: 2, progress: 3, passed: 4, muted: 5 }[assignmentResultStatus(result.assignment, result.error).tone] ?? 6);
    return rank(a) - rank(b);
  }), [results, resultFilter, resultSort, users]);
  const pager = usePaged(visibleResults, 12);

  return <div className="assignment-modal-overlay" onMouseDown={onClose} role="presentation">
    <section className="assignment-modal" onMouseDown={event => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Hasil tugas ${assignment.title}`}>
      <header className="assignment-modal-head">
        <div><span className="admin-eyebrow">Hasil tugas</span><h2>{assignment.title}</h2><p>{assignment.target.title || assignment.target.packTitle || assignment.target.topic || assignment.target.theme || assignment.target.kind} · {assignment.recipientCount} penerima · dikirim {formatShortDate(assignment.createdAt)}</p></div>
        <button type="button" className="detail-close" onClick={onClose} title="Tutup hasil"><i className="fas fa-xmark" /></button>
      </header>
      <div className="assignment-modal-targets">
        {assignment.target.minScore !== undefined && <span className="admin-pill"><i className="fas fa-bullseye mr-1" />Target nilai {assignment.target.minScore}%</span>}
        {assignment.target.targetDurationSeconds && <span className="admin-pill"><i className="fas fa-stopwatch mr-1" />Target {formatDuration(assignment.target.targetDurationSeconds)}</span>}
        {assignment.dueAt && <span className="admin-pill"><i className="far fa-calendar mr-1" />Tenggat {formatShortDate(assignment.dueAt)}</span>}
      </div>
      {loading ? <div className="assignment-results-loading"><i className="fas fa-circle-notch fa-spin" /> Memuat hasil {assignment.recipientCount} penerima…</div> : !results.length ? <div className="assignment-results-loading">Belum ada hasil yang dapat ditampilkan.</div> : <>
        <div className="assignment-modal-summary"><span><b>{counts.passed}</b>Target tercapai</span><span><b>{counts.inProgress}</b>Sedang dikerjakan</span><span><b>{counts.notStarted}</b>Belum dikerjakan</span><span><b>{counts.retake}</b>Perlu retake</span><span><b>{counts.late}</b>Terlambat</span>{counts.unavailable > 0 && <span><b>{counts.unavailable}</b>Data tidak tersedia</span>}</div>
        <div className="assignment-result-controls"><select className="admin-filter" value={resultFilter} onChange={event => setResultFilter(event.target.value as typeof resultFilter)}><option value="all">Semua penerima</option><option value="passed">Target tercapai</option><option value="action">Perlu tindakan</option><option value="pending">Belum selesai</option></select><select className="admin-filter" value={resultSort} onChange={event => setResultSort(event.target.value as typeof resultSort)}><option value="status">Prioritaskan masalah</option><option value="score">Nilai tertinggi</option><option value="name">Nama A–Z</option></select></div>
        <div className="assignment-result-table-wrap"><table className="assignment-result-table"><thead><tr><th>User</th><th>Hasil</th><th>Percobaan</th><th>Terakhir</th><th>Status</th></tr></thead><tbody>{pager.visible.map(result => {
          const recipient = users.find(userItem => userItem.uid === result.uid);
          const status = assignmentResultStatus(result.assignment, result.error);
          return <tr key={result.uid}><td><div className="user-cell"><AvatarBubble name={recipient?.name || 'User'} size={30} /><div><b>{recipient?.name || 'User tidak ditemukan'}</b><span>{recipient?.email || result.uid}</span></div></div></td><td>{status.detail}</td><td>{result.assignment?.attempts || 0}</td><td>{formatShortDate(result.assignment?.lastAttemptAt || result.assignment?.completedAt)}</td><td><span className={`assignment-result-status ${status.tone}`}>{status.label}</span></td></tr>;
        })}</tbody></table></div>
        <Pager {...pager} />
      </>}
    </section>
  </div>;
};

const AdminPortal: React.FC<{ user: User; isAdmin: boolean; onLogout: () => Promise<void> }> = ({ user, isAdmin, onLogout }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [details, setDetails] = useState<Record<string, AdminUserDetail>>({});
  const [adminAccess, setAdminAccess] = useState<AdminAccessRecord[]>([]);
  const [period, setPeriod] = useState<Period>('month');
  const [assignmentScope, setAssignmentScope] = useState<'common' | string>('common');
  const [section, setSection] = useState<Section>('overview');
  const [showTour, setShowTour] = useState(false);
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
  const [detailTab, setDetailTab] = useState<DetailTab>('assignment');
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
  const [communicationTab, setCommunicationTab] = useState<'broadcast' | 'comments' | 'history'>('broadcast');
  const [moreOpen, setMoreOpen] = useState(false);
  const [assignmentHistory, setAssignmentHistory] = useState<AdminAssignmentSummary[]>([]);
  const [broadcastHistory, setBroadcastHistory] = useState<AdminBroadcastSummary[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyRange, setHistoryRange] = useState<HistoryRange>('month');
  const [historyDate, setHistoryDate] = useState('');
  const [resultAssignment, setResultAssignment] = useState<AdminAssignmentSummary | null>(null);
  const [migrationBusy, setMigrationBusy] = useState(false);
  const [assignmentResults, setAssignmentResults] = useState<AdminAssignmentRecipientResult[]>([]);
  const [assignmentResultsLoading, setAssignmentResultsLoading] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportUserUids, setExportUserUids] = useState<string[]>([]);
  const [exportUserQuery, setExportUserQuery] = useState('');
  const [exportRange, setExportRange] = useState<ExportRange>('month');
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
  const [exportMode, setExportMode] = useState<ExportMode>('full');
  const [exportBusy, setExportBusy] = useState(false);

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const [assignments, broadcasts] = await Promise.all([listAssignments(), listBroadcasts()]);
      setAssignmentHistory(assignments);
      setBroadcastHistory(broadcasts);
    } catch (error) { console.error(error); setMessage('Riwayat tidak dapat dimuat.'); }
    finally { setHistoryLoading(false); }
  };
  useEffect(() => {
    if ((section === 'assignments' && assignmentTab === 'history') || (section === 'communication' && communicationTab === 'history')) void loadHistory();
  }, [section, assignmentTab, communicationTab]);

  const handleDeleteAssignment = async (item: AdminAssignmentSummary) => {
    if (!window.confirm(`Hapus tugas "${item.title}" beserta salinannya di ${item.recipientCount} user?`)) return;
    const previous = assignmentHistory;
    setAssignmentHistory(current => current.filter(entry => entry.id !== item.id));
    try { await deleteAssignment(item.id, item.recipientIds || []); }
    catch { setAssignmentHistory(previous); setMessage('Tugas tidak dapat dihapus. Coba lagi.'); }
  };
  const openAssignmentResults = async (item: AdminAssignmentSummary) => {
    const recipientIds = item.recipientIds?.length
      ? item.recipientIds
      : item.recipientMode === 'all' ? users.map(userItem => userItem.uid) : [];
    setResultAssignment(item);
    setAssignmentResults([]);
    if (!recipientIds.length) {
      setMessage('Daftar penerima tugas lama ini tidak tersedia.');
      return;
    }
    setAssignmentResultsLoading(true);
    try {
      setAssignmentResults(await getAssignmentRecipientResults(item.id, recipientIds));
    } catch (error) {
      console.error(error);
      setMessage('Hasil tugas tidak dapat dimuat. Coba lagi.');
    } finally { setAssignmentResultsLoading(false); }
  };
  const closeAssignmentResults = () => {
    setResultAssignment(null);
    setAssignmentResults([]);
    setAssignmentResultsLoading(false);
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
  const loadDetailsFor = async (targets: AdminUser[], { force = false }: { force?: boolean } = {}) => {
    const targetsToLoad = force ? targets : targets.filter(item => !details[item.uid]);
    if (!targetsToLoad.length) return;
    setDetailLoading(true);
    try {
      for (let index = 0; index < targetsToLoad.length; index += 8) {
        const batch = targetsToLoad.slice(index, index + 8);
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
    if (!isAdmin) return;
    try {
      const seen = localStorage.getItem(TOUR_KEY_ADMIN);
      if (!seen) {
        const t = window.setTimeout(() => setShowTour(true), 900);
        return () => window.clearTimeout(t);
      }
    } catch { /* ignore */ }
  }, [isAdmin]);
  useEffect(() => {
    (window as any).lovspeakStartAdminTour = () => {
      try { localStorage.removeItem(TOUR_KEY_ADMIN); } catch { /* ignore */ }
      setSection('overview');
      setShowTour(true);
    };
  }, []);
  useEffect(() => {
    // The full user list needs complete metrics for ranking and filters.
    // Keep that heavier load out of the initial overview screen.
    if (isAdmin && ['overview', 'users', 'attention', 'communication'].includes(section) && users.length) void loadDetailsFor(users);
  }, [isAdmin, section, users.length, detailRevision]);
  useEffect(() => {
    if (!isAdmin || !selected) return;
    // Keep the profile being viewed up to date. We intentionally do not watch
    // all users, because a class can have 100 learners and that would make
    // Firebase reads unnecessarily expensive.
    return subscribeToAdminUserActivity(selected.uid, () => {
      void loadDetailsFor([selected], { force: true });
    });
  }, [isAdmin, selected?.uid]);
  useEffect(() => {
    if (!selected || detailTab !== 'comments') return;
    const feedbackItems = details[selected.uid]?.feedback || [];
    if (!feedbackItems.length) return;
    void Promise.all(feedbackItems.map(async item => [item.id, await getReplies(item.id)] as const))
      .then(items => setReplies(Object.fromEntries(items))).catch(console.error);
  }, [selected, detailTab, details]);
  useEffect(() => { setSelected(null); }, [section]);

  const assignmentCatalog = useMemo(() => {
    const unique = new Map<string, UserAssignment>();
    Object.values(details).forEach(detail => (detail.assignments || []).forEach(item => {
      if (withinPeriod(item.createdAt, period) && !unique.has(item.id)) unique.set(item.id, item);
    }));
    return Array.from(unique.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [details, period]);
  useEffect(() => {
    if (assignmentScope !== 'common' && !assignmentCatalog.some(item => item.id === assignmentScope)) setAssignmentScope('common');
  }, [assignmentCatalog, assignmentScope]);
  const metrics = useMemo(() => users.map(item => metricForUser(item, details[item.uid], period, assignmentScope)), [users, details, period, assignmentScope]);
  const attention = useMemo(() => metrics.filter(item => item.attentionReason).sort((a, b) => Number(b.trend === 'down') - Number(a.trend === 'down') || (a.average ?? 101) - (b.average ?? 101)), [metrics]);
  const activeCount = users.filter(item => item.isOnline).length;
  const validScores = metrics.map(item => item.average).filter((value): value is number => value !== null);
  const meanScore = validScores.length ? Math.round(validScores.reduce((sum, value) => sum + value, 0) / validScores.length) : null;
  const assignmentTotal = metrics.reduce((sum, item) => sum + item.assignmentTotal, 0);
  const assignmentFinished = metrics.reduce((sum, item) => sum + item.assignmentCompleted, 0);
  const assignmentOnTime = metrics.reduce((sum, item) => sum + item.assignmentOnTime, 0);
  const assignmentOverdue = metrics.reduce((sum, item) => sum + item.assignmentOverdue, 0);
  const assignmentRetake = metrics.reduce((sum, item) => sum + item.assignmentRetake, 0);
  const assignmentNotStarted = metrics.reduce((sum, item) => sum + item.assignmentNotStarted, 0);
  const assignmentPassRate = assignmentTotal ? Math.round((assignmentFinished / assignmentTotal) * 100) : null;
  const assignmentCompletedWithDue = metrics.reduce((sum, item) => sum + item.assignmentCompletedWithDue, 0);
  const assignmentOnTimeRate = assignmentCompletedWithDue ? Math.round((assignmentOnTime / assignmentCompletedWithDue) * 100) : null;
  const periodLabel = period === 'week' ? '7 hari terakhir' : period === 'month' ? '30 hari terakhir' : 'semua waktu';
  const assignmentScopeLabel = assignmentScope === 'common' ? 'Assignment yang dikirim ke seluruh user' : assignmentCatalog.find(item => item.id === assignmentScope)?.title || 'Assignment terpilih';
  const selectedMetric = selected ? metrics.find(item => item.user.uid === selected.uid) : undefined;
  const selectedDetail = selected ? details[selected.uid] : undefined;
  const selectedActivities = selectedMetric?.activities || [];
  const selectedSpeaking = selectedActivities.filter(isSpeaking);

  const saveTheme = (next: ThemeMode) => { setTheme(next); localStorage.setItem('lovspeak_admin_theme', next); };
  const openExportDialog = () => {
    setExportUserUids(selected?.uid ? [selected.uid] : []);
    setExportUserQuery('');
    setExportRange(period === 'week' ? 'week' : period === 'month' ? 'month' : 'all');
    setExportStartDate(''); setExportEndDate(''); setExportMode('full'); setExportOpen(true);
  };
  const exportReport = async (scope: 'all' | 'selected') => {
    const targetUsers = scope === 'all' ? users : users.filter(item => exportUserUids.includes(item.uid));
    if (!targetUsers.length) { setMessage('Pilih minimal satu user untuk diekspor.'); return; }
    if (exportRange === 'custom' && (!exportStartDate || !exportEndDate || !exportWindow(exportRange, exportStartDate, exportEndDate))) { setMessage('Pilih tanggal mulai dan selesai yang valid.'); return; }
    setExportBusy(true);
    setMessage('Menyiapkan laporan Excel…');
    try {
      const selectedWindow = exportWindow(exportRange, exportStartDate, exportEndDate);
      const selectedPeriodLabel = exportRangeLabel(exportRange, exportStartDate, exportEndDate);
      const freshDetails: Record<string, AdminUserDetail> = {};
      for (let index = 0; index < targetUsers.length; index += 8) {
        const batch = targetUsers.slice(index, index + 8);
        const entries = await Promise.all(batch.map(async target => [target.uid, await getAdminUserDetail(target, ADMIN_REPORT_ACTIVITY_LIMIT)] as const));
        entries.forEach(([uid, detail]) => { freshDetails[uid] = detail; });
      }
      setDetails(current => ({ ...current, ...freshDetails }));
      const exportedMetrics = targetUsers
        .map(target => metricForUser(target, freshDetails[target.uid], selectedWindow || 'all', assignmentScope))
        .sort((a, b) => (b.average ?? -1) - (a.average ?? -1) || b.completionRate - a.completionRate);
      const rows = buildExportRows(exportedMetrics, freshDetails, selectedWindow);
      const charts = exportChartSpecs(exportedMetrics, rows);
      const workbook = createWorkbook();
      const selectedNames = targetUsers.slice(0, 3).map(item => item.name).join(', ');
      const scopeName = scope === 'all'
        ? `Seluruh user (${targetUsers.length})`
        : targetUsers.length === 1
          ? `${targetUsers[0].name} · ${targetUsers[0].email || 'email belum tersedia'}`
          : `${targetUsers.length} user terpilih (${selectedNames}${targetUsers.length > 3 ? ', dan lainnya' : ''})`;
      const scopeLabel = `${scopeName} · Baseline: ${assignmentScopeLabel}`;
      writeDashboard(workbook, exportedMetrics, selectedPeriodLabel, scopeLabel);
      writeExportTable(workbook, 'Ringkasan Assignment',
        ['Peringkat', 'Nama', 'Email', 'Level', 'Status akun', 'Terakhir online', 'Nilai Assignment', 'Target tercapai', 'Penyelesaian', 'Tepat waktu', 'Terlambat', 'Perlu retake', 'Belum dikerjakan', 'Reading', 'Listening', 'Grammar', 'Shadowing', 'Tren Assignment', 'Fokus tindak lanjut'],
        rows.assignmentSummary, [10, 24, 32, 10, 12, 20, 18, 18, 16, 14, 14, 16, 18, 14, 14, 14, 16, 18, 42], 'RingkasanAssignmentTable', charts.assignmentSummary);
      writeExportTable(workbook, 'Ringkasan Daily Plan',
        ['Nama', 'Email', 'Level', 'Task plan aktif', 'Penyelesaian plan aktif', 'Nilai pribadi', 'Reading', 'Listening', 'Grammar', 'Shadowing', 'Tren pribadi', 'Live Practice', 'Durasi Shadowing', 'Total speaking', 'Aktivitas Daily terakhir'],
        rows.dailySummary, [24, 32, 10, 18, 22, 16, 14, 14, 14, 16, 18, 16, 16, 18, 20], 'RingkasanDailyPlanTable', charts.dailySummary);
      if (exportMode === 'full') {
        writeExportTable(workbook, 'Detail Assignment',
          ['Nama', 'Email', 'ID Assignment', 'Judul tugas', 'Jenis', 'Target', 'Nilai minimum', 'Target durasi', 'Nilai terbaik', 'Nilai terakhir', 'Durasi terbaik', 'Durasi terakhir', 'Status', 'Detail progress', 'Percobaan', 'Percobaan terakhir', 'Dikirim', 'Tenggat', 'Selesai pada', 'Penerima'],
          rows.assignments, [24, 32, 28, 32, 18, 42, 16, 16, 16, 16, 16, 16, 20, 36, 12, 22, 22, 22, 22, 18], 'DetailAssignmentTable', charts.assignments);
        writeExportTable(workbook, 'Aktivitas Assignment',
          ['Nama', 'Email', 'Tanggal & waktu', 'ID Assignment', 'Judul Assignment', 'Modul', 'Kode modul', 'Materi / target', 'Detail / jawaban', 'Nilai', 'Akurasi', 'Durasi'],
          rows.assignmentActivities, [24, 32, 24, 28, 32, 16, 16, 36, 60, 12, 12, 16], 'AktivitasAssignmentTable', charts.assignmentActivities);
        writeExportTable(workbook, 'Rekap Daily per Hari',
          ['Tanggal', 'Nama', 'Email', 'Nilai pribadi', 'Reading', 'Listening', 'Grammar', 'Shadowing', 'Jumlah aktivitas Daily Plan'],
          rows.dailyByDate, [14, 24, 32, 18, 12, 12, 12, 12, 18], 'RekapDailyPerHariTable', charts.dailyByDate);
        writeExportTable(workbook, 'Aktivitas Daily Plan',
          ['Nama', 'Email', 'Tanggal & waktu', 'ID Task Daily', 'Judul Task Daily', 'Modul', 'Kode modul', 'Materi / target', 'Detail / jawaban', 'Nilai', 'Akurasi', 'Durasi'],
          rows.dailyActivities, [24, 32, 24, 28, 32, 16, 16, 36, 60, 12, 12, 16], 'AktivitasDailyPlanTable', charts.dailyActivities);
        writeExportTable(workbook, 'Komentar',
          ['Nama', 'Email', 'Tanggal', 'Dari admin', 'Jenis', 'Task', 'Komentar', 'Status dibaca'],
          rows.comments, [24, 32, 22, 24, 18, 28, 70, 18], 'KomentarTable', charts.comments);
      }
      const periodName = exportRange === 'today' ? 'hari-ini' : exportRange === 'week' ? '7-hari' : exportRange === 'month' ? '30-hari' : exportRange === 'calendar-month' ? 'bulan-berjalan' : exportRange === 'custom' ? `${exportStartDate}-sampai-${exportEndDate}` : 'semua-waktu';
      const name = scope === 'all' ? 'semua-user' : targetUsers.length > 1 ? `${targetUsers.length}-user-terpilih` : (targetUsers[0].name || 'user').toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
      const bytes = await workbookToBytes(workbook);
      const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `lovspeak-laporan-${name}-${periodName}-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setExportOpen(false);
      setMessage(`Laporan Excel ${exportMode === 'full' ? 'lengkap' : 'ringkas'} selesai dibuat untuk ${targetUsers.length} user.`);
    } catch (error) {
      console.error(error);
      setMessage('Laporan belum dapat dibuat. Pastikan koneksi Firebase tersedia lalu coba lagi.');
    } finally { setExportBusy(false); }
  };
  const exportCandidates = users.slice().sort((a, b) => a.name.localeCompare(b.name));
  const selectedExportUsers = users.filter(item => exportUserUids.includes(item.uid));
  const matchingExportUsers = exportCandidates.filter(item => `${item.name} ${item.email}`.toLowerCase().includes(exportUserQuery.toLowerCase()));
  const filteredExportUsers = matchingExportUsers.slice(0, 14);
  const toggleExportUser = (uid: string) => setExportUserUids(current => current.includes(uid) ? current.filter(item => item !== uid) : [...current, uid]);
  const openUser = (target: AdminUser, tab: DetailTab = 'assignment') => {
    setSelected(target); setDetailTab(tab); setFeedback(''); setTaskId('');
    // Do not trust an older empty cache when an admin opens a learner profile.
    void loadDetailsFor([target], { force: true });
  };
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [submittingReplyId, setSubmittingReplyId] = useState<string | null>(null);
  const [accessBusy, setAccessBusy] = useState(false);
  const refreshAccess = async () => {
    try { setAdminAccess(await getAdminAccess()); } catch (error) { console.error(error); }
  };
  const submitFeedback = async () => {
    if (submittingFeedback || !selected || !feedback.trim()) return;
    const dailyTask = tasksForPlan(selectedDetail?.plan || null).find(item => item.id === taskId);
    const assignment = (selectedDetail?.assignments || []).find(item => item.id === taskId);
    const task = assignment ? { id: assignment.id, title: assignment.title } : dailyTask;
    if (feedbackScope === 'task' && !task) { setMessage('Pilih tugas terlebih dahulu sebelum mengirim komentar tentang tugas.'); return; }
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
  const migrateLegacyLearningData = async () => {
    const sourceUid = 'Cb4MsGdrViei3RDnAzLBROFJBuD3';
    const targetUid = 'bl4NDEMYt0f5qJ7FAd6jKMfBjeK2';
    if (migrationBusy || !window.confirm('Salin activity dan progress dari Lovelya Trial ke akun Syarief? Data sumber tidak akan dihapus.')) return;
    setMigrationBusy(true);
    try {
      const result = await migrateLearningData(sourceUid, targetUid);
      setMessage(`Migrasi selesai: ${result.copied} dokumen disalin ke akun Syarief. Data sumber tetap aman.`);
      setDetails(current => { const next = { ...current }; delete next[targetUid]; return next; });
      setDetailRevision(value => value + 1);
      await refresh({ resetDetails: true });
    } catch (error) {
      console.error(error);
      setMessage('Migrasi belum berhasil. Pastikan Anda login sebagai admin dan rules Firebase terbaru sudah aktif.');
    } finally { setMigrationBusy(false); }
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
    setAssignmentTab('compose');
    setSection('assignments');
  };
  const printUserReport = async (target: AdminUser) => {
    const win = window.open('', '_blank', 'width=900,height=1100');
    if (!win) { setMessage('Popup diblokir browser. Izinkan popup untuk mencetak rapor.'); return; }
    win.document.open();
    win.document.write('<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Menyiapkan laporan…</title></head><body style="font-family:system-ui;padding:40px;color:#65718a">Menyiapkan laporan lengkap…</body></html>');
    win.document.close();
    let targetDetail: AdminUserDetail;
    try {
      targetDetail = await getAdminUserDetail(target, ADMIN_REPORT_ACTIVITY_LIMIT);
      setDetails(current => ({ ...current, [target.uid]: targetDetail }));
    } catch (error) {
      console.error(error);
      win.close();
      setMessage('Data rapor belum dapat dimuat. Periksa koneksi Firebase lalu coba lagi.');
      return;
    }
    const targetMetric = metricForUser(target, targetDetail, period, assignmentScope);
    const scoresByCategory = Object.entries(targetMetric.categories).map(([type, value]) => ({ label: CATEGORY_LABELS[type] || type, value }));
    const assignmentScores = targetMetric.assignments.filter(item => typeof item.bestScore === 'number')
      .sort((a, b) => (a.completedAt || a.createdAt).localeCompare(b.completedAt || b.createdAt)).slice(-14)
      .map(item => ({ date: item.completedAt || item.createdAt, score: Math.round(item.bestScore as number) }));
    const assignments = (targetDetail?.assignments || [])
      .filter(item => withinPeriod(item.createdAt, period))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const assignmentsNeedingAction = assignments.filter(item => item.status === 'needs_retake' || item.status === 'expired' || (item.status !== 'completed' && item.dueAt && new Date(item.dueAt).getTime() < Date.now()) || (item.status !== 'completed' && item.attempts >= 3)).length;
    const dailyActivities = targetMetric.activities.slice().sort((a, b) => b.date.localeCompare(a.date));
    const dailyTasks = targetMetric.dailyTasks;
    const feedback = (targetDetail?.feedback || []).filter(item => withinPeriod(item.createdAt, period));
    const esc = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
    const barChart = assignmentScores.length ? `<div class="chart">${assignmentScores.map(point => `<div class="col"><span class="val">${point.score}%</span><i style="height:${Math.max(6, point.score)}%"></i><span class="lbl">${formatShortDate(point.date)}</span></div>`).join('')}</div>` : '<p class="muted">Belum ada nilai Assignment untuk periode ini.</p>';
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
      .lane{display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border-radius:12px;margin:20px 0 12px}.lane b{display:block;font-size:12px}.lane span{display:block;font-size:10px;margin-top:3px;line-height:1.5}.lane.primary{background:#fff0f6;color:#9f2458;border:1px solid #f9c9dc}.lane.support{background:#f3f6fb;color:#4f607d;border:1px solid #e1e7f0}.support-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:10px 0 16px}.support-summary div{background:#f7f8fb;border:1px solid #e7eaf0;border-radius:10px;padding:10px}.support-summary b{font-size:15px;display:block}.support-summary span{font-size:8px;color:#65718a;text-transform:uppercase;letter-spacing:.06em}.muted{color:#65718a;font-size:11px;font-style:italic}.section-note{color:#65718a;font-size:10px;line-height:1.5;margin:-5px 0 10px}.page-break{break-before:page}
      .footer{margin-top:40px;padding-top:12px;border-top:1px solid #e7eaf0;display:flex;justify-content:space-between;font-size:10px;color:#65718a}
      .print{position:fixed;top:14px;right:14px;background:#e9458b;color:#fff;border:0;padding:10px 18px;border-radius:12px;font-weight:800;cursor:pointer;box-shadow:0 6px 16px rgba(233,69,139,.35)}@media print{.print{display:none}body{padding:20px 30px}.page-break{break-before:page}}
    </style></head><body>
      <button class="print" onclick="window.print()">🖨️ Cetak / Simpan PDF</button>
      <div class="header"><div class="logo">LOVSPEAK<small>LAPORAN ASSIGNMENT USER</small></div><div class="meta">Dicetak: ${new Date().toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}<br/>Periode: ${periodLabel}<br/>Baseline: ${esc(assignmentScopeLabel)}</div></div>
      <h1>${esc(target.name)}</h1>
      <p class="subline">${esc(target.email || 'Email belum tersedia')} · Level ${esc(target.level || 'belum dipilih')} · Aktif ${formatLastSeen(target.lastSeenAt)}</p>
      <div class="lane primary"><div>◆</div><div><b>Assignment Admin · data penilaian utama</b><span>Ringkasan nilai dan status mengikuti baseline ${esc(assignmentScopeLabel)} agar perbandingan antar-user tetap adil.</span></div></div>
      <div class="summary">
        <div class="stat"><b>${targetMetric.assignmentAverage === null ? '—' : `${targetMetric.assignmentAverage}%`}</b><span>Nilai Assignment</span></div>
        <div class="stat"><b>${targetMetric.assignmentCompleted}/${targetMetric.assignmentTotal}</b><span>Target tercapai</span></div>
        <div class="stat"><b>${targetMetric.assignmentOnTime}</b><span>Selesai tepat waktu</span></div>
        <div class="stat"><b>${assignmentsNeedingAction}</b><span>Perlu tindakan</span></div>
      </div>
      <h2>Nilai Assignment Admin per modul</h2>
      <div class="categories">${scoresByCategory.map(item => `<div><b>${item.value === null ? '—' : `${item.value}%`}</b><span>${esc(item.label)}</span></div>`).join('')}</div>
      <h2>Perkembangan nilai Assignment (14 hasil terakhir)</h2>
      ${barChart}
      <h2>Riwayat Assignment Admin (${assignments.length})</h2>
      <p class="section-note">Ringkasan di atas mengikuti baseline terpilih. Tabel ini menampilkan seluruh Assignment Admin yang dikirim pada periode laporan.</p>
      ${assignments.length ? `<table><thead><tr><th>Judul</th><th>Jenis</th><th>Target</th><th>Status</th><th>Hasil</th><th>Percobaan</th><th>Tenggat</th></tr></thead><tbody>${assignments.slice(0, 30).map(item => { const status = assignmentResultStatus(item); const targetText = item.target.minScore !== undefined ? `Nilai ≥ ${item.target.minScore}%` : item.target.targetDurationSeconds ? `Durasi ${formatDuration(item.target.targetDurationSeconds)}` : 'Selesaikan'; const resultText = typeof item.bestScore === 'number' ? `Terbaik ${Math.round(item.bestScore)}%${typeof item.lastScore === 'number' ? ` · terakhir ${Math.round(item.lastScore)}%` : ''}` : typeof item.bestDurationSeconds === 'number' ? `Terbaik ${formatDuration(item.bestDurationSeconds)}` : '—'; return `<tr><td>${esc(item.title)}</td><td>${esc(ASSIGNMENT_KIND_LABELS[item.target.kind] || item.target.kind)}</td><td>${esc(targetText)}</td><td>${esc(status.label)}</td><td>${esc(resultText)}</td><td>${item.attempts || 0}</td><td>${item.dueAt ? esc(formatShortDate(item.dueAt)) : '—'}</td></tr>`; }).join('')}</tbody></table>` : '<p class="muted">Belum ada tugas dari admin pada periode ini.</p>'}
      <div class="page-break"></div>
      <div class="lane support"><div>◇</div><div><b>Daily Plan · data aktivitas pendukung</b><span>Menunjukkan perkembangan rencana pribadi user. Data ini tidak dipakai untuk peringkat, nilai utama, atau status perlu perhatian.</span></div></div>
      <div class="support-summary">
        <div><b>${targetMetric.dailyCompleted}/${dailyTasks.length}</b><span>Task plan aktif</span></div>
        <div><b>${targetMetric.dailyAverage === null ? '—' : `${targetMetric.dailyAverage}%`}</b><span>Nilai pribadi</span></div>
        <div><b>${formatDuration(targetMetric.speakingSeconds)}</b><span>Total speaking</span></div>
        <div><b>${formatShortDate(targetMetric.dailyLastActivity)}</b><span>Aktivitas terakhir</span></div>
      </div>
      <h2>Rencana aktif (${dailyTasks.length})</h2>
      ${dailyTasks.length ? `<table><thead><tr><th>Task Daily Plan</th><th>Modul</th><th>Status plan aktif</th></tr></thead><tbody>${dailyTasks.map(item => `<tr><td>${esc(item.title)}</td><td>${esc(CATEGORY_LABELS[item.moduleView] || item.moduleView)}</td><td>${item.isCompleted ? 'Selesai' : 'Belum selesai'}</td></tr>`).join('')}</tbody></table>` : '<p class="muted">User belum memiliki Daily Plan aktif.</p>'}
      <h2>Aktivitas Daily Plan terbaru (${dailyActivities.length})</h2>
      ${dailyActivities.length ? `<table><thead><tr><th>Tanggal</th><th>Modul</th><th>Materi / detail</th><th>Nilai</th><th>Durasi</th></tr></thead><tbody>${dailyActivities.slice(0, 30).map(item => `<tr><td>${esc(formatShortDate(item.date))}</td><td>${esc(activityName(item))}</td><td>${esc(item.metadata?.title || item.metadata?.topic || item.details || '—')}</td><td>${typeof item.score === 'number' ? `${Math.round(item.score)}%` : '—'}</td><td>${esc(formatDuration(item.durationSeconds))}</td></tr>`).join('')}</tbody></table>` : '<p class="muted">Belum ada aktivitas Daily Plan pada periode ini.</p>'}
      <p class="section-note">Aktivitas modul manual dan Roadmap yang dibuka mandiri tidak disertakan dalam laporan admin.</p>
      <h2>Catatan dari admin (${feedback.length})</h2>
      ${feedback.length ? feedback.slice(0, 10).map(item => `<div style="border-left:3px solid #e9458b;padding:6px 12px;margin:8px 0;background:#fff0f6;border-radius:0 8px 8px 0"><b style="font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#c7286c">${item.scope === 'task' ? `Tugas · ${esc(item.taskTitle || 'Umum')}` : 'Komentar umum'}</b> <span style="font-size:10px;color:#65718a">${formatShortDate(item.createdAt)}</span><p style="margin:4px 0 0;font-size:12px;white-space:pre-wrap">${esc(item.message)}</p></div>`).join('') : '<p class="muted">Belum ada catatan dari admin.</p>'}
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
  const assignmentHistoryItems = useMemo(() => assignmentHistory
    .filter(item => matchesHistoryRange(item.createdAt || '', historyRange, historyDate))
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')), [assignmentHistory, historyRange, historyDate]);
  const broadcastHistoryItems = useMemo(() => broadcastHistory
    .filter(item => matchesHistoryRange(item.createdAt || '', historyRange, historyDate))
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')), [broadcastHistory, historyRange, historyDate]);
  const attentionPager = usePaged(attention);
  const commentsPager = usePaged(commentUsers);
  const assignmentHistoryPager = usePaged(assignmentHistoryItems);
  const broadcastHistoryPager = usePaged(broadcastHistoryItems);
  const accessPager = usePaged(adminAccess);
  const resetPagers = [attentionPager.setPage, commentsPager.setPage, assignmentHistoryPager.setPage, broadcastHistoryPager.setPage, accessPager.setPage];
  useEffect(() => { resetPagers.forEach(reset => reset(1)); }, [section, historyRange, historyDate]);

  const navItems: { id: Section; icon: string; label: string; count?: number }[] = [
    { id: 'overview', icon: 'fa-grid-2', label: 'Overview' }, { id: 'users', icon: 'fa-users', label: 'Semua User', count: users.length },
    { id: 'attention', icon: 'fa-triangle-exclamation', label: 'Perlu Perhatian', count: attention.length }, { id: 'assignments', icon: 'fa-clipboard-check', label: 'Tugas & Hasil' }, { id: 'communication', icon: 'fa-comments', label: 'Komunikasi' },
    { id: 'access', icon: 'fa-shield-halved', label: 'Akses Admin', count: adminAccess.length + 1 }
  ];

  return <div className={`admin-root admin-${theme}`}>
    <style>{`
      .admin-root{--accent:#e9458b;--accent-2:#ff7fb0;--accent-soft:#fff0f6;--accent-strong:#c7286c;--page:#f7f8fb;--panel:#fff;--subtle:#f4f6fa;--text:#172033;--muted:#65718a;--line:#e7eaf0;--shadow:0 10px 28px rgba(22,32,51,.06);--shadow-hover:0 20px 40px rgba(233,69,139,.12);min-height:100vh;background:radial-gradient(1200px 500px at 10% -10%,rgba(233,69,139,.06),transparent 60%),radial-gradient(900px 400px at 100% 0%,rgba(157,107,255,.05),transparent 60%),var(--page);color:var(--text);font-family:inherit}.admin-dark{--page:#0e1119;--panel:#181d28;--subtle:#212735;--text:#f4f6fb;--muted:#aab3c5;--line:#2b3343;--shadow:0 12px 30px rgba(0,0,0,.32);--shadow-hover:0 20px 40px rgba(233,69,139,.22);--accent-soft:#4a2436}.admin-dark.admin-root{background:radial-gradient(1200px 500px at 10% -10%,rgba(233,69,139,.12),transparent 60%),radial-gradient(900px 400px at 100% 0%,rgba(157,107,255,.08),transparent 60%),var(--page)}.admin-layout{max-width:1440px;margin:auto;min-height:100vh;display:grid;grid-template-columns:232px minmax(0,1fr)}.admin-side{padding:24px 16px;border-right:1px solid var(--line);display:flex;flex-direction:column;gap:24px}.admin-brand{display:flex;gap:10px;align-items:center;padding:4px 8px}.admin-brand-mark{width:35px;height:35px;border-radius:12px;background:linear-gradient(135deg,var(--accent),#9d6bff);color:white;display:grid;place-items:center;box-shadow:0 8px 18px color-mix(in srgb,var(--accent) 28%,transparent)}.admin-brand b{font-size:15px}.admin-brand span{display:block;color:var(--muted);font-size:10px;margin-top:2px}.admin-nav{display:grid;gap:5px}.admin-nav button{width:100%;border:0;background:transparent;color:var(--muted);text-align:left;padding:11px 12px;border-radius:12px;font-weight:700;font-size:13px;display:flex;align-items:center;gap:11px;cursor:pointer}.admin-nav button:hover{background:var(--subtle);color:var(--text)}.admin-nav button.active{background:var(--accent-soft);color:var(--accent-strong)}.admin-nav .count{margin-left:auto;background:color-mix(in srgb,var(--accent) 12%,transparent);font-size:10px;padding:2px 7px;border-radius:100px}.admin-side-bottom{margin-top:auto}.admin-return{border:1px solid var(--line);background:var(--panel);color:var(--text);width:100%;padding:11px;border-radius:12px;font:inherit;font-size:12px;font-weight:700;cursor:pointer}.admin-main{min-width:0;padding:26px 32px 40px}.admin-top{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:27px}.admin-eyebrow{font-size:11px;letter-spacing:.13em;text-transform:uppercase;color:var(--accent-strong);font-weight:800}.admin-top h1{font-size:27px;line-height:1.1;margin:5px 0 0;font-weight:900;letter-spacing:-.035em}.admin-top p{margin:6px 0 0;font-size:13px;color:var(--muted)}.admin-tools{display:flex;align-items:center;gap:8px}.admin-icon-button,.admin-tools select{height:38px;border:1px solid var(--line);background:var(--panel);color:var(--text);border-radius:10px;padding:0 11px;font:inherit;font-size:12px;cursor:pointer}.admin-icon-button{width:38px;padding:0}.admin-card{background:var(--panel);border:1px solid var(--line);border-radius:18px;box-shadow:var(--shadow)}.admin-alert{padding:12px 15px;background:#fff7e6;color:#946200;border:1px solid #f6dfab;border-radius:12px;font-size:13px;margin-bottom:16px}.admin-dark .admin-alert{background:#3c3019;color:#f6d17a;border-color:#5c4a26}.admin-kpi-explainer{display:flex;align-items:flex-start;gap:8px;margin:-4px 0 12px;padding:10px 12px;border:1px solid color-mix(in srgb,var(--accent) 18%,var(--line));border-radius:11px;background:color-mix(in srgb,var(--accent-soft) 55%,var(--panel));color:var(--muted);font-size:10.5px;line-height:1.5}.admin-kpi-explainer i{color:var(--accent-strong);margin-top:2px}.admin-kpi-explainer b{color:var(--text)}.admin-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px}.admin-kpi{padding:17px}.admin-kpi-icon{height:30px;width:30px;border-radius:10px;background:var(--accent-soft);color:var(--accent-strong);display:grid;place-items:center;font-size:12px}.admin-kpi .value{font-size:23px;line-height:1;margin-top:17px;font-weight:900;letter-spacing:-.04em}.admin-kpi .label{font-size:11px;color:var(--muted);font-weight:700;margin-top:7px}.admin-overview-grid{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(290px,.8fr);gap:18px}.admin-card-head{padding:20px 20px 0;display:flex;justify-content:space-between;gap:12px}.admin-card-head h2{font-size:16px;margin:5px 0 0;letter-spacing:-.02em}.admin-card-head p{font-size:12px;color:var(--muted);margin:5px 0 0}.admin-period{display:flex;gap:4px;padding:3px;border:1px solid var(--line);background:var(--subtle);border-radius:10px;height:max-content}.admin-period button{padding:6px 8px;border:0;background:transparent;border-radius:7px;color:var(--muted);font-size:11px;font-weight:700;cursor:pointer}.admin-period button.active{color:white;background:var(--accent)}.performance-map{height:350px;position:relative;margin:23px 20px 20px;border-left:1px solid var(--line);border-bottom:1px solid var(--line);background-image:linear-gradient(to right,var(--line) 1px,transparent 1px),linear-gradient(to bottom,var(--line) 1px,transparent 1px);background-size:25% 25%;border-radius:0 0 0 13px}.map-axis-y{position:absolute;left:-30px;top:45%;transform:rotate(-90deg);font-size:10px;color:var(--muted);white-space:nowrap}.map-axis-x{position:absolute;right:0;bottom:-25px;font-size:10px;color:var(--muted)}.map-zone{position:absolute;font-size:10px;color:var(--muted);opacity:.85}.map-dot{position:absolute;width:11px;height:11px;border:2px solid var(--panel);border-radius:50%;transform:translate(-50%,50%);cursor:pointer;box-shadow:0 2px 5px rgba(0,0,0,.15);padding:0}.map-dot:hover,.map-dot.selected{outline:3px solid color-mix(in srgb,var(--accent) 28%,transparent);z-index:3;transform:translate(-50%,50%) scale(1.25)}.map-dot.up{background:#22a986}.map-dot.steady{background:#4385ee}.map-dot.down{background:#e66262}.map-dot.none{background:#a4adbd}.map-legend{display:flex;flex-wrap:wrap;gap:11px;padding:0 20px 19px;font-size:11px;color:var(--muted)}.map-legend span{display:flex;align-items:center;gap:5px}.map-legend i{height:8px;width:8px;border-radius:50%;display:inline-block}.attention-list{padding:10px 14px 15px}.attention-row{width:100%;display:flex;align-items:center;gap:10px;border:0;border-bottom:1px solid var(--line);background:transparent;color:var(--text);padding:13px 6px;text-align:left;cursor:pointer}.attention-row:last-child{border-bottom:0}.attention-avatar,.user-avatar{display:grid;place-items:center;border-radius:50%;font-weight:900;background:var(--accent-soft);color:var(--accent-strong);flex:0 0 auto}.attention-avatar{width:31px;height:31px;font-size:11px}.attention-row b{font-size:12px;display:block}.attention-row small{font-size:10px;color:var(--muted);display:block;margin-top:3px}.attention-score{margin-left:auto;font-size:12px;font-weight:900}.admin-empty{padding:34px 20px;color:var(--muted);font-size:13px;text-align:center}.admin-table-card{margin-top:18px}.admin-table-toolbar{padding:18px 20px;display:flex;align-items:center;gap:10px;justify-content:space-between}.admin-search{height:38px;max-width:315px;width:100%;border:1px solid var(--line);color:var(--text);background:var(--subtle);padding:0 12px;border-radius:10px;outline:none;font:inherit;font-size:12px}.admin-table-wrap{overflow:auto}.admin-table{width:100%;border-collapse:collapse;font-size:12px;min-width:760px}.admin-table th{font-weight:800;text-align:left;color:var(--muted);font-size:10px;letter-spacing:.06em;text-transform:uppercase;padding:11px 20px;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.admin-table td{padding:13px 20px;border-bottom:1px solid var(--line)}.admin-table tbody tr{cursor:pointer}.admin-table tbody tr:hover{background:var(--subtle)}.user-cell{display:flex;align-items:center;gap:10px}.user-avatar{width:32px;height:32px;font-size:11px}.user-cell b{display:block}.user-cell span{font-size:10px;color:var(--muted);display:block;margin-top:3px}.status-dot{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:5px}.status-online{background:#22a986}.status-offline{background:#a4adbd}.metric-trend{font-weight:800}.metric-trend.up{color:#149978}.metric-trend.down{color:#d94d54}.metric-trend.steady{color:#4385ee}.metric-trend.none{color:var(--muted)}.admin-pill{font-size:10px;font-weight:800;padding:5px 8px;border-radius:99px;background:var(--subtle);color:var(--muted)}.admin-panel-overlay{position:fixed;inset:0;background:rgba(13,18,29,.32);z-index:50}.admin-detail{position:absolute;right:0;top:0;height:100%;width:min(560px,100%);background:var(--panel);border-left:1px solid var(--line);overflow-y:auto;padding:26px}.detail-head{display:flex;justify-content:space-between;gap:16px}.detail-head h2{font-size:23px;margin:6px 0 0;letter-spacing:-.04em}.detail-close{border:0;background:var(--subtle);color:var(--muted);height:34px;width:34px;border-radius:10px;cursor:pointer}.detail-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:20px 0}.detail-stat{background:var(--subtle);padding:11px;border-radius:12px}.detail-stat b{font-size:15px;display:block}.detail-stat span{font-size:9px;color:var(--muted);font-weight:700;display:block;margin-top:5px}.detail-section{border-top:1px solid var(--line);padding:19px 0}.detail-section h3{font-size:13px;margin:0 0 12px}.category-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.category-item{padding:10px;border-radius:11px;background:var(--subtle)}.category-item span{display:block;font-size:10px;color:var(--muted)}.category-item b{display:block;font-size:16px;margin-top:5px}.mini-bars{height:130px;display:flex;align-items:end;gap:6px;border-bottom:1px solid var(--line);padding:0 2px}.mini-bar{flex:1;min-width:7px;display:flex;align-items:end;height:100%;background:transparent;border:0;padding:0;cursor:default}.mini-bar i{width:100%;background:var(--accent);border-radius:6px 6px 2px 2px;display:block}.mini-labels{display:flex;gap:6px;margin-top:5px}.mini-labels span{flex:1;min-width:7px;font-size:8px;color:var(--muted);white-space:nowrap;overflow:hidden}.feedback-controls{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px}.feedback-controls button,.feedback-send{border:0;background:var(--subtle);color:var(--muted);border-radius:9px;padding:8px 10px;font:inherit;font-size:11px;font-weight:800;cursor:pointer}.feedback-controls button.active,.feedback-send{background:var(--accent);color:white}.feedback-textarea,.reply-input,.feedback-select{width:100%;box-sizing:border-box;border:1px solid var(--line);background:var(--subtle);color:var(--text);border-radius:11px;padding:10px;font:inherit;font-size:12px;outline:none}.feedback-textarea{min-height:84px;resize:vertical}.feedback-select{margin-bottom:8px}.feedback-send{margin-top:8px;padding:10px 13px}.feedback-item{padding:13px 0;border-bottom:1px solid var(--line)}.feedback-item:last-child{border-bottom:0}.feedback-meta{display:flex;justify-content:space-between;gap:8px;color:var(--muted);font-size:10px}.feedback-item p{font-size:12px;line-height:1.55;margin:8px 0}.reply{margin:7px 0 0 12px;padding:8px 10px;background:var(--subtle);border-radius:9px;font-size:11px}.reply-form{display:flex;gap:6px;margin-top:9px}.reply-form button,.delete-text{border:0;background:transparent;color:var(--accent-strong);font:inherit;font-size:10px;font-weight:800;cursor:pointer}.delete-text{color:#d94d54;margin-top:7px}.admin-mobile-bar{display:none}@media(max-width:960px){.admin-layout{grid-template-columns:1fr}.admin-side{display:none}.admin-main{padding:20px}.admin-mobile-bar{display:flex;overflow:auto;gap:7px;padding-bottom:15px}.admin-mobile-bar button{flex:0 0 auto;border:1px solid var(--line);background:var(--panel);color:var(--muted);border-radius:10px;padding:8px 10px;font:inherit;font-size:11px;font-weight:800}.admin-mobile-bar button.active{color:var(--accent-strong);background:var(--accent-soft);border-color:transparent}.admin-overview-grid{grid-template-columns:1fr}.admin-kpis{grid-template-columns:repeat(3,1fr)}}@media(max-width:620px){.admin-main{padding:16px}.admin-top{align-items:flex-start;flex-direction:column;margin-bottom:18px}.admin-tools{width:100%;justify-content:flex-end}.admin-kpis{grid-template-columns:repeat(2,1fr);gap:9px}.admin-kpi:last-child{grid-column:span 2}.admin-kpi{padding:14px}.admin-kpi .value{font-size:20px;margin-top:13px}.performance-map{height:265px;margin:19px 16px 18px}.admin-card-head{padding:16px 16px 0}.admin-period button{padding:6px}.admin-table-toolbar{padding:15px 16px;align-items:stretch;flex-direction:column}.admin-search{max-width:none}.admin-detail{padding:20px}.detail-summary{grid-template-columns:repeat(2,1fr)}.category-grid{grid-template-columns:repeat(2,1fr)}}
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
.export-modal{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:min(650px,94%);max-height:min(760px,calc(100vh - 32px));overflow:auto;background:var(--panel);border:1px solid var(--line);border-radius:22px;padding:24px;box-shadow:0 24px 70px rgba(0,0,0,.24)}
.export-modal-head{display:flex;align-items:flex-start;justify-content:space-between;gap:15px;padding-bottom:15px;border-bottom:1px solid var(--line)}.export-modal-head h3{font-size:20px;margin:6px 0 4px;letter-spacing:-.03em}.export-modal-head p{font-size:11px;color:var(--muted);line-height:1.5;margin:0;max-width:510px}.export-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:15px}.export-label{display:block;font-size:10px;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);font-weight:900;margin:0 0 6px}.export-control{width:100%;margin:0;box-sizing:border-box}.export-range-note{display:flex;align-items:center;gap:8px;margin-top:12px;padding:10px 12px;background:var(--accent-soft);color:var(--accent-strong);border-radius:10px;font-size:11px;font-weight:700;line-height:1.4}.export-user-section{margin-top:17px;padding-top:16px;border-top:1px solid var(--line)}.export-section-head{display:flex;justify-content:space-between;gap:10px;align-items:baseline;margin-bottom:7px}.export-section-head>span{font-size:10px;color:var(--muted);text-align:right}.export-user-toolbar{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:8px 0 4px}.export-user-toolbar span{font-size:11px;font-weight:800;color:var(--accent-strong)}.export-user-toolbar div{display:flex;gap:5px}.export-user-toolbar button{border:0;background:var(--subtle);color:var(--muted);border-radius:8px;padding:6px 9px;font-size:10px;font-weight:800;cursor:pointer}.export-user-toolbar button:hover{background:var(--accent-soft);color:var(--accent-strong)}.export-user-list{display:grid;gap:5px;max-height:224px;overflow:auto;margin-top:8px;padding:3px}.export-user-option{width:100%;display:flex;align-items:center;gap:10px;border:1px solid transparent;background:var(--subtle);color:var(--text);border-radius:11px;padding:9px 10px;text-align:left;cursor:pointer;transition:border-color .15s ease,background .15s ease}.export-user-option:hover,.export-user-option.selected{border-color:var(--accent);background:var(--accent-soft)}.export-user-option>span{min-width:0;flex:1}.export-user-option b{display:block;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.export-user-option small{display:block;color:var(--muted);font-size:10px;margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.export-user-option>i{color:var(--accent-strong);font-size:13px}.export-user-empty,.export-user-more{text-align:center;color:var(--muted);font-size:11px;padding:16px 8px}.export-user-more{padding:8px;font-style:italic}.export-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:17px}.export-footnote{font-size:10px;line-height:1.45;color:var(--muted);margin:12px 0 0;text-align:center}
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
.admin-assignment-form{padding:16px 20px 20px}
.assignment-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.assignment-grid .feedback-select{margin-bottom:0}
.assignment-grid+.assignment-grid,.assignment-grid+.assignment-target-picker,.assignment-target-picker+.assignment-grid{margin-top:8px}
.assignment-grid-three{grid-template-columns:repeat(3,minmax(0,1fr))}
.assignment-target-picker{margin-top:8px;padding:11px;border:1px solid var(--line);border-radius:12px;background:var(--subtle)}
.assignment-picker-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px}
.assignment-picker-head b{font-size:12px;color:var(--text)}
.assignment-choice{margin:0;justify-content:flex-end}
.assignment-choice button{padding:6px 8px;font-size:10px}
.admin-assignment-form>.feedback-textarea{margin-top:8px;min-height:66px}
.admin-assignment-form>.feedback-send{margin-top:10px}
.assignment-history-row{cursor:default}
.assignment-history-open{min-width:0;flex:1;display:flex;align-items:center;gap:10px;border:0;background:transparent;color:var(--text);font:inherit;text-align:left;cursor:pointer;padding:0}
.assignment-history-detail{color:var(--accent-strong);font-size:10px;font-weight:800;white-space:nowrap}
.assignment-history-detail i{margin-left:5px;font-size:9px}
.assignment-history-row .delete-text{margin:0 0 0 8px;align-self:center}
.assignment-modal-overlay{position:fixed;inset:0;z-index:90;display:grid;place-items:center;padding:22px;background:rgba(13,18,29,.48);backdrop-filter:blur(4px)}
.assignment-modal{width:min(940px,100%);max-height:min(760px,calc(100vh - 44px));overflow:hidden;display:flex;flex-direction:column;background:var(--panel);border:1px solid var(--line);border-radius:22px;box-shadow:0 24px 70px rgba(0,0,0,.28);animation:assignmentModalIn .2s ease-out}
@keyframes assignmentModalIn{from{transform:translateY(12px);opacity:0}to{transform:translateY(0);opacity:1}}
.assignment-modal-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:22px 24px 14px;border-bottom:1px solid var(--line)}.assignment-modal-head h2{margin:5px 0 0;font-size:20px;letter-spacing:-.025em}.assignment-modal-head p{margin:5px 0 0;color:var(--muted);font-size:11px;line-height:1.45}
.assignment-modal-targets{display:flex;gap:7px;flex-wrap:wrap;padding:12px 24px 0}.assignment-modal-targets .admin-pill{background:var(--accent-soft);color:var(--accent-strong)}
.assignment-modal-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:14px 24px}.assignment-modal-summary span{padding:10px 12px;background:var(--subtle);border-radius:11px;color:var(--muted);font-size:10px;font-weight:700}.assignment-modal-summary b{display:block;font-size:19px;color:var(--text);margin-bottom:3px}
.assignment-result-table-wrap{min-height:0;overflow:auto;margin:0 24px;border:1px solid var(--line);border-radius:12px}.assignment-result-table{width:100%;border-collapse:collapse;font-size:12px;min-width:620px}.assignment-result-table th{position:sticky;top:0;background:var(--subtle);padding:10px 13px;text-align:left;border-bottom:1px solid var(--line);font-size:9px;color:var(--muted);letter-spacing:.07em;text-transform:uppercase}.assignment-result-table td{padding:10px 13px;border-bottom:1px solid var(--line);color:var(--muted);vertical-align:middle}.assignment-result-table tr:last-child td{border-bottom:0}.assignment-result-table td:first-child{color:var(--text);min-width:210px}.assignment-result-table td:nth-child(2){line-height:1.45}.assignment-modal .admin-pagination{padding:12px 24px}
.assignment-results-panel{margin:0 6px 12px;padding:13px;border:1px solid var(--line);background:var(--subtle);border-radius:12px}
.assignment-results-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;flex-wrap:wrap}
.assignment-results-head b{display:block;font-size:12px}.assignment-results-head small{display:block;font-size:10px;color:var(--muted);margin-top:3px}
.assignment-results-loading{padding:18px 4px;text-align:center;font-size:11px;color:var(--muted)}
.assignment-result-summary{display:flex;gap:7px;flex-wrap:wrap;margin:11px 0 8px}.assignment-result-summary span{padding:5px 8px;border-radius:99px;background:var(--panel);font-size:10px;color:var(--muted)}.assignment-result-summary b{color:var(--text)}
.assignment-result-list{border-top:1px solid var(--line);max-height:360px;overflow-y:auto}.assignment-result-row{display:flex;align-items:center;gap:9px;padding:10px 2px;border-bottom:1px solid var(--line)}.assignment-result-row:last-child{border-bottom:0}
.assignment-result-user{min-width:0;flex:1}.assignment-result-user b{display:block;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.assignment-result-user small{display:block;font-size:9px;color:var(--muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.assignment-result-user .assignment-result-detail{white-space:normal;line-height:1.35}
.assignment-result-status{flex:0 0 auto;padding:5px 7px;border-radius:8px;font-size:9px;font-weight:800;white-space:nowrap}.assignment-result-status.passed{color:#168163;background:#def7ec}.assignment-result-status.pending{color:#a15c00;background:#fff1d4}.assignment-result-status.progress{color:#2766be;background:#e7f0ff}.assignment-result-status.retake{color:#a45800;background:#fff0d4}.assignment-result-status.muted{color:var(--muted);background:var(--panel)}.admin-dark .assignment-result-status.passed{background:#1d483c;color:#81e3bf}.admin-dark .assignment-result-status.pending,.admin-dark .assignment-result-status.retake{background:#48391f;color:#f4cf83}.admin-dark .assignment-result-status.progress{background:#203a61;color:#9fc3ff}

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
  .assignment-grid-three{grid-template-columns:repeat(2,minmax(0,1fr))}
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
  .admin-assignment-form{padding:14px}
  .assignment-grid,.assignment-grid-three{grid-template-columns:1fr}
  .assignment-picker-head{align-items:flex-start;flex-direction:column}
  .assignment-choice{justify-content:flex-start}
  .assignment-history-detail{display:none}
  .assignment-results-panel{margin:0 2px 10px;padding:11px}
  .assignment-result-status{font-size:8px;padding:5px 6px}
  .assignment-modal-overlay{padding:10px}
  .assignment-modal{max-height:calc(100vh - 20px);border-radius:16px}
  .assignment-modal-head{padding:17px 16px 12px}.assignment-modal-head h2{font-size:17px}.assignment-modal-targets{padding:10px 16px 0}.assignment-modal-summary{padding:12px 16px;gap:6px}.assignment-modal-summary span{padding:8px;font-size:9px}.assignment-modal-summary b{font-size:16px}.assignment-result-table-wrap{margin:0 16px}.assignment-modal .admin-pagination{padding:11px 16px}
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
  .export-modal{padding:18px;border-radius:17px}.export-modal-head h3{font-size:17px}.export-grid,.export-actions{grid-template-columns:1fr}.export-section-head{align-items:flex-start;flex-direction:column}.export-section-head>span{text-align:left}.export-user-toolbar{align-items:stretch;flex-direction:column}.export-user-toolbar div{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));width:100%}.export-user-toolbar button{min-height:34px;line-height:1.3}.export-user-list{max-height:185px}
}
@media(max-width:420px){
  .admin-kpis{grid-template-columns:1fr;gap:8px}
  .admin-kpi:last-child{grid-column:auto}
  .admin-kpi{padding:14px 16px}
  .admin-kpi .value{font-size:22px}
  .admin-recipient-grid label{font-size:13px}
}
.admin-kpis{grid-template-columns:repeat(3,minmax(0,1fr))}
.admin-kpi.danger .admin-kpi-icon{background:#fff0ed;color:#d95445;box-shadow:0 6px 14px rgba(217,84,69,.13)}
.admin-dark .admin-kpi.danger .admin-kpi-icon{background:#462623;color:#ff9b8d}
.comparison-bar{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px 16px;margin-bottom:16px;border:1px solid var(--line);border-radius:16px;background:color-mix(in srgb,var(--panel) 92%,var(--accent-soft));box-shadow:0 6px 20px rgba(22,32,51,.035)}
.comparison-bar>div:first-child{min-width:220px}.comparison-bar b{display:block;font-size:13px;margin-top:3px}.comparison-bar small{display:block;color:var(--muted);font-size:10px;margin-top:3px}.comparison-controls{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex:1}.comparison-controls>.admin-filter{width:min(390px,100%);height:40px}
.overview-side-stack{display:grid;gap:18px;align-content:start}.module-score-list{padding:14px 20px 20px}.module-score-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:5px 12px;padding:10px 0;border-bottom:1px solid var(--line)}.module-score-row:last-child{border-bottom:0}.module-score-row b{font-size:12px}.module-score-row span{display:block;color:var(--muted);font-size:9px;margin-top:2px}.module-score-row strong{font-size:13px}.module-score-row>i{grid-column:1/-1;height:5px;border-radius:99px;background:var(--subtle);overflow:hidden}.module-score-row>i em{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,var(--accent),#8d6cf2)}
.section-tabs{display:flex;gap:5px;margin-bottom:14px;padding:4px;width:max-content;max-width:100%;overflow:auto;border:1px solid var(--line);border-radius:13px;background:var(--panel);box-shadow:var(--shadow)}.section-tabs button{display:flex;align-items:center;gap:7px;border:0;border-radius:9px;padding:9px 13px;background:transparent;color:var(--muted);font:inherit;font-size:11px;font-weight:800;white-space:nowrap;cursor:pointer}.section-tabs button.active{background:var(--accent-soft);color:var(--accent-strong)}
.detail-stat.primary{background:linear-gradient(135deg,var(--accent-soft),color-mix(in srgb,var(--accent) 9%,var(--panel)))}.detail-stat.danger{background:#fff3ef}.admin-dark .detail-stat.danger{background:#442923}.detail-stat.danger b{color:#d95445}
.assignment-detail-card{position:relative;padding:14px;margin:9px 0;border:1px solid var(--line);border-radius:14px;background:color-mix(in srgb,var(--subtle) 56%,var(--panel))}.assignment-detail-card>b{display:block;font-size:13px;margin-top:10px}.assignment-detail-card>p{font-size:11px;color:var(--muted);margin:4px 0 10px}.assignment-detail-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.assignment-kind{display:flex;align-items:center;gap:6px;font-size:9px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:var(--accent-strong)}.assignment-detail-meta{display:flex;gap:7px 12px;flex-wrap:wrap;color:var(--muted);font-size:10px}.assignment-detail-meta span{display:flex;align-items:center;gap:5px}.retake-button{margin-top:12px;border:0;border-radius:8px;padding:7px 9px;background:#fff0d4;color:#9b6100;font:inherit;font-size:10px;font-weight:800;cursor:pointer}.status-count{display:inline-grid;place-items:center;min-width:25px;height:25px;border-radius:8px;background:var(--subtle);font-weight:900}.status-count.danger{background:#ffebe8;color:#c94739}.status-count.warning{background:#fff0d4;color:#9b6100}.admin-pill.attention{background:#ffebe8;color:#b43f34}.admin-pill.success{background:#e6f7f1;color:#148367}.admin-pill.neutral{background:var(--subtle);color:var(--muted)}.admin-dark .admin-pill.attention,.admin-dark .status-count.danger{background:#482624;color:#ff9e92}.admin-dark .admin-pill.success{background:#1f4037;color:#82dfbd}.assignment-result-status.late{color:#b43f34;background:#ffebe8}.admin-dark .assignment-result-status.late{background:#482624;color:#ff9e92}
.assignment-result-controls{display:flex;justify-content:flex-end;gap:8px;padding:0 22px 14px}.assignment-result-controls .admin-filter{min-width:180px}
@media(max-width:960px){.comparison-bar{align-items:flex-start;flex-direction:column}.comparison-controls{width:100%;justify-content:space-between}.comparison-controls>.admin-filter{max-width:none}.admin-kpis{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:620px){.admin-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.admin-kpi:last-child{grid-column:auto}.comparison-controls{align-items:stretch;flex-direction:column}.comparison-controls>.admin-filter{width:100%}.comparison-controls .admin-period{width:max-content}.assignment-detail-meta{display:grid}.section-tabs{width:100%}.section-tabs button{flex:1;justify-content:center}.detail-stat{min-width:0}.detail-stat b{font-size:14px}.assignment-result-controls{padding:0 16px 12px;align-items:stretch;flex-direction:column}.assignment-result-controls .admin-filter{min-width:0;width:100%}}
@media(max-width:420px){.admin-kpis{grid-template-columns:1fr}}

/* --- Fresh, spacious admin visual system --- */
.admin-root{--page:#f4f5fa;--panel:#ffffff;--subtle:#f5f6fa;--text:#1e2535;--muted:#606b80;--line:#e6e8f0;--violet:#7357df;--blue:#3b82e6;--green:#16a079;--amber:#df9427;--shadow:0 8px 26px rgba(34,42,65,.055);background:radial-gradient(900px 520px at 8% -8%,rgba(233,69,139,.11),transparent 64%),radial-gradient(780px 460px at 98% 2%,rgba(115,87,223,.10),transparent 62%),var(--page);font-family:'Plus Jakarta Sans',Inter,system-ui,sans-serif;font-weight:500}
.admin-dark{--page:#10121a;--panel:#191d28;--subtle:#222733;--text:#f4f5fa;--muted:#aeb6c7;--line:#2c3342;--shadow:0 10px 28px rgba(0,0,0,.25)}
.admin-side{position:sticky;top:0;height:100vh;background:linear-gradient(180deg,color-mix(in srgb,var(--panel) 95%,var(--accent-soft)),var(--panel));border-right-color:color-mix(in srgb,var(--line) 78%,transparent);padding:26px 17px}
.admin-brand b{font-weight:800;letter-spacing:-.015em}.admin-brand span{font-weight:600;letter-spacing:.08em}
.admin-nav button{font-weight:650;font-size:13px;padding:11px 13px}
.admin-main{padding:28px 34px 48px}
.admin-top{position:relative;overflow:hidden;isolation:isolate;padding:21px 22px;margin-bottom:17px;border:1px solid color-mix(in srgb,var(--accent) 13%,var(--line));border-radius:22px;background:linear-gradient(118deg,color-mix(in srgb,var(--accent-soft) 72%,var(--panel)),color-mix(in srgb,var(--panel) 92%,#e9e5ff) 58%,color-mix(in srgb,var(--panel) 91%,#ddf5f0));box-shadow:0 10px 30px rgba(68,53,104,.055)}
.admin-top::after{content:'';position:absolute;z-index:-1;width:260px;height:260px;right:-105px;top:-150px;border-radius:50%;background:linear-gradient(135deg,rgba(233,69,139,.17),rgba(115,87,223,.12));filter:blur(2px)}
.admin-top h1{font-size:25px;font-weight:800;letter-spacing:-.035em}.admin-top p{font-size:12.5px;line-height:1.55;font-weight:500;color:color-mix(in srgb,var(--muted) 92%,var(--text))}
.admin-top h1 i.section-icon{box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--accent) 12%,transparent);background:color-mix(in srgb,var(--panel) 72%,var(--accent-soft))}
.admin-eyebrow{font-size:10px;letter-spacing:.105em;font-weight:750}
.admin-card{border-color:color-mix(in srgb,var(--line) 88%,transparent);border-radius:20px;box-shadow:var(--shadow)}
.admin-card-head{padding:21px 21px 0}.admin-card-head h2{font-size:15.5px;font-weight:750;line-height:1.35}.admin-card-head p{font-size:12px;line-height:1.55;font-weight:520;color:var(--muted)}
.admin-card-head .admin-eyebrow{display:inline-flex;padding:4px 8px;border-radius:99px;background:var(--accent-soft);letter-spacing:.085em}
.comparison-bar{padding:15px 17px;margin-bottom:15px;border-radius:18px;background:color-mix(in srgb,var(--panel) 90%,var(--accent-soft));box-shadow:0 6px 20px rgba(34,42,65,.035)}
.comparison-bar b{font-size:13px;font-weight:750}.comparison-bar small{font-size:10.5px;line-height:1.45;font-weight:520}.comparison-controls>.admin-filter{background:var(--panel);font-weight:600}
.admin-period button{font-weight:650}.admin-period button.active{box-shadow:0 4px 12px color-mix(in srgb,var(--accent) 24%,transparent)}
.admin-kpis{grid-template-columns:repeat(3,minmax(0,1fr));gap:11px;margin-bottom:16px}
.admin-kpi{--kpi-color:var(--accent);min-height:142px;padding:15px 16px;border:1px solid color-mix(in srgb,var(--kpi-color) 12%,var(--line));background:linear-gradient(145deg,color-mix(in srgb,var(--kpi-color) 6%,var(--panel)),var(--panel) 58%)}
.admin-kpi:nth-child(2){--kpi-color:var(--blue)}.admin-kpi:nth-child(3){--kpi-color:var(--green)}.admin-kpi:nth-child(4){--kpi-color:var(--amber)}.admin-kpi:nth-child(5){--kpi-color:#e2675d}.admin-kpi:nth-child(6){--kpi-color:var(--violet)}
.admin-kpi::before{display:none}.admin-kpi-icon,.admin-kpi.danger .admin-kpi-icon{height:33px;width:33px;color:var(--kpi-color);background:color-mix(in srgb,var(--kpi-color) 11%,var(--panel));box-shadow:none}
.admin-kpi .value{margin-top:13px;font-size:24px;font-weight:800;letter-spacing:-.04em;background:none;-webkit-text-fill-color:currentColor;color:var(--text)}
.admin-kpi .label{font-size:11.25px;font-weight:700;color:var(--text)}.admin-kpi .hint{font-size:10.25px;font-weight:550;line-height:1.45;color:var(--muted)}
.admin-overview-grid{grid-template-columns:minmax(0,1.62fr) minmax(285px,.88fr);gap:15px}.overview-side-stack{gap:15px}
.performance-empty{min-height:268px;margin:16px 20px 20px;border:1px dashed color-mix(in srgb,var(--accent) 22%,var(--line));border-radius:16px;background:linear-gradient(145deg,color-mix(in srgb,var(--accent-soft) 45%,var(--panel)),color-mix(in srgb,var(--panel) 95%,#e7e4ff));display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:28px}
.performance-empty>span{display:grid;place-items:center;width:48px;height:48px;border-radius:16px;background:linear-gradient(135deg,var(--accent),var(--violet));color:#fff;box-shadow:0 10px 24px color-mix(in srgb,var(--accent) 28%,transparent);font-size:18px}.performance-empty b{font-size:14px;font-weight:750;margin-top:15px}.performance-empty p{max-width:390px;margin:6px 0 12px;color:var(--muted);font-size:11px;line-height:1.55}.performance-empty small{padding:5px 9px;border-radius:99px;background:var(--panel);color:var(--accent-strong);font-size:9.5px;font-weight:700}
.module-score-list{padding:12px 20px 18px}.module-score-row b{font-weight:700}.module-score-row span{font-size:10.25px;font-weight:520}.module-score-row strong{font-weight:750}
.admin-table-card{margin-top:15px}.admin-table-toolbar{padding:18px 20px}.admin-table-toolbar h2{font-weight:750!important}.admin-table-toolbar p{font-weight:500!important;line-height:1.5}.admin-table{font-size:11.5px}.admin-table th{font-weight:700;letter-spacing:.055em;color:var(--muted)}.admin-table td{font-weight:500}.user-cell b{font-weight:700}.admin-pill{font-weight:700}
.admin-search,.admin-filter,.feedback-select,.feedback-textarea,.reply-input{font-weight:550;color:var(--text)}
.detail-head h2{font-weight:800}.detail-stat b{font-weight:750}.detail-stat span{font-weight:650}.detail-section h3{font-weight:750}.detail-readable .task-line{font-size:13px}.detail-readable .task-line b{font-weight:700}.detail-readable .task-line small{font-size:11px;font-weight:500}
.admin-user-cards{display:none}
@media(min-width:1200px){.admin-kpis{grid-template-columns:repeat(6,minmax(0,1fr))}.admin-kpi{min-height:148px}}
@media(max-width:960px){
  .admin-main{padding:18px 18px 104px}
  .admin-top{padding:18px 19px;border-radius:20px}.admin-top h1{font-size:22px;font-weight:780}.admin-top p{font-weight:500}
  .comparison-bar{gap:10px}.admin-kpis{grid-template-columns:repeat(3,minmax(0,1fr))}.admin-overview-grid{grid-template-columns:minmax(0,1fr)}
  .admin-bottom-nav button{font-weight:650}.admin-bottom-nav button i{font-size:16px}
}
@media(max-width:620px){
  .admin-root{--page:#f5f6fa;--muted:#5f697c}
  .admin-main{padding:10px 10px 96px}
  .admin-top{padding:14px 14px 13px;margin-bottom:10px;border-radius:17px;align-items:flex-start}
  .admin-top::after{width:170px;height:170px;right:-80px;top:-100px}.admin-top h1{font-size:19px;font-weight:750;line-height:1.25}.admin-top h1 i.section-icon{width:27px;height:27px;font-size:11px}.admin-top p{margin-top:6px;font-size:11.5px;line-height:1.5;font-weight:500;max-width:260px}.admin-top>.admin-tools{padding-top:1px}.admin-eyebrow{font-size:9.5px;font-weight:700;letter-spacing:.09em}
  .comparison-bar{padding:12px;margin-bottom:10px;border-radius:16px}.comparison-bar>div:first-child{min-width:0}.comparison-bar b{font-size:12.5px;font-weight:700}.comparison-bar small{font-size:9.5px}.comparison-controls{gap:7px}.comparison-controls>.admin-filter{height:40px;font-size:11px}.comparison-controls .admin-period{width:100%;display:grid;grid-template-columns:repeat(3,1fr)}.comparison-controls .admin-period button{font-size:10px;padding:7px 5px;font-weight:650}
  .admin-kpis{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:10px}.admin-kpi:last-child{grid-column:auto}.admin-kpi{min-height:121px;padding:12px;border-radius:16px}.admin-kpi:hover{transform:none}.admin-kpi-icon,.admin-kpi.danger .admin-kpi-icon{height:28px;width:28px;border-radius:9px;font-size:11px}.admin-kpi .value{font-size:21px;font-weight:750;margin-top:9px}.admin-kpi .label{font-size:10px;font-weight:650}.admin-kpi .hint{font-size:9px;font-weight:500;line-height:1.35;margin-top:4px}
  .admin-overview-grid{gap:10px}.overview-side-stack{gap:10px}.admin-card{border-radius:17px}.admin-card-head{padding:14px 14px 0}.admin-card-head h2{font-size:14px;font-weight:700}.admin-card-head p{font-size:10.5px;line-height:1.5}.admin-card-head .admin-eyebrow{padding:3px 7px}
  .performance-empty{min-height:164px;margin:12px 12px 14px;padding:18px}.performance-empty>span{width:40px;height:40px;border-radius:13px;font-size:15px}.performance-empty b{font-size:12.5px;margin-top:11px}.performance-empty p{font-size:10px;margin:5px 0 9px}.performance-empty small{font-size:9px}
  .performance-map{height:210px;margin:14px 12px 12px}.map-legend{padding:0 13px 14px;gap:8px;font-size:9.5px}
  .module-score-list{padding:8px 14px 14px}.module-score-row{padding:9px 0}.attention-list{padding:5px 10px 11px}.admin-empty{padding:25px 14px;font-size:11.5px}
  .admin-table-card{margin-top:10px;background:transparent;border:0;box-shadow:none}.admin-table-toolbar{display:flex;padding:14px;background:var(--panel);border:1px solid var(--line);border-radius:17px;box-shadow:var(--shadow);margin-bottom:9px}.admin-table-toolbar h2{font-size:15px!important;font-weight:700!important}.admin-table-toolbar p{font-size:10.5px!important}.admin-table-controls{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));width:100%;gap:7px}.admin-table-controls .admin-search{grid-column:1/-1}.admin-search,.admin-filter{min-width:0;width:100%;height:40px;font-size:10.5px;font-weight:550}.admin-table-wrap{display:none}
  .admin-user-cards{display:grid;gap:8px}.mobile-user-card{padding:12px;background:var(--panel);border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow)}.mobile-user-head{display:flex;align-items:center;gap:9px}.mobile-user-head>input{width:17px;height:17px;accent-color:var(--accent);flex:0 0 auto}.mobile-user-identity{min-width:0;flex:1;display:flex;align-items:center;gap:9px;border:0;background:transparent;color:var(--text);padding:0;text-align:left;font:inherit;cursor:pointer}.mobile-user-identity>span{min-width:0;flex:1}.mobile-user-identity b{display:block;font-size:12.5px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mobile-user-identity small{display:block;margin-top:3px;color:var(--muted);font-size:9.5px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mobile-user-identity>i{font-size:9px;color:var(--muted)}
  .mobile-user-metrics{width:100%;display:grid;grid-template-columns:repeat(4,1fr);gap:5px;border:0;background:var(--subtle);border-radius:11px;padding:8px 6px;margin-top:10px;color:var(--text);font:inherit;cursor:pointer}.mobile-user-metrics span{border-right:1px solid var(--line)}.mobile-user-metrics span:last-child{border-right:0}.mobile-user-metrics small{display:block;color:var(--muted);font-size:8px;font-weight:600;text-transform:uppercase;letter-spacing:.035em}.mobile-user-metrics b{display:block;font-size:12.5px;font-weight:700;margin-top:3px}.mobile-user-metrics .metric-danger{color:#c94739}.mobile-user-metrics .metric-warning{color:#a66b08}.mobile-user-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:9px}.mobile-user-foot small{font-size:9px;color:var(--muted);font-weight:500}
  .admin-pagination{background:var(--panel);border:1px solid var(--line);border-radius:14px;margin-top:8px;padding:9px 10px;justify-content:space-between}.admin-pagination button{padding:7px 9px;font-weight:650}
  .admin-detail{inset:0;width:100%;height:100dvh;padding:16px 14px 94px;border:0;box-shadow:none}.detail-head{padding-bottom:4px}.detail-head h2{font-size:18px;font-weight:750}.detail-head p{font-size:10.5px!important;line-height:1.5}.detail-summary{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin:13px 0}.detail-stat{padding:10px;border-radius:11px}.detail-stat b{font-size:14px;font-weight:700}.detail-stat span{font-size:8px;font-weight:650}.detail-tabs{margin:0 -14px;padding:0 14px;gap:0}.detail-tabs button{flex:1;margin:0;padding:11px 4px;font-size:10.5px;font-weight:650}.detail-period{font-size:9.5px;line-height:1.5}.detail-section{padding:15px 0}.detail-section h3{font-size:13.5px;font-weight:700}.category-grid{gap:7px}.category-item{padding:10px}.category-item b{font-size:15px;font-weight:700}.category-item span,.category-item small{font-size:9px}.detail-readable .task-line{font-size:12.5px;padding:11px 0}.detail-readable .task-line small{font-size:10.5px}.assignment-detail-card{padding:12px;border-radius:12px}.assignment-detail-card>b{font-size:12.5px;font-weight:700}.assignment-detail-meta{font-size:9.5px}
  .section-tabs{padding:3px;border-radius:12px;margin-bottom:10px}.section-tabs button{padding:9px 7px;font-size:10px;font-weight:650}
  .admin-bottom-nav{padding:6px 7px calc(6px + env(safe-area-inset-bottom));box-shadow:0 -8px 24px rgba(31,38,57,.11)}.admin-bottom-nav button{font-size:9.5px;font-weight:650;padding:6px 2px 4px;border-radius:12px}.admin-bottom-nav button i{font-size:15px}
}
@media(max-width:360px){.admin-main{padding-inline:8px}.admin-kpi{padding:11px;min-height:118px}.admin-kpi .hint{font-size:8.5px}.mobile-user-card{padding:11px}.mobile-user-metrics{padding-inline:3px}}
`}</style>
    <div className="admin-layout">
      <aside className="admin-side"><div className="admin-brand"><div className="admin-brand-mark"><i className="fas fa-heart" /></div><div><b>LOVSPEAK</b><span>ADMIN CONSOLE</span></div></div><nav className="admin-nav" data-tour="admin-nav">{navItems.map(item => <button key={item.id} data-tour={item.id === 'users' ? 'admin-users-nav' : item.id === 'assignments' ? 'admin-assignments-nav' : undefined} onClick={() => setSection(item.id)} className={section === item.id ? 'active' : ''}><i className={`fas ${item.icon}`} />{item.label}{item.count !== undefined && <span className="count">{item.count}</span>}</button>)}</nav><div className="admin-side-bottom"><button className="admin-return" onClick={() => window.location.assign('/')}><i className="fas fa-arrow-left mr-2" />Kembali ke LovSpeak</button></div></aside>
      <main className="admin-main">
        <header className="admin-top"><div><span className="admin-eyebrow">LovSpeak LMS</span><h1><i className={`fas ${SectionIcons[section]} section-icon`} />{section === 'overview' ? 'Assignment Overview' : section === 'users' ? 'Performa user' : section === 'attention' ? 'Perlu perhatian' : section === 'communication' ? 'Komunikasi' : section === 'assignments' ? 'Tugas & hasil' : 'Akses admin'}</h1><p>{section === 'overview' ? 'Bandingkan hasil Assignment Admin. Daily Plan tetap ditampilkan sebagai informasi pendukung.' : section === 'access' ? 'Kelola hak akses tanpa mencampurkannya dengan data monitoring user.' : section === 'assignments' ? 'Buat Assignment dengan target yang sama dan tinjau hasil setiap penerima.' : section === 'communication' ? 'Kelola broadcast, komentar, dan percakapan tanpa memengaruhi penilaian.' : 'Data performa utama berasal dari Assignment Admin.'}</p></div><div className="admin-tools"><button className="admin-back-btn mobile-hide" onClick={() => window.location.assign('/')} title="Kembali ke LovSpeak"><i className="fas fa-arrow-left" /><span>Kembali ke LovSpeak</span></button><button data-tour="admin-refresh" className="admin-icon-button" onClick={() => void refresh({ resetDetails: true })} title="Muat ulang data"><i className={`fas fa-rotate-right ${loading || detailLoading ? 'fa-spin' : ''}`} /></button><button className="admin-icon-button mobile-hide" onClick={openExportDialog} title="Unduh laporan Excel"><i className="fas fa-file-export" /></button><button className="admin-icon-button mobile-hide" onClick={() => saveTheme(theme === 'light' ? 'dark' : 'light')} title="Ganti mode"><i className={`fas fa-${theme === 'light' ? 'moon' : 'sun'}`} /></button><button className="admin-icon-button mobile-hide" onClick={onLogout} title="Keluar"><i className="fas fa-arrow-right-from-bracket" /></button></div></header>
        {message && <div className="admin-alert">{message}</div>}
        {detailLoading && <div className="admin-alert" style={{ background: 'var(--accent-soft)', color: 'var(--accent-strong)', borderColor: 'var(--line)' }}>Ringkasan user sudah tampil. Detail nilai dan aktivitas sedang dilengkapi…</div>}
        {!loading && users.length > 0 && ['overview', 'users'].includes(section) && <div className="comparison-bar"><div><span className="admin-eyebrow">Baseline perbandingan</span><b>{assignmentScopeLabel}</b><small>Hanya penerima dengan target yang sama{lastUpdated ? ` · diperbarui ${lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}` : ''}.</small></div><div className="comparison-controls"><select className="admin-filter" value={assignmentScope} onChange={event => setAssignmentScope(event.target.value)} aria-label="Pilih baseline Assignment"><option value="common">Semua Assignment yang dikirim ke seluruh user</option>{assignmentCatalog.map(item => <option key={item.id} value={item.id}>{item.title} · {ASSIGNMENT_KIND_LABELS[item.target.kind]}</option>)}</select><div className="admin-period">{(['week', 'month', 'all'] as Period[]).map(item => <button key={item} className={period === item ? 'active' : ''} onClick={() => setPeriod(item)}>{item === 'week' ? '7 hari' : item === 'month' ? '30 hari' : 'Semua'}</button>)}</div></div></div>}
        {loading && !users.length ? <>
          <div className="admin-kpis">{[0, 1, 2, 3].map(index => <div key={index} className="skeleton-kpi"><div className="skeleton" style={{ width: 36, height: 36, borderRadius: 10 }} /><div className="skeleton big" style={{ marginTop: 16 }} /><div className="skeleton" style={{ width: '50%' }} /></div>)}</div>
          <div className="admin-card">{[0, 1, 2, 3, 4].map(index => <div key={index} className="skeleton-row"><div className="skeleton circle" /><div><div className="skeleton" style={{ width: 140, marginBottom: 6 }} /><div className="skeleton" style={{ width: 90, height: 10 }} /></div><div className="skeleton short" style={{ marginLeft: 'auto' }} /></div>)}</div>
        </> : !users.length ? <div className="admin-card admin-empty"><svg className="empty-illustration" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="60" r="58" fill="var(--accent-soft)" /><circle cx="60" cy="48" r="18" fill="var(--accent)" opacity="0.15" /><circle cx="60" cy="48" r="12" fill="var(--accent)" /><path d="M30 92c0-16 13-28 30-28s30 12 30 28" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.35" /><path d="M85 30l4 4M31 30l-4 4M60 22v-4" stroke="var(--accent-strong)" strokeWidth="2.5" strokeLinecap="round" /></svg><b style={{ display: 'block', color: 'var(--text)', fontSize: 15, marginBottom: 6 }}>Belum ada user terdaftar</b>Bagikan tautan LovSpeak untuk mulai mengundang user.<br />Data pemantauan muncul otomatis setelah user pertama masuk.</div> : <>
          {section === 'overview' && <>
            <div className="admin-kpi-explainer"><i className="fas fa-circle-info" /><span><b>Rata-rata nilai:</b> rata-rata nilai user; nilai user dihitung dari nilai terbaik setiap Assignment bernilai. User tanpa nilai tidak dihitung.<br /><b>Target tercapai:</b> Assignment selesai/lulus dibagi seluruh Assignment penerima, termasuk Roadmap dan Speaking.<br /><b>Periode:</b> mengikuti tanggal Assignment dikirim.</span></div>
            <div className="admin-kpis" data-tour="admin-kpis">{[
              ['fa-chart-line', meanScore === null ? '—' : `${meanScore}%`, 'Rata-rata nilai', validScores.length ? `${validScores.length} user memiliki hasil · ${periodLabel}` : `Belum ada hasil bernilai · ${periodLabel}`],
              ['fa-circle-check', assignmentPassRate === null ? '—' : `${assignmentPassRate}%`, 'Target tercapai', assignmentTotal ? `${assignmentFinished} selesai/lulus dari ${assignmentTotal} Assignment penerima` : 'Belum ada Assignment pada baseline dan periode ini'],
              ['fa-clock', assignmentOnTimeRate === null ? '—' : `${assignmentOnTimeRate}%`, 'Selesai tepat waktu', assignmentCompletedWithDue ? `${assignmentOnTime} dari ${assignmentCompletedWithDue} tugas bertenggat` : 'Belum ada tugas selesai yang bertenggat'],
              ['fa-hourglass-half', `${assignmentNotStarted}`, 'Belum dikerjakan', 'Assignment belum dibuka atau dicoba'],
              ['fa-calendar-xmark', `${assignmentOverdue}`, 'Terlambat', 'Belum selesai setelah tenggat'],
              ['fa-rotate-left', `${assignmentRetake}`, 'Perlu retake', `${users.length} user · ${activeCount} sedang online`]
            ].map(([icon, value, label, hint]) => <button type="button" className={`admin-card admin-kpi ${label === 'Terlambat' || label === 'Perlu retake' ? 'danger' : ''}`} key={label} onClick={() => { if (label === 'Terlambat') { setSection('users'); setUserFilter('overdue'); } else if (label === 'Perlu retake') { setSection('users'); setUserFilter('retake'); } else if (label === 'Belum dikerjakan') { setSection('users'); setUserFilter('not-started'); } else { setSection('assignments'); setAssignmentTab('history'); } }} style={{ textAlign: 'left', width: '100%' }}><div className="admin-kpi-icon"><i className={`fas ${icon}`} /></div><div className="value">{value}</div><div className="label">{label}</div><div className="hint">{hint}</div></button>)}</div>
            <div className="admin-overview-grid"><section className="admin-card performance-card"><div className="admin-card-head"><div><span className="admin-eyebrow">Assignment Admin</span><h2>Peta performa Assignment</h2><p>Posisi user menunjukkan nilai dan penyelesaian berdasarkan baseline yang dipilih.</p></div></div><PerformanceMap metrics={metrics} selectedId={selected?.uid} onSelect={openUser} />{metrics.some(item => item.average !== null) && <div className="map-legend"><span><i style={{ background: '#22a986' }} />Meningkat</span><span><i style={{ background: '#4385ee' }} />Stabil</span><span><i style={{ background: '#e66262' }} />Menurun</span><span><i style={{ background: '#a4adbd' }} />Belum cukup data</span></div>}</section>
              <div className="overview-side-stack"><section className="admin-card"><div className="admin-card-head"><div><span className="admin-eyebrow">Kemampuan</span><h2>Nilai Assignment per modul</h2><p>Roadmap dan Speaking berbasis durasi tidak diubah menjadi nilai.</p></div></div><div className="module-score-list">{[AppView.GRAMMAR, AppView.READING, AppView.LISTENING, AppView.SHADOWING].map(type => { const values = metrics.map(item => item.categories[type]).filter((value): value is number => value !== null); const value = values.length ? Math.round(values.reduce((sum, score) => sum + score, 0) / values.length) : null; return <div className="module-score-row" key={type}><div><b>{CATEGORY_LABELS[type]}</b><span>{value === null ? 'Belum ada Assignment yang memiliki nilai' : `${values.length} user memiliki hasil`}</span></div><strong>{value === null ? '—' : `${value}%`}</strong><i><em style={{ width: `${value || 0}%` }} /></i></div>; })}</div></section><section className="admin-card"><div className="admin-card-head"><div><span className="admin-eyebrow">Tindakan cepat</span><h2>Perlu perhatian</h2><p>Hanya masalah yang berasal dari Assignment Admin.</p></div><span className="admin-pill">{attention.length} user</span></div><div className="attention-list">{attention.slice(0, 5).map(item => <AttentionRow key={item.user.uid} item={item} onClick={() => openUser(item.user)} />)}{!attention.length && <div className="admin-empty">Tidak ada Assignment yang perlu ditindaklanjuti.</div>}</div></section></div></div>
            <EnhancedUserTable metrics={metrics} query={query} setQuery={setQuery} onSelect={openUser} onVisibleUsers={loadDetailsFor} reloadToken={detailRevision} title="Ringkasan performa user" subtitle="Nilai dan status utama hanya berasal dari Assignment Admin." showSearch={false} filter="all" setFilter={setUserFilter} sort={userSort} setSort={setUserSort} /></>}
          {section === 'users' && <EnhancedUserTable metrics={metrics} query={query} setQuery={setQuery} onSelect={openUser} onVisibleUsers={loadDetailsFor} reloadToken={detailRevision} title="Daftar user" subtitle="Detail nilai, tugas, jawaban, dan komentar dimuat saat user dibuka." showSearch filter={userFilter} setFilter={setUserFilter} sort={userSort} setSort={setUserSort} bulkSelected={bulkSelected} setBulkSelected={setBulkSelected} onBulkComment={() => setBulkCommentOpen(true)} onBulkAssign={handleBulkAssign} />}
          {section === 'attention' && <section className="admin-card admin-table-card"><div className="admin-card-head"><div><span className="admin-eyebrow">Prioritas Assignment</span><h2>Daftar user yang perlu diperiksa</h2><p>Berdasarkan tugas terlambat, perlu diulang, percobaan berulang, atau belum dimulai menjelang tenggat.</p></div></div><div className="attention-list">{attentionPager.visible.map(item => <AttentionRow key={item.user.uid} item={item} onClick={() => openUser(item.user)} />)}{!attention.length && <div className="admin-empty"><svg className="empty-illustration" viewBox="0 0 120 120" fill="none"><circle cx="60" cy="60" r="58" fill="var(--accent-soft)" /><path d="M40 60l14 14 28-28" stroke="#22a986" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg><b style={{ display: 'block', color: 'var(--text)', fontSize: 14, marginBottom: 4 }}>Tidak ada Assignment yang perlu ditindaklanjuti</b>Semua hasil tugas saat ini tidak memerlukan tindakan.</div>}</div><Pager {...attentionPager} /></section>}
          {section === 'assignments' && <>
            <div className="section-tabs">
              <button className={assignmentTab === 'compose' ? 'active' : ''} onClick={() => setAssignmentTab('compose')}><i className="fas fa-plus" />Buat tugas</button>
              <button className={assignmentTab === 'history' ? 'active' : ''} onClick={() => setAssignmentTab('history')}><i className="fas fa-chart-column" />Riwayat & hasil</button>
            </div>
            {assignmentTab === 'compose' && <AdminAssignmentsPanel mode="assignment" users={users} adminUid={user.uid} onMessage={setMessage} initialRecipientIds={prefilledRecipients} onConsumePrefill={() => setPrefilledRecipients(null)} />}
            {assignmentTab === 'history' && <section className="admin-card admin-table-card">
              <div className="admin-table-toolbar"><div><span className="admin-eyebrow">Assignment Admin</span><h2 className="text-[16px] font-black mt-1 mb-0">Riwayat tugas dan hasil penerima</h2><p className="text-[12px] text-[var(--muted)] mt-1 mb-0">Buka satu tugas untuk membandingkan user yang menerima target yang sama.</p></div><div className="admin-table-controls"><select className="admin-filter" value={historyRange} onChange={event => setHistoryRange(event.target.value as HistoryRange)} aria-label="Periode riwayat"><option value="today">Hari ini</option><option value="week">7 hari terakhir</option><option value="month">Bulan ini</option><option value="date">Pilih tanggal</option><option value="all">Semua waktu</option></select>{historyRange === 'date' && <input className="admin-filter" type="date" value={historyDate} onChange={event => setHistoryDate(event.target.value)} aria-label="Tanggal riwayat" />}<button className="admin-icon-button" onClick={() => void loadHistory()} title="Muat ulang riwayat"><i className={`fas fa-rotate-right ${historyLoading ? 'fa-spin' : ''}`} /></button></div></div>
              <div className="attention-list">
                {historyLoading && !assignmentHistoryItems.length && <div className="admin-empty"><i className="fas fa-circle-notch fa-spin mr-2" />Memuat riwayat…</div>}
              {!historyLoading && !assignmentHistoryItems.length && <div className="admin-empty">Tidak ada Assignment pada periode yang dipilih.</div>}
                {assignmentHistoryPager.visible.map(entry => <div key={entry.id} className="attention-row assignment-history-row">
                    <button type="button" className="assignment-history-open" onClick={() => void openAssignmentResults(entry)}>
                      <div className="attention-avatar" style={{ background: '#e0f2fe', color: '#0284c7' }}><i className="fas fa-clipboard-check" /></div>
                      <div style={{ flex: 1 }}>
                        <b>{entry.title}</b>
                        <small>{ASSIGNMENT_KIND_LABELS[entry.target.kind]} · {entry.recipientCount} penerima · dikirim {formatShortDate(entry.createdAt)}{entry.dueAt ? ` · tenggat ${formatShortDate(entry.dueAt)}` : ' · tanpa tenggat'}</small>
                      </div>
                      <span className="assignment-history-detail">Lihat hasil <i className="fas fa-arrow-up-right-from-square" /></span>
                    </button>
                    <button className="delete-text" onClick={() => void handleDeleteAssignment(entry)}>Hapus</button>
                </div>)}
              </div>
              <Pager {...assignmentHistoryPager} />
            </section>}
          </>}
          {section === 'communication' && <>
            <div className="section-tabs">
              <button className={communicationTab === 'broadcast' ? 'active' : ''} onClick={() => setCommunicationTab('broadcast')}><i className="fas fa-bullhorn" />Kirim broadcast</button>
              <button className={communicationTab === 'comments' ? 'active' : ''} onClick={() => setCommunicationTab('comments')}><i className="fas fa-comments" />Komentar dan balasan</button>
              <button className={communicationTab === 'history' ? 'active' : ''} onClick={() => setCommunicationTab('history')}><i className="fas fa-clock-rotate-left" />Riwayat broadcast</button>
            </div>
            {communicationTab === 'broadcast' && <AdminAssignmentsPanel mode="broadcast" users={users} adminUid={user.uid} onMessage={setMessage} />}
            {communicationTab === 'comments' && <section className="admin-card admin-table-card"><div className="admin-table-toolbar"><div><span className="admin-eyebrow">Komentar dan balasan</span><h2 className="text-[16px] font-black mt-1 mb-0">Percakapan dengan user</h2><p className="text-[12px] text-[var(--muted)] mt-1 mb-0">Pilih user untuk menulis komentar atau melanjutkan percakapan.</p></div><input className="admin-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Cari nama atau email user…" /></div><div className="attention-list">{commentsPager.visible.map(item => <button className="attention-row" key={item.user.uid} onClick={() => openUser(item.user, 'comments')}><AvatarBubble name={item.user.name} size={31} className="attention-avatar" /><div><b>{item.user.name}</b><small>{item.detail?.feedback.length} komentar · terakhir {formatShortDate(item.detail?.feedback[0]?.createdAt)}</small></div><i className="fas fa-chevron-right ml-auto text-[10px]" /></button>)}{!commentUsers.length && <div className="admin-empty">Belum ada komentar yang dikirim.</div>}</div><Pager {...commentsPager} /></section>}
            {communicationTab === 'history' && <section className="admin-card admin-table-card"><div className="admin-table-toolbar"><div><span className="admin-eyebrow">Riwayat komunikasi</span><h2 className="text-[16px] font-black mt-1 mb-0">Riwayat broadcast</h2><p className="text-[12px] text-[var(--muted)] mt-1 mb-0">Riwayat pesan dipisahkan dari Assignment agar tidak memengaruhi data penilaian.</p></div><div className="admin-table-controls"><select className="admin-filter" value={historyRange} onChange={event => setHistoryRange(event.target.value as HistoryRange)} aria-label="Periode riwayat"><option value="today">Hari ini</option><option value="week">7 hari terakhir</option><option value="month">Bulan ini</option><option value="date">Pilih tanggal</option><option value="all">Semua waktu</option></select>{historyRange === 'date' && <input className="admin-filter" type="date" value={historyDate} onChange={event => setHistoryDate(event.target.value)} aria-label="Tanggal riwayat" />}<button className="admin-icon-button" onClick={() => void loadHistory()} title="Muat ulang riwayat"><i className={`fas fa-rotate-right ${historyLoading ? 'fa-spin' : ''}`} /></button></div></div><div className="attention-list">{historyLoading && !broadcastHistoryItems.length && <div className="admin-empty"><i className="fas fa-circle-notch fa-spin mr-2" />Memuat riwayat…</div>}{!historyLoading && !broadcastHistoryItems.length && <div className="admin-empty">Tidak ada broadcast pada periode yang dipilih.</div>}{broadcastHistoryPager.visible.map(entry => <div key={entry.id} className="attention-row" style={{ cursor: 'default' }}><div className="attention-avatar" style={{ background: '#fef3c7', color: '#b45309' }}><i className="fas fa-bullhorn" /></div><div style={{ flex: 1 }}><b>{entry.title}</b><small>{entry.recipientCount} penerima · {formatShortDate(entry.createdAt)}</small><p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--muted)', whiteSpace: 'pre-wrap' }}>{entry.message.slice(0, 160)}{entry.message.length > 160 ? '…' : ''}</p></div><button className="delete-text" onClick={() => void handleDeleteBroadcast(entry)}>Hapus</button></div>)}</div><Pager {...broadcastHistoryPager} /></section>}
          </>}
          {section === 'access' && <section className="admin-card admin-table-card"><div className="admin-card-head"><div><span className="admin-eyebrow">Keamanan</span><h2>Kelola akses admin</h2><p>Hanya user yang sudah memiliki akun LovSpeak yang dapat diberikan akses admin.</p></div></div><div className="admin-access-form"><select className="feedback-select" value={accessUserId} onChange={event => setAccessUserId(event.target.value)}><option value="">Pilih user yang akan diberi akses</option>{users.filter(item => item.uid !== user.uid && !adminAccess.some(access => access.uid === item.uid)).map(item => <option key={item.uid} value={item.uid}>{item.name} · {item.email || 'tanpa email'}</option>)}</select><button className="feedback-send" disabled={accessBusy || !accessUserId} onClick={() => void handleGrantAdmin()}>{accessBusy ? 'Memproses…' : 'Berikan akses admin'}</button></div><div className="attention-list"><div className="access-row"><div className="attention-avatar">{MASTER_ADMIN_EMAIL.slice(0, 1).toUpperCase()}</div><div><b>Admin Utama</b><small>{MASTER_ADMIN_EMAIL} · tidak dapat dicabut</small></div><span className="admin-pill">Bawaan sistem</span></div>{accessPager.visible.map(access => <div className="access-row" key={access.uid}><AvatarBubble name={access.name || access.email} size={31} className="attention-avatar" /><div><b>{access.name || 'Admin'}</b><small>{access.email || 'Email tidak tersedia'} · ditambahkan {formatShortDate(access.createdAt)}</small></div><button className="delete-text ml-auto" disabled={accessBusy} onClick={() => void handleRevokeAdmin(access)}>Cabut akses</button></div>)}</div><Pager {...accessPager} /><div className="admin-card" style={{ marginTop: 16, border: '1px dashed var(--line)', boxShadow: 'none' }}><span className="admin-eyebrow">Pemulihan data</span><button className="feedback-send" disabled={migrationBusy} onClick={() => void migrateLegacyLearningData()}>{migrationBusy ? 'Menyalin data…' : 'Mulai pemulihan data'}</button></div></section>}
        </>}
      </main>
    </div>
    <nav className="admin-bottom-nav" data-tour="admin-nav-mobile">
      {([['overview', 'fa-chart-pie', 'Overview'], ['users', 'fa-users', 'User'], ['assignments', 'fa-clipboard-check', 'Tugas']] as [Section, string, string][]).map(([id, icon, label]) => <button key={id} data-tour={id === 'users' ? 'admin-users-nav-mobile' : id === 'assignments' ? 'admin-assignments-nav-mobile' : undefined} className={section === id && !moreOpen ? 'active' : ''} onClick={() => { setMoreOpen(false); setSection(id); }}><i className={`fas ${icon}`} /><span>{label}</span></button>)}
      <button className={moreOpen || ['attention', 'communication', 'access'].includes(section) ? 'active' : ''} onClick={() => setMoreOpen(current => !current)}><i className="fas fa-ellipsis" /><span>Lainnya</span></button>
    </nav>
    {moreOpen && <div className="admin-more-overlay" onClick={() => setMoreOpen(false)}>
      <div className="admin-more-sheet" onClick={event => event.stopPropagation()}>
        <div className="admin-more-grab" />
        <b className="admin-more-title">Menu lainnya</b>
        <div className="admin-more-list">
          <button onClick={() => { setSection('attention'); setMoreOpen(false); }}><i className="fas fa-triangle-exclamation" style={{ color: '#e66262' }} />Perlu Perhatian{attention.length > 0 && <span className="admin-more-count">{attention.length}</span>}</button>
          <button onClick={() => { setSection('communication'); setCommunicationTab('comments'); setMoreOpen(false); }}><i className="fas fa-comments" style={{ color: '#4385ee' }} />Komunikasi</button>
          <button onClick={() => { setSection('access'); setMoreOpen(false); }}><i className="fas fa-shield-halved" style={{ color: '#7c5ce5' }} />Akses Admin<span className="admin-more-count">{adminAccess.length + 1}</span></button>
          <div className="admin-more-divider" />
          <button onClick={() => { openExportDialog(); setMoreOpen(false); }}><i className="fas fa-file-export" style={{ color: '#14a88b' }} />Unduh laporan Excel</button>
          <button onClick={() => saveTheme(theme === 'light' ? 'dark' : 'light')}><i className={`fas fa-${theme === 'light' ? 'moon' : 'sun'}`} style={{ color: '#f0a020' }} />{theme === 'light' ? 'Mode malam' : 'Mode terang'}</button>
          <div className="admin-more-divider" />
          <button onClick={() => window.location.assign('/')}><i className="fas fa-arrow-left" style={{ color: 'var(--accent-strong)' }} />Kembali ke LovSpeak</button>
          <button className="danger" onClick={() => void onLogout()}><i className="fas fa-arrow-right-from-bracket" />Keluar</button>
        </div>
      </div>
    </div>}
    {exportOpen && <div className="admin-panel-overlay" onMouseDown={() => !exportBusy && setExportOpen(false)}>
      <div className="export-modal" onMouseDown={event => event.stopPropagation()}>
        <div className="export-modal-head"><div><span className="admin-eyebrow">Unduh laporan</span><h3>Unduh laporan Excel</h3><p>Assignment dan Daily Plan tersedia pada lembar terpisah. Setiap tabel dapat difilter dan diurutkan.</p></div><button className="detail-close" onClick={() => setExportOpen(false)} disabled={exportBusy} aria-label="Tutup laporan">×</button></div>
        <div className="export-grid">
          <div><label className="export-label">Rentang data</label><select className="admin-filter export-control" value={exportRange} onChange={event => setExportRange(event.target.value as ExportRange)} disabled={exportBusy}><option value="today">Hari ini</option><option value="week">7 hari terakhir</option><option value="month">30 hari terakhir</option><option value="calendar-month">Bulan kalender berjalan</option><option value="custom">Pilih tanggal</option><option value="all">Semua waktu</option></select></div>
          <div><label className="export-label">Format laporan</label><select className="admin-filter export-control" value={exportMode} onChange={event => setExportMode(event.target.value as ExportMode)} disabled={exportBusy}><option value="summary">Laporan ringkas · dashboard dan ringkasan</option><option value="full">Laporan lengkap · seluruh detail</option></select></div>
        </div>
        {exportRange === 'custom' && <div className="export-grid"><div><label className="export-label">Mulai</label><input className="admin-filter export-control" type="date" value={exportStartDate} onChange={event => setExportStartDate(event.target.value)} disabled={exportBusy} /></div><div><label className="export-label">Selesai</label><input className="admin-filter export-control" type="date" value={exportEndDate} onChange={event => setExportEndDate(event.target.value)} disabled={exportBusy} /></div></div>}
        <div className="export-range-note"><i className="fas fa-calendar-days" /> Data {exportRangeLabel(exportRange, exportStartDate, exportEndDate)}. {exportMode === 'full' ? 'Termasuk detail Assignment, aktivitas Daily Plan, dan komentar.' : 'Termasuk dashboard serta ringkasan Assignment dan Daily Plan.'}</div>
        <div className="export-user-section"><div className="export-section-head"><label className="export-label">User yang disertakan</label><span>{selectedExportUsers.length ? `${selectedExportUsers.length} user terpilih` : 'Belum ada user yang dipilih'}</span></div><input className="feedback-select export-control" value={exportUserQuery} onChange={event => setExportUserQuery(event.target.value)} placeholder="Cari nama atau email user…" disabled={exportBusy} /><div className="export-user-toolbar"><span>Pilihan tetap tersimpan saat Anda mencari user lain.</span><div><button type="button" onClick={() => setExportUserUids(current => Array.from(new Set([...current, ...matchingExportUsers.map(item => item.uid)])))} disabled={exportBusy || !matchingExportUsers.length}>{exportUserQuery.trim() ? 'Pilih semua hasil pencarian' : 'Pilih semua user'}</button><button type="button" onClick={() => setExportUserUids([])} disabled={exportBusy || !exportUserUids.length}>Hapus semua pilihan</button></div></div><div className="export-user-list">{filteredExportUsers.map(item => { const checked = exportUserUids.includes(item.uid); return <button type="button" key={item.uid} className={`export-user-option ${checked ? 'selected' : ''}`} onClick={() => toggleExportUser(item.uid)} disabled={exportBusy} aria-pressed={checked}><AvatarBubble name={item.name} size={34} /><span><b>{item.name}</b><small>{item.email || 'Email belum tersedia'} · {item.level || 'Level belum dipilih'}</small></span><i className={`fas ${checked ? 'fa-square-check' : 'fa-square'}`} /></button>; })}{!filteredExportUsers.length && <div className="export-user-empty">User tidak ditemukan.</div>}{matchingExportUsers.length > 14 && <div className="export-user-more">Gunakan pencarian untuk mempersempit daftar.</div>}</div></div>
        <div className="export-actions"><button className="feedback-send" style={{ margin: 0 }} disabled={exportBusy || !exportUserUids.length} onClick={() => void exportReport('selected')}>{exportBusy ? 'Menyiapkan…' : exportUserUids.length ? `Unduh data ${exportUserUids.length} user` : 'Pilih user untuk mengunduh'}</button><button className="feedback-send" style={{ margin: 0, background: 'var(--subtle)', color: 'var(--text)', boxShadow: 'none' }} disabled={exportBusy || !users.length} onClick={() => void exportReport('all')}>{exportBusy ? 'Menyiapkan…' : `Unduh data semua user (${users.length})`}</button></div>
        <p className="export-footnote">Setiap lembar menampilkan satu grafik ringkas. Data lengkap tetap dapat difilter dan diurutkan.</p>
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
    <TourGuide steps={ADMIN_TOUR_STEPS} isOpen={showTour} onClose={() => setShowTour(false)} storageKey={TOUR_KEY_ADMIN} mobileBreakpoint={960} />
    {selected && selectedMetric && <DetailPanelV2 user={selected} metric={selectedMetric} detail={selectedDetail} activities={selectedActivities} speaking={selectedSpeaking} period={period} assignmentScopeLabel={assignmentScopeLabel} tab={detailTab} setTab={setDetailTab} feedback={feedback} setFeedback={setFeedback} feedbackScope={feedbackScope} setFeedbackScope={setFeedbackScope} taskId={taskId} setTaskId={setTaskId} onClose={() => setSelected(null)} onSubmitFeedback={submitFeedback} submittingFeedback={submittingFeedback} submittingReplyId={submittingReplyId} replies={replies} replyDrafts={replyDrafts} setReplyDrafts={setReplyDrafts} onReply={submitReply} onDeleteFeedback={removeFeedback} onDeleteReply={removeReply} onRetakeAssignment={handleRetakeAssignment} onPrintReport={() => printUserReport(selected)} />}
    {resultAssignment && <AssignmentResultsModal key={resultAssignment.id} assignment={resultAssignment} users={users} results={assignmentResults} loading={assignmentResultsLoading} onClose={closeAssignmentResults} />}
  </div>;
};

const PerformanceMap: React.FC<{ metrics: UserMetric[]; selectedId?: string; onSelect: (user: AdminUser) => void }> = ({ metrics, selectedId, onSelect }) => {
  const plotted = metrics.filter(item => item.average !== null);
  const noData = metrics.length - plotted.length;
  if (!plotted.length) return <div className="performance-empty"><span><i className="fas fa-chart-scatter" /></span><b>Belum ada hasil untuk dipetakan</b><p>Grafik akan terisi setelah user menyelesaikan Assignment Admin yang memiliki nilai.</p><small>{noData} user belum memiliki hasil Assignment</small></div>;
  return <><div className="performance-map"><span className="map-axis-y">Nilai Assignment</span><span className="map-axis-x">Penyelesaian Assignment →</span><span className="map-zone" style={{ left: '7%', top: '9%' }}>Nilai baik, belum tuntas</span><span className="map-zone" style={{ right: '7%', top: '9%' }}>Performa unggul</span><span className="map-zone" style={{ left: '7%', bottom: '9%' }}>Perlu perhatian</span><span className="map-zone" style={{ right: '7%', bottom: '9%' }}>Tuntas, perlu bantuan</span>{plotted.map(item => { const x = item.totalTasks ? Math.max(4, Math.min(96, item.completionRate)) : 5; const y = Math.max(7, Math.min(96, item.average as number)); return <button aria-label={`Detail ${item.user.name}`} key={item.user.uid} title={`${item.user.name} · nilai ${item.average}% · ${item.completionRate}% Assignment tercapai`} className={`map-dot ${item.trend} ${selectedId === item.user.uid ? 'selected' : ''}`} onClick={() => onSelect(item.user)} style={{ left: `${x}%`, bottom: `${y}%` }} />; })}</div>{noData > 0 && <p style={{ padding: '0 20px', margin: '6px 0 0', fontSize: 10, color: 'var(--muted)' }}><i className="fas fa-circle-info mr-1" />{noData} user belum memiliki hasil Assignment yang memiliki nilai sehingga tidak ditampilkan pada peta.</p>}</>;
};

const AttentionRow: React.FC<{ item: UserMetric; onClick: () => void }> = ({ item, onClick }) => <button className="attention-row" onClick={onClick}><AvatarBubble name={item.user.name} size={31} className="attention-avatar" /><div><b>{item.user.name}</b><small>{item.attentionReason}</small></div><span className="attention-score">{item.average === null ? '—' : `${item.average}%`}</span></button>;

type DetailPanelV2Props = {
  user: AdminUser;
  metric: UserMetric;
  detail?: AdminUserDetail;
  activities: ActivityLog[];
  speaking: ActivityLog[];
  period: Period;
  assignmentScopeLabel: string;
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
  user, metric, detail, activities, speaking, period, assignmentScopeLabel, tab, setTab, feedback, setFeedback, feedbackScope,
  setFeedbackScope, taskId, setTaskId, onClose, onSubmitFeedback, submittingFeedback, submittingReplyId, replies, replyDrafts, setReplyDrafts, onReply,
  onDeleteFeedback, onDeleteReply, onRetakeAssignment, onPrintReport
}) => {
  const [chartMode, setChartMode] = useState<'average' | AssignmentKind>('average');
  const periodLabel = period === 'week' ? '7 hari terakhir' : period === 'month' ? '30 hari terakhir' : 'semua waktu';
  const chartAssignments = metric.assignments.filter(item => typeof item.bestScore === 'number' && (chartMode === 'average' || item.target.kind === chartMode));
  const assignmentScores = chartAssignments.sort((a, b) => (a.completedAt || a.createdAt).localeCompare(b.completedAt || b.createdAt)).slice(-10).map(item => ({ date: item.completedAt || item.createdAt, score: Math.round(item.bestScore as number) }));
  const answers = activities.filter(item => Boolean(item.details)).slice(0, 8);
  const assignmentAnswers = metric.assignmentActivities.filter(item => Boolean(item.details)).slice(0, 8);
  const [assignmentLimit, setAssignmentLimit] = useState(PAGE_SIZE);
  const [feedbackLimit, setFeedbackLimit] = useState(PAGE_SIZE);
  useEffect(() => { setAssignmentLimit(PAGE_SIZE); setFeedbackLimit(PAGE_SIZE); }, [user.uid]);
  const allAssignments = detail?.assignments || [];
  const allFeedback = detail?.feedback || [];
  const assignmentsNeedingAction = allAssignments.filter(item => item.status === 'needs_retake' || item.status === 'expired' || (item.status !== 'completed' && item.dueAt && new Date(item.dueAt).getTime() < Date.now()) || (item.status !== 'completed' && item.attempts >= 3)).length;
  const lastSpeaking = [...speaking].sort((a, b) => b.date.localeCompare(a.date))[0];
  const tabs: { id: DetailTab; label: string }[] = [
    { id: 'assignment', label: 'Assignment' }, { id: 'daily', label: 'Daily Plan' }, { id: 'comments', label: 'Komentar' }
  ];

  return <div className="admin-panel-overlay" onMouseDown={onClose}>
    <aside className="admin-detail detail-readable" onMouseDown={event => event.stopPropagation()}>
      <div className="detail-head">
        <div><span className="admin-eyebrow">Profil user</span><h2><i className={`status-dot ${user.isOnline ? 'status-online' : 'status-offline'}`} />{user.name}</h2><p className="text-[12px] text-[var(--muted)] mt-1">{user.email || 'Email belum tersedia'} · {user.level || 'Level belum dipilih'} · terakhir aktif {formatLastSeen(user.lastSeenAt)}</p></div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="detail-close" onClick={onPrintReport} aria-label="Cetak laporan" title="Cetak laporan atau simpan sebagai PDF"><i className="fas fa-print" /></button>
          <button className="detail-close" onClick={onClose} aria-label="Tutup detail"><i className="fas fa-xmark" /></button>
        </div>
      </div>
      {metric.attentionReason && <div className="detail-notice"><i className="fas fa-triangle-exclamation mt-[1px]" /><span><b>Perlu perhatian:</b> {metric.attentionReason}</span></div>}
      <div className="detail-summary">
        <div className="detail-stat primary"><b>{metric.assignmentAverage === null ? '—' : `${metric.assignmentAverage}%`}</b><span>NILAI ASSIGNMENT</span></div>
        <div className="detail-stat"><b>{metric.assignmentCompleted}/{metric.assignmentTotal}</b><span>TARGET TERCAPAI</span></div>
        <div className="detail-stat"><b>{metric.assignmentOnTime}</b><span>TEPAT WAKTU</span></div>
        <div className="detail-stat danger"><b>{assignmentsNeedingAction}</b><span>PERLU TINDAKAN</span></div>
      </div>
      <div className="detail-tabs">{tabs.map(item => <button key={item.id} className={tab === item.id ? 'active' : ''} onClick={() => setTab(item.id)}>{item.label}</button>)}</div>

      {tab === 'assignment' && <>
        <p className="detail-period">Baseline: <b>{assignmentScopeLabel}</b> · {periodLabel}. Setiap Assignment yang memiliki nilai dihitung satu kali menggunakan nilai terbaik; Roadmap dan Speaking dinilai berdasarkan pencapaian target.</p>
        <section className="detail-section"><h3>Nilai Assignment per modul</h3><p className="text-[10px] text-[var(--muted)] mb-3">Nilai per modul tidak mengambil aktivitas Daily Plan atau latihan manual.</p><div className="category-grid">{[AppView.GRAMMAR, AppView.READING, AppView.LISTENING, AppView.SHADOWING].map(type => { const value = metric.categories[type]; return <div className="category-item" key={type}><span>{CATEGORY_LABELS[type]}</span><b>{value === null ? '—' : `${value}%`}</b><small>{value === null ? 'Belum ada Assignment yang memiliki nilai' : 'Rata-rata nilai terbaik'}</small></div>; })}<div className="category-item"><span>Roadmap Pack</span><b>{metric.assignments.filter(item => item.target.kind === 'roadmap_pack' && item.status === 'completed').length}/{metric.assignments.filter(item => item.target.kind === 'roadmap_pack').length}</b><small>Pack selesai</small></div><div className="category-item"><span>Speaking</span><b>{metric.assignments.filter(item => item.target.kind === 'speaking' && item.status === 'completed').length}/{metric.assignments.filter(item => item.target.kind === 'speaking').length}</b><small>Target durasi tercapai</small></div></div></section>
        <section className="detail-section"><div className="flex items-start justify-between gap-3"><div><h3>Perkembangan nilai Assignment</h3><p className="text-[10px] text-[var(--muted)] mb-1">Diurutkan berdasarkan hasil Assignment, bukan aktivitas harian.</p></div><select className="chart-select" aria-label="Jenis Assignment pada grafik" value={chartMode} onChange={event => setChartMode(event.target.value as 'average' | AssignmentKind)}><option value="average">Semua modul bernilai</option><option value="grammar">Grammar</option><option value="reading">Reading</option><option value="listening">Listening</option><option value="shadowing">Shadowing</option></select></div>{assignmentScores.length ? <ScoreTrendChart points={assignmentScores} /> : <p className="text-[12px] text-[var(--muted)]">Belum ada nilai Assignment untuk jenis ini pada periode yang dipilih.</p>}</section>
        <section className="detail-section"><h3>Riwayat Assignment</h3><p className="text-[10px] text-[var(--muted)] mb-3">Daftar ini tetap lengkap meskipun ringkasan di atas mengikuti baseline yang dipilih.</p>{allAssignments.slice(0, assignmentLimit).map(item => { const status = assignmentResultStatus(item); const target = item.target.packTitle || item.target.title || item.target.topic || item.target.theme || 'Target terarah'; return <div className="assignment-detail-card" key={item.id}><div className="assignment-detail-head"><span className="assignment-kind"><i className={`fas ${item.target.kind === 'roadmap_pack' ? 'fa-route' : item.target.kind === 'speaking' ? 'fa-microphone' : 'fa-file-circle-check'}`} />{ASSIGNMENT_KIND_LABELS[item.target.kind]}</span><span className={`assignment-result-status ${status.tone}`}>{status.label}</span></div><b>{item.title}</b><p>{target}</p><div className="assignment-detail-meta"><span><i className="fas fa-bullseye" />{status.detail}</span><span><i className="fas fa-rotate" />{item.attempts || 0} percobaan</span><span><i className="far fa-calendar" />{item.dueAt ? `Tenggat ${formatShortDate(item.dueAt)}` : 'Tanpa tenggat'}</span>{item.lastAttemptAt && <span><i className="fas fa-clock-rotate-left" />Terakhir {formatShortDate(item.lastAttemptAt)}</span>}{item.completedAt && <span><i className="fas fa-check" />Selesai {formatShortDate(item.completedAt)}</span>}</div>{item.status === 'completed' && <button className="retake-button" onClick={() => onRetakeAssignment(item.id)}>Berikan kesempatan retake</button>}</div>; })}{allAssignments.length > assignmentLimit && <button className="load-more" onClick={() => setAssignmentLimit(current => current + PAGE_SIZE)}>Muat {Math.min(PAGE_SIZE, allAssignments.length - assignmentLimit)} tugas lagi ({allAssignments.length - assignmentLimit} tersisa)</button>}{!allAssignments.length && <p className="text-[12px] text-[var(--muted)]">Belum ada Assignment dari admin.</p>}</section>
        <section className="detail-section"><h3>Jawaban atau catatan Assignment terbaru</h3>{assignmentAnswers.map(item => <div className="task-line" key={item.id}><i className="fas fa-clipboard-check text-[var(--accent-strong)]" /><div className="flex-1"><b>{activityName(item)}</b><small>{formatShortDate(item.date)} · {isScored(item) ? `${item.score}%` : isSpeaking(item) ? formatDuration(item.durationSeconds) : 'Aktivitas Assignment'}</small><details className="answer-details"><summary>Lihat jawaban atau catatan</summary><p>{item.details}</p></details></div></div>)}{!assignmentAnswers.length && <p className="text-[12px] text-[var(--muted)]">Belum ada jawaban atau catatan Assignment.</p>}</section>
      </>}

      {tab === 'daily' && <>
        <p className="detail-period">Konteks perkembangan pribadi untuk {periodLabel}. Daily Plan tidak memengaruhi nilai, peringkat, KPI, atau status perlu perhatian.</p>
        <section className="detail-section"><h3>Ringkasan Daily Plan</h3><div className="task-source"><div className="task-source-card"><b>{metric.dailyCompleted}/{metric.dailyTasks.length}</b><span>RENCANA AKTIF SELESAI</span><small>{metric.dailyTasks.length ? `${metric.dailyCompletionRate}% dari rencana aktif` : 'Belum ada rencana aktif'}</small></div><div className="task-source-card"><b>{metric.dailyAverage === null ? '—' : `${metric.dailyAverage}%`}</b><span>NILAI PRIBADI</span><small>{trendIcon(metric.dailyTrend)} {trendText(metric.dailyTrend)} · tidak untuk perbandingan</small></div></div></section>
        <section className="detail-section"><h3>Nilai pribadi per modul</h3><div className="category-grid">{[AppView.GRAMMAR, AppView.READING, AppView.LISTENING, AppView.SHADOWING].map(type => { const value = metric.dailyCategories[type]; return <div className="category-item" key={type}><span>{CATEGORY_LABELS[type]}</span><b>{value === null ? '—' : `${value}%`}</b><small>{value === null ? 'Belum ada sesi' : 'Rata-rata Daily Plan'}</small></div>; })}<div className="category-item"><span>Speaking</span><b>{formatDuration(metric.liveSeconds)}</b><small>{activities.filter(item => item.type === AppView.LIVE).length} sesi</small></div><div className="category-item"><span>Terakhir belajar</span><b className="text-[13px]">{formatShortDate(metric.dailyLastActivity)}</b><small>Aktivitas Daily Plan</small></div></div></section>
        <section className="detail-section"><h3>Daily Plan aktif</h3><div className="task-list">{metric.dailyTasks.map(task => <div className="task-line" key={task.id}><i className={`fas ${task.isCompleted ? 'fa-circle-check text-emerald-500' : 'fa-circle text-[var(--muted)]'}`} /><div className="flex-1"><b>{task.title}</b><small>{task.moduleView} · {task.isCompleted ? 'Selesai' : 'Belum selesai'}</small></div></div>)}{!metric.dailyTasks.length && <p className="text-[12px] text-[var(--muted)] py-2">Belum ada Daily Plan aktif.</p>}</div></section>
        <section className="detail-section"><h3>Hasil Daily Plan terbaru</h3>{answers.map(item => <div className="task-line" key={item.id}><i className="fas fa-calendar-check text-emerald-500" /><div className="flex-1"><b>{activityName(item)}</b><small>{formatShortDate(item.date)} · {isScored(item) ? `${item.score}%` : isSpeaking(item) ? formatDuration(item.durationSeconds) : 'Aktivitas Daily Plan'}</small><details className="answer-details"><summary>Lihat jawaban atau catatan</summary><p>{item.details}</p></details></div></div>)}{!answers.length && <p className="text-[12px] text-[var(--muted)]">Belum ada hasil Daily Plan pada periode ini.</p>}</section>
        <section className="detail-section"><h3>Aktivitas speaking Daily Plan</h3><p className="text-[11px] text-[var(--muted)] mt-0">Total {formatDuration(metric.speakingSeconds)} · sesi terakhir: <b className="text-[var(--text)]">{lastSpeaking ? `${formatShortDate(lastSpeaking.date)} · ${activityName(lastSpeaking)}` : 'belum ada'}</b></p></section>
      </>}

      {tab === 'comments' && <>
        <section className="detail-section"><h3>Kirim komentar</h3><div className="feedback-controls"><button className={feedbackScope === 'general' ? 'active' : ''} onClick={() => setFeedbackScope('general')}>Umum</button><button className={feedbackScope === 'task' ? 'active' : ''} onClick={() => setFeedbackScope('task')}>Tentang tugas</button></div>{feedbackScope === 'task' && <select className="feedback-select" value={taskId} onChange={event => setTaskId(event.target.value)}><option value="">Pilih tugas</option><optgroup label="Assignment Admin">{allAssignments.map(item => <option key={`assignment-${item.id}`} value={item.id}>{item.title}</option>)}</optgroup><optgroup label="Daily Plan">{tasksForPlan(detail?.plan || null).map(task => <option key={`daily-${task.id}`} value={task.id}>{task.title}</option>)}</optgroup></select>}<textarea className="feedback-textarea" value={feedback} onChange={event => setFeedback(event.target.value)} placeholder="Tulis arahan atau apresiasi…" /><button className="feedback-send" disabled={submittingFeedback || !feedback.trim()} onClick={onSubmitFeedback}>{submittingFeedback ? 'Mengirim…' : 'Kirim komentar'}</button></section>
        <section className="detail-section"><h3>Riwayat komentar</h3>{allFeedback.slice(0, feedbackLimit).map(item => <div className="feedback-item" key={item.id}><div className="feedback-meta"><span>{item.scope === 'task' ? `Tugas · ${item.taskTitle || 'Tanpa judul'}` : 'Komentar umum'}</span><span>{formatShortDate(item.createdAt)}</span></div><p>{item.message}</p>{(replies[item.id] || []).map(reply => <div className="reply" key={reply.id}><b>{reply.authorName}</b> · {reply.message}<button className="delete-text ml-2" onClick={() => onDeleteReply(item.id, reply.id)}>Hapus</button></div>)}<div className="reply-form"><input className="reply-input" value={replyDrafts[item.id] || ''} onChange={event => setReplyDrafts(current => ({ ...current, [item.id]: event.target.value }))} placeholder="Balas…" /><button disabled={submittingReplyId === item.id || !(replyDrafts[item.id] || '').trim()} onClick={() => onReply(item.id)}>{submittingReplyId === item.id ? '…' : 'Kirim'}</button></div><button className="delete-text" onClick={() => onDeleteFeedback(item.id)}>Hapus komentar</button></div>)}{allFeedback.length > feedbackLimit && <button className="load-more" onClick={() => setFeedbackLimit(current => current + PAGE_SIZE)}>Muat {Math.min(PAGE_SIZE, allFeedback.length - feedbackLimit)} komentar lagi ({allFeedback.length - feedbackLimit} tersisa)</button>}{!allFeedback.length && <p className="text-[12px] text-[var(--muted)]">Belum ada komentar untuk user ini.</p>}</section>
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
    if (filter === 'overdue') return item.attentionOverdue > 0;
    if (filter === 'retake') return item.attentionRetake > 0;
    if (filter === 'not-started') return item.assignmentNotStarted > 0;
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
  const colSpan = bulkEnabled ? 9 : 8;
  return <section className="admin-card admin-table-card">
    <div className="admin-table-toolbar">
      <div><span className="admin-eyebrow">Monitoring · {filteredMetrics.length} user</span><h2 className="text-[16px] font-black mt-1 mb-0">{title}</h2><p className="text-[12px] text-[var(--muted)] mt-1 mb-0">{subtitle}</p></div>
      {showSearch && <div className="admin-table-controls"><input className="admin-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Cari nama atau email user…" /><select className="admin-filter" aria-label="Filter user" value={filter} onChange={event => setFilter(event.target.value as UserFilter)}><option value="all">Semua user</option><option value="attention">Perlu perhatian</option><option value="online">Sedang online</option><option value="low-score">Nilai Assignment di bawah 60%</option><option value="overdue">Assignment terlambat</option><option value="retake">Perlu retake</option><option value="not-started">Belum mengerjakan</option></select><select className="admin-filter" aria-label="Urutkan user" value={sort} onChange={event => setSort(event.target.value as UserSort)}><option value="score-desc">Nilai Assignment tertinggi</option><option value="score-asc">Nilai Assignment terendah</option><option value="progress-desc">Penyelesaian tertinggi</option><option value="progress-asc">Penyelesaian terendah</option><option value="recent">Assignment terbaru</option></select></div>}
    </div>
    {bulkEnabled && (bulkSelected?.length || 0) > 0 && <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--accent-soft)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <b style={{ fontSize: 12, color: 'var(--accent-strong)' }}>{bulkSelected!.length} user terpilih</b>
      <button className="feedback-send" style={{ margin: 0, padding: '7px 12px', fontSize: 11 }} onClick={onBulkComment}><i className="fas fa-comment mr-1" />Kirim komentar</button>
      <button className="feedback-send" style={{ margin: 0, padding: '7px 12px', fontSize: 11 }} onClick={onBulkAssign}><i className="fas fa-clipboard-check mr-1" />Beri tugas</button>
      <button onClick={() => setBulkSelected?.([])} style={{ marginLeft: 'auto', background: 'transparent', border: 0, color: 'var(--muted)', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>Batal pilih</button>
    </div>}
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr>
      {bulkEnabled && <th style={{ width: 36 }}><input type="checkbox" checked={visibleAllSelected} onChange={toggleAllVisible} aria-label="Pilih semua di halaman ini" /></th>}
      <th>User</th><th>Nilai Assignment</th><th>Target tercapai</th><th>Tepat waktu</th><th title="Jumlah Assignment terlambat yang masih aktif">Terlambat aktif</th><th title="Jumlah Assignment yang perlu diulang">Retake aktif</th><th>Status</th><th>Assignment terakhir</th>
    </tr></thead><tbody>{visible.map(item => <tr key={item.user.uid} onClick={event => { if ((event.target as HTMLElement).tagName === 'INPUT') return; onSelect(item.user); }}>
      {bulkEnabled && <td onClick={event => event.stopPropagation()}><input type="checkbox" checked={selectedSet.has(item.user.uid)} onChange={() => toggle(item.user.uid)} aria-label={`Pilih ${item.user.name}`} /></td>}
      <td><div className="user-cell"><AvatarBubble name={item.user.name} size={32} /><div><b><i className={`status-dot ${item.user.isOnline ? 'status-online' : 'status-offline'}`} title={item.user.isOnline ? 'Online' : 'Offline'} />{item.user.name}</b><span>{item.user.email || 'Email belum tersedia'}</span></div></div></td><td className="font-black">{item.average === null ? 'Belum ada' : `${item.average}%`}<span className={`metric-trend ${item.trend}`} style={{ display: 'block', marginTop: 4, fontSize: 10 }}>{trendIcon(item.trend)} {trendText(item.trend)}</span></td><td><b>{item.assignmentCompleted}/{item.assignmentTotal}</b> <span className="text-[var(--muted)]">({item.assignmentCompletionRate}%)</span></td><td className="font-bold">{item.assignmentCompletedWithDue ? `${item.assignmentOnTime}/${item.assignmentCompletedWithDue}` : '—'}</td><td><span className={item.attentionOverdue ? 'status-count danger' : 'status-count'}>{item.attentionOverdue}</span></td><td><span className={item.attentionRetake ? 'status-count warning' : 'status-count'}>{item.attentionRetake}</span></td><td><span className={`admin-pill ${assignmentFollowUpTone(item)}`}>{assignmentFollowUpLabel(item)}</span></td><td className="text-[var(--muted)]">{formatShortDate(item.lastActivity)}</td>
    </tr>)}{!visible.length && <tr><td colSpan={colSpan} className="text-center text-[var(--muted)] py-10">Tidak ada user yang sesuai.</td></tr>}</tbody></table></div>
    <div className="admin-user-cards">{visible.map(item => <article className="mobile-user-card" key={`mobile-${item.user.uid}`}>
      <div className="mobile-user-head">
        {bulkEnabled && <input type="checkbox" checked={selectedSet.has(item.user.uid)} onChange={() => toggle(item.user.uid)} aria-label={`Pilih ${item.user.name}`} />}
        <button type="button" className="mobile-user-identity" onClick={() => onSelect(item.user)}>
          <AvatarBubble name={item.user.name} size={38} />
          <span><b><i className={`status-dot ${item.user.isOnline ? 'status-online' : 'status-offline'}`} />{item.user.name}</b><small>{item.user.email || 'Email belum tersedia'}</small></span>
          <i className="fas fa-chevron-right" />
        </button>
      </div>
      <button type="button" className="mobile-user-metrics" onClick={() => onSelect(item.user)} aria-label={`Lihat performa ${item.user.name}`}>
        <span><small>Nilai</small><b>{item.average === null ? '—' : `${item.average}%`}</b></span>
        <span><small>Target</small><b>{item.assignmentCompleted}/{item.assignmentTotal}</b></span>
        <span><small>Terlambat</small><b className={item.attentionOverdue ? 'metric-danger' : ''}>{item.attentionOverdue}</b></span>
        <span><small>Retake</small><b className={item.attentionRetake ? 'metric-warning' : ''}>{item.attentionRetake}</b></span>
      </button>
      <div className="mobile-user-foot"><span className={`admin-pill ${assignmentFollowUpTone(item)}`}>{assignmentFollowUpLabel(item)}</span><small>{item.lastActivity ? `Aktivitas ${formatShortDate(item.lastActivity)}` : 'Belum ada aktivitas Assignment'}</small></div>
    </article>)}{!visible.length && <div className="admin-empty">Tidak ada user yang sesuai.</div>}</div>
    {pageCount > 1 && <div className="admin-pagination"><button type="button" disabled={page === 1} onClick={() => setPage(current => current - 1)}>Sebelumnya</button><span>Halaman {page} dari {pageCount}</span><button type="button" disabled={page === pageCount} onClick={() => setPage(current => current + 1)}>Berikutnya</button></div>}
  </section>;
};

export default AdminPortal;
