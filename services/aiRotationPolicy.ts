export type AiCooldownReason = 'quota' | 'timeout' | 'network' | 'server' | 'permission' | 'invalid';

export const AI_ROTATION_POLICY_VERSION = 3;
export const AI_ROTATION_POLICY_STORAGE_KEY = 'lovelya_api_rotation_policy_version';

const MINUTE_MS = 60 * 1000;
const DAY_MS = 24 * 60 * MINUTE_MS;
export const QUOTA_DAILY_COOLDOWN_MS = DAY_MS;

export interface QuotaStrikeState {
  count: number;
  firstLimitedAt: number;
}

export interface QuotaCooldownDecision extends QuotaStrikeState {
  until: number;
  isDaily: boolean;
}

const errorText = (error: unknown): string => {
  if (!error) return '';
  if (typeof error === 'string') return error;
  const value = error as Record<string, unknown>;
  const parts = [value.message, value.status, value.code];
  try {
    parts.push(JSON.stringify(value.details || value.error || ''));
  } catch {
    // Ignore circular error metadata; the regular message is still usable.
  }
  return parts.filter(Boolean).join(' ').toLowerCase();
};

const fallbackFingerprint = (key: string): string => {
  // FNV-1a fallback for older/non-secure browser contexts. API keys are
  // high-entropy values; only this irreversible short identifier is stored.
  let hash = 0x811c9dc5;
  for (let index = 0; index < key.length; index += 1) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `k_${(hash >>> 0).toString(16).padStart(8, '0')}`;
};

export const fingerprintApiKey = async (key: string): Promise<string> => {
  try {
    const subtle = globalThis.crypto?.subtle;
    if (!subtle) return fallbackFingerprint(key);
    const bytes = new TextEncoder().encode(key);
    const digest = await subtle.digest('SHA-256', bytes);
    const hex = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
    return `k_${hex.slice(0, 16)}`;
  } catch {
    return fallbackFingerprint(key);
  }
};

export const makeKeyModelCooldownId = (fingerprint: string, model: string): string =>
  `${fingerprint}::${model}`;

const getTimeZoneOffsetMs = (date: Date, timeZone: string): number => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  const representedAsUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );
  return representedAsUtc - date.getTime();
};

export const millisecondsUntilPacificMidnight = (nowMs: number = Date.now()): number => {
  const timeZone = 'America/Los_Angeles';
  const now = new Date(nowMs);
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  const nextLocalMidnightAsUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day) + 1,
  );

  // Resolve the timezone offset twice to remain correct across DST changes.
  let candidate = nextLocalMidnightAsUtc;
  candidate = nextLocalMidnightAsUtc - getTimeZoneOffsetMs(new Date(candidate), timeZone);
  candidate = nextLocalMidnightAsUtc - getTimeZoneOffsetMs(new Date(candidate), timeZone);
  return Math.max(MINUTE_MS, candidate - nowMs + 2 * MINUTE_MS);
};

const parseServerRetryDelayMs = (text: string): number | null => {
  const patterns = [
    /retry(?:delay|\s+after|\s+in)?[\s"':=]+(\d+(?:\.\d+)?)\s*(ms|milliseconds?|s|seconds?|m|minutes?)/i,
    /"retryDelay"\s*:\s*"?(\d+(?:\.\d+)?)\s*(s|m|ms)"?/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;
    const amount = Number(match[1]);
    const unit = match[2].toLowerCase();
    if (!Number.isFinite(amount) || amount <= 0) continue;
    if (unit.startsWith('ms')) return amount;
    if (unit.startsWith('m') && !unit.startsWith('ms')) return amount * MINUTE_MS;
    return amount * 1000;
  }
  return null;
};

export const getQuotaCooldownMs = (error: unknown, nowMs: number = Date.now()): number => {
  const text = errorText(error);
  const serverDelay = parseServerRetryDelayMs(text);
  if (serverDelay !== null) return Math.min(DAY_MS, Math.max(30 * 1000, serverDelay + 5 * 1000));

  if (/requests?[_\s-]*per[_\s-]*day|tokens?[_\s-]*per[_\s-]*day|\brpd\b|\btpd\b|daily/.test(text)) {
    return DAY_MS;
  }
  if (/requests?[_\s-]*per[_\s-]*minute|tokens?[_\s-]*per[_\s-]*minute|\brpm\b|\btpm\b|per minute/.test(text)) {
    return 90 * 1000;
  }

  // Unknown 429s are retried after a short recovery window instead of
  // disabling a healthy project for six hours.
  return 5 * MINUTE_MS;
};

export const isDailyQuotaError = (error: unknown): boolean => {
  const text = errorText(error);
  return /requests?[_\s-]*per[_\s-]*day|tokens?[_\s-]*per[_\s-]*day|\brpd\b|\btpd\b|daily/.test(text);
};

export const getQuotaCooldownDecision = (
  error: unknown,
  previous: QuotaStrikeState | null,
  nowMs: number = Date.now(),
): QuotaCooldownDecision => {
  const hasRecentFirstStrike = Boolean(
    previous &&
    Number.isFinite(previous.firstLimitedAt) &&
    previous.firstLimitedAt <= nowMs &&
    nowMs < previous.firstLimitedAt + DAY_MS &&
    previous.count >= 1,
  );
  const firstLimitedAt = hasRecentFirstStrike ? previous!.firstLimitedAt : nowMs;
  const count = hasRecentFirstStrike ? previous!.count + 1 : 1;
  const isDaily = isDailyQuotaError(error) || count >= 2;
  const until = isDaily
    ? firstLimitedAt + DAY_MS
    : nowMs + getQuotaCooldownMs(error, nowMs);

  return { count, firstLimitedAt, until, isDaily };
};

export const hasAllKeysLimitedForModel = (
  quotaKeysByModel: Map<string, Set<number>>,
  model: string,
  keyCount: number,
): boolean => keyCount > 0 && quotaKeysByModel.get(model)?.size === keyCount;
