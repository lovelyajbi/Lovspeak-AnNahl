import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const ACCESS_COLLECTION = 'scalevWebhookAccess';
const ORDER_SNAPSHOT_COLLECTION = 'scalevWebhookOrders';

const DEFAULT_ALLOWED_SKUS = ['LovspeakAks'];
const DEFAULT_ALLOWED_SOURCE_URLS = [
  'https://lovelya-edu.myscalev.com/lovspeakcop',
  'https://lovelya-edu.myscalev.com/lovspeak1',
];

const ORDER_SNAPSHOT_EVENTS = new Set([
  'order.created',
  'order.updated',
  'order.epayment_created',
]);

const ACCESS_EVENTS = new Set([
  'payment.received',
  'order.payment_status_changed',
  'order.status_changed',
]);

const normalize = (value?: string | null) => String(value || '').trim();
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

const ensureFirebase = () => {
  if (!getApps().length) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '';

    if (serviceAccountJson) {
      const parsed = JSON.parse(serviceAccountJson);
      initializeApp({
        credential: cert({
          projectId: parsed.project_id,
          clientEmail: parsed.client_email,
          privateKey: String(parsed.private_key || '').replace(/\\n/g, '\n'),
        }),
      });
    } else {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = String(process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

      if (!projectId || !clientEmail || !privateKey) {
        throw new Error('Missing Firebase Admin environment variables.');
      }

      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }
  }

  return getFirestore();
};

const extractCustomerEmail = (data: any) =>
  normalize(
    data?.customer?.email ||
      data?.destination_address?.email ||
      data?.destinationAddress?.email
  );

const extractSourceUrl = (data: any) =>
  normalize(
    data?.sourceUrl ||
      data?.eventSourceUrl ||
      data?.metadata?.event_source_url
  );

const extractSku = (data: any) => {
  const orderlineSku = Array.isArray(data?.orderlines)
    ? data.orderlines
        .map((orderline: any) =>
          normalize(
            orderline?.variant_sku ||
              orderline?.sku ||
              orderline?.product_sku
          )
        )
        .find(Boolean)
    : '';

  return normalize(
    data?.sku ||
      data?.product_sku ||
      data?.productSku ||
      data?.metadata?.sku ||
      orderlineSku
  );
};

const getOrderKeys = (payload: any, data: any) => {
  const values = [
    normalize(payload?.entity_id),
    normalize(data?.id),
    normalize(data?.order_id),
  ].filter(Boolean);

  return Array.from(new Set(values));
};

const getPrimaryOrderKey = (payload: any, data: any) => {
  const keys = getOrderKeys(payload, data);
  return keys[0] || normalize(payload?.unique_id) || `scalev-${Date.now()}`;
};

const isPaidLike = (event: string, data: any) => {
  const paymentStatus = normalizeLower(data?.payment_status);
  const orderStatus = normalizeLower(data?.status);

  if (event === 'order.status_changed') {
    return orderStatus === 'completed';
  }

  return ['paid', 'settled', 'completed'].includes(paymentStatus || orderStatus);
};

const matchesLovSpeakProduct = (sku?: string | null, sourceUrl?: string | null) => {
  const allowedSkus = getAllowedSkus();
  const allowedSourceUrls = getAllowedSourceUrls();
  const normalizedSku = normalizeLower(sku);
  const normalizedSourceUrl = normalizeLower(sourceUrl);

  if (allowedSkus.length === 0 && allowedSourceUrls.length === 0) {
    return true;
  }

  return (
    (!!normalizedSku && allowedSkus.includes(normalizedSku)) ||
    (!!normalizedSourceUrl && allowedSourceUrls.includes(normalizedSourceUrl))
  );
};

const getAccessKey = (params: {
  queryKey?: string;
  headers?: Record<string, string | undefined>;
}) => {
  const queryKey = normalize(params.queryKey);
  const headerKey = normalize(params.headers?.['x-webhook-key']);
  const authHeader = normalize(params.headers?.authorization);

  if (queryKey) return queryKey;
  if (headerKey) return headerKey;
  if (authHeader.startsWith('Bearer ')) return authHeader.slice('Bearer '.length).trim();

  return '';
};

const findOrderSnapshot = async (payload: any, data: any) => {
  const firestore = ensureFirebase();
  const orderKeys = getOrderKeys(payload, data);

  for (const key of orderKeys) {
    const snapshotDoc = await firestore.collection(ORDER_SNAPSHOT_COLLECTION).doc(key).get();
    if (snapshotDoc.exists) {
      return { id: key, data: snapshotDoc.data() || {} };
    }
  }

  return null;
};

const saveOrderSnapshot = async (payload: any, data: any) => {
  const firestore = ensureFirebase();
  const docId = getPrimaryOrderKey(payload, data);
  const email = normalizeLower(extractCustomerEmail(data));
  const sku = extractSku(data);
  const sourceUrl = extractSourceUrl(data);
  const now = payload?.timestamp || new Date().toISOString();

  await firestore.collection(ORDER_SNAPSHOT_COLLECTION).doc(docId).set(
    {
      email: email || null,
      emailNormalized: email || null,
      sku: sku || null,
      sourceUrl: sourceUrl || null,
      orderId: normalize(data?.order_id) || null,
      entityId: normalize(payload?.entity_id) || normalize(data?.id) || null,
      status: normalize(data?.status) || null,
      paymentStatus: normalize(data?.payment_status) || null,
      productMatched: matchesLovSpeakProduct(sku, sourceUrl),
      customerName: normalize(data?.customer?.name) || null,
      lastEvent: normalize(payload?.event) || null,
      createdAt: normalize(data?.created_at) || now,
      updatedAt: normalize(data?.last_updated_at) || now,
      raw: {
        uniqueId: normalize(payload?.unique_id) || null,
        eventSourceUrl: sourceUrl || null,
        sku: sku || null,
      },
    },
    { merge: true }
  );

  return {
    docId,
    email,
    sku,
    sourceUrl,
  };
};

