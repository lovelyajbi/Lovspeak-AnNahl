export type PronunciationWordStatus = 'correct' | 'incorrect' | 'missed';

export interface NormalizedPronunciationAnalysis {
  feedback: string;
  wordAnalysis: Array<{
    word: string;
    status: PronunciationWordStatus;
    errorDetails: string;
  }>;
}

export type ReadingAudioStatus = 'speech' | 'silence' | 'unusable';

export interface ReadingAudioTranscription {
  audioStatus: ReadingAudioStatus;
  spokenWords: string[];
  pronunciationIssues: Array<{
    spokenIndex: number;
    details: string;
  }>;
}

export interface AlignedReadingAnalysis extends NormalizedPronunciationAnalysis {
  heardTranscript: string;
  spokenWordCount: number;
  insertedWordCount: number;
}

const STATUS_CODES: Record<string, PronunciationWordStatus> = {
  c: 'correct',
  correct: 'correct',
  i: 'incorrect',
  incorrect: 'incorrect',
  m: 'missed',
  missed: 'missed',
};

const cleanWord = (word: unknown): string => String(word || '')
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[^a-z0-9]/g, '');

const isSingleSpokenToken = (word: unknown): word is string => {
  if (typeof word !== 'string' || !word.trim()) return false;
  return word.trim().split(/\s+/).length === 1 && cleanWord(word).length > 0;
};

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

/**
 * Strictly validates compact index-based AI output and converts it to the
 * legacy wordAnalysis shape consumed by Reading and Shadowing result views.
 * A malformed or misaligned result is rejected instead of being scored.
 */
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

  // Latency-optimized format: one character per target word. Keep accepting
  // the previous statuses array below so cached/older model responses remain valid.
  if (typeof payload.statusMap === 'string') {
    const codes = payload.statusMap.toLowerCase().replace(/\s+/g, '').split('');
    return buildCompactResult(codes.map(normalizeStatus));
  }

  if (Array.isArray(payload.statuses)) {
    return buildCompactResult(payload.statuses.map(normalizeStatus));
  }

  // Direct Reading analysis returns one item per target position. The target
  // word is already known locally, so formatting differences in the redundant
  // AI `word` field must not discard an otherwise complete analysis.
  if (Array.isArray(payload.wordAnalysis) && payload.wordAnalysis.length === targetWords.length) {
    const normalizedItems = payload.wordAnalysis.map((item, index) => {
      if (!item || typeof item !== 'object') return null;
      const wordItem = item as Record<string, unknown>;
      const status = normalizeStatus(wordItem.status);
      if (!status) return null;
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

/**
 * Validates the evidence-first Reading response. The AI is intentionally not
 * given the passage, so this transcript cannot be completed from target-text
 * context when the learner only reads part of it.
 */
export const normalizeReadingAudioTranscription = (raw: unknown): ReadingAudioTranscription | null => {
  if (!raw || typeof raw !== 'object') return null;
  const payload = raw as Record<string, unknown>;
  const audioStatus = typeof payload.audioStatus === 'string'
    ? payload.audioStatus.trim().toLowerCase()
    : '';
  if (audioStatus !== 'speech' && audioStatus !== 'silence' && audioStatus !== 'unusable') return null;
  if (!Array.isArray(payload.spokenWords) || payload.spokenWords.some(word => !isSingleSpokenToken(word))) return null;

  const spokenWords = (payload.spokenWords as string[]).map(word => word.trim());
  if (audioStatus === 'speech' && spokenWords.length === 0) return null;
  if (audioStatus !== 'speech' && spokenWords.length > 0) return null;

  if (payload.pronunciationIssues !== undefined && !Array.isArray(payload.pronunciationIssues)) return null;
  const pronunciationIssues: ReadingAudioTranscription['pronunciationIssues'] = [];
  const seenIssueIndexes = new Set<number>();
  for (const item of (payload.pronunciationIssues as unknown[] | undefined) || []) {
    if (!item || typeof item !== 'object') return null;
    const issue = item as Record<string, unknown>;
    const spokenIndex = Number(issue.spokenIndex);
    const details = typeof issue.details === 'string' ? issue.details.trim() : '';
    if (
      !Number.isInteger(spokenIndex) ||
      spokenIndex < 0 ||
      spokenIndex >= spokenWords.length ||
      !details ||
      seenIssueIndexes.has(spokenIndex)
    ) return null;
    seenIssueIndexes.add(spokenIndex);
    pronunciationIssues.push({ spokenIndex, details });
  }

  return {
    audioStatus: audioStatus as ReadingAudioStatus,
    spokenWords,
    pronunciationIssues,
  };
};

type AlignmentStep =
  | { kind: 'match' | 'substitute'; targetIndex: number; spokenIndex: number }
  | { kind: 'missed'; targetIndex: number }
  | { kind: 'inserted'; spokenIndex: number };

const wordEditDistance = (left: string, right: string): number => {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i++) {
    const current = new Array<number>(right.length + 1);
    current[0] = i;
    for (let j = 1; j <= right.length; j++) {
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1),
      );
    }
    for (let j = 0; j <= right.length; j++) previous[j] = current[j];
  }
  return previous[right.length];
};

const isLikelySubstitution = (target: string, spoken: string): boolean => {
  if (!target || !spoken) return false;
  const longest = Math.max(target.length, spoken.length);
  const distance = wordEditDistance(target, spoken);
  return distance <= Math.max(1, Math.floor(longest * 0.4)) ||
    (target.slice(0, 2) === spoken.slice(0, 2) && Math.abs(target.length - spoken.length) <= 2);
};

