
import { GoogleGenAI, Type, Modality, ThinkingLevel } from "@google/genai";
import { ReadingContent, GrammarResult, AssessmentQuestion, AssessmentResult, QuizQuestion } from "../types";
import { getGeminiApiKey, getGeminiApiKeys, getAppLanguage } from "./storage";

declare global {
    interface Window {
        aistudio?: {
            openSelectKey?: () => void;
            hasSelectedApiKey?: () => Promise<boolean>;
        };
    }
}

// We track the starting index per model to maximize quota usage across calls
const modelKeyIndices: Record<string, number> = {};

const getAiClient = (modelName: string, keyIndex: number = 0) => {
    const keys = getGeminiApiKeys();
    if (keys.length === 0) {
        throw new Error("AI API Key not found. Please set it in your settings.");
    }

    const safeIndex = keyIndex % keys.length;
    const apiKey = keys[safeIndex];
    console.log(`[AI-USAGE] ${modelName} is using Key #${safeIndex + 1} (${apiKey.substring(0, 4)}...${apiKey.slice(-4)})`);
    return new GoogleGenAI({ apiKey });
};

// Helper to check if an error is a genuine quota/rate-limit error
const isQuotaError = (e: any): boolean => {
    const msg = e?.message || e?.toString() || '';
    return msg.includes("429") ||
        msg.toLowerCase().includes("quota") ||
        msg.toLowerCase().includes("rate limit") ||
        msg.toLowerCase().includes("resource has been exhausted");
};

// Helper: Definitively invalid API key — Google explicitly says "API key not valid"
const isDefinitelyInvalidKey = (e: any): boolean => {
    const msg = e?.message || e?.toString() || '';
    return msg.toLowerCase().includes('api key not valid') ||
        msg.toLowerCase().includes('api_key_invalid') ||
        msg.toLowerCase().includes('invalid api key');
};

// Helper: Generic permission/access error — could be model access, region, or key issue
const isPermissionError = (e: any): boolean => {
    const msg = e?.message || e?.toString() || '';
    return msg.includes("403") ||
        msg.toLowerCase().includes("permission denied") ||
        msg.toLowerCase().includes("forbidden") ||
        msg.toLowerCase().includes("unauthorized");
};

export const MODEL_CASCADE_SMART = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-3-flash-preview', 'gemini-3.1-flash-lite', 'gemini-2.5-flash-lite', 'gemini-2.0-flash-lite', 'gemini-3.1-pro-preview', 'gemini-2.5-pro', 'gemini-pro-latest'];
export const MODEL_CASCADE_LITE = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-2.5-flash-lite', 'gemini-2.0-flash-lite', 'gemini-2.5-flash', 'gemini-3-flash-preview'];
export const MODEL_CASCADE_TTS = ['gemini-2.5-flash-preview-tts', 'gemini-3.1-flash-tts-preview', 'gemini-2.5-flash'];
export const MODEL_CASCADE_PRO = ['gemini-3.5-flash', 'gemini-3.1-pro-preview', 'gemini-3-flash-preview', 'gemini-2.5-pro', 'gemini-pro-latest', 'gemini-2.5-flash'];

const modelCooldowns: Record<string, number> = {};
const modelAccessDenied: Record<string, number> = {};
const COOLDOWN_MS = 6 * 60 * 60 * 1000; // 6 hours
const ACCESS_DENIED_COOLDOWN_MS = 6 * 60 * 60 * 1000; // 6 hours — model not available for this account

// Reset cooldowns when user updates their API keys
export const resetApiCooldowns = () => {
    for (const key in modelCooldowns) delete modelCooldowns[key];
    for (const key in modelAccessDenied) delete modelAccessDenied[key];
    for (const key in modelKeyIndices) delete modelKeyIndices[key];
};

// Wrapper for automatic rotation on quota errors and model fallbacks
async function callGeminiWithRotation<T>(modelName: string | string[], fn: (client: ReturnType<typeof getAiClient>) => Promise<T>): Promise<T> {
    const keys = getGeminiApiKeys();
    if (!keys || keys.length === 0) throw new Error("API_KEY_MISSING");

    // Automatically map old single models to the new powerful cascade arrays!
    let models = Array.isArray(modelName) ? modelName : [modelName];
    if (typeof modelName === 'string') {
        if (modelName === 'gemini-2.5-flash' || modelName === 'gemini-3.5-flash') models = MODEL_CASCADE_SMART;
        else if (modelName === 'gemini-2.5-flash-lite') models = MODEL_CASCADE_LITE;
        else if (modelName === 'gemini-3-flash-preview') models = MODEL_CASCADE_PRO;
        else if (modelName === 'gemini-2.5-flash-preview-tts') models = MODEL_CASCADE_TTS;
    }
    
    const executeRotationForModel = async (targetModel: string): Promise<T> => {
        const startIndex = modelKeyIndices[targetModel] ?? 0;
        let attemptedKeys = 0;

        while (attemptedKeys < keys.length) {
            const currentKeyIndex = (startIndex + attemptedKeys) % keys.length;
            try {
                const baseClient = getAiClient(targetModel, currentKeyIndex);
                
                // Proxy client to force the active model on inner calls
                const proxyClient = {
                    ...baseClient,
                    models: {
                        ...baseClient.models,
                        generateContent: async (params: any) => {
                            return await baseClient.models.generateContent({ ...params, model: targetModel });
                        },
                        generateContentStream: async (params: any) => {
                            return await baseClient.models.generateContentStream({ ...params, model: targetModel });
                        }
                    }
                } as any;

                const result = await fn(proxyClient);
                modelKeyIndices[targetModel] = currentKeyIndex;
                return result;
            } catch (e: any) {
                // Quota/rate-limit errors: rotate to next key
                if (isQuotaError(e) && keys.length > 1 && (attemptedKeys + 1) < keys.length) {
                    console.warn(`[AI-ROTATION] ${targetModel}: Key #${currentKeyIndex + 1} exhausted. Trying next key...`);
                    attemptedKeys++;
                    continue;
                }

                if (isQuotaError(e)) {
                    modelKeyIndices[targetModel] = (currentKeyIndex + 1) % keys.length;
                    throw new Error("QUOTA_EXHAUSTED");
                }

                // Definitively invalid API key — Google explicitly says "API key not valid"
                if (isDefinitelyInvalidKey(e) && keys.length > 1 && (attemptedKeys + 1) < keys.length) {
                    console.warn(`[AI-ROTATION] ${targetModel}: Key #${currentKeyIndex + 1} is invalid. Trying next key...`);
                    attemptedKeys++;
                    continue;
                }

                if (isDefinitelyInvalidKey(e)) {
                    console.error(`[AI-KEY-ERROR] ${targetModel}: All keys confirmed invalid by Google.`);
                    throw new Error("DEFINITE_KEY_INVALID");
                }

                // Generic 403/permission error — likely model not available for this account
                if (isPermissionError(e) && keys.length > 1 && (attemptedKeys + 1) < keys.length) {
                    console.warn(`[AI-ROTATION] ${targetModel}: Key #${currentKeyIndex + 1} got permission error. Trying next key...`);
                    attemptedKeys++;
                    continue;
                }

                if (isPermissionError(e)) {
                    console.error(`[AI-ACCESS] ${targetModel}: All keys got permission error (model likely not available for this account).`);
                    throw new Error("MODEL_ACCESS_DENIED");
                }
                
                console.error(`[AI-ERROR] ${targetModel}: Non-quota error on Key #${currentKeyIndex + 1}:`, e.message);
                throw e;
            }
        }
        throw new Error("QUOTA_EXHAUSTED");
    };

    for (let i = 0; i < models.length; i++) {
        const currentModel = models[i];
        const cooldownUntil = modelCooldowns[currentModel] || 0;
        const accessDeniedUntil = modelAccessDenied[currentModel] || 0;
        
        // Skip models on quota cooldown or access-denied cooldown
        if (Date.now() < cooldownUntil || Date.now() < accessDeniedUntil) {
            continue; 
        }
        
        try {
            return await executeRotationForModel(currentModel);
        } catch (e: any) {
            if (e.message === "QUOTA_EXHAUSTED") {
                console.warn(`[AI-FALLBACK] ${currentModel} exhausted on all keys. Cooldown for 6 hours.`);
                modelCooldowns[currentModel] = Date.now() + COOLDOWN_MS;
                if (i === models.length - 1) {
                    console.error(`[AI-LIMIT] All models exhausted in cascade!`);
                    window.dispatchEvent(new CustomEvent('lovelya_api_limit_reached'));
                    throw new Error("API_LIMIT_TOTAL");
                }
                continue;
            }

            // Generic 403/permission error: model not available for this account
            // Cooldown this specific model and try the next one — do NOT declare key invalid
            if (e.message === "MODEL_ACCESS_DENIED") {
                console.warn(`[AI-FALLBACK] ${currentModel} not available for this account. Cooldown for 6 hours.`);
                modelAccessDenied[currentModel] = Date.now() + ACCESS_DENIED_COOLDOWN_MS;
                if (i === models.length - 1) {
                    // All models unavailable for this account — treat as limit, NOT invalid key
                    console.error(`[AI-LIMIT] All models in cascade unavailable for this account.`);
                    window.dispatchEvent(new CustomEvent('lovelya_api_limit_reached'));
                    throw new Error("API_LIMIT_TOTAL");
                }
                continue;
            }

            // Definitively invalid key — Google explicitly said "API key not valid"
            // Still try next model to double-confirm before showing popup
            if (e.message === "DEFINITE_KEY_INVALID") {
                console.warn(`[AI-FALLBACK] ${currentModel}: Key confirmed invalid. Trying next model to verify...`);
                if (i === models.length - 1) {
                    // ALL models (including stable fallbacks) confirm the key is invalid
                    console.error(`[AI-KEY-ERROR] All models confirm: API key is invalid.`);
                    window.dispatchEvent(new CustomEvent('lovelya_api_key_invalid'));
                    throw new Error("API_KEY_INVALID");
                }
                continue;
            }
            
            // 400/404: model not found, bad parameter, or deprecated — cooldown and try next model
            const msg = e?.message || e?.toString() || '';
            if (msg.includes("400") || msg.includes("404")) {
                console.warn(`[AI-FALLBACK] ${currentModel} failed with ${msg.includes("404") ? '404' : '400'} error. Cooldown for 6 hours. Trying next...`, msg);
                modelAccessDenied[currentModel] = Date.now() + ACCESS_DENIED_COOLDOWN_MS;
                if (i === models.length - 1) {
                    throw e;
                }
                continue;
            }

            // 500/503: server error — short cooldown (5 min) since it may be transient
            if (msg.includes("500") || msg.includes("503")) {
                console.warn(`[AI-FALLBACK] ${currentModel} server error. Short cooldown (5 min). Trying next...`, msg);
                modelAccessDenied[currentModel] = Date.now() + 5 * 60 * 1000;
                if (i === models.length - 1) {
                    throw e;
                }
                continue;
            }

            throw e;
        }
    }
    
    window.dispatchEvent(new CustomEvent('lovelya_api_limit_reached'));
    throw new Error("API_LIMIT_TOTAL");
}

