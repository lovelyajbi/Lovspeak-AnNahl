import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { timingSafeEqual } from 'node:crypto';

const clean = (value: unknown) => typeof value === 'string' ? value.trim() : '';

const sameSecret = (provided: string, expected: string) => {
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
};

const ensureFirebaseAdmin = () => {
  if (!getApps().length) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '';
    if (serviceAccountJson) {
      const parsed = JSON.parse(serviceAccountJson);
      initializeApp({ credential: cert({
        projectId: parsed.project_id,
        clientEmail: parsed.client_email,
        privateKey: String(parsed.private_key || '').replace(/\\n/g, '\n'),
      }) });
    } else {
      initializeApp({ credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: String(process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      }) });
    }
  }
  return getAuth();
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const expectedUsername = clean(process.env.ADMIN_LOGIN_USERNAME);
  const expectedPassword = process.env.ADMIN_LOGIN_PASSWORD || '';
  const masterUid = clean(process.env.ADMIN_MASTER_UID);
  const masterEmail = clean(process.env.ADMIN_MASTER_EMAIL) || 'lovelyatrial@gmail.com';
  if (!expectedUsername || !expectedPassword || !masterUid) {
    return res.status(500).json({ error: 'Admin login belum dikonfigurasi di Vercel.' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const username = clean(body.username);
  const password = typeof body.password === 'string' ? body.password : '';
  if (!sameSecret(username, expectedUsername) || !sameSecret(password, expectedPassword)) {
    return res.status(401).json({ error: 'Username atau password admin tidak valid.' });
  }

  try {
    const firebaseAuth = ensureFirebaseAdmin();
    try {
      await firebaseAuth.getUser(masterUid);
    } catch (error: any) {
      if (error?.code !== 'auth/user-not-found') throw error;
      await firebaseAuth.createUser({ uid: masterUid, email: masterEmail, emailVerified: true, displayName: 'Admin Utama' });
    }
    const token = await firebaseAuth.createCustomToken(masterUid, { adminMaster: true });
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Admin custom login failed:', error);
    return res.status(500).json({ error: 'Login admin belum dapat diproses.' });
  }
}
