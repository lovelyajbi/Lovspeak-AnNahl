
import {
    Level, ReadingContent, ReadingProgress, ActivityLog,
    VocabItem, UserProfile, LearningPlan, Badge, DiaryEntry, AppView
} from '../types';
import { db, auth } from '../src/firebase';
import {
    doc, getDoc, setDoc, collection, getDocs, deleteDoc,
    query, orderBy, limit, onSnapshot, getDocFromServer, where
} from 'firebase/firestore';

// --- Error Handling ---
enum OperationType {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    LIST = 'list',
    GET = 'get',
    WRITE = 'write',
}

interface FirestoreErrorInfo {
    error: string;
    operationType: OperationType;
    path: string | null;
    authInfo: {
        userId: string | undefined;
        email: string | null | undefined;
        emailVerified: boolean | undefined;
        isAnonymous: boolean | undefined;
        tenantId: string | null | undefined;
        providerInfo: {
            providerId: string;
            displayName: string | null;
            email: string | null;
            photoUrl: string | null;
        }[];
    }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
    const errInfo: FirestoreErrorInfo = {
        error: error instanceof Error ? error.message : String(error),
        authInfo: {
            userId: auth.currentUser?.uid,
            email: auth.currentUser?.email,
            emailVerified: auth.currentUser?.emailVerified,
            isAnonymous: auth.currentUser?.isAnonymous,
            tenantId: auth.currentUser?.tenantId,
            providerInfo: auth.currentUser?.providerData.map(provider => ({
                providerId: provider.providerId,
                displayName: provider.displayName,
                email: provider.email,
                photoUrl: provider.photoURL
            })) || []
        },
        operationType,
        path
    }
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    // We don't necessarily want to crash the whole app for a sync error, 
    // but we must log it as per instructions.
}

// --- Connection Test ---
async function testConnection() {
    try {
        await getDocFromServer(doc(db, 'settings', 'connection_test'));
    } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
            console.error("Please check your Firebase configuration. The client is offline.");
        }
    }
}
testConnection();

// --- KEYS ---
const KEY_PROFILE = 'lovelya_profile';
const KEY_PLAN = 'lovelya_plan';
const KEY_ACTIVITY = 'lovelya_activity_logs';
const KEY_VOCAB = 'lovelya_vocab';
const KEY_FAVORITES = 'lovelya_favorites';
const KEY_CUSTOM_CATS = 'lovelya_custom_cats';
const KEY_CACHE_TITLES = 'lovelya_cache_titles';
const KEY_CACHE_LISTENING_TITLES = 'lovelya_cache_listening_titles';
const KEY_CACHE_CONTENT = 'lovelya_cache_content';
const KEY_PROGRESS = 'lovelya_progress';
const KEY_DIARY = 'lovelya_diary';
const KEY_THEME_COLOR = 'lovelya_theme_color';
const KEY_GAME_PROGRESS = 'lovelya_game_progress';
const KEY_HINT_STATE = 'lovelya_hint_state';
const KEY_ROADMAP_PROGRESS = 'lovelya_roadmap_progress';
const KEY_GEMINI_API_KEY = 'lovelya_gemini_api_key';
const KEY_FONT_SIZE = 'lovelya_font_size';
const KEY_SOUND_ENABLED = 'lovelya_sound_enabled';
const KEY_APP_LANGUAGE = 'lovelya_app_language';
const KEY_VOCAB_ENRICHMENT = 'lovelya_vocab_enrichment';
const KEY_GEMINI_API_KEYS = 'lovelya_gemini_api_keys';

const SCALEV_WEBHOOK_COLLECTION = 'scalevWebhookAccess';
const SCALEV_ALLOWED_SKUS = ['LovspeakAks'];
const SCALEV_ALLOWED_SOURCE_URLS = [
    'https://lovelya-edu.myscalev.com/lovspeakcop',
    'https://lovelya-edu.myscalev.com/lovspeak1',
];

// --- Interfaces ---
export interface CustomCategory {
    name: string;
    icon: string;
    color?: string;
}

export interface GameProgress {
    [category: string]: number;
}

export interface HintState {
    count: number;
    lastRegenTime: number;
}

// --- API KEY (Sync to Firestore) ---
export const getGeminiApiKey = (): string | null => {
    // Fallback to legacy single key if array doesn't exist
    const keys = getGeminiApiKeys();
    if (keys.length > 0) return keys[0];
    return localStorage.getItem(KEY_GEMINI_API_KEY);
};