export const safeParseJSON = (text: string | undefined, fallback: any) => {
    if (!text) return fallback;
    let cleanText = text.trim();
    cleanText = cleanText.replace(/^```(json|JSON)?|```$/g, '').trim();
    const firstBrace = cleanText.search(/[{[]/);
    if (firstBrace !== -1) {
        const lastClose = cleanText.lastIndexOf(cleanText[firstBrace] === '{' ? '}' : ']');
        if (lastClose !== -1 && lastClose > firstBrace) {
            cleanText = cleanText.substring(firstBrace, lastClose + 1);
        }
    }
    try { return JSON.parse(cleanText); } catch (e) { return fallback; }
};

const handleApiError = (e: any) => {
    console.error("Gemini API Error:", e);
    if (e.message?.includes("Requested entity was not found")) {
        window.aistudio?.openSelectKey?.();
    }
    throw e;
};

const STRICT_FILTER = `
STRICT CONTENT PROHIBITIONS & ISLAMIC ALIGNMENT:
- Religion & Philosophy: Do NOT generate ANY content related to Sufism (sufi), philosophy (filsafat), or any Islamic sects/streams that do not follow pure Islam based strictly on the Quran and Sahih Hadith. All religious explanations, wisdom, and references must be based solely on pure Islam following the Quran and Sahih Hadith.
- General Prohibitions: Do NOT generate ANY content or references related to:
  * Music, singing, musical instruments, concerts, or theater.
  * Movies, films, cinema, or television dramas.
  * Dating (pacaran), romance, or inappropriate free-mixing between genders.
  * Celebrations & Holidays: Maulid (Prophet's birthday), birthdays (ulang tahun / milad), wedding anniversaries, New Year (tahun baru), Halloween, Valentine's Day, Christmas, Easter, or any other non-Islamic holidays.
  * Other: Yoga, meditation, magic, fantasy, horoscopes, astrology, alcohol, pork, or gambling.
- Always use positive, clean, and modest scenarios aligned with pure Islamic values.
`;

const QUALITY_ASSURANCE_PROMPT = `
CRITICAL — ANSWER ACCURACY & QUALITY ASSURANCE:
You are generating educational English learning content for real students. Any incorrect question or answer will TEACH WRONG ENGLISH and cause serious harm. You MUST follow ALL rules below with ABSOLUTE precision.

GRAMMAR RULES TO VERIFY IN EVERY QUESTION AND ANSWER:
1. ARTICLES: "an" before VOWEL SOUNDS (an apple, an hour, an umbrella). "a" before CONSONANT SOUNDS (a banana, a university, a European). Rule is about SOUND, not letter.
2. SUBJECT-VERB AGREEMENT: He/She/It → goes/has/is/does. I/You/We/They → go/have/are/do. "There is" + singular. "There are" + plural.
3. TENSES: Match time markers strictly. "yesterday" → past. "every day" → present. "tomorrow" → future. Never mix tenses illogically.
4. PREPOSITIONS: "interested in", "depend on", "good at", "listen to", "look at", "wait for". Time: "in the morning", "at night", "on Monday", "at 5 o'clock".
5. COUNTABLE/UNCOUNTABLE: "many books" ✓ "much books" ✗. "much water" ✓ "many water" ✗. "fewer people" ✓ "less people" ✗ (formal).
6. COMPARATIVES/SUPERLATIVES: 1 syllable → -er/-est. 2+ syllables → more/most. Irregular: good→better→best, bad→worse→worst.
7. PRONOUNS: Subject (I/he/she/they), Object (me/him/her/them), Possessive (my/his/her/their). Never confuse them.
8. MODALS: can/could/should/must/will + BASE FORM (no -s). "He can swim" ✓ "He can swims" ✗.
9. CONDITIONALS: If + present → will + base. If + past → would + base. Never mix conditional structures incorrectly.
10. WORD ORDER: Adjective before noun. Proper question word order with auxiliaries (Do/Does/Did + subject + base verb).

ANSWER VALIDATION — MANDATORY CHECKLIST BEFORE RETURNING:
- For EVERY MCQ: The option at correctIndex MUST be the ONLY correct answer. Re-read the question, insert the answer — is it perfect?
- For EVERY wrong option: Confirm it is GENUINELY incorrect and cannot also be considered correct in any context.
- For fill-in-the-blank: Insert the answer into the blank and read the FULL sentence — it MUST sound natural and be grammatically flawless.
- For error-correction (grammar_strike): The "correction" MUST have ZERO errors. Read it carefully word by word.
- For translations: The translation MUST accurately convey the original meaning with correct grammar.
- For vocabulary/synonyms: Ensure the synonym/meaning is genuinely accurate, not just loosely related.
- CONTEXT COHERENCE: Every answer MUST logically and semantically fit the question's specific context and scenario.
- NO AMBIGUITY: If a question could have multiple valid answers, rewrite it so only ONE answer is clearly correct.
- If you are even SLIGHTLY unsure about any answer, REPLACE that question with one you are 100% confident about.

ABSOLUTE RULE: Accuracy and correctness ABOVE ALL. Never sacrifice correctness for variety or creativity.
`;

// --- PROGRAMMATIC VALIDATION HELPERS ---
// These catch obviously broken quiz data AFTER AI generation as a safety net.

const validateMCQItems = (items: any[]): any[] => {
    return items.filter((q, idx) => {
        if (q.options && Array.isArray(q.options)) {
            const cIdx = Number(q.correctIndex);
            if (isNaN(cIdx) || cIdx < 0 || cIdx >= q.options.length) {
                console.warn(`[QA] Q${idx + 1}: invalid correctIndex ${q.correctIndex} for ${q.options.length} options — removed.`);
                return false;
            }
            q.correctIndex = cIdx; // Normalize back to number
            if (q.options.length < 2) {
                console.warn(`[QA] Q${idx + 1}: too few options — removed.`);
                return false;
            }
            if (q.options.some((opt: any) => !opt || (typeof opt === 'string' && !opt.trim()))) {
                console.warn(`[QA] Q${idx + 1}: has empty option — removed.`);
                return false;
            }
            const normalized = q.options.map((o: string) => (o || '').toLowerCase().trim());
            if (new Set(normalized).size !== normalized.length) {
                console.warn(`[QA] Q${idx + 1}: has duplicate options — removed.`);
                return false;
            }
        }
        if (q.question !== undefined && (!q.question || (typeof q.question === 'string' && !q.question.trim()))) {
            console.warn(`[QA] Q${idx + 1}: empty question text — removed.`);
            return false;
        }
        return true;
    });
};

const validateGameItems = (items: any[], category: string): any[] => {
    return items.filter((item, idx) => {
        switch (category) {
            case 'grammar_strike':
                if (!item.sentence_with_error || !item.correction) return false;
                if (item.sentence_with_error.toLowerCase().trim() === item.correction.toLowerCase().trim()) {
                    console.warn(`[QA] grammar_strike ${idx + 1}: error and correction identical — removed.`);
                    return false;
                }
                return true;
            case 'knowledge':
                if (!item.options || item.options.length < 2) return false;
                const kcIdx = Number(item.correctIndex);
                if (isNaN(kcIdx) || kcIdx < 0 || kcIdx >= item.options.length) return false;
                item.correctIndex = kcIdx;
                return true;
            case 'odd_one_out':
                if (!item.words || item.words.length < 3) return false;
                const ocIdx = Number(item.intruder_index);
                if (isNaN(ocIdx) || ocIdx < 0 || ocIdx >= item.words.length) return false;
                item.intruder_index = ocIdx;
                return true;
            case 'interpreter':
                return !!(item.indonesian && item.english);
            case 'scramble':
                return !!(item.sentence && item.sentence.split(/\s+/).length >= 3);
            case 'visual':
                return !!(item.emojis && item.answer);
            case 'arcade':
                return !!(item.word && item.definition);
            case 'read_aloud':
                return !!(item.text && typeof item.text === 'string' && item.text.trim().length > 0);
            case 'vocab_master': {
                if (!item.options || item.options.length < 2 || !item.question) return false;
                const vmIdx = Number(item.correctIndex);
                if (isNaN(vmIdx) || vmIdx < 0 || vmIdx >= item.options.length) return false;
                item.correctIndex = vmIdx;
                return true;
            }
            default:
                return true;
        }
    });
};

const getLanguageInstruction = () => {
    const lang = getAppLanguage();
    return lang === 'id'
        ? "IMPORTANT: Provide all feedback, explanations, and instructions in INDONESIAN language. HOWEVER, the actual English learning content (questions, options, texts, vocabulary, sentences) MUST strictly remain in English."
        : "IMPORTANT: Provide all feedback, explanations, and insights in ENGLISH language.";
};

export const analyzeDiaryEntry = async (text: string, level: string): Promise<GrammarResult> => {
    const MODEL = 'gemini-2.5-flash-lite';
    return callGeminiWithRotation(MODEL, async (ai) => {
        const prompt = `
        Act as a friendly English Tutor and Islamic Coach. 
        User Level: ${level}
        Diary Content: "${text}"
        ${getLanguageInstruction()}

        TASK:
        1. Perform a deep grammar and vocabulary analysis.
        2. Identify specific mistakes but DO NOT change the user's original text in your final feedback string.
        3. For each mistake, provide the original snippet, the recommendation, and a short explanation.
        4. Based on the diary's topic, provide one relevant "Islamic Insight" (Quran verse or Hadith) that matches the mood (gratitude, struggle, joy, etc.).

        STRICT FILTER: ${STRICT_FILTER}

        Return JSON: { 
            "score": 0-100, 
            "generalFeedback": "A short summary of their writing quality.", 
            "errors": [{ "mistake": "snippet", "correction": "fixed version", "explanation": "why" }],
            "islamicInsight": "A relevant spiritual reminder based on their day's story."
        }`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        return safeParseJSON(response.text, { correctedText: text, generalFeedback: 'Analysis failed', errors: [], score: 0 });
    }).catch(e => handleApiError(e));
};

// --- TRANSLATION PRACTICE SERVICES ---

export interface TranslationResult {
    completion: number;
    accuracy: number;
    pronunciation: number;
    overall: number;
    corrections: { original: string; userSaid: string; correct: string; explanation: string }[];
    answerKey: string;
    feedback: string;
}

export const generateTranslationText = async (level: string, theme: string, isIslamic: boolean, title?: string): Promise<{ paragraphs: string[], answerKey: string }> => {
    const MODEL = 'gemini-2.5-flash-lite';
    return callGeminiWithRotation(MODEL, async (ai) => {
        const prompt = `You are an expert language teacher. Generate a SHORT Indonesian text for an English translation exercise.
        Target CEFR Level: ${level}
        Theme: ${theme}
        ${title ? `Specific Title/Topic: ${title}` : ''}
        ${isIslamic ? '- Naturally weave in Islamic values or context.' : ''}
        ${STRICT_FILTER}

        RULES:
        - Write 2-3 SHORT paragraphs in INDONESIAN (Bahasa Indonesia).
        - Each paragraph should be 2-3 sentences MAX.
        - The vocabulary and sentence complexity MUST match what a ${level} English learner can translate. 
          For A1: very simple daily sentences (Saya suka makan nasi. Ibu saya memasak di dapur.).
          For A2: slightly more complex but still basic.
          For B1-B2: moderate complexity with some compound sentences.
          For C1-C2: complex sentences with nuance.
        - Use practical, relatable topics.
        - Also provide the IDEAL English translation as "answerKey".

        Return JSON: { "paragraphs": ["Indonesian paragraph 1", "Indonesian paragraph 2"], "answerKey": "The ideal English translation of the entire text, paragraph by paragraph." }`;

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        return safeParseJSON(response.text, { paragraphs: [], answerKey: '' });
    }).catch(e => handleApiError(e));
};

export const evaluateTranslation = async (indonesianText: string, audioBase64: string, mimeType: string, level: string, answerKey: string): Promise<TranslationResult> => {
    const MODEL = 'gemini-2.5-flash';
    return callGeminiWithRotation(MODEL, async (ai) => {
        const prompt = `You are a senior English examiner evaluating a translation exercise.
        ${getLanguageInstruction()}

        ORIGINAL INDONESIAN TEXT:
        "${indonesianText}"

        IDEAL ENGLISH TRANSLATION (ANSWER KEY):
        "${answerKey}"

        TARGET CEFR LEVEL: ${level}

        TASK:
        Listen to the user's audio recording where they translate the Indonesian text above into English.
        
        EVALUATION RULES:
        1. COMPLETION: Calculate what percentage of the original Indonesian text was actually translated. If the text has 3 paragraphs and the user only translated 1, completion is roughly 33%. Be precise based on content coverage.
        2. ACCURACY: For the parts that WERE translated, how accurate is the meaning? Score 0-100. Judge FAIRLY for ${level} level — do NOT expect C1-level vocabulary from an A1 learner. Accept simpler but correct alternatives.
        3. PRONUNCIATION: For the parts spoken, how clear and intelligible is the pronunciation? Be LENIENT with accents (the user is Indonesian). Only penalize if words are completely unintelligible. Score 0-100.
        4. OVERALL: Calculate as (accuracy + pronunciation) / 2 * (completion / 100). Round to nearest integer.
        5. CORRECTIONS: List specific mistakes. For each, show the original Indonesian, what the user said, what the correct English should be, and a brief explanation.
        6. FEEDBACK: Write a short, encouraging feedback paragraph.

        Return JSON: {
            "completion": 0-100,
            "accuracy": 0-100,
            "pronunciation": 0-100,
            "overall": 0-100,
            "corrections": [{ "original": "Indonesian snippet", "userSaid": "what user said", "correct": "correct English", "explanation": "why" }],
            "answerKey": "${answerKey}",
            "feedback": "string"
        }`;

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: {
                parts: [
                    { inlineData: { data: audioBase64, mimeType: mimeType } },
                    { text: prompt }
                ]
            },
            config: { responseMimeType: 'application/json' }
        });
        return safeParseJSON(response.text, { completion: 0, accuracy: 0, pronunciation: 0, overall: 0, corrections: [], answerKey: '', feedback: 'Evaluation failed.' });
    }).catch(e => handleApiError(e));
};

