import { QuizQuestion } from '../types';

interface LessonBank {
  quiz: QuizQuestion[];
  practicePrompts: string[];
}

// Picks up whatever quizBanks/{LEVEL}.json files exist at build time — zero files
// today is fine (falls through to AI), files appearing after running
// scripts/generate-grammar-content.mjs are picked up on the next build with no code change.
// Not eager: each level's JSON is its own chunk, fetched only when that level is
// actually opened — studying A1 never pulls in C2's questions.
const bankLoaders = import.meta.glob<Record<string, LessonBank>>('../data/grammar/quizBanks/*.json', { import: 'default' });

const LOADERS_BY_LEVEL: Record<string, () => Promise<Record<string, LessonBank>>> = {};
for (const [filePath, loader] of Object.entries(bankLoaders)) {
  const level = filePath.match(/([^/]+)\.json$/)?.[1];
  if (level) LOADERS_BY_LEVEL[level] = loader;
}

const loadedBanks: Record<string, Record<string, LessonBank>> = {};

export const getLessonBank = async (level: string, lessonId: string): Promise<LessonBank | null> => {
  if (!loadedBanks[level]) {
    const loader = LOADERS_BY_LEVEL[level];
    if (!loader) return null;
    loadedBanks[level] = await loader();
  }
  return loadedBanks[level][lessonId] || null;
};

const shuffle = <T>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

// Re-shuffles option order (and remaps correctIndex) per draw so repeat
// attempts don't let a player memorize "the answer is always B".
const shuffleQuestionOptions = (q: QuizQuestion): QuizQuestion => {
  const order = shuffle(q.options.map((_, i) => i));
  return {
    ...q,
    options: order.map(i => q.options[i]),
    correctIndex: order.indexOf(q.correctIndex)
  };
};

export const pickQuizSet = (bank: QuizQuestion[], count = 10): QuizQuestion[] => {
  return shuffle(bank).slice(0, count).map(shuffleQuestionOptions);
};

export const pickPracticePrompt = (prompts: string[]): string | null => {
  if (!prompts.length) return null;
  return prompts[Math.floor(Math.random() * prompts.length)];
};
