type TierPool = Record<string, any[]>;
type GameBank = Record<'islamic' | 'general', TierPool>;

const bankLoaders = import.meta.glob<GameBank>('../data/games/*.json', { import: 'default' });

const LOADERS_BY_CATEGORY: Record<string, () => Promise<GameBank>> = {};
for (const [filePath, loader] of Object.entries(bankLoaders)) {
  const category = filePath.match(/([^/]+)\.json$/)?.[1];
  if (category) LOADERS_BY_CATEGORY[category] = loader;
}

const loadedBanks: Record<string, GameBank> = {};

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Returns `count` shuffled items from the static bank for the given game,
 * context, and level (levels 1-20 map to tiers 1-4), or null when no bank
 * exists for the category so callers can fall back to AI generation.
 * Items are deep-copied because game rounds mutate them (option reshuffles).
 */
export const getGameBankItems = async (
  category: string,
  context: 'islamic' | 'general',
  level: number,
  count: number = 10
): Promise<any[] | null> => {
  const loader = LOADERS_BY_CATEGORY[category];
  if (!loader) return null;
  if (!loadedBanks[category]) {
    try {
      loadedBanks[category] = await loader();
    } catch (e) {
      console.error(`Failed to load game bank for ${category}`, e);
      return null;
    }
  }
  const tier = String(Math.min(4, Math.max(1, Math.ceil(level / 5))));
  const pool = loadedBanks[category]?.[context]?.[tier];
  if (!pool || pool.length === 0) return null;
  const picked = shuffleArray(pool).slice(0, Math.min(count, pool.length));
  return JSON.parse(JSON.stringify(picked));
};