// --- ASSESSMENT SERVICES ---

// Uses pre-made template packs — no AI call needed for question generation
import { getRandomAssessmentPack, getRecentAssessmentPacks, saveRecentAssessmentPack } from '../src/constants/assessment_templates';

export const generateAssessmentTest = async (): Promise<AssessmentQuestion[]> => {
    // Retrieve last 3 used packs to avoid repetition
    const recentPacks = getRecentAssessmentPacks();
    const pack = getRandomAssessmentPack(recentPacks);
    saveRecentAssessmentPack(pack.id);

    // Return questions (preserve difficulty metadata for evaluation)
    return pack.questions.map(q => ({
        id: q.id,
        type: q.type,
        prompt: q.prompt,
        options: q.options,
        correctIndex: q.correctIndex,
        ...(q.difficulty ? { difficulty: q.difficulty } : {}),
    })) as AssessmentQuestion[];
};

export const evaluateAssessment = async (responses: any[]): Promise<AssessmentResult> => {
    const MODEL = 'gemini-3-flash-preview';
    return callGeminiWithRotation(MODEL, async (ai) => {
        // Build enhanced summary with grammar scoring details
        const grammarResponses = responses.filter(r => r.type === 'grammar');
        const grammarResults = grammarResponses.map(r => {
            const isCorrect = r.selectedOption === r.originalQuestion.correctIndex;
            const difficulty = r.originalQuestion.difficulty || 'medium';
            return {
                questionNumber: responses.indexOf(r) + 1,
                prompt: r.originalQuestion.prompt,
                userAnswer: r.originalQuestion.options[r.selectedOption],
                correctAnswer: r.originalQuestion.options[r.originalQuestion.correctIndex],
                isCorrect,
                difficulty,
            };
        });

        const totalGrammarCorrect = grammarResults.filter(g => g.isCorrect).length;
        const easyCorrect = grammarResults.filter(g => g.difficulty === 'easy' && g.isCorrect).length;
        const easyTotal = grammarResults.filter(g => g.difficulty === 'easy').length;
        const mediumCorrect = grammarResults.filter(g => g.difficulty === 'medium' && g.isCorrect).length;
        const mediumTotal = grammarResults.filter(g => g.difficulty === 'medium').length;
        const hardCorrect = grammarResults.filter(g => g.difficulty === 'hard' && g.isCorrect).length;
        const hardTotal = grammarResults.filter(g => g.difficulty === 'hard').length;

        const summaryData = responses.map((r, idx) => ({
            questionNumber: idx + 1,
            type: r.type,
            prompt: r.originalQuestion.prompt,
            answer: r.type === 'speaking' ? `[See Audio Part ${idx + 1}]` : (r.type === 'writing' ? r.textAnswer : r.originalQuestion.options[r.selectedOption]),
            isCorrect: r.type === 'grammar' ? (r.selectedOption === r.originalQuestion.correctIndex) : null,
            difficulty: r.type === 'grammar' ? (r.originalQuestion.difficulty || 'medium') : undefined,
            correctAnswer: r.type === 'grammar' ? r.originalQuestion.options[r.originalQuestion.correctIndex] : undefined,
        }));

        const grammarAnalysisSummary = `
GRAMMAR SCORING BREAKDOWN:
- Total correct: ${totalGrammarCorrect}/6
- Easy questions (basic grammar): ${easyCorrect}/${easyTotal} correct
- Medium questions (intermediate grammar): ${mediumCorrect}/${mediumTotal} correct
- Hard questions (advanced grammar): ${hardCorrect}/${hardTotal} correct

DETAILED GRAMMAR RESULTS:
${grammarResults.map(g => `  Q${g.questionNumber} [${g.difficulty.toUpperCase()}]: "${g.prompt}" → User: "${g.userAnswer}" | Correct: "${g.correctAnswer}" | ${g.isCorrect ? '✓ CORRECT' : '✗ WRONG'}`).join('\n')}

USE THIS DATA to determine grammar proficiency:
- If user gets all easy wrong → likely A1
- If user gets easy right but medium wrong → likely A1-A2
- If user gets easy+medium right but hard wrong → likely B1-B2
- If user gets all/most correct including hard → likely C1-C2
`;

        const contentParts: any[] = [
            {
                text: `Act as a senior English linguist and CEFR examiner. 
              Analyze the following 10 responses (including audio recordings) to determine the user's English proficiency level (A1-C2).
              ${getLanguageInstruction()}
              
              USER RESPONSES SUMMARY:
              ${JSON.stringify(summaryData, null, 2)}

              ${grammarAnalysisSummary}

              INSTRUCTIONS:
              1. Listen to each audio part provided below.
              2. Evaluate the speaking fluency, pronunciation, and grammar in the audio.
              3. Evaluate the writing complexity and accuracy in the text answers.
              4. Use the grammar scoring breakdown above to inform your grammar section score and overall CEFR level assessment.
              5. Provide a final CEFR level.
              6. The "summary" field MUST be a Detailed Analysis Report (min 3 paragraphs) formatted nicely. It MUST include:
                 - Strengths (Kelebihan)
                 - Weaknesses (Kelemahan/Area Perbaikan)
                 - Grammar Performance Detail (mention which difficulty levels were correct/incorrect)
                 - CEFR Justification & Study Advice.

              Return JSON: {
                "detectedLevel": "A1"|"A2"|"B1"|"B2"|"C1"|"C2",
                "overallScore": 0-100,
                "sections": {
                    "speaking": { "score": 0-100, "feedback": "string" },
                    "grammar": { "score": 0-100, "feedback": "string" },
                    "writing": { "score": 0-100, "feedback": "string" }
                },
                "recommendedFocus": ["string"],
                "summary": "string"
              }
            `}
        ];

        responses.forEach((r, idx) => {
            if (r.type === 'speaking' && r.audioBase64) {
                contentParts.push({ text: `--- AUDIO PART ${idx + 1} ---` });
                contentParts.push({ inlineData: { mimeType: 'audio/webm', data: r.audioBase64 } });
            }
        });

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: { parts: contentParts },
            config: {
                responseMimeType: 'application/json'
            }
        });

        return safeParseJSON(response.text, { detectedLevel: 'A1', overallScore: 0 });
    }).catch(e => handleApiError(e));
};