export const getGeminiApiKeys = (): string[] => {
    const data = localStorage.getItem(KEY_GEMINI_API_KEYS);
    if (!data) {
        // Migration: check if legacy key exists
        const legacy = localStorage.getItem(KEY_GEMINI_API_KEY);
        return legacy ? [legacy] : [];
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

export const saveGeminiApiKeys = async (keys: string[]) => {
    const cleanKeys = keys.filter(k => k.trim() !== "");
    localStorage.setItem(KEY_GEMINI_API_KEYS, JSON.stringify(cleanKeys));
    // Update legacy key as well for backward compatibility
    if (cleanKeys.length > 0) {
        localStorage.setItem(KEY_GEMINI_API_KEY, cleanKeys[0]);
    } else {
        localStorage.removeItem(KEY_GEMINI_API_KEY);
    }
    await syncToFirestore('settings/api_keys', { keys: cleanKeys });
};

export const saveGeminiApiKey = async (key: string) => {
    await saveGeminiApiKeys([key]);
};

export const clearGeminiApiKey = () => {
    localStorage.removeItem(KEY_GEMINI_API_KEY);
    localStorage.removeItem(KEY_GEMINI_API_KEYS);
    const uid = getUserId();
    if (uid) {
        const path = `users/${uid}/settings/api_keys`;
        deleteDoc(doc(db, path)).catch(e => handleFirestoreError(e, OperationType.DELETE, path));
        const legacyPath = `users/${uid}/settings/api_key`;
        deleteDoc(doc(db, legacyPath)).catch(e => handleFirestoreError(e, OperationType.DELETE, legacyPath));
    }
};

// --- FIRESTORE SYNC HELPERS ---
const getUserId = () => auth.currentUser?.uid;

const sanitizeData = (data: any): any => {
    if (data === null || typeof data !== 'object') return data;

    if (Array.isArray(data)) {
        return data.map(item => sanitizeData(item));
    }

    const sanitized: any = {};
    Object.keys(data).forEach(key => {
        const value = data[key];
        if (value !== undefined) {
            sanitized[key] = sanitizeData(value);
        }
    });
    return sanitized;
};

export const syncToFirestore = async (path: string, data: any) => {
    const uid = getUserId();
    if (!uid) return;
    const fullPath = `users/${uid}/${path}`;
    try {
        await setDoc(doc(db, fullPath), sanitizeData(data), { merge: true });
    } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, fullPath);
    }
};

const getFromFirestore = async (path: string) => {
    const uid = getUserId();
    if (!uid) return null;
    const fullPath = `users/${uid}/${path}`;
    try {
        const snap = await getDoc(doc(db, fullPath));
        return snap.exists() ? snap.data() : null;
    } catch (e) {
        handleFirestoreError(e, OperationType.GET, fullPath);
        return null;
    }
};

// --- ROADMAP PROGRESS ---
export const getRoadmapProgress = (): string[] => {
    const data = localStorage.getItem(KEY_ROADMAP_PROGRESS);
    return data ? JSON.parse(data) : [];
};

export const completeRoadmapUnit = (unitId: string) => {
    const progress = getRoadmapProgress();
    if (!progress.includes(unitId)) {
        progress.push(unitId);
        localStorage.setItem(KEY_ROADMAP_PROGRESS, JSON.stringify(progress));
        syncToFirestore('progress/roadmap', { units: progress });
    }
};

// --- HELPER: ID GENERATOR ---
const generateId = (prefix: string = 'id') => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// --- THEME COLOR ---
export const getThemeColor = (): string => {
    return localStorage.getItem(KEY_THEME_COLOR) || '#ec4899'; // Default to pink (#ec4899)
};

export const saveThemeColor = (color: string) => {
    localStorage.setItem(KEY_THEME_COLOR, color);
    syncToFirestore('settings/theme', { color });
};

// --- FONT SIZE ---
export type FontSize = 'normal' | 'medium' | 'large';

export const getFontSize = (): FontSize => {
    return (localStorage.getItem(KEY_FONT_SIZE) as FontSize) || 'normal';
};

export const saveFontSize = (size: FontSize) => {
    localStorage.setItem(KEY_FONT_SIZE, size);
    syncToFirestore('settings/font_size', { size });
};

// --- SOUND & LANGUAGE ---
export const getSoundEnabled = (): boolean => {
    const val = localStorage.getItem(KEY_SOUND_ENABLED);
    return val === null ? true : val === 'true';
};

export const setSoundEnabled = (enabled: boolean) => {
    localStorage.setItem(KEY_SOUND_ENABLED, String(enabled));
    syncToFirestore('settings/sound', { enabled });
};

export const getAppLanguage = (): 'id' | 'en' => {
    return (localStorage.getItem(KEY_APP_LANGUAGE) as 'id' | 'en') || 'id';
};

export const setAppLanguage = (lang: 'id' | 'en') => {
    localStorage.setItem(KEY_APP_LANGUAGE, lang);
    syncToFirestore('settings/language', { lang });
};

