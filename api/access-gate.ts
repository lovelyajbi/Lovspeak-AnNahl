import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { DecodedIdToken, UserRecord } from 'firebase-admin/auth';
import { FieldValue } from 'firebase-admin/firestore';
// Keep the explicit extension: Vercel runs this server function as native ESM
// after compilation, where extensionless relative imports are not resolvable.
import { getFirebaseAdmin } from './_firebaseAdmin.js';

const ACCESS_FULL_MESSAGE = 'Akses LovSpeak saat ini sedang penuh. Silakan hubungi admin untuk informasi lebih lanjut.';
const ACCESS_UNAVAILABLE_MESSAGE = 'Akses LovSpeak belum dapat diverifikasi. Silakan coba lagi beberapa saat kemudian.';
const CAPACITY_PATH = 'settings/accessCapacity';

const getMaxAccounts = () => {
  const configured = Number.parseInt(String(process.env.LOVSPEAK_MAX_ACCOUNTS || '15'), 10);
  return Number.isFinite(configured) && configured > 0 ? configured : 15;
};

const listAllUsers = async (auth: ReturnType<typeof getFirebaseAdmin>['auth']) => {
  const users: UserRecord[] = [];
  let pageToken: string | undefined;
  do {
    const page = await auth.listUsers(1000, pageToken);
    users.push(...page.users);
    pageToken = page.pageToken;
  } while (pageToken);
  return users;
};

/**
 * The first request after deployment seeds seats for every Firebase Auth
 * account that already exists. This keeps the current six accounts intact
 * without asking the admin to copy UIDs or run a migration manually.
 */
const ensureCapacityInitialized = async (db: ReturnType<typeof getFirebaseAdmin>['db'], auth: ReturnType<typeof getFirebaseAdmin>['auth'], maxAccounts: number) => {
  const capacityRef = db.doc(CAPACITY_PATH);
  const current = await capacityRef.get();
  if (current.exists && current.data()?.initializedAt) return;

  const existingUsers = await listAllUsers(auth);
  // Reserve the master seat even if the custom-login account has not been
  // materialized by /api/admin-login yet. In the normal case it is already
  // present in Firebase Auth, so this is a no-op.
  const masterUid = String(process.env.ADMIN_MASTER_UID || '').trim();
  if (masterUid && !existingUsers.some((account) => account.uid === masterUid)) {
    existingUsers.push({
      uid: masterUid,
      email: String(process.env.ADMIN_MASTER_EMAIL || 'lovelyatrial@gmail.com').trim(),
      displayName: 'Admin Utama',
    } as UserRecord);
  }
  await db.runTransaction(async (transaction) => {
    const fresh = await transaction.get(capacityRef);
    if (fresh.exists && fresh.data()?.initializedAt) return;

    const now = new Date().toISOString();
    existingUsers.forEach((account) => {
      transaction.set(db.doc(`accessSeats/${account.uid}`), {
        uid: account.uid,
        email: account.email || null,
        displayName: account.displayName || null,
        source: 'bootstrap',
        grantedAt: now,
        updatedAt: now,
      }, { merge: true });
    });
    transaction.set(capacityRef, {
      maxAccounts,
      usedAccounts: existingUsers.length,
      initializedAt: now,
      updatedAt: now,
      source: 'server_capacity_gate',
    }, { merge: true });
  });
};

type GateResult = { allowed: true } | { allowed: false; reason: 'capacity_full' | 'service_unavailable' };

const reserveSeat = async (uid: string, email: string | null, displayName: string | null): Promise<GateResult> => {
  const { db, auth } = getFirebaseAdmin();
  const maxAccounts = getMaxAccounts();
  await ensureCapacityInitialized(db, auth, maxAccounts);

  const capacityRef = db.doc(CAPACITY_PATH);
  const seatRef = db.doc(`accessSeats/${uid}`);
  const userRef = db.doc(`users/${uid}`);
  const result = await db.runTransaction(async (transaction): Promise<GateResult> => {
    const capacitySnap = await transaction.get(capacityRef);
    const seatSnap = await transaction.get(seatRef);
    const capacity = capacitySnap.data() || {};
    const usedAccounts = Number(capacity.usedAccounts || 0);
    const now = new Date().toISOString();

    if (seatSnap.exists) {
      transaction.set(userRef, {
        email,
        name: displayName,
        isActive: true,
        accessSource: 'capacity_gate',
        accessSeatVerifiedAt: now,
      }, { merge: true });
      transaction.set(capacityRef, { maxAccounts, updatedAt: now }, { merge: true });
      return { allowed: true };
    }

    if (usedAccounts >= maxAccounts) return { allowed: false, reason: 'capacity_full' };

    transaction.set(seatRef, {
      uid,
      email,
      displayName,
      source: 'new_account',
      grantedAt: now,
      updatedAt: now,
    }, { merge: true });
    transaction.update(capacityRef, {
      maxAccounts,
      usedAccounts: FieldValue.increment(1),
      updatedAt: now,
    });
    transaction.set(userRef, {
      email,
      name: displayName,
      isActive: true,
      accessSource: 'capacity_gate',
      accessSeatVerifiedAt: now,
    }, { merge: true });
    return { allowed: true };
  });
  return result;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const authorization = typeof req.headers.authorization === 'string' ? req.headers.authorization : '';
  if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required' });

  let decoded: DecodedIdToken;
  try {
    const { auth } = getFirebaseAdmin();
    decoded = await auth.verifyIdToken(authorization.slice(7));
  } catch (error) {
    return res.status(401).json({ allowed: false, error: 'Authentication required' });
  }

  try {
    const result = await reserveSeat(decoded.uid, decoded.email || null, typeof decoded.name === 'string' ? decoded.name : null);
    if (result.allowed === false) return res.status(403).json({ allowed: false, error: ACCESS_FULL_MESSAGE, reason: result.reason });
    return res.status(200).json({ allowed: true });
  } catch (error) {
    console.error('Account access gate failed:', error);
    return res.status(503).json({ allowed: false, error: ACCESS_UNAVAILABLE_MESSAGE, reason: 'service_unavailable' });
  }
};