// --- GRAMMAR SERVICES ---

export const generateGrammarTask = async (lessonTitle: string, level: string = 'A1'): Promise<string> => {
    const MODEL = 'gemini-2.5-flash-lite';
    return callGeminiWithRotation(MODEL, async (ai) => {
        const prompt = `Create a specific grammar writing task for the topic: "${lessonTitle}". 
        - The user's English proficiency is CEFR Level: ${level}.
        - Adjust the complexity and expectations perfectly for level ${level}.
        - CRITICAL RULE: The user only has ONE blank text area to write a text. DO NOT ask them to "fill in the blanks", "complete the following sentences", or "rewrite".
        - The task MUST instruct them to WRITE ORIGINAL SENTENCES from scratch (e.g., "Tulis 3 kalimat tentang keluargamu menggunakan am/is/are", or "Ceritakan apa yang kamu lakukan kemarin").
        - The actual task instruction MUST be written entirely in INDONESIAN to help the user understand what to do. Max 2 short sentences.
        - Add a "Hint" section if there are specific tips. The hint MUST also be in INDONESIAN and kept extremely short (1 sentence max).
        - Format strictly like this: [TASK] Main instruction in Indonesian here. [HINT] 1 short tip in Indonesian here.
        - NO introductory or conversational fluff.
        ${STRICT_FILTER}`;
        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: {
            }
        });
        return response.text?.trim() || `[TASK] Buatlah 3-5 kalimat singkat untuk berlatih ${lessonTitle}. [HINT] Gunakan kata-kata yang sederhana.`;
    }).catch(e => handleApiError(e));
};

export const analyzeGrammar = async (text: string, taskContext: string): Promise<GrammarResult> => {
    const MODEL = 'gemini-2.5-flash-lite';
    return callGeminiWithRotation(MODEL, async (ai) => {
        const prompt = `
        Analyze this English writing for grammar. Task: ${taskContext}. Text: "${text}".
        ${getLanguageInstruction()}
        Return JSON: { "correctedText": "...", "generalFeedback": "...", "score": 0-100, "errors": [{ "mistake": "...", "correction": "...", "explanation": "..." }] }`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        return safeParseJSON(response.text, { correctedText: text, generalFeedback: 'Error', errors: [], score: 0 });
    }).catch(e => handleApiError(e));
};

export const generateGrammarQuiz = async (lessonTitle: string, content: string, level: string): Promise<QuizQuestion[]> => {
    const MODEL = 'gemini-2.5-flash';
    return callGeminiWithRotation(MODEL, async (ai) => {
        const prompt = `Create 10 MCQ English grammar quiz items for the topic: "${lessonTitle}" at ${level} level. 
        ${getLanguageInstruction()}
        CRITICAL: The "question" and "options" fields MUST be strictly in English. Only the "explanation" field should use the requested feedback language (Indonesian/English).
        ${STRICT_FILTER}
        IMPORTANT: Randomize the correctIndex (0, 1, 2, or 3) for each question so the correct answer is NOT always the first option!
        ${QUALITY_ASSURANCE_PROMPT}
        Return JSON: { "quiz": [{ "question": "...", "options": ["4 options"], "correctIndex": 0, "explanation": "..." }] }`;
        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        const data = safeParseJSON(response.text, { quiz: [] });
        return validateMCQItems(data.quiz);
    }).catch(e => handleApiError(e));
};

// --- GAME SERVICES ---

export const generateGameData = async (category: string, context: string, level: number, count: number): Promise<any[]> => {
    const MODEL = 'gemini-2.5-flash';
    let schemaPrompt = "";
    switch (category) {
        case 'visual': schemaPrompt = `{ "data": [{ "emojis": "string (ONLY use 2-4 STANDARD, universally supported emojis. DO NOT invent emojis. Emojis MUST logically and accurately describe the answer)", "answer": "string", "clue": "string" }] }`; break;
        case 'knowledge': schemaPrompt = `{ "data": [{ "question": "string", "options": ["4 strings"], "correctIndex": 0 }] }`; break;
        case 'grammar_strike': schemaPrompt = `{ "data": [{ "sentence_with_error": "string (MUST contain exactly ONE clear grammatical error)", "correction": "string (MUST be the perfectly corrected version with ZERO errors — double-check articles a/an, subject-verb agreement, tenses, prepositions)" }] }`; break;
        case 'odd_one_out': schemaPrompt = `{ "data": [{ "words": ["4 strings"], "intruder_index": 0 }] }`; break;
        case 'arcade': schemaPrompt = `{ "data": [{ "word": "string", "definition": "string" }] }`; break;
        case 'scramble': schemaPrompt = `{ "data": [{ "sentence": "string (MUST be a grammatically perfect English sentence)" }] }`; break;
        case 'interpreter': schemaPrompt = `{ "data": [{ "indonesian": "string", "english": "string (MUST be grammatically perfect English — verify articles, tenses, prepositions)" }] }`; break;
        case 'read_aloud': schemaPrompt = `{ "data": [{ "text": "string" }] }`; break;
    }

    const contextInstruction = context === 'islamic' 
        ? 'CRITICAL: The context is "islamic". Every single item MUST incorporate themes of Islam, faith, Muslim culture, Quranic values, or Halal lifestyle (e.g. using names like Ahmad/Aisha, mentioning mosque, prayer, fasting, charity, honesty, etc). Do not generate generic English items.'
        : `Context: ${context}`;

    const prompt = `Generate ${count} English items for "${category}" at difficulty level ${level}/20.
    ${contextInstruction}
    ${getLanguageInstruction()}
    ${STRICT_FILTER}
    ${QUALITY_ASSURANCE_PROMPT}
    
    IMPORTANT JSON RULES:
    1. Structure: ${schemaPrompt}
    2. Return EXACTLY this JSON structure and absolutely nothing else.
    3. Do NOT add any "checklist", "validation", or extra fields outside the requested structure.
    4. Randomize the correctIndex for multiple choice questions.`;

    return callGeminiWithRotation(MODEL, async (ai) => {
        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        const parsed = safeParseJSON(response.text, { data: [] });
        return validateGameItems(parsed.data || [], category);
    }).catch(e => handleApiError(e));
};

export const generateVocabDetails = async (word: string): Promise<{ synonyms: string[], examples: string[], ipa: string }> => {
    const MODEL = 'gemini-2.5-flash';
    return callGeminiWithRotation(MODEL, async (ai) => {
        const prompt = `
        Provide vocabulary details for the English word: "${word}".
        
        TASK:
        1. Provide the International Phonetic Alphabet (IPA).
        2. Provide 3-5 synonyms.
        3. Provide 3 natural example sentences.
        4. For EACH example sentence, provide an Indonesian translation.
        
        Return JSON format: 
        { 
          "ipa": "/string/", 
          "synonyms": ["string"], 
          "examples": ["English sentence | Indonesian translation"] 
        }`;

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        return safeParseJSON(response.text, { ipa: '', synonyms: [], examples: [] });
    }).catch(e => ({ ipa: '', synonyms: [], examples: [] }));
};