// --- RESET PROGRESS ---
export const resetAllProgress = async () => {
    const uid = getUserId();

    // Get current lists before wiping local storage so we can delete them from cloud
    const vocabList = getVocab();
    const diaryList = getDiaryEntries();
    const activityList = getActivityLogs();

    // Clear LocalStorage keys related to progress and data
    const keysToClear = [
        KEY_PROGRESS, KEY_GAME_PROGRESS + '_general', KEY_GAME_PROGRESS + '_islamic',
        KEY_ROADMAP_PROGRESS, KEY_ACTIVITY, KEY_HINT_STATE,
        KEY_PLAN, KEY_VOCAB, KEY_DIARY, KEY_FAVORITES, KEY_CUSTOM_CATS
    ];
    keysToClear.forEach(k => localStorage.removeItem(k));

    // Clear dynamic cache keys
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith(KEY_CACHE_CONTENT)) localStorage.removeItem(key);
    });

    // Reset Profile XP and Level
    const profile = getUserProfile();
    profile.xp = 0;
    profile.level = 'A1';
    saveUserProfile(profile);

    if (uid) {
        try {
            // Update main profile document
            await setDoc(doc(db, `users/${uid}`), sanitizeData(profile), { merge: true });
            
            // Delete settings documents
            await deleteDoc(doc(db, `users/${uid}/settings/plan`)).catch(() => {});
            await deleteDoc(doc(db, `users/${uid}/settings/categories`)).catch(() => {});
            await deleteDoc(doc(db, `users/${uid}/settings/favorites`)).catch(() => {});
            
            // Delete progress documents
            await deleteDoc(doc(db, `users/${uid}/progress/roadmap`)).catch(() => {});
            await deleteDoc(doc(db, `users/${uid}/progress/game_general`)).catch(() => {});
            await deleteDoc(doc(db, `users/${uid}/progress/game_islamic`)).catch(() => {});
            
            // Delete subcollections based on local IDs (best effort for client-side)
            vocabList.forEach(v => deleteDoc(doc(db, `users/${uid}/vocab/${v.id}`)).catch(() => {}));
            diaryList.forEach(d => deleteDoc(doc(db, `users/${uid}/diary/${d.id}`)).catch(() => {}));
            activityList.forEach(a => deleteDoc(doc(db, `users/${uid}/activity/${a.id}`)).catch(() => {}));

        } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, `users/${uid}`);
        }
    }
};

// --- FAVORITES ---
export const getFavorites = (): string[] => {
    const data = localStorage.getItem(KEY_FAVORITES);
    return data ? JSON.parse(data) : [];
};

export const toggleFavorite = (id: string): string[] => {
    let favs = getFavorites();
    if (favs.includes(id)) {
        favs = favs.filter(f => f !== id);
    } else {
        favs.push(id);
    }
    localStorage.setItem(KEY_FAVORITES, JSON.stringify(favs));
    syncToFirestore('settings/favorites', { ids: favs });
    return favs;
};

// --- USER PROFILE ---
export const getUserProfile = (): UserProfile => {
    const data = localStorage.getItem(KEY_PROFILE);
    if (data) {
        const profile = JSON.parse(data);
        if (profile.xp === undefined) profile.xp = 0;
        return profile;
    }
    return { name: 'Lovelies', avatar: 'fa-user', level: 'A1', xp: 0 };
};

export const saveUserProfile = (profile: UserProfile) => {
    localStorage.setItem(KEY_PROFILE, JSON.stringify(profile));
    const uid = getUserId();
    if (uid) {
        const path = `users/${uid}`;
        setDoc(doc(db, path), sanitizeData(profile), { merge: true }).catch(e => handleFirestoreError(e, OperationType.WRITE, path));
    }
};

// --- LEARNING PLAN ---
export const getLearningPlan = (): LearningPlan | null => {
    const data = localStorage.getItem(KEY_PLAN);
    return data ? JSON.parse(data) : null;
};

export const saveLearningPlan = (plan: LearningPlan) => {
    localStorage.setItem(KEY_PLAN, JSON.stringify(plan));
    syncToFirestore('settings/plan', plan);
};

// --- DIARY ---
export const getDiaryEntries = (): DiaryEntry[] => {
    const data = localStorage.getItem(KEY_DIARY);
    return data ? JSON.parse(data) : [];
};

export const deleteDiaryEntry = async (id: string) => {
    const entries = getDiaryEntries();
    const filtered = entries.filter(e => e.id !== id);
    localStorage.setItem(KEY_DIARY, JSON.stringify(filtered));

    const uid = getUserId();
    if (uid) {
        const path = `users/${uid}/diary/${id}`;
        try {
            await deleteDoc(doc(db, path));
        } catch (e) {
            handleFirestoreError(e, OperationType.DELETE, path);
        }
    }
};

export const saveDiaryEntry = async (entry: DiaryEntry) => {
    if (!entry.title.trim() && !entry.content.trim()) return;
    const entries = getDiaryEntries();
    const newEntry = { ...entry };
    if (!newEntry.id) newEntry.id = generateId('diary');
    entries.unshift(newEntry);
    localStorage.setItem(KEY_DIARY, JSON.stringify(entries));

    const uid = getUserId();
    if (uid) {
        const path = `users/${uid}/diary/${newEntry.id}`;
        try {
            await setDoc(doc(db, path), sanitizeData(newEntry));
        } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, path);
        }
    }
};

