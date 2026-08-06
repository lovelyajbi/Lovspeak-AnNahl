import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const COLLECTION_NAME = 'scalevWebhookAccess';
const DEFAULT_ALLOWED_SKUS = ['LovspeakAks'];
const DEFAULT_ALLOWED_SOURCE_URLS = ['https://lovelya-edu.myscalev.com/lovspeakcop'];

const normalize = (value?: string | null) => (value || '').trim();
const normalizeLower = (value?: string | null) => normalize(value).toLowerCase();

const getEnvList = (value: string | undefined, fallback: string[]) => {
  const items = (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : fallback;
};

const getAllowedSkus = () =>
  getEnvList(process.env.SCALEV_ALLOWED_SKUS, DEFAULT_ALLOWED_SKUS).map((item) => item.toLowerCase());

const getAllowedSourceUrls = () =>
  getEnvList(process.env.SCALEV_LOVSPEAK_SOURCE_URLS, DEFAULT_ALLOWED_SOURCE_URLS).map((item) => item.toLowerCase());

const getAccessKeyFromRequest = (req: VercelRequest) => {
  const queryKey = typeof req.query.key === 'string' ? req.query.key : '';
  const headerKey = typeof req.headers['x-webhook-key'] === 'string' ? req.headers['x-webhook-key'] : '';
  const authHeader = typeof req.headers.authorization === 'string' ? req.headers.authorization : '';

  if (queryKey) return queryKey;
  if (headerKey) return headerKey;
  if (authHeader.startsWith('Bearer ')) return authHeader.slice('Bearer '.length).trim();

  return '';
};

const ensureFirebase = () => {
  if (!getApps().length) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '';
    if (!serviceAccountJson) {
      throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_JSON');
    }

    const parsed = JSON.parse(serviceAccountJson);
    initializeApp({
      credential: cert({
        projectId: parsed.project_id,
        clientEmail: parsed.client_email,
        privateKey: String(parsed.private_key || '').replace(/\\n/g, '\n'),
      }),
    });
  }

  return getFirestore();
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      service: 'lovspeak-scalev-webhook',
      message: 'Webhook endpoint is reachable.',
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const signingSecret = process.env.SCALEV_SIGNING_SECRET || '';
  if (!signingSecret) {
    return res.status(500).json({ ok: false, error: 'Missing SCALEV_SIGNING_SECRET' });
  }

  const providedKey = getAccessKeyFromRequest(req);
  if (providedKey !== signingSecret) {
    return res.status(401).json({ ok: false, error: 'Unauthorized request' });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const event = payload?.event || '';
    const data = payload?.data || {};

    const paymentStatus = normalizeLower(data.payment_status);
    const email = normalizeLower(data.customer?.email);
    const sku = normalize(data.sku || data.product_sku || data.productSku || data.metadata?.sku);
    const sourceUrl = normalize(data.metadata?.event_source_url);

    if (event !== 'payment.received') {
      return res.status(202).json({ ok: true, ignored: true, reason: 'unsupported_event' });
    }

    if (paymentStatus !== 'paid') {
      return res.status(202).json({ ok: true, ignored: true, reason: 'payment_not_paid' });
    }

    if (!email) {
      return res.status(422).json({ ok: false, error: 'Missing customer email' });
    }

    const skuAllowed = getAllowedSkus().includes(normalizeLower(sku));
    const sourceAllowed = getAllowedSourceUrls().includes(normalizeLower(sourceUrl));

    if (!skuAllowed && !sourceAllowed) {
      return res.status(202).json({
        ok: true,
        ignored: true,
        reason: 'not_lovspeak_product',
        sku: sku || null,
        sourceUrl: sourceUrl || null,
      });
    }

    const firestore = ensureFirebase();
    const docId =
      normalize(data.order_id) ||
      normalize(payload?.entity_id) ||
      normalize(data.id) ||
      normalize(payload?.unique_id) ||
      `${Date.now()}`;

    await firestore.collection(COLLECTION_NAME).doc(docId).set({
      email,
      emailNormalized: email,
      status: 'paid',
      active: true,
      sku: sku || DEFAULT_ALLOWED_SKUS[0],
      orderId: normalize(data.order_id) || null,
      sourceUrl: sourceUrl || null,
      customerName: normalize(data.customer?.name) || null,
      paidTime: normalize(data.paid_time) || null,
      createdAt: normalize(data.created_at) || payload?.timestamp || new Date().toISOString(),
      updatedAt: normalize(data.last_updated_at) || payload?.timestamp || new Date().toISOString(),
      rawEvent: event,
      rawEntityId: normalize(payload?.entity_id) || null,
      rawUniqueId: normalize(payload?.unique_id) || null,
    }, { merge: true });

    return res.status(200).json({
      ok: true,
      stored: true,
      email,
      sku: sku || DEFAULT_ALLOWED_SKUS[0],
      orderId: normalize(data.order_id) || null,
    });
  } catch (error) {
    console.error('LovSpeak webhook error:', error);
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
