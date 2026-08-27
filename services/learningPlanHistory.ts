import type { DailyTask, LearningPlan } from '../types';

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_HISTORY_DAYS = 35;

export const isPlanDateKey = (value?: string): value is string => {
  if (!value || !DATE_KEY_PATTERN.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
};

export const shiftPlanDateKey = (dateKey: string, days: number): string | null => {
  if (!isPlanDateKey(dateKey)) return null;
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0'),
  ].join('-');
};

export const planDateKeyToDate = (dateKey: string): Date | undefined => {
  if (!isPlanDateKey(dateKey)) return undefined;
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
};

const mergeTaskProgress = (preferred: DailyTask, alternate?: DailyTask): DailyTask => {
  if (!alternate) return preferred;
  return {
    ...alternate,
    ...preferred,
    isCompleted: Boolean(preferred.isCompleted || alternate.isCompleted),
    accumulatedSeconds: Math.max(
      preferred.accumulatedSeconds || 0,
      alternate.accumulatedSeconds || 0,
    ) || undefined,
  };
};

export const mergeDailyTaskLists = (
  preferred: DailyTask[] = [],
  alternate: DailyTask[] = [],
): DailyTask[] => {
  if (preferred.length === 0) return alternate.map(task => ({ ...task }));
  const alternateById = new Map(alternate.map(task => [task.id, task]));
  return preferred.map(task => mergeTaskProgress(task, alternateById.get(task.id)));
};

const pruneHistory = (history: Record<string, DailyTask[]>): Record<string, DailyTask[]> => {
  const retainedKeys = Object.keys(history)
    .filter(isPlanDateKey)
    .sort((a, b) => b.localeCompare(a))
    .slice(0, MAX_HISTORY_DAYS);
  return Object.fromEntries(retainedKeys.map(key => [key, history[key]]));
};

export const normalizeLearningPlanHistory = (plan: LearningPlan): LearningPlan => {
  const history: Record<string, DailyTask[]> = {};
  Object.entries(plan.dailyTaskHistory || {}).forEach(([dateKey, tasks]) => {
    if (isPlanDateKey(dateKey) && Array.isArray(tasks)) history[dateKey] = tasks;
  });

  if (isPlanDateKey(plan.lastGeneratedDate) && Array.isArray(plan.dailyTasks)) {
    history[plan.lastGeneratedDate] = mergeDailyTaskLists(
      plan.dailyTasks,
      history[plan.lastGeneratedDate],
    );
  }

  const previousDateKey = shiftPlanDateKey(plan.lastGeneratedDate, -1);
  if (previousDateKey && Array.isArray(plan.yesterdayTasks) && plan.yesterdayTasks.length > 0) {
    history[previousDateKey] = mergeDailyTaskLists(
      plan.yesterdayTasks,
      history[previousDateKey],
    );
  }

  const dailyTaskHistory = pruneHistory(history);
  return {
    ...plan,
    dailyTaskHistory,
    yesterdayTasks: previousDateKey ? dailyTaskHistory[previousDateKey] : undefined,
  };
};

export const getPlanTasksForDate = (plan: LearningPlan | null, dateKey: string): DailyTask[] => {
  if (!plan || !isPlanDateKey(dateKey)) return [];
  const normalized = normalizeLearningPlanHistory(plan);
  return normalized.dailyTaskHistory?.[dateKey] || [];
};

export const mergeLearningPlanHistories = (
  primary: LearningPlan,
  secondary: LearningPlan,
): Record<string, DailyTask[]> => {
  const primaryHistory = normalizeLearningPlanHistory(primary).dailyTaskHistory || {};
  const secondaryHistory = normalizeLearningPlanHistory(secondary).dailyTaskHistory || {};
  const merged: Record<string, DailyTask[]> = { ...secondaryHistory };

  Object.entries(primaryHistory).forEach(([dateKey, tasks]) => {
    merged[dateKey] = mergeDailyTaskLists(tasks, secondaryHistory[dateKey] || []);
  });
  return pruneHistory(merged);
};