export const updateDiaryEntry = async (entry: DiaryEntry) => {
    if (!entry.title.trim() && !entry.content.trim()) {
        await deleteDiaryEntry(entry.id);
        return;
    }
    let entries = getDiaryEntries();
    const index = entries.findIndex(e => e.id === entry.id);
    if (index !== -1) {
        entries[index] = { ...entry };
        localStorage.setItem(KEY_DIARY, JSON.stringify(entries));
    } else {
        await saveDiaryEntry(entry);
    }

    const uid = getUserId();
    if (uid) {
        const path = `users/${uid}/diary/${entry.id}`;
        try {
            await setDoc(doc(db, path), sanitizeData(entry));
        } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, path);
        }
    }
};

// --- VOCABULARY ---
export const getVocab = (): VocabItem[] => {
    const data = localStorage.getItem(KEY_VOCAB);
    return data ? JSON.parse(data) : [];
};

export const getCustomCategories = (): CustomCategory[] => {
    const data = localStorage.getItem(KEY_CUSTOM_CATS);
    return data ? JSON.parse(data) : [];
};

const cleanupEmptyCategories = () => {
    const vocab = getVocab();
    const cats = getCustomCategories();
    const filteredCats = cats.filter(cat =>
        vocab.some(v => v.category.trim().toLowerCase() === cat.name.trim().toLowerCase())
    );
    localStorage.setItem(KEY_CUSTOM_CATS, JSON.stringify(filteredCats));
    syncToFirestore('settings/categories', { categories: filteredCats });
};

export const deleteVocab = async (id: string) => {
    const list = getVocab();
    const filtered = list.filter(i => i.id !== id);
    localStorage.setItem(KEY_VOCAB, JSON.stringify(filtered));
    cleanupEmptyCategories();

    const uid = getUserId();
    if (uid) {
        const path = `users/${uid}/vocab/${id}`;
        try {
            await deleteDoc(doc(db, path));
        } catch (e) {
            handleFirestoreError(e, OperationType.DELETE, path);
        }
    }
};

export const saveVocab = async (item: VocabItem) => {
    if (!item.english.trim() && !item.indonesian.trim()) return;
    const list = getVocab();
    const newItem = { ...item };
    if (!newItem.id) newItem.id = generateId('vocab');
    list.push(newItem);
    localStorage.setItem(KEY_VOCAB, JSON.stringify(list));

    const uid = getUserId();
    if (uid) {
        const path = `users/${uid}/vocab/${newItem.id}`;
        try {
            await setDoc(doc(db, path), sanitizeData(newItem));
        } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, path);
        }
    }
};

export const updateVocab = async (item: VocabItem) => {
    if (!item.english.trim() && !item.indonesian.trim()) {
        await deleteVocab(item.id);
        return;
    }
    let list = getVocab();
    list = list.map(i => i.id === item.id ? { ...item } : i);
    localStorage.setItem(KEY_VOCAB, JSON.stringify(list));
    cleanupEmptyCategories();

    const uid = getUserId();
    if (uid) {
        const path = `users/${uid}/vocab/${item.id}`;
        try {
            await setDoc(doc(db, path), item);
        } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, path);
        }
    }
};

export const saveCustomCategory = (cat: CustomCategory) => {
    const cats = getCustomCategories();
    const catName = cat.name.trim();
    if (!cats.some(c => c.name.trim().toLowerCase() === catName.toLowerCase())) {
        cats.push({ ...cat, name: catName });
        localStorage.setItem(KEY_CUSTOM_CATS, JSON.stringify(cats));
        syncToFirestore('settings/categories', { categories: cats });
    }
};

export const getVocabEnrichment = (): Record<string, { ipa: string, synonyms: string[], examples: string[] }> => {
    const data = localStorage.getItem(KEY_VOCAB_ENRICHMENT);
    return data ? JSON.parse(data) : {};
};

export const saveVocabEnrichment = async (wordId: string, details: { ipa: string, synonyms: string[], examples: string[] }) => {
    const enrichment = getVocabEnrichment();
    enrichment[wordId] = details;
    localStorage.setItem(KEY_VOCAB_ENRICHMENT, JSON.stringify(enrichment));
    syncToFirestore('settings/vocab_enrichment', enrichment);
};

// --- ACTIVITY LOGS ---
export const getActivityLogs = (): ActivityLog[] => {
    const data = localStorage.getItem(KEY_ACTIVITY);
    return data ? JSON.parse(data) : [];
};

