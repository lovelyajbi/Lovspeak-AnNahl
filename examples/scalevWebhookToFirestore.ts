/**
 * Example backend logic for a working Scalev webhook endpoint.
 *
 * This file is NOT used by the LovSpeak frontend app directly.
 * Use it as a reference in the backend project that already accepts webhook requests.
 */

type ScalevPayload = {
  event?: string;
  unique_id?: string;
  entity_id?: string;
  entity_type?: string;
  timestamp?: string;
  data?: {
    id?: string;
    order_id?: string;
    payment_status?: string;
    created_at?: string;
    last_updated_at?: string;
    paid_time?: string;
    sku?: string;
    product_sku?: string;
    productSku?: string;
    customer?: {
      email?: string;
      name?: string;
    };
    metadata?: {
      event_source_url?: string;
    };
  };
};

type FirestoreLike = {
  collection: (name: string) => {
    doc: (id: string) => {
      set: (data: Record<string, unknown>, options?: { merge?: boolean }) => Promise<void>;
    };
  };
};

const LOVSPEAK_SKU = 'LovspeakAks';
const LOVSPEAK_SOURCE_URL = 'https://lovelya-edu.myscalev.com/lovspeakcop';
const COLLECTION_NAME = 'scalevWebhookAccess';

const normalize = (value?: string | null) => (value || '').trim();
const normalizeLower = (value?: string | null) => normalize(value).toLowerCase();

export async function handleLovSpeakScalevWebhook(
  firestore: FirestoreLike,
  payload: ScalevPayload
) {
  const event = payload?.event || '';
  const data = payload?.data || {};

  const paymentStatus = normalizeLower(data.payment_status);
  const email = normalizeLower(data.customer?.email);
  const sku = normalize(data.sku || data.product_sku || data.productSku);
  const sourceUrl = normalize(data.metadata?.event_source_url);

  const isLovSpeakSku = normalizeLower(sku) === normalizeLower(LOVSPEAK_SKU);
  const isLovSpeakSource = normalizeLower(sourceUrl) === normalizeLower(LOVSPEAK_SOURCE_URL);

  if (event !== 'payment.received') {
    return { ok: true, ignored: true, reason: 'unsupported_event' as const };
  }

  if (paymentStatus !== 'paid') {
    return { ok: true, ignored: true, reason: 'payment_not_paid' as const };
  }

  if (!email) {
    return { ok: false, ignored: false, reason: 'missing_email' as const };
  }

  if (!isLovSpeakSku && !isLovSpeakSource) {
    return { ok: true, ignored: true, reason: 'not_lovspeak_product' as const };
  }

  const docId =
    normalize(data.order_id) ||
    normalize(payload.entity_id) ||
    normalize(data.id) ||
    normalize(payload.unique_id) ||
    `${Date.now()}`;

  await firestore.collection(COLLECTION_NAME).doc(docId).set({
    email,
    emailNormalized: email,
    status: 'paid',
    active: true,
    sku: sku || LOVSPEAK_SKU,
    orderId: normalize(data.order_id) || null,
    sourceUrl: sourceUrl || null,
    customerName: normalize(data.customer?.name) || null,
    paidTime: normalize(data.paid_time) || null,
    createdAt: normalize(data.created_at) || payload.timestamp || new Date().toISOString(),
    updatedAt: normalize(data.last_updated_at) || payload.timestamp || new Date().toISOString(),
    rawEvent: event,
    rawEntityType: normalize(payload.entity_type) || null,
    rawEntityId: normalize(payload.entity_id) || null,
  }, { merge: true });

  return {
    ok: true,
    ignored: false,
    reason: 'stored' as const,
    docId,
    email,
    sku: sku || LOVSPEAK_SKU,
  };
}
