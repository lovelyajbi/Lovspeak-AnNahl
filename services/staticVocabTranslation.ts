type TranslationChunk = Record<string, string>;

const chunkPromises = new Map<string, Promise<TranslationChunk>>();

const normalizeStaticWord = (word: string): string => word
  .trim()
  .toLowerCase()
  .replace(/’/g, "'")
  .replace(/^[^a-z]+|[^a-z']+$/g, '');

const loadChunk = (initial: string): Promise<TranslationChunk> => {
  const cached = chunkPromises.get(initial);
  if (cached) return cached;

  const request = fetch(`/content/vocab/translations/${initial}.json`, { cache: 'force-cache' })
    .then(async response => {
      if (!response.ok) throw new Error(`Static vocabulary chunk failed (${response.status})`);
      return response.json() as Promise<TranslationChunk>;
    })
    .catch(error => {
      chunkPromises.delete(initial);
      throw error;
    });

  chunkPromises.set(initial, request);
  return request;
};

/**
 * Resolves English words found in LovSpeak's authored Reading and Listening
 * libraries without an AI call or a third-party translation request.
 */
export const translateStaticVocabWord = async (word: string): Promise<string> => {
  const normalized = normalizeStaticWord(word);
  if (!normalized || !/^[a-z]/.test(normalized)) return word.trim();

  try {
    const chunk = await loadChunk(normalized[0]);
    return chunk[normalized] || word.trim();
  } catch (error) {
    console.warn('[Static vocab] Local dictionary unavailable:', error);
    return word.trim();
  }
};