/**
 * Deterministic sequence alignment keeps skipped/repeated words from shifting
 * every status that follows. Only an exact heard token can be marked correct;
 * substitutions are attempted-but-incorrect and deletions are missed.
 */
const alignWordSequences = (targetWords: string[], spokenWords: string[]): AlignmentStep[] => {
  const target = targetWords.map(cleanWord);
  const spoken = spokenWords.map(cleanWord);
  const rows = target.length + 1;
  const cols = spoken.length + 1;
  const costs = Array.from({ length: rows }, () => new Uint16Array(cols));
  const moves = Array.from({ length: rows }, () => new Uint8Array(cols));
  // moves: 1=diagonal, 2=delete target, 3=insert spoken
  for (let i = 1; i < rows; i++) { costs[i][0] = i; moves[i][0] = 2; }
  for (let j = 1; j < cols; j++) { costs[0][j] = j; moves[0][j] = 3; }

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const same = target[i - 1] === spoken[j - 1];
      // A non-matching substitution costs the same as one deletion plus one
      // insertion. This lets surrounding exact matches win, so a repeated or
      // skipped word does not shift the rest of the passage.
      const diagonal = costs[i - 1][j - 1] + (same ? 0 : 2);
      const deletion = costs[i - 1][j] + 1;
      const insertion = costs[i][j - 1] + 1;

      // Exact matches always win. A mismatched diagonal wins a tie only when
      // the words are plausibly related; otherwise insertion/deletion better
      // represents a repeated or skipped word without shifting later matches.
      const preferDiagonal = same ||
        diagonal < Math.min(deletion, insertion) ||
        (diagonal === Math.min(deletion, insertion) && isLikelySubstitution(target[i - 1], spoken[j - 1]));
      if (preferDiagonal && diagonal <= deletion && diagonal <= insertion) {
        costs[i][j] = diagonal;
        moves[i][j] = 1;
      } else if (deletion <= insertion) {
        costs[i][j] = deletion;
        moves[i][j] = 2;
      } else {
        costs[i][j] = insertion;
        moves[i][j] = 3;
      }
    }
  }

  const reversed: AlignmentStep[] = [];
  let i = target.length;
  let j = spoken.length;
  while (i > 0 || j > 0) {
    const move = moves[i][j];
    if (i > 0 && j > 0 && move === 1) {
      reversed.push({
        kind: target[i - 1] === spoken[j - 1] ? 'match' : 'substitute',
        targetIndex: i - 1,
        spokenIndex: j - 1,
      });
      i -= 1;
      j -= 1;
    } else if (i > 0 && (move === 2 || j === 0)) {
      reversed.push({ kind: 'missed', targetIndex: i - 1 });
      i -= 1;
    } else {
      reversed.push({ kind: 'inserted', spokenIndex: j - 1 });
      j -= 1;
    }
  }
  return reversed.reverse();
};

export const alignReadingAudioToTarget = (
  targetWords: string[],
  transcription: ReadingAudioTranscription,
): AlignedReadingAnalysis | null => {
  if (targetWords.length === 0 || transcription.audioStatus !== 'speech') return null;
  const issuesBySpokenIndex = new Map(
    transcription.pronunciationIssues.map(issue => [issue.spokenIndex, issue.details]),
  );
  const analysis: NormalizedPronunciationAnalysis['wordAnalysis'] = targetWords.map(word => ({
    word,
    status: 'missed',
    errorDetails: '',
  }));
  let insertedWordCount = 0;

  for (const step of alignWordSequences(targetWords, transcription.spokenWords)) {
    if (step.kind === 'inserted') {
      insertedWordCount += 1;
      continue;
    }
    if (step.kind === 'missed') continue;

    const issueDetails = issuesBySpokenIndex.get(step.spokenIndex);
    if (step.kind === 'match' && !issueDetails) {
      analysis[step.targetIndex] = {
        word: targetWords[step.targetIndex],
        status: 'correct',
        errorDetails: '',
      };
      continue;
    }

    const heardWord = transcription.spokenWords[step.spokenIndex];
    analysis[step.targetIndex] = {
      word: targetWords[step.targetIndex],
      status: 'incorrect',
      errorDetails: issueDetails || `Heard “${heardWord}” instead of “${targetWords[step.targetIndex]}”.`,
    };
  }

  const correctCount = analysis.filter(item => item.status === 'correct').length;
  const incorrectItems = analysis.filter(item => item.status === 'incorrect');
  const missedItems = analysis.filter(item => item.status === 'missed');
  const attemptedCount = correctCount + incorrectItems.length;
  const reviewWords = incorrectItems.slice(0, 4).map(item => item.word).join(', ');
  const firstMissed = missedItems[0]?.word;
  const feedbackParts = [`You read ${attemptedCount} of ${targetWords.length} target words.`];
  if (reviewWords) feedbackParts.push(`Practise: ${reviewWords}.`);
  if (firstMissed) feedbackParts.push(`Continue from “${firstMissed}”.`);
  if (!reviewWords && !firstMissed) feedbackParts.push('Your words were clear and in the correct order.');
  if (insertedWordCount > 0) feedbackParts.push(`${insertedWordCount} extra or repeated word${insertedWordCount === 1 ? ' was' : 's were'} heard.`);

  return {
    feedback: feedbackParts.join(' '),
    wordAnalysis: analysis,
    heardTranscript: transcription.spokenWords.join(' '),
    spokenWordCount: transcription.spokenWords.length,
    insertedWordCount,
  };
};
