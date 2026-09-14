import { ActivityLog } from '../types';

export type MonitoredActivitySource = 'daily' | 'assignment' | null;

/**
 * Admin monitoring intentionally has only two lanes. Learner-initiated work
 * (manual modules, standalone Roadmap, games, diary, and assessments) remains
 * available to the learner but must not affect an admin's performance view.
 */
export const getMonitoredActivitySource = (activity: ActivityLog): MonitoredActivitySource => {
  const metadata = activity.metadata || {};

  // IDs are the strongest signal and keep older correctly-tagged records
  // working even if their `source` field was not written yet.
  if (metadata.assignmentId || metadata.source === 'assignment') return 'assignment';
  if (metadata.planTaskId || metadata.source === 'daily') return 'daily';

  return null;
};

export const isDailyPlanActivity = (activity: ActivityLog) =>
  getMonitoredActivitySource(activity) === 'daily';

export const isAdminAssignmentActivity = (activity: ActivityLog) =>
  getMonitoredActivitySource(activity) === 'assignment';

export const isMonitoredActivity = (activity: ActivityLog) =>
  getMonitoredActivitySource(activity) !== null;
