import { onDisconnect, ref, serverTimestamp, set } from 'firebase/database';
import { realtimeDb } from '../src/firebase';

export const startPresence = async (uid: string) => {
  const presenceRef = ref(realtimeDb, `presence/${uid}`);
  await onDisconnect(presenceRef).set({ online: false, lastSeenAt: serverTimestamp() });
  await set(presenceRef, { online: true, lastSeenAt: serverTimestamp() });
  return () => set(presenceRef, { online: false, lastSeenAt: serverTimestamp() }).catch(console.error);
};
