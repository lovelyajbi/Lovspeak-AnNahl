import { cert, getApps, getApp, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Creates one Firebase Admin app per serverless instance. All server-only
 * access-control endpoints use this helper so credentials never reach the
 * browser bundle.
 */
export const getFirebaseAdmin = () => {
  const app = getApps().length
    ? getApp()
    : (() => {
        const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '';
        if (raw) {
          const parsed = JSON.parse(raw);
          return initializeApp({
            credential: cert({
              projectId: parsed.project_id,
              clientEmail: parsed.client_email,
              privateKey: String(parsed.private_key || '').replace(/\\n/g, '\n'),
            }),
          });
        }
        return initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: String(process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
          }),
        });
      })();

  return { auth: getAuth(app), db: getFirestore(app) };
};
