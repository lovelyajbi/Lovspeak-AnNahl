export type AiDiagnosticLevel = 'info' | 'warn' | 'error';

export interface AiDiagnosticEntry {
  at: string;
  requestId: string;
  module: string;
  phase: string;
  level: AiDiagnosticLevel;
  model?: string;
  keySlot?: number;
  keyId?: string;
  attempt?: number;
  durationMs?: number;
  code?: string;
  message?: string;
  details?: Record<string, unknown>;
}

const STORAGE_KEY = 'lovspeak_ai_diagnostics_v1';
const MAX_ENTRIES = 150;
let requestSequence = 0;

const redactText = (value: string): string => value
  .replace(/AIza[0-9A-Za-z_-]{15,}/g, '[REDACTED_API_KEY]')
  .replace(/([?&](?:key|api[_-]?key)=)[^&\s]+/gi, '$1[REDACTED]')
  .slice(0, 500);

const sanitizeDetails = (details?: Record<string, unknown>): Record<string, unknown> | undefined => {
  if (!details) return undefined;
  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(details)) {
    if (/api.?key|base64|audio|prompt|contents?|recording/i.test(key)) continue;
    if (typeof value === 'string') safe[key] = redactText(value);
    else if (typeof value === 'number' || typeof value === 'boolean' || value === null) safe[key] = value;
    else if (Array.isArray(value)) safe[key] = value.slice(0, 12).map(item =>
      typeof item === 'string' ? redactText(item) : item
    );
  }
  return Object.keys(safe).length > 0 ? safe : undefined;
};

const readEntries = (): AiDiagnosticEntry[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.slice(-MAX_ENTRIES) : [];
  } catch {
    return [];
  }
};

const installConsoleHelper = () => {
  if (typeof window === 'undefined' || window.lovSpeakAI) return;
  window.lovSpeakAI = {
    recent: (limit = 50) => readEntries().slice(-Math.max(1, Math.min(MAX_ENTRIES, limit))),
    print: (limit = 50) => {
      const rows = readEntries().slice(-Math.max(1, Math.min(MAX_ENTRIES, limit))).map(entry => ({
        time: entry.at.slice(11, 23),
        module: entry.module,
        phase: entry.phase,
        model: entry.model || '-',
        key: entry.keySlot ? `#${entry.keySlot} ${entry.keyId || ''}`.trim() : '-',
        attempt: entry.attempt || '-',
        duration: typeof entry.durationMs === 'number' ? `${entry.durationMs}ms` : '-',
        code: entry.code || '-',
        message: entry.message || '-',
      }));
      console.table(rows);
      return rows;
    },
    clear: () => {
      localStorage.removeItem(STORAGE_KEY);
      console.info('[AI-MONITOR] Diagnostic history cleared.');
    },
  };
  console.info('[AI-MONITOR] Ready. Run lovSpeakAI.print() to inspect recent AI activity.');
};

declare global {
  interface Window {
    lovSpeakAI?: {
      recent: (limit?: number) => AiDiagnosticEntry[];
      print: (limit?: number) => unknown[];
      clear: () => void;
    };
  }
}

export const createAiDiagnosticRequestId = (module: string): string => {
  requestSequence = (requestSequence + 1) % 10000;
  const prefix = module.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 18) || 'ai';
  return `${prefix}-${Date.now().toString(36)}-${requestSequence}`;
};

export const recordAiDiagnostic = (entry: Omit<AiDiagnosticEntry, 'at' | 'level'> & { level?: AiDiagnosticLevel }) => {
  try {
    installConsoleHelper();
    const safeEntry: AiDiagnosticEntry = {
      ...entry,
      at: new Date().toISOString(),
      level: entry.level || 'info',
      message: entry.message ? redactText(entry.message) : undefined,
      details: sanitizeDetails(entry.details),
    };
    const entries = readEntries();
    entries.push(safeEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-MAX_ENTRIES)));
    const label = `[AI-MONITOR] ${safeEntry.module} · ${safeEntry.phase}`;
    if (safeEntry.level === 'error') console.error(label, safeEntry);
    else if (safeEntry.level === 'warn') console.warn(label, safeEntry);
    else console.info(label, safeEntry);
  } catch {
    // Diagnostics must never affect an AI request.
  }
};

if (typeof window !== 'undefined') installConsoleHelper();