export const logActivity = async (log: Omit<ActivityLog, 'id'>) => {
    const logs = getActivityLogs();
    const newLog: ActivityLog = { ...log, id: Date.now().toString() };
    logs.unshift(newLog);
    localStorage.setItem(KEY_ACTIVITY, JSON.stringify(logs));

    const uid = getUserId();
    if (uid) {
        const path = `users/${uid}/activity/${newLog.id}`;
        try {
            await setDoc(doc(db, path), sanitizeData(newLog));
        } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, path);
        }
    }
};

// --- MASTER ACTIVATION CHECK ---
export const checkActivationCode = async (code: string): Promise<boolean> => {
    // Hardcoded fallback as requested
    const HARDCODED_CODE = "BismillahAksesLovSpeakUntukPribadi";
    if (code === HARDCODED_CODE) return true;

    try {
        const snap = await getDoc(doc(db, 'settings/master'));
        if (snap.exists()) {
            const masterCode = snap.data().activationCode;
            return masterCode === code;
        }
        return false;
    } catch (e) {
        console.error("Activation check error:", e);
        return false;
    }
};

export const activateUser = async () => {
    const uid = getUserId();
    if (!uid) return;
    const path = `users/${uid}`;
    try {
        await setDoc(doc(db, path), sanitizeData({
            isActive: true,
            activatedAt: new Date().toISOString()
        }), { merge: true });
    } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, path);
    }
};

const normalizeEmail = (email?: string | null) => (email || '').trim().toLowerCase();

const isTruthy = (value: unknown) => value === true;

const isScalevStatusActive = (status?: string | null) => {
    const normalized = (status || '').trim().toLowerCase();
    return ['active', 'paid', 'completed', 'success', 'confirmed'].includes(normalized);
};

export const hasGrandfatheredAccess = (userData: any, localProfile?: any): boolean => {
    if (isTruthy(userData?.legacyAccess) || isTruthy(userData?.isActive)) return true;
    if (typeof userData?.activatedAt === 'string' && userData.activatedAt.trim() !== '') return true;
    if (isTruthy(localProfile?.legacyAccess) || isTruthy(localProfile?.isActive)) return true;
    return false;
};

export const hasScalevAccess = (userData: any): boolean => {
    const scalev = userData?.scalev;
    if (!scalev || typeof scalev !== 'object') return false;
    if (isTruthy(scalev.active)) return true;
    if (isScalevStatusActive(scalev.status)) return true;
    return false;
};

export const resolveAccessState = (userData: any, localProfile?: any): boolean => {
    return hasGrandfatheredAccess(userData, localProfile) || hasScalevAccess(userData);
};

export const migrateLegacyAccess = async (options?: {
    uid?: string;
    email?: string | null;
    displayName?: string | null;
    localProfile?: any;
}) => {
    const uid = options?.uid || getUserId();
    if (!uid) return false;

    const localProfile = options?.localProfile || getUserProfile();
    if (!hasGrandfatheredAccess(null, localProfile)) return false;

    const path = `users/${uid}`;
    try {
        await setDoc(doc(db, path), sanitizeData({
            email: options?.email || auth.currentUser?.email || null,
            name: options?.displayName || auth.currentUser?.displayName || localProfile?.name || null,
            isActive: true,
            legacyAccess: true,
            accessSource: 'legacy_migration',
            legacyAccessMigratedAt: new Date().toISOString(),
            activatedAt: localProfile?.activatedAt || new Date().toISOString(),
        }), { merge: true });
        return true;
    } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, path);
        return false;
    }
};

export const syncScalevAccessByEmail = async (options?: {
    uid?: string;
    email?: string | null;
    displayName?: string | null;
}) => {
    const uid = options?.uid || getUserId();
    const email = normalizeEmail(options?.email || auth.currentUser?.email);
    if (!uid || !email) return false;

    try {
        const accessQuery = query(
            collection(db, SCALEV_WEBHOOK_COLLECTION),
            where('emailNormalized', '==', email)
        );
        const accessSnap = await getDocs(accessQuery);
        if (accessSnap.empty) return false;

        const validRecord = accessSnap.docs
            .map((docSnap) => ({ id: docSnap.id, data: docSnap.data() }))
            .sort((a, b) => {
                const aTime = new Date(a.data.updatedAt || a.data.createdAt || 0).getTime();
                const bTime = new Date(b.data.updatedAt || b.data.createdAt || 0).getTime();
                return bTime - aTime;
            })
            .find(({ data }) => {
                const active = isTruthy(data.active) || isScalevStatusActive(data.status);
                return active;
            });

        if (!validRecord) return false;

        const record = { id: validRecord.id };
        const data = validRecord.data;
        const sku = data.sku || data.productSku || null;
        const sourceUrl = data.sourceUrl || data.eventSourceUrl || data.metadata?.event_source_url || null;

        const path = `users/${uid}`;
        await setDoc(doc(db, path), sanitizeData({
            email,
            name: options?.displayName || auth.currentUser?.displayName || null,
            isActive: true,
            accessSource: 'scalev_webhook',
            activatedAt: new Date().toISOString(),
            scalev: {
                active: true,
                status: data.status || 'active',
                sku,
                productName: data.productName || data.product || null,
                orderId: data.orderId || record.id,
                customerEmail: email,
                sourceUrl,
                sourceUpdatedAt: data.updatedAt || data.createdAt || null,
                linkedAt: new Date().toISOString(),
            }
        }), { merge: true });

        const localProfile = getUserProfile();
        localStorage.setItem(KEY_PROFILE, JSON.stringify({
            ...localProfile,
            isActive: true,
            activatedAt: localProfile?.activatedAt || new Date().toISOString(),
            accessSource: 'scalev_webhook',
        }));

        return true;
    } catch (e) {
        console.error("Scalev access sync error:", e);
        return false;
    }
};