export const generateVocabReviewGame = async (vocabItems: { english: string, indonesian: string }[], count: number, level: number, context: string = 'general'): Promise<any[]> => {
    const MODEL = 'gemini-2.5-flash';
    return callGeminiWithRotation(MODEL, async (ai) => {
        const baseWords = vocabItems.length > 0
            ? `Based on these words: ${JSON.stringify(vocabItems)}`
            : `Generate random educational or everyday English words appropriate for Level ${level}/20`;
            
        const contextInstruction = context === 'islamic' 
            ? 'CRITICAL: The context is "islamic". The vocabulary words, questions, and options MUST incorporate themes of Islam, faith, Muslim culture, Quranic values, or Halal lifestyle. Do not generate generic English items.'
            : `Context: ${context}`;

        const prompt = `
        Create exactly ${count} quiz items for a "Vocab Master" game.
        ${baseWords}.
        ${contextInstruction}
        
        QUIZ TYPES (must mix these types):
        - "synonym": Question asks for a synonym of an English word.
        - "meaning": Question asks for the Indonesian meaning of an English word.
        - "reverse": Question is in Indonesian, asking for the English translation.

        ${getLanguageInstruction()}
        ${STRICT_FILTER}
        ${QUALITY_ASSURANCE_PROMPT}

        Return JSON in this EXACT format: 
        { 
          "quiz": [
            { 
              "type": "synonym"|"meaning"|"reverse", 
              "question": "string", 
              "options": ["Option A", "Option B", "Option C", "Option D"], 
              "correctIndex": 0, 
              "explanation": "Brief tip about the word" 
            }
          ] 
        }`;

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        const data = safeParseJSON(response.text, { quiz: [] });
        return validateMCQItems(data.quiz || []);
    }).catch(e => {
        console.error("Vocab Game Error:", e);
        return [];
    });
};

// --- READING & LISTENING SERVICES ---

export const generateReadingTitles = async (level: string, theme: string, isIslamic: boolean): Promise<string[]> => {
    const MODEL = 'gemini-2.5-flash';
    return callGeminiWithRotation(MODEL, async (ai) => {
        const prompt = `You are a master curriculum designer. Generate 12 highly engaging, unique, and deeply interesting English reading titles for CEFR level ${level}.
        Theme: ${theme}.
        RULES:
        - The titles must be catchy, thought-provoking, and sound like real-world articles, essays, or stories.
        - AVOID generic or boring textbook titles (e.g. "My Daily Routine", "The Library").
        - Provide a mix of styles: 4 Narrative, 4 Informative, 4 Reflective/Opinion.
        ${isIslamic ? '- Naturally weave in Islamic context, values, or history in a sophisticated way.' : ''} 
        ${STRICT_FILTER} 
        Return JSON: { "titles": ["string"] }`;
        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        return safeParseJSON(response.text, { titles: [] }).titles;
    }).catch(e => handleApiError(e));
};

export const generateReadingContentStream = async (title: string, level: string, theme: string, isIslamic: boolean) => {
    const MODEL = 'gemini-2.5-flash';
    return callGeminiWithRotation(MODEL, async (ai) => {
        const prompt = `You are an expert English author and educator for language learners. Write an exceptionally engaging, high-quality reading article (4-6 paragraphs) titled "${title}" strictly for CEFR level ${level}.
        Theme: ${theme}.
        The reader is an Indonesian English learner. 
        RULES:
        - The content MUST be captivating, well-structured, and deeply interesting (like a premium blog post or a great story). Do not write dry, robotic text.
        - Match vocabulary, sentence structure, and grammar complexity EXACTLY to ${level} level.
        - Use practical, real-world examples the reader can relate to.
        - Each paragraph should be 3-5 sentences and flow naturally into the next.
        ${isIslamic ? '- Naturally weave in Islamic values, wisdom, or cultural context in a profound and relatable way.' : ''}
        ${STRICT_FILTER} 
        Return JSON: { "title": "${title}", "paragraphs": ["string"] }`;

        return await ai.models.generateContentStream({
            model: MODEL,
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
    }).catch(e => handleApiError(e));
};

export const generateReadingContent = async (title: string, level: string, theme: string, isIslamic: boolean): Promise<ReadingContent> => {
    const MODEL = 'gemini-2.5-flash-lite';
    return callGeminiWithRotation(MODEL, async (ai) => {
        const prompt = `You are an expert English content writer for language learners. Write an engaging reading article (4-6 paragraphs) titled "${title}" strictly for CEFR level ${level}.
        Theme: ${theme}.
        The reader is an Indonesian English learner.
        RULES:
        - Match vocabulary, sentence structure, and grammar complexity EXACTLY to ${level} level.
        - Use practical, real-world examples the reader can relate to.
        - Make it educational and interesting — not generic or repetitive.
        - Each paragraph should be 3-5 sentences.
        ${isIslamic ? '- Naturally weave in Islamic values, wisdom, or cultural context.' : ''}
        ${STRICT_FILTER}
        CRITICAL: Return ONLY a pure JSON object. Do NOT include ANY conversational text, markdown formatting, or extra fields:
        { "title": "${title}", "paragraphs": ["string"] }`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        return safeParseJSON(response.text, { title, paragraphs: [] });
    }).catch(e => handleApiError(e));
};

export const generateListeningTitles = async (level: string, type: string, theme: string, isIslamic: boolean): Promise<string[]> => {
    const MODEL = 'gemini-2.5-flash';
    return callGeminiWithRotation(MODEL, async (ai) => {
        const prompt = `You are a master curriculum designer. Generate 12 highly engaging, unique, and deeply interesting English listening ${type} titles for CEFR level ${level}.
        Theme: ${theme}.
        RULES:
        - The titles must be catchy, thought-provoking, and sound like real-world podcast episodes, captivating stories, or TED-style talks.
        - AVOID generic or boring textbook titles. Make the listener want to click and listen immediately!
        - Provide a variety of styles: 4 Narrative Stories, 4 Informational/Lectures, and 4 Personal Journals/Reflections.
        ${isIslamic ? '- Naturally weave in Islamic context and values in a sophisticated way.' : ''} 
        ${STRICT_FILTER} 
        Return JSON: { "titles": ["string"] }`;
        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        return safeParseJSON(response.text, { titles: [] }).titles;
    }).catch(e => handleApiError(e));
};

// --- LISTENING CONTENT (Script + Speakers only, quiz generated separately for speed) ---
export interface ListeningContentResult {
    speakers: { name: string; gender: 'male' | 'female' }[];
    script: string;
    quiz: QuizQuestion[];
}

// Helper: infer gender from common names when AI doesn't provide it
const KNOWN_FEMALE_NAMES = new Set(['fatimah', 'aisha', 'maryam', 'zainab', 'nadia', 'sarah', 'emma', 'olivia', 'sophie', 'chloe', 'khadijah', 'hana', 'layla', 'amina', 'sumaya', 'anna', 'maria', 'lisa', 'jessica', 'emily', 'linda', 'susan', 'mary', 'hannah', 'rachel', 'leah', 'rebecca', 'ruth', 'esther', 'naomi', 'diana', 'alice', 'grace', 'rose', 'lily', 'ella', 'mia', 'ava', 'isla', 'ivy', 'lucy', 'ruby', 'daisy', 'poppy', 'jasmine', 'maya', 'lina', 'siti', 'dewi', 'rina', 'nina', 'dina', 'fiona', 'julia', 'clara', 'eva', 'helena', 'sofia', 'charlotte', 'amelia', 'harper', 'aria', 'scarlett', 'victoria', 'madison', 'eleanor', 'penelope', 'stella', 'violet', 'hazel', 'aurora', 'savannah', 'brooklyn', 'bella', 'natalie', 'zoe', 'leila', 'samantha', 'audrey', 'claire', 'ellie', 'paisley', 'skylar', 'katherine', 'madelyn']);

const inferGender = (name: string): 'male' | 'female' => {
    return KNOWN_FEMALE_NAMES.has(name.toLowerCase().trim()) ? 'female' : 'male';
};

export const generateListeningContent = async (title: string, level: string, type: string, theme: string, isIslamic: boolean, accent: string = 'Default'): Promise<ListeningContentResult> => {
    const MODEL = 'gemini-2.5-flash-lite';
    return callGeminiWithRotation(MODEL, async (ai) => {
        let accentScriptInstruction = '';
        if (accent && accent !== 'Default') {
            if (accent === 'UK') {
                accentScriptInstruction = `- CRITICAL STYLE: You MUST write the script using standard British English (UK) spelling conventions (e.g., colour, theatre, favourite, grey, realise) and natural British vocabulary (e.g., flat instead of apartment, lift instead of elevator, petrol instead of gas, chips instead of fries, queue instead of line) where appropriate.`;
            } else if (accent === 'US') {
                accentScriptInstruction = `- CRITICAL STYLE: You MUST write the script using standard American English (US) spelling conventions (e.g., color, theater, favorite, gray, realize) and American vocabulary.`;
            } else if (accent === 'AU') {
                accentScriptInstruction = `- CRITICAL STYLE: You MUST write the script using standard Australian English spelling and regional vocabulary/expressions (e.g., mate, G'day, arvo) where appropriate.`;
            }
        }
        // Level-aware complexity scaling (moderately reduced for speed)
        const levelGuide: Record<string, { vocab: string; sentences: string; speed: string; wordCount: string; turns: string }> = {
            'A1': { vocab: 'basic everyday words (100-300 most common)', sentences: 'very short and simple (subject-verb-object)', speed: 'clear and gentle', wordCount: '300-400', turns: '18-24' },
            'A2': { vocab: 'common daily vocabulary (300-600 words)', sentences: 'short sentences with simple connectors (and, but, because)', speed: 'clear and comfortable', wordCount: '350-450', turns: '20-26' },
            'B1': { vocab: 'intermediate vocabulary with some idiomatic expressions', sentences: 'moderate complexity with relative clauses', speed: 'natural comfortable pace', wordCount: '400-500', turns: '24-30' },
            'B2': { vocab: 'wide-ranging vocabulary including abstract concepts', sentences: 'complex sentences with multiple clauses', speed: 'natural conversational speed', wordCount: '450-550', turns: '26-32' },
            'C1': { vocab: 'sophisticated and nuanced vocabulary', sentences: 'complex and varied sentence structures', speed: 'natural confident pace', wordCount: '500-600', turns: '28-34' },
            'C2': { vocab: 'full range including rare and specialized terms', sentences: 'highly complex, native-level structures', speed: 'fast natural native speed', wordCount: '550-650', turns: '30-36' },
        };
        const guide = levelGuide[level] || levelGuide['A1'];

        const dialogueInstructions = type === 'dialogue'
            ? `DIALOGUE RULES:
- Choose 2 character names. Mix between Islamic names (Ahmad, Fatimah, Omar, Aisha, Yusuf, Zainab, Hassan, Maryam, Khalid, Nadia) and General names (James, Sarah, David, Emma, Michael, Olivia, Daniel, Sophie, Liam, Chloe).
- CRITICAL: Assign a gender to each character. Male names MUST have gender "male", female names MUST have gender "female". Never mismatch.
- FORMAT: Randomly choose between making this a "Casual Everyday Conversation" OR a "Podcast Episode / Interview". If it's a podcast, include a brief intro/outro.
- Format each line as "CharacterName: [emotion/tone tag] dialogue text"
- AUDIO TAGS — CRITICAL RULES FOR NATURAL EXPRESSIVENESS:
  * Use a DIVERSE palette of tags: [warmly], [excited], [curious], [thoughtful], [laughing], [sighs], [gasps], [nervously], [whispering], [confidently], [hesitantly], [surprised], [amused], [serious], [enthusiastically], [gently], [with wonder], [chuckling], [reassuringly], [playfully], [concerned], [proudly], [softly], [eagerly], [relieved].
  * Place tags at the START of turns AND mid-sentence when emotion shifts naturally. Example: "Ahmad: [excited] Oh, you went there too? That's amazing! [thoughtful] Actually... I wonder if it was the same day we were there."
  * NOT every sentence needs a tag — only where the emotion genuinely changes or needs emphasis. Aim for 1-3 tags per turn naturally, not forced.
  * The emotional arc should EVOLVE across the conversation — start casual, build interest, hit peaks of excitement/surprise, then settle warmly.
  * NEVER repeat the same tag in consecutive turns. Vary them!
- MUST USE FILLER WORDS: Make it sound incredibly human by using words like "Well...", "Um,", "Like,", "You know,", "Ah," or "Hmm...".
- MUST USE PUNCTUATION FOR PACING: Use ellipses (...) heavily for pauses, dashes (-) for interruptions, and exclamation marks for excitement.
- Create ${guide.turns} turns (back and forth). Each turn should be 1-3 sentences.
- NATURAL CONVERSATION FLOW: Include natural reactions like "Oh really?", "That's interesting!", "Hmm, I see...", "Wait, what?", "No way!", "Tell me more!". Characters should react genuinely to each other.
- DEPTH: Don't just exchange surface-level information. Have characters share personal stories, ask follow-up questions, express opinions, and build on each other's ideas.
- VOCABULARY: Use ONLY ${guide.vocab}.
- SENTENCES: Use ${guide.sentences}.
- CRITICAL DURATION: The script MUST be at least ${guide.wordCount} words to produce approximately 1.5-2 minutes of audio. Do NOT write a short script.
- Make the conversation feel 100% REAL — not like a textbook reading.`
            : `MONOLOGUE RULES:
- Choose 1 narrator name with their gender.
- DYNAMIC STYLE: Look at the Title. If it sounds like a story, write a narrative. If it sounds like a lecture/talk, write an engaging presentation. If it sounds personal, write a journal entry.
- NARRATIVE STRUCTURE: Build a compelling arc — open with an engaging hook, develop with interesting details, and close with a meaningful conclusion or insight.
- AUDIO TAGS — NATURAL EXPRESSIVENESS:
  * Use a DIVERSE palette: [warmly], [excited], [thoughtful], [pauses heavily], [sighs], [chuckling], [serious], [with wonder], [nostalgically], [confidently], [softly], [proudly], [amused], [gently], [eagerly], [hesitantly], [relieved], [passionately].
  * Place tags at the START of paragraphs AND mid-sentence when emotion shifts. Example: "[thoughtful] You know, when I first arrived... [chuckling] I had absolutely no idea what I was doing."
  * Aim for 2-4 tags per paragraph, placed naturally — not forced on every sentence.
  * The emotional arc should BUILD: start calm/reflective, build energy, hit an emotional peak, then resolve warmly.
- PUNCTUATION FOR BREATHING: Use ellipses (...) frequently for dramatic pauses and breaths.
- FILLER WORDS: Make it human. Use "Well...", "Now,", "You see,", "So...", "Anyway,".
- CRITICAL DURATION: Aim for ${guide.wordCount} words to produce approximately 1.5-2 minutes of audio. Do NOT write a short script.
- VOCABULARY: Use ONLY ${guide.vocab}.
- SENTENCES: Use ${guide.sentences}.
- The script MUST sound like a real, passionate human telling a fascinating story, never like a robot reading text.`;

        const prompt = `You are an expert English content creator for CEFR ${level} level learners.

Title: "${title}"
Theme: ${theme}
Type: ${type}
${isIslamic ? 'Context: Content should reflect Islamic wisdom, manners, and vocabulary naturally.' : ''}
${accentScriptInstruction}

CRITICAL LEVEL REQUIREMENTS FOR ${level}:
- Vocabulary: ${guide.vocab}
- Sentence complexity: ${guide.sentences}
- Speaking pace guidance: ${guide.speed}
- The learner is Indonesian. Content must be comprehensible at ${level} level.

${dialogueInstructions}

${STRICT_FILTER}
${getLanguageInstruction()}

Return ONLY this JSON structure (NO quiz, ONLY script and speakers):
{
  "speakers": [{"name": "CharacterName", "gender": "male"}, {"name": "CharacterName2", "gender": "female"}],
  "script": "the full script text with audio tags..."
}`;

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                thinkingConfig: { thinkingBudget: 0 }
            }
        });

        const parsed = safeParseJSON(response.text, { speakers: [], script: '', quiz: [] });
        
        // Validate we got a usable script
        if (!parsed.script || parsed.script.length < 50) {
            throw new Error('Generated script is too short or empty');
        }

        // Normalize speakers format with smart gender inference
        if (parsed.speakers && parsed.speakers.length > 0) {
            parsed.speakers = parsed.speakers.map((s: any) => {
                if (typeof s === 'string') return { name: s, gender: inferGender(s) };
                const name = s.name || 'Speaker';
                // Use AI-provided gender if available, otherwise infer from name
                const gender = s.gender && (s.gender === 'male' || s.gender === 'female') ? s.gender : inferGender(name);
                return { name, gender };
            });
        }

        // Quiz is always empty — generated separately for speed
        parsed.quiz = [];

        return parsed;
    }).catch(e => handleApiError(e));
};

