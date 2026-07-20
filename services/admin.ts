import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query,
  setDoc, updateDoc, where, writeBatch
} from 'firebase/firestore';
import { db } from '../src/firebase';
import { realtimeDb } from '../src/firebase';
import { get, ref } from 'firebase/database';
import { ActivityLog, AdminAssignment, AdminFeedback, AdminReply, AppView, AssignmentTarget, DailyTask, LearningPlan, UserAssignment, UserNotification, UserProfile } from '../types';

export interface AdminUser {
  uid: string;
  email: string;
  name: string;
  level?: string;
  xp?: number;
  isActive?: boolean;
  isOnline?: boolean;
  lastSeenAt?: number | null;
}

export interface AdminUserDetail extends AdminUser {
  plan: LearningPlan | null;
  roadmapUnits: string[];
  activities: ActivityLog[];
  feedback: AdminFeedback[];
  assignments: UserAssignment[];
}

export interface AdminAccessRecord {
  uid: string;
  email: string;
  name: string;
  grantedBy?: string;
  createdAt?: string;
}

const toMillis = (value: any): number | null => {
  if (!value) return null;
  if (typeof value === 'number') return value;
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value === 'string') return Date.parse(value) || null;
  return null;
};

const assignmentIsComplete = (assignment: UserAssignment, activities: ActivityLog[], roadmapUnits: string[]) => {
  const target = assignment.target;
  if (target.kind === 'roadmap_pack') return Boolean(target.packStepIds?.length) && target.packStepIds!.every(stepId => roadmapUnits.includes(stepId));
  const activityType: Partial<Record<string, AppView>> = { grammar: AppView.GRAMMAR, reading: AppView.READING, listening: AppView.LISTENING, speaking: AppView.LIVE, shadowing: AppView.SHADOWING };
  const retakeAt = (assignment as UserAssignment & { retakeAt?: string }).retakeAt;
  const cutoffIso = retakeAt && retakeAt > assignment.createdAt ? retakeAt : assignment.createdAt;
  const cutoff = new Date(cutoffIso).getTime();
  const relevant = activities.filter(item => item.type === activityType[target.kind] && new Date(item.date).getTime() >= cutoff);
  if (!relevant.length) return false;
  if (target.kind === 'speaking' && target.targetDurationSeconds) return relevant.some(item => (item.durationSeconds || 0) >= target.targetDurationSeconds!);
  return relevant.some(item => target.minScore === undefined || item.score >= target.minScore);
};

const MASTER_ADMIN_EMAIL = ((import.meta as { env?: Record<string, string | undefined> }).env?.VITE_ADMIN_MASTER_EMAIL || 'lovelyatrial@gmail.com').toLowerCase();

export const isAdminUser = async (uid: string, email?: string | null) => {
  if (email?.toLowerCase() === MASTER_ADMIN_EMAIL) return true;
  return (await getDoc(doc(db, 'adminAccess', uid))).exists();
};

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const [snap, presenceSnap] = await Promise.all([
    getDocs(collection(db, 'users')),
    get(ref(realtimeDb, 'presence'))
  ]);
  const presence = presenceSnap.val() || {};
  return snap.docs.map((item) => {
    const data = item.data() as UserProfile & { email?: string; isActive?: boolean; lastSeenAt?: number; isOnline?: boolean };
    return { uid: item.id, email: data.email || '', name: data.name || 'User', level: data.level, xp: data.xp || 0, isActive: data.isActive, isOnline: Boolean(presence[item.id]?.online), lastSeenAt: toMillis(presence[item.id]?.lastSeenAt) };
  });
};

