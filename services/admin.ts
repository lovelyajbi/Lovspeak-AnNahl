import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query,
  setDoc, updateDoc, where
} from 'firebase/firestore';
import { db } from '../src/firebase';
import { realtimeDb } from '../src/firebase';
import { get, ref } from 'firebase/database';
import { ActivityLog, AdminFeedback, AdminReply, DailyTask, LearningPlan, UserProfile } from '../types';

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

export const isAdminUser = async (uid: string, email?: string | null) => {
  if (email?.toLowerCase() === 'lovelyatrial@gmail.com') return true;
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
  const [planSnap, roadmapSnap, activitySnap, feedbackSnap] = await Promise.all([
    getDoc(doc(db, `users/${user.uid}/settings/plan`)),
    getDoc(doc(db, `users/${user.uid}/progress/roadmap`)),
    getDocs(query(collection(db, `users/${user.uid}/activity`), orderBy('date', 'desc'), limit(100))),
    getDocs(query(collection(db, 'feedback'), where('recipientId', '==', user.uid), limit(100)))
  ]);
  return {
    ...user,
    plan: planSnap.exists() ? planSnap.data() as LearningPlan : null,
    roadmapUnits: roadmapSnap.exists() ? roadmapSnap.data().units || [] : [],
    activities: activitySnap.docs.map(item => item.data() as ActivityLog),
    feedback: feedbackSnap.docs.map(item => ({ id: item.id, ...item.data() } as AdminFeedback)).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
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

export const getUnreadFeedback = async (uid: string) => {
  const items = await getUserFeedback(uid);
  return items.filter(item => !item.readAt);
};

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
