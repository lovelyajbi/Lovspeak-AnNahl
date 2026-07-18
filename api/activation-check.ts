import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { timingSafeEqual } from 'node:crypto';

const sameSecret = (provided: string, expected: string) => {
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
};

const ensureFirebaseAuth = () => {
  if (!getApps().length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '';
    if (raw) {
      const parsed = JSON.parse(raw);
      initializeApp({ credential: cert({ projectId: parsed.project_id, clientEmail: parsed.client_email, privateKey: String(parsed.private_key || '').replace(/\\n/g, '\n') }) });
    } else {
      initializeApp({ credential: cert({ projectId: process.env.FIREBASE_PROJECT_ID, clientEmail: process.env.FIREBASE_CLIENT_EMAIL, privateKey: String(process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n') }) });
    }
  }
  return getAuth();
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const authorization = typeof req.headers.authorization === 'string' ? req.headers.authorization : '';
  if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required' });
  try {
    await ensureFirebaseAuth().verifyIdToken(authorization.slice(7));
  } catch {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const expectedCode = String(process.env.ACTIVATION_CODE || '').trim();
  if (!expectedCode) return res.status(500).json({ error: 'Kode aktivasi belum dikonfigurasi.' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const code = typeof body.code === 'string' ? body.code.trim() : '';
  return res.status(200).json({ valid: sameSecret(code, expectedCode) });
}