// --- FALLBACK: Script-only generation (used if combined call fails entirely) ---
export const generateListeningScript = async (title: string, level: string, type: string, theme: string, isIslamic: boolean, accent: string = 'Default'): Promise<string> => {
    const MODEL = 'gemini-2.5-flash-lite';
    return callGeminiWithRotation(MODEL, async (ai) => {
        let accentScriptInstruction = '';
        if (accent && accent !== 'Default') {
            if (accent === 'UK') {
                accentScriptInstruction = `You MUST write the script using standard British English (UK) spelling conventions (e.g., colour, theatre, favourite, grey, realise) and natural British vocabulary/phrasing (e.g., flat instead of apartment, lift instead of elevator, petrol instead of gas, chips instead of fries, queue instead of line) where appropriate.`;
            } else if (accent === 'US') {
                accentScriptInstruction = `You MUST write the script using standard American English (US) spelling conventions (e.g., color, theater, favorite, gray, realize) and American vocabulary.`;
            } else if (accent === 'AU') {
                accentScriptInstruction = `You MUST write the script using standard Australian English spelling and expressions where appropriate.`;
            }
        }
        const prompt = `Write an engaging English ${type} script for level ${level} titled "${title}". 
        Theme: ${theme}. 
        ${isIslamic ? 'Ensure the content reflects Islamic manners and vocabulary.' : ''}
        ${accentScriptInstruction}
        ${type === 'dialogue' ? `Choose 2 real character names (mix of Islamic names like Ahmad, Fatimah, Omar and general names like James, Sarah, David). Use audio tags like [warmly], [excited], [laughing], [curious] throughout. Create a vibrant dialogue with 20-26 turns, each 1-3 sentences.` : `Write in first person as someone sharing a personal experience. Use a narrative arc: engaging hook → interesting development → meaningful conclusion. Use audio tags like [warmly], [thoughtful], [pausing], [emphasizing], [with wonder], [smiling] throughout. Aim for 350-420 words. Make it sound like a real person telling a fascinating story, NOT a textbook passage.`}
        ${STRICT_FILTER} 
        Return only the plain text script.`;
        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: { thinkingConfig: { thinkingBudget: 0 } }
        });
        return response.text || "";
    }).catch(e => handleApiError(e));
};

export const generateListeningQuiz = async (script: string, level: string): Promise<QuizQuestion[]> => {
    const MODEL = 'gemini-2.5-flash';
    return callGeminiWithRotation(MODEL, async (ai) => {
        const prompt = `Create 5 MCQ comprehension questions for this English script at ${level} level: "${script}". 
        ${getLanguageInstruction()}
        ${STRICT_FILTER}
        IMPORTANT: Randomize the correctIndex (0, 1, 2, or 3) for each question so the correct answer is NOT always the first option!
        ${QUALITY_ASSURANCE_PROMPT}
        Return JSON: { "quiz": [{ "question": "...", "options": ["4 options"], "correctIndex": 0, "explanation": "..." }] }`;
        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        return validateMCQItems(safeParseJSON(response.text, { quiz: [] }).quiz);
    }).catch(e => handleApiError(e));
};

