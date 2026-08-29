export type PronunciationWordStatus = 'correct' | 'incorrect' | 'missed';

export interface NormalizedPronunciationAnalysis {
  feedback: string;
  wordAnalysis: Array<{
    word: string;
    status: PronunciationWordStatus;
    errorDetails: string;
  }>;
}

const STATUS_CODES: Record<string, PronunciationWordStatus> = {
  c: 'correct', correct: 'correct',
  i: 'incorrect', incorrect: 'incorrect',
  m: 'missed', missed: 'missed',
};

const cleanWord = (word: unknown): string => String(word || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const normalizeStatus = (value: unknown): PronunciationWordStatus | null => {
  if (typeof value !== 'string') return null;
  return STATUS_CODES[value.trim().toLowerCase()] || null;
};

const normalizeFeedback = (value: unknown): string => {
  if (typeof value !== 'string' || !value.trim()) {
    return 'Keep practising the words marked for review, then read the passage again at a steady pace.';
  }
  return value.trim();
};

export const normalizePronunciationAnalysis = (
  targetWords: string[],
  raw: unknown,
): NormalizedPronunciationAnalysis | null => {
  if (!raw || typeof raw !== 'object' || targetWords.length === 0) return null;
  const payload = raw as Record<string, unknown>;

  const buildCompactResult = (statuses: Array<PronunciationWordStatus | null>) => {
    if (statuses.length !== targetWords.length || statuses.some(status => status === null)) return null;

    const detailsByIndex = new Map<number, string>();
    if (payload.errors !== undefined && !Array.isArray(payload.errors)) return null;
    for (const item of (payload.errors as unknown[] | undefined) || []) {
      if (!item || typeof item !== 'object') return null;
      const error = item as Record<string, unknown>;
      const index = Number(error.index);
      const details = typeof error.details === 'string' ? error.details.trim() : '';
      if (!Number.isInteger(index) || index < 0 || index >= targetWords.length || !details) return null;
      detailsByIndex.set(index, details);
    }

    return {
      feedback: normalizeFeedback(payload.feedback),
      wordAnalysis: targetWords.map((word, index) => ({
        word,
        status: statuses[index] as PronunciationWordStatus,
        errorDetails: statuses[index] === 'incorrect'
          ? (detailsByIndex.get(index) || 'Pronunciation needs more practice.')
          : '',
      })),
    };
  };

  // Accept the new one-character-per-word response and the previous array
  // response so older/cached model output remains compatible.
  if (typeof payload.statusMap === 'string') {
    const codes = payload.statusMap.toLowerCase().replace(/\s+/g, '').split('');
    return buildCompactResult(codes.map(normalizeStatus));
  }

  if (Array.isArray(payload.statuses)) {
    return buildCompactResult(payload.statuses.map(normalizeStatus));
  }

  if (Array.isArray(payload.wordAnalysis) && payload.wordAnalysis.length === targetWords.length) {
    const normalizedItems = payload.wordAnalysis.map((item, index) => {
      if (!item || typeof item !== 'object') return null;
      const wordItem = item as Record<string, unknown>;
      const status = normalizeStatus(wordItem.status);
      if (!status || cleanWord(wordItem.word) !== cleanWord(targetWords[index])) return null;
      return {
        word: targetWords[index],
        status,
        errorDetails: status === 'incorrect' && typeof wordItem.errorDetails === 'string'
          ? wordItem.errorDetails.trim()
          : '',
      };
    });
    if (normalizedItems.some(item => item === null)) return null;
    return {
      feedback: normalizeFeedback(payload.feedback),
      wordAnalysis: normalizedItems as NormalizedPronunciationAnalysis['wordAnalysis'],
    };
  }

  return null;
};