// --- INITIAL SYNC FROM CLOUD ---
export const syncFromCloud = async () => {
    const uid = getUserId();
    if (!uid) return;

    // Helper: merge cloud array data with local array data by ID.
    // Cloud wins for items with the same ID; local-only items are preserved.
    const mergeArrayById = (cloudItems: any[], localKey: string, idField: string = 'id') => {
        const localRaw = localStorage.getItem(localKey);
        const localItems: any[] = localRaw ? JSON.parse(localRaw) : [];
        if (cloudItems.length === 0) return; // Nothing from cloud, keep local as-is

        const cloudIds = new Set(cloudItems.map((item: any) => item[idField]));
        // Cloud items first (source of truth), then local-only items
        const merged = [
            ...cloudItems,
            ...localItems.filter((item: any) => item[idField] && !cloudIds.has(item[idField]))
        ];
        localStorage.setItem(localKey, JSON.stringify(merged));
    };

    try {
        const syncTasks = [
            // Profile
            (async () => {
                const profileSnap = await getDoc(doc(db, `users/${uid}`));
                if (profileSnap.exists()) localStorage.setItem(KEY_PROFILE, JSON.stringify(profileSnap.data()));
            })(),

            // Settings (includes vocab_enrichment)
            (async () => {
                const settingsSnap = await getDocs(collection(db, `users/${uid}/settings`));
                settingsSnap.docs.forEach(d => {
                    const data = d.data();
                    if (d.id === 'plan') localStorage.setItem(KEY_PLAN, JSON.stringify(data));
                    if (d.id === 'api_key') localStorage.setItem(KEY_GEMINI_API_KEY, data.key);
                    if (d.id === 'api_keys') localStorage.setItem(KEY_GEMINI_API_KEYS, JSON.stringify(data.keys));
                    if (d.id === 'api_cooldowns') {
                        if (data.modelCooldowns) localStorage.setItem('lovelya_api_cooldowns_model', JSON.stringify(data.modelCooldowns));
                        if (data.modelAccessDenied) localStorage.setItem('lovelya_api_access_model', JSON.stringify(data.modelAccessDenied));
                        if (data.keyModelCooldowns) localStorage.setItem('lovelya_api_cooldowns_key_model', JSON.stringify(data.keyModelCooldowns));
                    }
                    if (d.id === 'theme') localStorage.setItem(KEY_THEME_COLOR, data.color);
                    if (d.id === 'categories') localStorage.setItem(KEY_CUSTOM_CATS, JSON.stringify(data.categories));
                    if (d.id === 'favorites') localStorage.setItem(KEY_FAVORITES, JSON.stringify(data.ids));
                    if (d.id === 'font_size') localStorage.setItem(KEY_FONT_SIZE, data.size);
                    if (d.id === 'sound') localStorage.setItem(KEY_SOUND_ENABLED, String(data.enabled));
                    if (d.id === 'language') localStorage.setItem(KEY_APP_LANGUAGE, data.lang);
                    if (d.id === 'vocab_enrichment') localStorage.setItem(KEY_VOCAB_ENRICHMENT, JSON.stringify(data));
                });
            })(),

            // Roadmap
            (async () => {
                const roadmapSnap = await getDoc(doc(db, `users/${uid}/progress/roadmap`));
                if (roadmapSnap.exists()) localStorage.setItem(KEY_ROADMAP_PROGRESS, JSON.stringify(roadmapSnap.data().units));
            })(),

            // Reading Progress (merge by generated ID)
            (async () => {
                const readingProgSnap = await getDocs(collection(db, `users/${uid}/reading_progress`));
                const cloudItems = readingProgSnap.docs.map(d => ({ _syncId: d.id, ...d.data() }));
                if (cloudItems.length > 0) {
                    // Reading progress items don't have a natural 'id', use doc ID as _syncId
                    const localRaw = localStorage.getItem(KEY_PROGRESS);
                    const localItems: any[] = localRaw ? JSON.parse(localRaw) : [];
                    // For reading progress, cloud is authoritative since items are append-only
                    // We keep local items that don't match any cloud item by level+themeId+timestamp
                    const cloudKeys = new Set(cloudItems.map((item: any) => `${item.level}_${item.themeId}`));
                    const localOnly = localItems.filter((item: any) => {
                        const key = `${item.level}_${item.themeId}`;
                        // Keep local item if there's no matching cloud entry
                        // (simple heuristic since reading progress lacks unique IDs)
                        return !cloudKeys.has(key);
                    });
                    localStorage.setItem(KEY_PROGRESS, JSON.stringify([...cloudItems, ...localOnly]));
                }
            })(),

            // Game Progress
            (async () => {
                const [gen, isl] = await Promise.all([
                    getDoc(doc(db, `users/${uid}/progress/game_general`)),
                    getDoc(doc(db, `users/${uid}/progress/game_islamic`))
                ]);
                if (gen.exists()) localStorage.setItem(`${KEY_GAME_PROGRESS}_general`, JSON.stringify(gen.data()));
                if (isl.exists()) localStorage.setItem(`${KEY_GAME_PROGRESS}_islamic`, JSON.stringify(isl.data()));
            })(),

            // Cache
            (async () => {
                const cacheSnap = await getDocs(query(collection(db, `users/${uid}/reading_cache`), orderBy('timestamp', 'desc'), limit(10)));
                cacheSnap.docs.forEach(d => {
                    const data = d.data();
                    const key = `${KEY_CACHE_CONTENT}_${data.level}_${data.themeId}_${data.title}`;
                    localStorage.setItem(key, JSON.stringify(data.content));
                });
            })(),

            // Diary (merge by id)
            (async () => {
                const diarySnap = await getDocs(collection(db, `users/${uid}/diary`));
                const cloudItems = diarySnap.docs.map(d => d.data());
                mergeArrayById(cloudItems, KEY_DIARY, 'id');
            })(),

            // Vocab (merge by id)
            (async () => {
                const vocabSnap = await getDocs(collection(db, `users/${uid}/vocab`));
                const cloudItems = vocabSnap.docs.map(d => d.data());
                mergeArrayById(cloudItems, KEY_VOCAB, 'id');
            })(),

            // Activity (merge by id)
            (async () => {
                const activitySnap = await getDocs(query(collection(db, `users/${uid}/activity`), orderBy('date', 'desc'), limit(50)));
                const cloudItems = activitySnap.docs.map(d => d.data());
                mergeArrayById(cloudItems, KEY_ACTIVITY, 'id');
            })()
        ];

        await Promise.all(syncTasks);

    } catch (e) {
        handleFirestoreError(e, OperationType.GET, `users/${uid}/*`);
    }
};

