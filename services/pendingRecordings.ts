// Local-only cache for reading recordings that failed AI analysis, so the user
// can leave, come back later, and resend the same recording instead of re-recording.
// Not mirrored to Firestore: this is binary audio data and purely a local retry aid.

const DB_NAME = 'lovspeak_pending_recordings';
const DB_VERSION = 1;
const STORE_NAME = 'recordings';
const RECORDING_TTL_MS = 48 * 60 * 60 * 1000;
const MAX_RECORDINGS = 5;

interface PendingRecording {
  key: string;
  blob: Blob;
  mimeType: string;
  savedAt: string;
}

const openDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const pruneRecordings = async (db: IDBDatabase, keepKey?: string): Promise<void> => {
  const records = await new Promise<PendingRecording[]>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
  const now = Date.now();
  const retained = records
    .filter(record => record.key === keepKey || now - new Date(record.savedAt).getTime() <= RECORDING_TTL_MS)
    .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
  const retainedKeys = new Set(retained.slice(0, MAX_RECORDINGS).map(record => record.key));
  if (keepKey) retainedKeys.add(keepKey);
  const keysToDelete = records.filter(record => !retainedKeys.has(record.key)).map(record => record.key);
  if (keysToDelete.length === 0) return;
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    keysToDelete.forEach(key => store.delete(key));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const savePendingRecording = async (key: string, blob: Blob, mimeType: string): Promise<void> => {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put({ key, blob, mimeType, savedAt: new Date().toISOString() } as PendingRecording);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    await pruneRecordings(db, key);
    db.close();
  } catch (e) {
    console.error('Failed to save pending recording:', e);
  }
};

export const getPendingRecording = async (key: string): Promise<PendingRecording | null> => {
  try {
    const db = await openDb();
    const result = await new Promise<PendingRecording | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
    if (result && Date.now() - new Date(result.savedAt).getTime() > RECORDING_TTL_MS) {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
      db.close();
      return null;
    }
    db.close();
    return result;
  } catch (e) {
    console.error('Failed to read pending recording:', e);
    return null;
  }
};

export const deletePendingRecording = async (key: string): Promise<void> => {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch (e) {
    console.error('Failed to delete pending recording:', e);
  }
};
