import {
  ReadingIndexItem,
  ReadingPracticeMode,
  StaticReadingItem,
  StaticReadingTranslateItem,
  Theme,
  Level,
} from '../types';

const indexCache = new Map<string, ReadingIndexItem[] | null>();
const itemCache = new Map<string, StaticReadingItem | StaticReadingTranslateItem | null>();
const summaryCache = new Map<string, StaticLibrarySummary | null>();

export interface StaticLibrarySummary {
  themes: Record<string, { total: number; titles: string[] }>;
}

const buildIndexPath = (mode: ReadingPracticeMode, level: Level, themeId: string) =>
  `/content/reading/index/${mode}/${level}/${themeId}.json`;

const buildItemPath = (mode: ReadingPracticeMode, id: string) =>
  `/content/reading/items/${mode}/${id}.json`;

const buildSummaryPath = (mode: ReadingPracticeMode, level: Level) =>
  `/content/reading/index/${mode}/${level}/_summary.json`;

const fetchJson = async <T>(path: string): Promise<T | null> => {
  try {
    const response = await fetch(path);
    if (!response.ok) return null;
    return await response.json() as T;
  } catch (error) {
    console.warn(`Unable to load reading content from ${path}`, error);
    return null;
  }
};

export const getStaticReadingIndex = async (
  mode: ReadingPracticeMode,
  level: Level,
  theme: Theme,
): Promise<ReadingIndexItem[] | null> => {
  // Static datasets may cover any app theme or level. Missing files fall back to the AI flow.
  const cacheKey = `${mode}:${level}:${theme.id}`;
  if (indexCache.has(cacheKey)) {
    return indexCache.get(cacheKey) || null;
  }

  const payload = await fetchJson<{ items: ReadingIndexItem[] }>(buildIndexPath(mode, level, theme.id));
  const items = payload?.items || null;
  indexCache.set(cacheKey, items);
  return items;
};

export const getStaticReadingLibrarySummary = async (
  mode: ReadingPracticeMode,
  level: Level,
): Promise<StaticLibrarySummary | null> => {
  const cacheKey = `${mode}:${level}`;
  if (summaryCache.has(cacheKey)) return summaryCache.get(cacheKey) || null;
  const summary = await fetchJson<StaticLibrarySummary>(buildSummaryPath(mode, level));
  summaryCache.set(cacheKey, summary);
  return summary;
};

export const getStaticReadingItem = async (
  mode: ReadingPracticeMode,
  id: string,
): Promise<StaticReadingItem | StaticReadingTranslateItem | null> => {
  const cacheKey = `${mode}:${id}`;
  if (itemCache.has(cacheKey)) {
    return itemCache.get(cacheKey) || null;
  }

  const item = await fetchJson<StaticReadingItem | StaticReadingTranslateItem>(buildItemPath(mode, id));
  itemCache.set(cacheKey, item);
  return item;
};