// --- BACKUP / IMPORT ---
export const exportFullSystemBackup = (): string => {
    const backupData = {
        meta: { version: '1.6', exportDate: new Date().toISOString(), appName: 'LovSpeak' },
        data: {
            profile: getUserProfile(),
            activityLogs: getActivityLogs(),
            vocab: getVocab(),
            customCategories: getCustomCategories(),
            favorites: getFavorites(),
            learningPlan: localStorage.getItem(KEY_PLAN) ? JSON.parse(localStorage.getItem(KEY_PLAN)!) : null,
            diary: getDiaryEntries(),
            themeColor: getThemeColor(),
            roadmapProgress: getRoadmapProgress()
        }
    };
    return JSON.stringify(backupData, null, 2);
};

export const importFullSystemBackup = async (jsonString: string): Promise<{ success: boolean, message: string }> => {
    try {
        const backup = JSON.parse(jsonString);
        if (!backup.data) return { success: false, message: "Format backup tidak valid." };
        const { profile, activityLogs, vocab, customCategories, favorites, learningPlan, diary, themeColor, roadmapProgress } = backup.data;
        
        if (profile) saveUserProfile(profile);
        if (themeColor) saveThemeColor(themeColor);
        if (roadmapProgress) {
            localStorage.setItem(KEY_ROADMAP_PROGRESS, JSON.stringify(roadmapProgress));
            syncToFirestore('progress/roadmap', { units: roadmapProgress });
        }
        if (vocab) localStorage.setItem(KEY_VOCAB, JSON.stringify(vocab));
        if (customCategories) {
            localStorage.setItem(KEY_CUSTOM_CATS, JSON.stringify(customCategories));
            syncToFirestore('settings/categories', { categories: customCategories });
        }
        if (favorites) {
            localStorage.setItem(KEY_FAVORITES, JSON.stringify(favorites));
            syncToFirestore('settings/favorites', { ids: favorites });
        }
        if (activityLogs) localStorage.setItem(KEY_ACTIVITY, JSON.stringify(activityLogs));
        if (diary) localStorage.setItem(KEY_DIARY, JSON.stringify(diary));
        if (learningPlan) {
            localStorage.setItem(KEY_PLAN, JSON.stringify(learningPlan));
            syncToFirestore('settings/plan', learningPlan);
        }

        // Full Cloud Sync for array collections
        const uid = getUserId();
        if (uid) {
            const promises: Promise<any>[] = [];
            
            if (vocab && Array.isArray(vocab)) {
                vocab.forEach((v: any) => promises.push(setDoc(doc(db, `users/${uid}/vocab/${v.id}`), sanitizeData(v))));
            }
            if (activityLogs && Array.isArray(activityLogs)) {
                activityLogs.forEach((log: any) => promises.push(setDoc(doc(db, `users/${uid}/activity/${log.id}`), sanitizeData(log))));
            }
            if (diary && Array.isArray(diary)) {
                diary.forEach((entry: any) => promises.push(setDoc(doc(db, `users/${uid}/diary/${entry.id}`), sanitizeData(entry))));
            }
            
            if (promises.length > 0) {
                try {
                    await Promise.all(promises);
                } catch(e) {
                    console.error("Error syncing backup to cloud:", e);
                }
            }
        }

        return { success: true, message: "Sistem berhasil dipulihkan & tersinkronisasi!" };
    } catch (e) {
        return { success: false, message: "File JSON rusak atau tidak valid." };
    }
};

