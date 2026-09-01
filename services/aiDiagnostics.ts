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
let monitorTimer: ReturnType<typeof setInterval> | null = null;

interface ActiveAiDiagnostic {
  requestId: string;
  module: string;
  phase: string;
  model?: string;
  keySlot?: number;
  attempt?: number;
  startedAt: number;
  phaseStartedAt: number;
  details?: Record<string, unknown>;
}

const formatDetails = (details?: Record<string, unknown>): string => {
  if (!details || Object.keys(details).length === 0) return '-';
  try { return JSON.stringify(details).slice(0, 240); } catch { return '-'; }
};

const activeRequests = new Map<string, ActiveAiDiagnostic>();

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

const activeRows = () => Array.from(activeRequests.values()).map(entry => ({
  module: entry.module,
  stage: entry.phase,
  stage_seconds: ((Date.now() - entry.phaseStartedAt) / 1000).toFixed(1),
  total_seconds: ((Date.now() - entry.startedAt) / 1000).toFixed(1),
  model: entry.model || '-',
  key: entry.keySlot ? `#${entry.keySlot}` : '-',
  attempt: entry.attempt || '-',
  detail: formatDetails(entry.details),
  request: entry.requestId,
}));

const printActive = () => {
  const rows = activeRows();
  if (rows.length === 0) console.log('[AI-MONITOR] No AI process is currently active.');
  else console.table(rows);
  return rows;
};

const installConsoleHelper = () => {
  if (typeof window === 'undefined') return;
  window.lovSpeakAI = {
    recent: (limit = 50) => readEntries().slice(-Math.max(1, Math.min(MAX_ENTRIES, limit))),
    print: (limit = 50) => {
      const rows = readEntries().slice(-Math.max(1, Math.min(MAX_ENTRIES, limit))).map(entry => ({
        time: entry.at.slice(11, 23),
        module: entry.module,
        phase: entry.phase,
        model: entry.model || '-',
        key: entry.keySlot ? `#${entry.keySlot}` : '-',
        attempt: entry.attempt || '-',
        duration: typeof entry.durationMs === 'number' ? `${entry.durationMs}ms` : '-',
        code: entry.code || '-',
        message: entry.message || '-',
        detail: formatDetails(entry.details),
      }));
      console.table(rows);
      return rows;
    },
    status: () => printActive(),
    watch: (intervalSeconds = 5) => {
      if (monitorTimer) clearInterval(monitorTimer);
      const seconds = Math.max(1, Math.min(30, Number(intervalSeconds) || 5));
      console.log(`[AI-MONITOR] Live monitor started (${seconds}s interval). Run lovSpeakAI.stop() to stop it.`);
      printActive();
      monitorTimer = setInterval(printActive, seconds * 1000);
      return activeRows();
    },
    stop: () => {
      if (monitorTimer) clearInterval(monitorTimer);
      monitorTimer = null;
      console.log('[AI-MONITOR] Live monitor stopped.');
    },
    help: () => {
      const commands = [
        'lovSpeakAI.status()     — current stage, model, key number, and elapsed seconds',
        'lovSpeakAI.watch(5)     — repeat the current status every 5 seconds',
        'lovSpeakAI.stop()       — stop the repeating monitor',
        'lovSpeakAI.print(50)    — show the latest 50 completed/transition events',
        'lovSpeakAI.clear()      — clear saved diagnostic history',
      ];
      console.log(commands.join('\n'));
      return commands;
    },
    clear: () => {
      localStorage.removeItem(STORAGE_KEY);
      console.info('[AI-MONITOR] Diagnostic history cleared.');
    },
  };
  console.log('[AI-MONITOR] Ready. Run lovSpeakAI.help() to see monitoring commands.');
};

declare global {
  interface Window {
    lovSpeakAI?: {
      recent: (limit?: number) => AiDiagnosticEntry[];
      print: (limit?: number) => unknown[];
      status: () => unknown[];
      watch: (intervalSeconds?: number) => unknown[];
      stop: () => void;
      help: () => string[];
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
    const existing = activeRequests.get(entry.requestId);
    const safeEntry: AiDiagnosticEntry = {
      ...entry,
      at: new Date().toISOString(),
      level: entry.level || 'info',
      model: entry.model || existing?.model,
      keySlot: entry.keySlot || existing?.keySlot,
      attempt: entry.attempt || existing?.attempt,
      message: entry.message ? redactText(entry.message) : undefined,
      details: sanitizeDetails(entry.details),
    };
    const entries = readEntries();
    entries.push(safeEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-MAX_ENTRIES)));
    const now = Date.now();
    const terminalPhase = /request_completed|request_failed|session_stopped|all_keys|reconnect_exhausted/i.test(safeEntry.phase);
    if (terminalPhase) {
      activeRequests.delete(safeEntry.requestId);
    } else {
      activeRequests.set(safeEntry.requestId, {
        requestId: safeEntry.requestId,
        module: safeEntry.module,
        phase: safeEntry.phase,
        model: safeEntry.model || existing?.model,
        keySlot: safeEntry.keySlot || existing?.keySlot,
        attempt: safeEntry.attempt || existing?.attempt,
        startedAt: existing?.startedAt || now,
        phaseStartedAt: existing?.phase === safeEntry.phase ? existing.phaseStartedAt : now,
        details: safeEntry.details,
      });
    }
    const label = `[AI-MONITOR] ${safeEntry.module} · ${safeEntry.phase}`;
    if (safeEntry.level === 'error') console.error(label, safeEntry);
    else if (safeEntry.level === 'warn') console.warn(label, safeEntry);
    else console.log(label, safeEntry);
  } catch {
    // Diagnostics must never affect an AI request.
  }
};

if (typeof window !== 'undefined') installConsoleHelper();
