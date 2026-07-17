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

const buildIndexPath = (mode: ReadingPracticeMode, level: Level, themeId: string) =>
  `/content/reading/index/${mode}/${level}/${themeId}.json`;

const buildItemPath = (mode: ReadingPracticeMode, id: string) =>
  `/content/reading/items/${mode}/${id}.json`;

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
  if (!theme.isIslamic || level !== 'A1') return null;

  const cacheKey = `${mode}:${level}:${theme.id}`;
  if (indexCache.has(cacheKey)) {
    return indexCache.get(cacheKey) || null;
  }

  const payload = await fetchJson<{ items: ReadingIndexItem[] }>(buildIndexPath(mode, level, theme.id));
  const items = payload?.items || null;
  indexCache.set(cacheKey, items);
  return items;
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