const activateAccess = async (payload: any, data: any) => {
  const firestore = ensureFirebase();
  const snapshot = await findOrderSnapshot(payload, data);

  const email = normalizeLower(extractCustomerEmail(data) || snapshot?.data?.email || snapshot?.data?.emailNormalized);
  const sku = extractSku(data) || normalize(snapshot?.data?.sku);
  const sourceUrl = extractSourceUrl(data) || normalize(snapshot?.data?.sourceUrl);

  if (!isPaidLike(payload?.event || '', data)) {
    return {
      status: 202,
      body: {
        ok: true,
        ignored: true,
        reason: 'payment_not_settled',
        event: payload?.event || null,
        paymentStatus: data?.payment_status || null,
        orderStatus: data?.status || null,
      },
    };
  }

  if (!matchesLovSpeakProduct(sku, sourceUrl)) {
    return {
      status: 202,
      body: {
        ok: true,
        ignored: true,
        reason: 'SKU/source URL not mapped to LovSpeak',
        sku: sku || null,
        sourceUrl: sourceUrl || '',
      },
    };
  }

  if (!email) {
    return {
      status: 202,
      body: {
        ok: true,
        ignored: true,
        reason: 'Customer email not found in event or snapshot',
        orderId: data?.order_id || null,
      },
    };
  }

  const docId = getPrimaryOrderKey(payload, data);
  const status = normalize(data?.payment_status || data?.status) || 'paid';
  const now = payload?.timestamp || new Date().toISOString();

  await firestore.collection(ACCESS_COLLECTION).doc(docId).set(
    {
      email,
      emailNormalized: email,
      status,
      active: true,
      sku: sku || DEFAULT_ALLOWED_SKUS[0],
      productName: 'LovSpeak',
      orderId: normalize(data?.order_id) || snapshot?.data?.orderId || null,
      sourceUrl: sourceUrl || null,
      customerName: normalize(data?.customer?.name) || snapshot?.data?.customerName || null,
      scalevEvent: normalize(payload?.event) || null,
      scalevEntityId: normalize(payload?.entity_id) || normalize(data?.id) || null,
      uniqueId: normalize(payload?.unique_id) || null,
      paidTime: normalize(data?.paid_time) || null,
      orderSnapshotFound: !!snapshot,
      createdAt: normalize(data?.created_at) || snapshot?.data?.createdAt || now,
      updatedAt: normalize(data?.last_updated_at) || now,
      raw: {
        event: normalize(payload?.event) || null,
        entityType: normalize(payload?.entity_type) || null,
        entityId: normalize(payload?.entity_id) || null,
        orderId: normalize(data?.order_id) || null,
        paymentStatus: normalize(data?.payment_status) || null,
        orderStatus: normalize(data?.status) || null,
        sku: sku || null,
        eventSourceUrl: sourceUrl || null,
      },
    },
    { merge: true }
  );

  return {
    status: 200,
    body: {
      ok: true,
      stored: true,
      email,
      sku: sku || DEFAULT_ALLOWED_SKUS[0],
      sourceUrl: sourceUrl || null,
      orderId: normalize(data?.order_id) || null,
      orderSnapshotFound: !!snapshot,
    },
  };
};

export const handleScalevWebhook = async (params: {
  method: string;
  queryKey?: string;
  headers?: Record<string, string | undefined>;
  bodyText?: string;
}) => {
  if (params.method === 'GET') {
    return {
      status: 200,
      body: {
        ok: true,
        service: 'lovspeak-scalev-webhook',
        message: 'Webhook endpoint is reachable.',
      },
    };
  }

  if (params.method !== 'POST') {
    return {
      status: 405,
      body: { ok: false, error: 'Method not allowed' },
    };
  }

  const expectedKey = process.env.SCALEV_SIGNING_SECRET || process.env.SCALEV_WEBHOOK_KEY || '';
  if (!expectedKey) {
    return {
      status: 500,
      body: { ok: false, error: 'Missing SCALEV_SIGNING_SECRET' },
    };
  }

  const providedKey = getAccessKey({
    queryKey: params.queryKey,
    headers: params.headers,
  });

  if (providedKey !== expectedKey) {
    return {
      status: 401,
      body: { ok: false, error: 'Unauthorized request' },
    };
  }

  try {
    const payload = JSON.parse(params.bodyText || '{}');
    const event = normalize(payload?.event);
    const data = payload?.data || {};

    if (event === 'business.test_event') {
      return {
        status: 200,
        body: { ok: true, ignored: true, event },
      };
    }

    if (ORDER_SNAPSHOT_EVENTS.has(event)) {
      const snapshot = await saveOrderSnapshot(payload, data);
      return {
        status: 200,
        body: {
          ok: true,
          snapshotStored: true,
          event,
          email: snapshot.email || null,
          sku: snapshot.sku || null,
          sourceUrl: snapshot.sourceUrl || null,
        },
      };
    }

    if (ACCESS_EVENTS.has(event)) {
      return await activateAccess(payload, data);
    }

    return {
      status: 200,
      body: {
        ok: true,
        ignored: true,
        reason: 'unsupported_event',
        event,
      },
    };
  } catch (error) {
    console.error('Scalev webhook error:', error);
    return {
      status: 500,
      body: {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};
