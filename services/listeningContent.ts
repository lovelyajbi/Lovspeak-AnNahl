import {
  ListeningIndexItem,
  StaticListeningItem,
  Theme,
  Level,
} from '../types';

const indexCache = new Map<string, ListeningIndexItem[] | null>();
const itemCache = new Map<string, StaticListeningItem | null>();

const buildIndexPath = (level: Level, themeId: string) =>
  `/content/listening/index/${level}/${themeId}.json`;

const buildItemPath = (id: string) =>
  `/content/listening/items/${id}.json`;

const fetchJson = async <T>(path: string): Promise<T | null> => {
  try {
    const response = await fetch(path);
    if (!response.ok) return null;
    return await response.json() as T;
  } catch (error) {
    console.warn(`Unable to load listening content from ${path}`, error);
    return null;
  }
};

export const getStaticListeningIndex = async (
  level: Level,
  theme: Theme,
): Promise<ListeningIndexItem[] | null> => {
  const cacheKey = `${level}:${theme.id}`;
  if (indexCache.has(cacheKey)) {
    return indexCache.get(cacheKey) || null;
  }

  const payload = await fetchJson<{ items: ListeningIndexItem[] }>(buildIndexPath(level, theme.id));
  const items = payload?.items || null;
  indexCache.set(cacheKey, items);
  return items;
};

export const getStaticListeningItem = async (
  id: string,
): Promise<StaticListeningItem | null> => {
  if (itemCache.has(id)) {
    return itemCache.get(id) || null;
  }

  const item = await fetchJson<StaticListeningItem>(buildItemPath(id));
  itemCache.set(id, item);
  return item;
};
