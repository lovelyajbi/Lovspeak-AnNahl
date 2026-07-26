/**
 * Batch Grammar Content Generator
 *
 * For every grammar lesson (data/grammar/level*.ts), generates and bakes in:
 *  - a 30-question MCQ quiz bank (10 are randomly drawn + option-shuffled per attempt at runtime)
 *  - 5 writing-practice prompt variants
 * so GrammarModule can run quizzes/practice tasks with zero AI calls at runtime.
 * Falls back to live AI generation only for lessons this script hasn't covered yet.
 *
 * Usage: GEMINI_API_KEY=key1,key2 node scripts/generate-grammar-content.mjs [level]
 *   e.g. GEMINI_API_KEY=xxx node scripts/generate-grammar-content.mjs        (all levels)
 *        GEMINI_API_KEY=xxx node scripts/generate-grammar-content.mjs A1     (one level only)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import esbuild from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const GRAMMAR_DIR = path.join(ROOT, 'data', 'grammar');
const BANK_DIR = path.join(GRAMMAR_DIR, 'quizBanks');

const rawKeys = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
const API_KEYS = rawKeys ? rawKeys.split(',').map(k => k.trim()).filter(Boolean) : [];

if (API_KEYS.length === 0) {
  console.error('❌ Error: No API keys found. Please set GEMINI_API_KEY environment variable.');
  console.error('   Example: GEMINI_API_KEY=your_key_1,your_key_2 node scripts/generate-grammar-content.mjs');
  process.exit(1);
}

let currentKeyIndex = 0;
function getNextApiKey() {
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  if (API_KEYS.length > 1) console.log(`   🔄 Switching to API Key #${currentKeyIndex + 1}`);
}

const QUESTIONS_PER_LESSON = 30;
const PROMPTS_PER_LESSON = 5;
const DELAY_MS = 1500;

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
- CONTEXT COHERENCE: Every answer MUST logically and semantically fit the question's specific context and scenario.
- NO AMBIGUITY: If a question could have multiple valid answers, rewrite it so only ONE answer is clearly correct.
- If you are even SLIGHTLY unsure about any answer, REPLACE that question with one you are 100% confident about.
- Vary the position of the correct answer across questions — do not always put it at the same index.

ABSOLUTE RULE: Accuracy and correctness ABOVE ALL. Never sacrifice correctness for variety or creativity.
`;

async function callGemini(prompt, retries = 5) {
  const apiKey = API_KEYS[currentKeyIndex];
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.4 }
        })
      }
    );

    if (!response.ok) {
      if ((response.status === 429 || response.status === 503) && retries > 0) {
        getNextApiKey();
        await new Promise(r => setTimeout(r, 2000));
        return callGemini(prompt, retries - 1);
      }
      const err = await response.text();
      throw new Error(`API Error ${response.status}: ${err.slice(0, 200)}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response from Gemini');
    return JSON.parse(text);
  } catch (error) {
    if (error.message.includes('JSON') && retries > 0) {
      console.log(`   ⏳ JSON parse error, retrying...`);
      return callGemini(prompt, retries - 1);
    }
    throw error;
  }
}

function validateMCQItems(items) {
  if (!Array.isArray(items)) return [];
  return items.filter((q) => {
    if (!q.options || !Array.isArray(q.options) || q.options.length < 2) return false;
    const cIdx = Number(q.correctIndex);
    if (Number.isNaN(cIdx) || cIdx < 0 || cIdx >= q.options.length) return false;
    q.correctIndex = cIdx;
    if (q.options.some(o => !o || !String(o).trim())) return false;
    const normalized = q.options.map(o => String(o).toLowerCase().trim());
    if (new Set(normalized).size !== normalized.length) return false;
    if (!q.question || !String(q.question).trim()) return false;
    return true;
  });
}

async function generateQuizBank(lesson) {
  const contentString = lesson.sections.map(s => `${s.heading}: ${s.content}`).join('\n');
  const prompt = `Create ${QUESTIONS_PER_LESSON} MCQ English grammar quiz items for the topic: "${lesson.title}" at ${lesson.level} level.
Lesson content for context:
${contentString.slice(0, 4000)}

CRITICAL: The "question" and "options" fields MUST be strictly in English. The "explanation" field MUST be in Indonesian (Bahasa Indonesia).
${STRICT_FILTER}
${QUALITY_ASSURANCE_PROMPT}
Return JSON: { "quiz": [{ "question": "...", "options": ["4 options"], "correctIndex": 0, "explanation": "..." }] }`;

  const data = await callGemini(prompt);
  return validateMCQItems(data.quiz || []);
}

async function generatePracticePrompts(lesson) {
  const prompt = `Create ${PROMPTS_PER_LESSON} DIFFERENT writing-practice task variants for the grammar topic: "${lesson.title}" at CEFR level ${lesson.level}.
- Each variant must instruct the user to WRITE ORIGINAL SENTENCES from scratch (e.g. "Tulis 3 kalimat tentang keluargamu menggunakan am/is/are"). Never ask them to "fill in the blanks", "complete the following", or "rewrite".
- Each task instruction MUST be written entirely in INDONESIAN. Max 2 short sentences.
- Each variant needs a short "hint" in INDONESIAN (1 sentence max).
- The 5 variants must be genuinely different scenarios/topics from each other, not reworded copies.
${STRICT_FILTER}
Return JSON: { "prompts": ["[TASK] ... [HINT] ...", "[TASK] ... [HINT] ..."] }`;

  const data = await callGemini(prompt);
  return Array.isArray(data.prompts) ? data.prompts.filter(p => typeof p === 'string' && p.trim()) : [];
}

async function loadLevelLessons(levelFile) {
  const tsPath = path.join(GRAMMAR_DIR, `${levelFile}.ts`);
  const result = await esbuild.build({
    entryPoints: [tsPath],
    bundle: false,
    write: false,
    format: 'esm',
    platform: 'node',
    loader: { '.ts': 'ts' }
  });
  const jsCode = result.outputFiles[0].text;
  const tmpPath = path.join(ROOT, 'scratch_grammar_load.mjs');
  fs.writeFileSync(tmpPath, jsCode);
  try {
    const mod = await import(`file://${tmpPath}?t=${Date.now()}`);
    const exportName = Object.keys(mod)[0];
    return mod[exportName];
  } finally {
    fs.unlinkSync(tmpPath);
  }
}

async function main() {
  const onlyLevel = process.argv[2]?.toUpperCase();
  const LEVEL_FILES = ['levelA1', 'levelA2', 'levelB1', 'levelB2', 'levelC1', 'levelC2'];
  const targets = onlyLevel
    ? LEVEL_FILES.filter(f => f.toLowerCase() === `level${onlyLevel.toLowerCase()}`)
    : LEVEL_FILES;

  if (targets.length === 0) {
    console.error(`❌ Unknown level "${onlyLevel}". Use one of: A1, A2, B1, B2, C1, C2`);
    process.exit(1);
  }

  fs.mkdirSync(BANK_DIR, { recursive: true });

  for (const levelFile of targets) {
    const level = levelFile.replace('level', '').toUpperCase();
    console.log(`\n📘 Level ${level}`);
    const lessons = await loadLevelLessons(levelFile);

    const bankPath = path.join(BANK_DIR, `${level}.json`);
    const existingBank = fs.existsSync(bankPath) ? JSON.parse(fs.readFileSync(bankPath, 'utf8')) : {};

    for (const lesson of lessons) {
      if (existingBank[lesson.id]?.quiz?.length >= QUESTIONS_PER_LESSON) {
        console.log(`   ⏭️  ${lesson.title} — already has a bank, skipping`);
        continue;
      }

      console.log(`   📝 ${lesson.title}`);
      try {
        const [quiz, practicePrompts] = await Promise.all([
          generateQuizBank(lesson),
          generatePracticePrompts(lesson)
        ]);
        existingBank[lesson.id] = { quiz, practicePrompts };
        console.log(`      ✅ ${quiz.length} quiz questions, ${practicePrompts.length} practice prompts`);
        fs.writeFileSync(bankPath, JSON.stringify(existingBank, null, 2));
      } catch (e) {
        console.error(`      ❌ Failed: ${e.message}`);
      }

      await new Promise(r => setTimeout(r, DELAY_MS));
    }

    console.log(`   📁 Saved ${bankPath}`);
  }

  console.log('\n✅ Done.');
}

main();