export const getAdminUserDetail = async (user: AdminUser): Promise<AdminUserDetail> => {
  const [planSnap, roadmapSnap, activitySnap, feedbackSnap, assignmentSnap] = await Promise.all([
    getDoc(doc(db, `users/${user.uid}/settings/plan`)),
    getDoc(doc(db, `users/${user.uid}/progress/roadmap`)),
    getDocs(query(collection(db, `users/${user.uid}/activity`), orderBy('date', 'desc'), limit(100))),
    getDocs(query(collection(db, 'feedback'), where('recipientId', '==', user.uid), limit(100))),
    getDocs(query(collection(db, `userAssignments/${user.uid}/items`), orderBy('createdAt', 'desc'), limit(100)))
  ]);
  const activities = activitySnap.docs.map(item => item.data() as ActivityLog);
  const roadmapUnits = roadmapSnap.exists() ? roadmapSnap.data().units || [] : [];
  return {
    ...user,
    plan: planSnap.exists() ? planSnap.data() as LearningPlan : null,
    roadmapUnits,
    activities,
    feedback: feedbackSnap.docs.map(item => ({ id: item.id, ...item.data() } as AdminFeedback)).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    assignments: assignmentSnap.docs.map(item => {
      const assignment = { id: item.id, ...item.data() } as UserAssignment;
      return assignmentIsComplete(assignment, activities, roadmapUnits) ? { ...assignment, status: 'completed' as const, completedAt: assignment.completedAt || nowIso() } : assignment;
    })
  };
};

export const sendFeedback = async (feedback: Omit<AdminFeedback, 'id' | 'createdAt' | 'readAt'>) =>
  addDoc(collection(db, 'feedback'), { ...feedback, createdAt: new Date().toISOString() });

export const getReplies = async (feedbackId: string): Promise<AdminReply[]> => {
  const snap = await getDocs(query(collection(db, `feedback/${feedbackId}/replies`), orderBy('createdAt', 'asc')));
  return snap.docs.map(item => ({ id: item.id, ...item.data() } as AdminReply));
};

export const sendReply = async (feedbackId: string, reply: Omit<AdminReply, 'id' | 'createdAt'>) =>
  addDoc(collection(db, `feedback/${feedbackId}/replies`), { ...reply, createdAt: new Date().toISOString() });

export const markFeedbackRead = async (feedbackId: string) =>
  updateDoc(doc(db, 'feedback', feedbackId), { readAt: new Date().toISOString() });

export const getUserFeedback = async (uid: string): Promise<AdminFeedback[]> => {
  const snap = await getDocs(query(collection(db, 'feedback'), where('recipientId', '==', uid), limit(100)));
  return snap.docs.map(item => ({ id: item.id, ...item.data() } as AdminFeedback))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

export const deleteFeedback = async (feedbackId: string) => deleteDoc(doc(db, 'feedback', feedbackId));

export const deleteReply = async (feedbackId: string, replyId: string) =>
  deleteDoc(doc(db, `feedback/${feedbackId}/replies/${replyId}`));

export const grantAdminAccess = async (user: AdminUser, grantedBy: string) =>
  setDoc(doc(db, 'adminAccess', user.uid), { uid: user.uid, email: user.email, name: user.name, grantedBy, createdAt: new Date().toISOString() });

export const getAdminAccess = async (): Promise<AdminAccessRecord[]> => {
  const snap = await getDocs(collection(db, 'adminAccess'));
  return snap.docs.map(item => ({ uid: item.id, ...item.data() } as AdminAccessRecord))
    .sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email));
};

export const revokeAdminAccess = async (uid: string) => deleteDoc(doc(db, 'adminAccess', uid));

export const tasksForPlan = (plan: LearningPlan | null): DailyTask[] => plan ? [...(plan.dailyTasks || []), ...(plan.yesterdayTasks || [])] : [];

const nowIso = () => new Date().toISOString();

/** Creates an assignment and fan-outs a small per-user inbox record. Chunking keeps this safe for classes of 100+ users. */
export const createAdminAssignment = async (input: {
  title: string;
  description?: string;
  target: AssignmentTarget;
  dueAt?: string | null;
  createdBy: string;
  recipientMode: 'all' | 'selected';
  recipientIds: string[];
}) => {
  const createdAt = nowIso();
  const assignmentRef = doc(collection(db, 'assignments'));
  const assignment: Omit<AdminAssignment, 'id'> & { recipientIds: string[] } = {
    title: input.title.trim(),
    description: input.description?.trim() || '',
    target: input.target,
    dueAt: input.dueAt || null,
    recipientMode: input.recipientMode,
    recipientCount: input.recipientIds.length,
    recipientIds: input.recipientIds,
    createdBy: input.createdBy,
    createdAt
  };

  const writes = [
    { ref: assignmentRef, data: assignment },
    ...input.recipientIds.map(uid => ({
      ref: doc(db, `userAssignments/${uid}/items/${assignmentRef.id}`),
      data: { ...assignment, assignmentId: assignmentRef.id, status: 'assigned', attempts: 0, createdAt }
    })),
    ...input.recipientIds.map(uid => ({
      ref: doc(collection(db, `userNotifications/${uid}/items`)),
      data: { kind: 'assignment', refId: assignmentRef.id, title: 'Tugas baru dari admin', message: input.title.trim(), createdAt }
    }))
  ];
  for (let index = 0; index < writes.length; index += 450) {
    const batch = writeBatch(db);
    writes.slice(index, index + 450).forEach(item => batch.set(item.ref, item.data));
    await batch.commit();
  }
  return assignmentRef.id;
};