export const analyzePronunciationAudio = async (text: string, base64: string, mime: string) => {
    const MODEL = 'gemini-2.5-flash';
    return callGeminiWithRotation(MODEL, async (ai) => {
        // Split target text to get word count for coverage check
        const targetWords = text.replace(/[.,!?;:'"()]/g, '').split(/\s+/).filter(w => w.length > 0);

        const prompt = `You are a strict but fair English pronunciation evaluator for language learners.

TARGET TEXT the user should read aloud:
"${text}"

Total target words: ${targetWords.length}

${getLanguageInstruction()}

EVALUATION RULES:
1. **Listen carefully** to every word the user says in the audio.
2. **Compare each spoken word** against the corresponding word in the target text, in order.
3. Mark each word with one of these statuses:
   - "correct": The word is clearly spoken AND recognizable as the target word. Minor accent is OK.
   - "incorrect": The word is spoken but mispronounced significantly — wrong vowel sounds, dropped/added syllables, wrong stress, or sounds like a different word.
   - "missed": The word from the target text was completely skipped/not spoken at all.
4. **Be honest and accurate**. Do NOT default to "correct" — actually evaluate each word. A score of 100% should only happen when pronunciation is genuinely good.
5. **Check for these common errors**:
   - Wrong vowel sounds (e.g., "ship" vs "sheep", "bed" vs "bad")
   - Dropped consonants (e.g., "wor" instead of "world")
   - Wrong word stress (e.g., "reCORD" vs "REcord")
   - Added syllables (e.g., "es-top" instead of "stop")
   - Substituted sounds (e.g., "th" → "d", "v" → "f")
6. **Every word in the target text MUST appear** in your wordAnalysis — either as "correct", "incorrect", or "missed". The total number of items in wordAnalysis must equal ${targetWords.length}.
7. If the audio is silent, empty, or unintelligible, mark ALL words as "missed".

Provide specific, actionable feedback in the "feedback" field mentioning which words need work and how to improve.

Return JSON:
{
  "feedback": "string — specific tips mentioning problem words",
  "wordAnalysis": [
    { "word": "target_word", "status": "correct" | "incorrect" | "missed", "errorDetails": "string (required if incorrect, explain what was wrong)" }
  ]
}`;

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: {
                parts: [
                    { inlineData: { data: base64, mimeType: mime } },
                    { text: prompt }
                ]
            },
            config: {
                responseMimeType: 'application/json'
            }
        });

        const result = safeParseJSON(response.text, null);
        if (!result || !Array.isArray(result.wordAnalysis)) {
            throw new Error("Invalid analysis format from AI");
        }
        return result;
    });
};

export const transcribeAudio = async (base64: string, mime: string): Promise<string> => {
    const MODEL = 'gemini-2.5-flash-lite';
    return callGeminiWithRotation(MODEL, async (ai) => {
        const response = await ai.models.generateContent({
            model: MODEL,
            contents: {
                parts: [
                    { inlineData: { data: base64, mimeType: mime } },
                    { text: "Transcribe this English audio precisely. Return only the transcription." }
                ]
            },
            config: {
            }
        });
        return response.text?.trim() || "";
    }).catch(e => handleApiError(e));
};

// Voice pools for variety (separated to avoid narrator sounding like a dialogue character)
const VOICE_POOL_MALE = ['Puck', 'Enceladus', 'Charon', 'Fenrir', 'Orus'];
const VOICE_POOL_FEMALE = ['Kore', 'Aoede', 'Leda', 'Callirrhoe'];
const VOICE_POOL_NARRATOR = ['Zephyr', 'Sulafat', 'Umbriel', 'Algenib', 'Vindemiatrix'];

const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateTTSAudio = async (text: string, type: string, speakers?: { name: string; gender: 'male' | 'female' }[], level?: string, exactVoiceName?: string, accent: string = 'Default'): Promise<string> => {
    return callGeminiWithRotation(MODEL_CASCADE_TTS, async (ai) => {
        const config: any = {
            responseModalities: [Modality.AUDIO],
        };

        if (exactVoiceName) {
            config.speechConfig = {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: exactVoiceName } }
            };
        } else if (type === 'dialogue' && speakers && speakers.length >= 2) {
            // Gender-aware voice assignment
            const speakerConfigs = speakers.map(s => {
                const pool = s.gender === 'female' ? VOICE_POOL_FEMALE : VOICE_POOL_MALE;
                return {
                    speaker: s.name,
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: pickRandom(pool) } }
                };
            });
            // Ensure no duplicate voices
            if (speakerConfigs.length >= 2 && 
                speakerConfigs[0].voiceConfig.prebuiltVoiceConfig.voiceName === speakerConfigs[1].voiceConfig.prebuiltVoiceConfig.voiceName) {
                const altPool = speakers[1].gender === 'female' ? VOICE_POOL_FEMALE : VOICE_POOL_MALE;
                const altVoices = altPool.filter(v => v !== speakerConfigs[0].voiceConfig.prebuiltVoiceConfig.voiceName);
                if (altVoices.length > 0) speakerConfigs[1].voiceConfig.prebuiltVoiceConfig.voiceName = pickRandom(altVoices);
            }

            config.speechConfig = {
                multiSpeakerVoiceConfig: { speakerVoiceConfigs: speakerConfigs }
            };
        } else if (type === 'dialogue') {
            config.speechConfig = {
                multiSpeakerVoiceConfig: {
                    speakerVoiceConfigs: [
                        { speaker: 'Person A', voiceConfig: { prebuiltVoiceConfig: { voiceName: pickRandom(VOICE_POOL_MALE) } } },
                        { speaker: 'Person B', voiceConfig: { prebuiltVoiceConfig: { voiceName: pickRandom(VOICE_POOL_FEMALE) } } }
                    ]
                }
            };
        } else {
            let selectedVoice = pickRandom(VOICE_POOL_NARRATOR);
            if (speakers && speakers.length === 1) {
                // Respect the gender returned by the script generator for monologue
                const gender = speakers[0].gender;
                selectedVoice = pickRandom(gender === 'female' ? VOICE_POOL_FEMALE : VOICE_POOL_MALE);
            }
            config.speechConfig = {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedVoice } }
            };
        }

        // Level-based speech instructions
        const levelPace: Record<string, string> = {
            'A1': 'Speak clearly at a gentle, natural pace. Pronounce words distinctly but maintain a warm, engaging rhythm with natural flow — never robotic or mechanical. Brief natural pauses between ideas.',
            'A2': 'Speak clearly at a comfortable, natural pace. Use warm and engaging tone with natural rhythm. Sound like a kind friend telling a story, not a teacher dictating.',
            'B1': 'Speak at a natural, comfortable pace with expressive flow. Use good intonation and natural pauses for emphasis.',
            'B2': 'Speak at a natural conversational pace with dynamic energy. Vary your speed naturally for emphasis and drama.',
            'C1': 'Speak at a natural, confident pace with sophisticated delivery. Use connected speech and expressive dynamics.',
            'C2': 'Speak at full native speed with masterful, compelling delivery. Use natural reductions, connected speech, and dynamic pacing.',
        };
        const paceInstruction = levelPace[level || 'B1'] || levelPace['B1'];
        let accentInstruction = '';
        if (accent && accent !== 'Default') {
            if (accent === 'UK') {
                accentInstruction = `CRITICAL VOICE DIRECTION: You MUST speak with a highly authentic, natural, and distinct British accent (Received Pronunciation or standard Southern British). Pronounce words with clear British vowel sounds and non-rhoticity (e.g., drop the 'r' at the end of words like 'car' or 'water', use a broad 'a' in 'can't' or 'path', and pronounce 'water' as /'wɔːtə/). Ensure your pitch, rhythm, and intonation sound distinctly British.`;
            } else if (accent === 'US') {
                accentInstruction = `CRITICAL VOICE DIRECTION: You MUST speak with a clear, natural Standard American accent (General American). Pronounce words with clear American rhoticity (pronounce the 'r' sounds clearly) and typical American vowel shifts.`;
            } else if (accent === 'AU') {
                accentInstruction = `CRITICAL VOICE DIRECTION: You MUST speak with a natural, authentic Australian English accent. Use standard Australian vowels, distinct inflections, and speech patterns.`;
            } else {
                accentInstruction = `CRITICAL VOICE DIRECTION: You MUST speak with a natural ${accent} English accent.`;
            }
        }

        const prompt = type === 'dialogue'
            ? `You are world-class voice actors performing a scripted conversation, but you must make it sound 100% natural and alive. ${paceInstruction} ${accentInstruction} Read this dialogue with distinct character voices. Act out real emotions, use natural pauses, and sound alive — like a real podcast or daily conversation. CRITICALLY IMPORTANT ACTING RULES: 
1. Fully perform any emotion tags (actually laugh out loud for [laughing], whisper for [whispering], sigh audibly for [sighs], gasp for [gasps]).
2. Treat ellipses (...) as physical pauses where you take a breath or think.
3. Pronounce filler words ("um", "well", "ah") naturally and organically.
4. CRITICAL: You MUST perform the EXACT text provided below word-for-word. Do not change, add, or skip any words. Ensure 100% fidelity to the script.
Make it sound incredibly human and alive. Do NOT sound like an AI reading text:\n\n${text}`
            : `Analyze the following text to determine its genre (e.g., personal story, professional lecture, casual journal, or news report). Based on your analysis, adopt the perfect persona and voice for it. For example, if it's a story, be a captivating world-class storyteller. If it's a lecture, be a clear and engaging professional expert. If casual, be a friendly and relaxed narrator. ${paceInstruction} ${accentInstruction} 
CRITICALLY IMPORTANT ACTING RULES: 
1. Vary your pace dynamically. Slow down for important points, speed up for excitement.
2. Fully perform emotion tags — actually laugh for [laughing], genuinely whisper for [whispering], sigh audibly for [sighs].
3. Treat ellipses (...) as physical pauses where you take a breath or hesitate.
4. Pronounce filler words naturally. 
5. CRITICAL: You MUST perform the EXACT text provided below word-for-word. Do not change, add, or skip any words. Ensure 100% fidelity to the script.
Sound like a real, passionate human naturally speaking. NEVER sound like an AI reading text monotonously. Perform this text now:\n\n${text}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-tts',
            contents: [{ parts: [{ text: prompt }] }],
            config
        });
        const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!audioData) {
            console.error('[TTS] No audio data in response');
            throw new Error('TTS model returned no audio data');
        }
        return audioData;
    }).catch(e => handleApiError(e));
};

export interface SimpleTranslationResult {
    translation: string;
    synonyms?: string[];
    examples?: string[];
}

// --- Translation Cache (LRU-style, max 200 entries) ---
const translationCache = new Map<string, { result: SimpleTranslationResult; timestamp: number }>();
const TRANSLATION_CACHE_MAX = 200;
const TRANSLATION_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

const getCachedTranslation = (key: string): SimpleTranslationResult | null => {
    const entry = translationCache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > TRANSLATION_CACHE_TTL) {
        translationCache.delete(key);
        return null;
    }
    return entry.result;
};

const setCachedTranslation = (key: string, result: SimpleTranslationResult) => {
    // Evict oldest entries if cache is full
    if (translationCache.size >= TRANSLATION_CACHE_MAX) {
        const oldestKey = translationCache.keys().next().value;
        if (oldestKey) translationCache.delete(oldestKey);
    }
    translationCache.set(key, { result, timestamp: Date.now() });
};

// Helper: fetch dictionary data for an English word (free API, no quota)
const fetchDictionaryData = async (englishWord: string): Promise<{ synonyms: string[]; examples: string[] }> => {
    const synonyms: string[] = [];
    const examples: string[] = [];
    try {
        const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(englishWord.trim().toLowerCase())}`);
        if (dictRes.ok) {
            const dictData = await dictRes.json();
            if (dictData[0] && dictData[0].meanings) {
                dictData[0].meanings.forEach((m: any) => {
                    m.definitions?.forEach((d: any) => {
                        if (d.example) examples.push(d.example);
                        if (d.synonyms?.length > 0) synonyms.push(...d.synonyms);
                    });
                    if (m.synonyms?.length > 0) synonyms.push(...m.synonyms);
                });
            }
        }
    } catch (e) {
        console.warn('Free dictionary fetch failed for:', englishWord, e);
    }
    return {
        synonyms: [...new Set(synonyms)].slice(0, 5),
        examples: [...new Set(examples)].slice(0, 3),
    };
};