// --- GAME & HINTS ---
export const getGameProgress = (category: string, theme: string = 'general'): number => {
    const data = localStorage.getItem(`${KEY_GAME_PROGRESS}_${theme}`);
    const progress: GameProgress = data ? JSON.parse(data) : {};
    return progress[category] || 1;
};

export const unlockNextLevel = (category: string, theme: string, completedLevel: number) => {
    const data = localStorage.getItem(`${KEY_GAME_PROGRESS}_${theme}`);
    const progress: GameProgress = data ? JSON.parse(data) : {};
    const currentMax = progress[category] || 1;
    if (completedLevel >= currentMax) {
        progress[category] = completedLevel + 1;
        localStorage.setItem(`${KEY_GAME_PROGRESS}_${theme}`, JSON.stringify(progress));
        syncToFirestore(`progress/game_${theme}`, progress);
    }
};

export const getHintState = (): HintState => {
    const data = localStorage.getItem(KEY_HINT_STATE);
    if (data) return JSON.parse(data);
    return { count: 5, lastRegenTime: Date.now() };
};

export const saveHintState = (state: HintState) => {
    localStorage.setItem(KEY_HINT_STATE, JSON.stringify(state));
};

// --- CACHE & PROGRESS ---
export const saveProgress = (prog: ReadingProgress) => {
    const existing = localStorage.getItem(KEY_PROGRESS);
    const list: ReadingProgress[] = existing ? JSON.parse(existing) : [];
    list.push(prog);
    localStorage.setItem(KEY_PROGRESS, JSON.stringify(list));

    const uid = getUserId();
    if (uid) {
        const id = `${prog.level}_${prog.themeId}_${Date.now()}`;
        const path = `users/${uid}/reading_progress/${id}`;
        setDoc(doc(db, path), sanitizeData(prog)).catch(e => handleFirestoreError(e, OperationType.WRITE, path));
    }
};

export const clearAllLocalData = () => {
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('lovelya_')) {
            localStorage.removeItem(key);
        }
    });
};

export const getCachedTitles = (level: string, themeId: string): string[] | null => {
    const key = `${KEY_CACHE_TITLES}_${level}_${themeId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

export const setCachedTitles = (level: string, themeId: string, titles: string[]) => {
    const key = `${KEY_CACHE_TITLES}_${level}_${themeId}`;
    localStorage.setItem(key, JSON.stringify(titles));
};

export const getCachedListeningTitles = (level: string, type: string, themeId: string): string[] | null => {
    const key = `${KEY_CACHE_LISTENING_TITLES}_${level}_${type}_${themeId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

export const setCachedListeningTitles = (level: string, type: string, themeId: string, titles: string[]) => {
    const key = `${KEY_CACHE_LISTENING_TITLES}_${level}_${type}_${themeId}`;
    localStorage.setItem(key, JSON.stringify(titles));
};

export const getCachedContent = (level: string, themeId: string, title: string): ReadingContent | null => {
    const key = `${KEY_CACHE_CONTENT}_${level}_${themeId}_${title}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

export const setCachedContent = (level: string, themeId: string, title: string, content: ReadingContent) => {
    const key = `${KEY_CACHE_CONTENT}_${level}_${themeId}_${title}`;
    localStorage.setItem(key, JSON.stringify(content));

    const uid = getUserId();
    if (uid) {
        // We use a safe ID for Firestore (no slashes or special chars)
        const safeId = btoa(`${level}_${themeId}_${title}`).replace(/\//g, '_');
        const path = `users/${uid}/reading_cache/${safeId}`;
        setDoc(doc(db, path), sanitizeData({ level, themeId, title, content, timestamp: Date.now() }))
            .catch(e => handleFirestoreError(e, OperationType.WRITE, path));
    }
};