export const getUserAssignments = async (uid: string): Promise<UserAssignment[]> => {
  const snap = await getDocs(query(collection(db, `userAssignments/${uid}/items`), orderBy('createdAt', 'desc'), limit(100)));
  return snap.docs.map(item => ({ id: item.id, ...item.data() } as UserAssignment));
};

export const markUserAssignmentRead = async (uid: string, assignmentId: string) =>
  updateDoc(doc(db, `userAssignments/${uid}/items/${assignmentId}`), { readAt: nowIso() });

export const getUserNotifications = async (uid: string): Promise<UserNotification[]> => {
  const snap = await getDocs(query(collection(db, `userNotifications/${uid}/items`), orderBy('createdAt', 'desc'), limit(50)));
  return snap.docs.map(item => ({ id: item.id, ...item.data() } as UserNotification));
};

export const markNotificationRead = async (uid: string, notificationId: string) =>
  updateDoc(doc(db, `userNotifications/${uid}/items/${notificationId}`), { readAt: nowIso() });

export const createAdminBroadcast = async (input: { title: string; message: string; createdBy: string; recipientIds: string[] }) => {
  const createdAt = nowIso();
  const broadcastRef = doc(collection(db, 'broadcasts'));
  const data = { title: input.title.trim(), message: input.message.trim(), createdBy: input.createdBy, recipientCount: input.recipientIds.length, createdAt };
  const writes = [
    { ref: broadcastRef, data },
    ...input.recipientIds.map(uid => ({
      ref: doc(collection(db, `userNotifications/${uid}/items`)),
      data: { kind: 'broadcast', refId: broadcastRef.id, title: input.title.trim(), message: input.message.trim(), createdAt }
    }))
  ];
  for (let index = 0; index < writes.length; index += 450) {
    const batch = writeBatch(db);
    writes.slice(index, index + 450).forEach(item => batch.set(item.ref, item.data));
    await batch.commit();
  }
  return broadcastRef.id;
};

export interface AdminAssignmentSummary extends AdminAssignment {
  id: string;
  recipientIds?: string[];
}

export interface AdminBroadcastSummary {
  id: string;
  title: string;
  message: string;
  createdBy: string;
  createdAt: string;
  recipientCount: number;
}

export const listAssignments = async (): Promise<AdminAssignmentSummary[]> => {
  const snap = await getDocs(query(collection(db, 'assignments'), orderBy('createdAt', 'desc'), limit(100)));
  return snap.docs.map(item => ({ id: item.id, ...item.data() } as AdminAssignmentSummary));
};

export const listBroadcasts = async (): Promise<AdminBroadcastSummary[]> => {
  const snap = await getDocs(query(collection(db, 'broadcasts'), orderBy('createdAt', 'desc'), limit(100)));
  return snap.docs.map(item => ({ id: item.id, ...item.data() } as AdminBroadcastSummary));
};

export const deleteAssignment = async (assignmentId: string, recipientIds: string[] = []) => {
  const writes = [`assignments/${assignmentId}`, ...recipientIds.map(uid => `userAssignments/${uid}/items/${assignmentId}`)];
  for (let index = 0; index < writes.length; index += 450) {
    const batch = writeBatch(db);
    writes.slice(index, index + 450).forEach(path => batch.delete(doc(db, path)));
    await batch.commit();
  }
};

export const deleteBroadcast = async (broadcastId: string) =>
  deleteDoc(doc(db, 'broadcasts', broadcastId));

export const retakeAssignment = async (uid: string, assignmentId: string) =>
  updateDoc(doc(db, `userAssignments/${uid}/items/${assignmentId}`), {
    status: 'assigned', attempts: 0, completedAt: null, bestScore: null, bestDurationSeconds: null, readAt: null, retakeAt: nowIso()
  });