export const translateText = async (text: string, direction: 'en-id' | 'id-en'): Promise<SimpleTranslationResult> => {
    const trimmedText = text.trim();
    if (!trimmedText) {
        return { translation: '', synonyms: [], examples: [] };
    }

    // Check cache first — saves quota!
    const cacheKey = `${direction}:${trimmedText.toLowerCase()}`;
    const cached = getCachedTranslation(cacheKey);
    if (cached) {
        console.log('[Translate] Cache hit — saved an API call!');
        return cached;
    }

    try {
        const sl = direction === 'en-id' ? 'en' : 'id';
        const tl = direction === 'en-id' ? 'id' : 'en';
        
        // 1. Get Translation via Free Google API
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(trimmedText)}`);
        const data = await res.json();
        
        // Null-safe extraction of translation from nested arrays
        let translation = '';
        if (Array.isArray(data) && Array.isArray(data[0])) {
            // Google Translate returns segments — concatenate all translated parts
            translation = data[0]
                .filter((segment: any) => Array.isArray(segment) && segment[0])
                .map((segment: any) => segment[0])
                .join('');
        }
        
        if (!translation) {
            throw new Error('Empty translation response');
        }

        const result: SimpleTranslationResult = { translation, synonyms: [], examples: [] };
        
        // 2. Determine the English word(s) to look up in the dictionary
        //    - EN→ID: the source text is English
        //    - ID→EN: the translated result is English
        const wordCount = trimmedText.split(/\s+/).length;
        const isShortText = wordCount <= 3;
        
        if (isShortText) {
            let englishLookup = '';
            
            if (direction === 'en-id') {
                // Source is English — look up the source
                englishLookup = trimmedText;
            } else {
                // ID→EN: the translation result is English — look up the translation
                englishLookup = translation;
            }
            
            // Try looking up the full phrase first
            const lookupWords = englishLookup.trim().split(/\s+/);
            let dictData = await fetchDictionaryData(englishLookup);
            
            // If full phrase lookup failed and it's multi-word, try individual words
            if (dictData.examples.length === 0 && dictData.synonyms.length === 0 && lookupWords.length > 1) {
                for (const word of lookupWords) {
                    if (word.length < 3) continue; // skip short words like "a", "is", "to"
                    const wordData = await fetchDictionaryData(word);
                    if (wordData.examples.length > 0) {
                        dictData.examples.push(...wordData.examples);
                    }
                    if (wordData.synonyms.length > 0) {
                        dictData.synonyms.push(...wordData.synonyms);
                    }
                    if (dictData.examples.length >= 2) break; // enough examples
                }
            }
            
            result.synonyms = [...new Set(dictData.synonyms)].slice(0, 5);
            result.examples = [...new Set(dictData.examples)].slice(0, 3);
        }
        
        // Cache the result
        setCachedTranslation(cacheKey, result);
        
        return result;
    } catch (e) {
        console.error('Translation failed:', e);
        return { translation: "Gagal menerjemahkan (Cek koneksi internet Anda)", synonyms: [], examples: [] };
    }
};

export const getWordIPA = async (word: string): Promise<string> => {
    const MODEL = 'gemini-2.5-flash-lite';
    return callGeminiWithRotation(MODEL, async (ai) => {
        const prompt = `Give the International Phonetic Alphabet (IPA) for the English word: "${word}". Return only the IPA symbols in slashes.`;
        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: {
            }
        });
        return response.text?.trim() || "";
    }).catch(e => "");
};

export const generateSingleReadingTitle = async (level: string, theme: string, isIslamic: boolean) => {
    const MODEL = 'gemini-2.5-flash-lite';
    return callGeminiWithRotation(MODEL, async (ai) => {
        const prompt = `Generate ONE unique and catchy English reading title for level ${level}, theme: ${theme}. 
        ${isIslamic ? 'Include Islamic context.' : ''} 
        ${STRICT_FILTER} 
        Return JSON: { "title": "string" }`;
        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        return safeParseJSON(response.text, { title: "New Topic" }).title;
    }).catch(e => "New Topic");
};

export const generateSingleListeningTitle = async (level: string, type: string, theme: string, isIslamic: boolean) => {
    const MODEL = 'gemini-2.5-flash-lite';
    return callGeminiWithRotation(MODEL, async (ai) => {
        const prompt = `Generate ONE unique and catchy English listening ${type} title for level ${level}, theme: ${theme}. 
        ${isIslamic ? 'Include Islamic context.' : ''} 
        ${STRICT_FILTER} 
        Return JSON: { "title": "string" }`;
        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        return safeParseJSON(response.text, { title: "New Topic" }).title;
    }).catch(e => "New Topic");
};

export const generateWeeklyInsight = async (logs: any[], profileName: string): Promise<string> => {
    const MODEL = 'gemini-3-flash-preview';
    return callGeminiWithRotation(MODEL, async (ai) => {
        const prompt = `
        Act as a professional, data-driven, yet friendly English Tutor and Islamic Coach.
        Generate a "Weekly AI Insight" for the user named ${profileName}.
        
        USER DATA (Last 7 Days Activity Logs):
        ${JSON.stringify(logs, null, 2)}
        
        ${getLanguageInstruction()}
        
        TASK:
        1. Analyze Performance: Look at the logs. If active, highlight specific achievements factually (e.g., days active, score trends, modules completed). If inactive, factually state that they missed some days.
        2. Provide Encouragement: Use a professional and supportive tone. If active, praise their consistency. If inactive, reassure them ("Tidak masalah...") and briefly share a mature Islamic wisdom about persistence.
        3. Give Actionable Advice (Saran): Based on their logs (or lack thereof), give ONE specific, actionable advice for next week (e.g., "Fokus tingkatkan akurasi di modul Grammar", "Luangkan 10 menit sehari untuk Listening").
        4. STRICT FORMAT: The entire insight MUST be exactly ONE short paragraph (max 3 sentences). Combine the analysis, encouragement, and advice into a single, seamless paragraph. Do NOT use bullet points or multiple paragraphs.
        5. Tone: Factual, professional, and friendly. Avoid overly casual slang, exaggerated emojis, or dramatic emotional words ("alay"). Use polite pronouns like "Anda" instead of "kamu".
        
        STRICT FILTER: ${STRICT_FILTER}
        
        Return only the plain text insight (no quotes in the response).
        `;

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: {
            }
        });
        return response.text?.trim() || "";
    }).catch(e => {
        console.error("Weekly Insight Error:", e);
        return `"Keep up the great work, ${profileName}! Consistency is the key to mastering a new language. You're doing better than you think!"`;
    });
};
