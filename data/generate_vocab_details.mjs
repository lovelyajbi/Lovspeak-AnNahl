/**
 * Batch Vocab Detail Generator
 * 
 * Generates IPA, synonyms, antonyms, and example sentences for all vocab words
 * that don't have details yet. Uses Gemini AI with strict Islamic content guidelines.
 * 
 * Usage: node data/generate_vocab_details.mjs
 */

import fs from 'fs';
import path from 'path';

// Load API keys from environment variable to support BYOK (Bring Your Own Key)
// You can provide a single key or multiple keys separated by commas
const rawKeys = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
const API_KEYS = rawKeys ? rawKeys.split(',').map(k => k.trim()) : [];

if (API_KEYS.length === 0) {
  console.error('❌ Error: No API keys found. Please set GEMINI_API_KEY environment variable.');
  console.error('   Example: GEMINI_API_KEY=your_key_1,your_key_2 node data/generate_vocab_details.mjs');
  process.exit(1);
}

let currentKeyIndex = 0;

function getNextApiKey() {
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  if (API_KEYS.length > 1) {
    console.log(`   🔄 Switching to API Key #${currentKeyIndex + 1}`);
  }
  return API_KEYS[currentKeyIndex];
}

// Read vocabData.ts and extract all english words + existing detail keys
const vocabPath = path.join(process.cwd(), 'data', 'vocabData.ts');
const content = fs.readFileSync(vocabPath, 'utf8');

// Extract all english words
const englishWords = new Set();
const pairRegex = /\['([^']+)',\s*'[^']+'\]/g;
let match;
while ((match = pairRegex.exec(content)) !== null) {
  englishWords.add(match[1]);
}

// Extract existing detail keys
const detailSet = new Set();
const detailRegex = /"([^"]+)":\s*\{\s*ipa:/g;
while ((match = detailRegex.exec(content)) !== null) {
  detailSet.add(match[1].toLowerCase());
}

// Find missing words
const missingWords = [...englishWords].filter(w => !detailSet.has(w.toLowerCase()));
console.log(`📊 Total words: ${englishWords.size}, With details: ${detailSet.size}, Missing: ${missingWords.length}`);

if (missingWords.length === 0) {
  console.log('✅ All words already have details!');
  process.exit(0);
}

const BATCH_SIZE = 20; // Slightly smaller to process faster
const DELAY_MS = 1000; // Delay between calls

async function callGemini(words, retries = 5) {
  const prompt = `You are a vocabulary database generator for an Islamic English learning app called LovSpeak.

Generate vocabulary details for these English words: ${JSON.stringify(words)}

For each word, provide:
1. IPA pronunciation
2. 2-4 synonyms
3. 1-3 antonyms. You MUST provide antonyms if the word has any logical opposite. Do not leave this empty unless it's a highly specific noun (like 'laboratory' or 'bicycle') without any logical opposite.
4. 3 example sentences with Indonesian translations separated by " | "

STRICT CONTENT RULES (CRITICAL - MUST FOLLOW):
- All example sentences MUST follow the pure teachings of Islam (Quran and Sahih Hadith) and be appropriate for devout Muslims. Use natural, conversational language that people actually use in daily life!
- Do NOT generate ANY content or references related to: Sufism (sufi), philosophy (filsafat), or any Islamic sects/streams that do not follow pure Islam based strictly on the Quran and Sahih Hadith. All explanations must be based solely on pure Islam following the Quran and Sahih Hadith.
- Do NOT generate ANY content or references related to:
  * Music, singing, musical instruments, concerts, or theater.
  * Movies, films, cinema, or television dramas.
  * Dating (pacaran), romance, or inappropriate free-mixing between genders.
  * Celebrations & Holidays: Maulid (Prophet's birthday), birthdays (ulang tahun / milad), wedding anniversaries, New Year (tahun baru), Halloween, Valentine's Day, Christmas, Easter, or any other non-Islamic holidays.
  * Other: Yoga, meditation, magic, fantasy, horoscopes, astrology, alcohol, pork, or gambling.
- Preferred themes: Islamic values, family, education, work, nature, health, community service, charity, seeking knowledge, helping others, cooking halal food, sports (Sunnah like archery/swimming/horse-riding), travel for good purposes, mosque activities, Ramadan, Eid al-Fitr, Eid al-Adha, Hajj, daily prayers.
- Use Muslim names when needed (Ahmad, Fatimah, Umar, Aisha, Khadijah, etc.).
- Keep sentences practical, conversational, educational, and morally upright.

Return ONLY valid JSON in this exact format:
{
  "words": {
    "word_lowercase": {
      "ipa": "/pronunciation/",
      "antonyms": ["word1", "word2"],
      "synonyms": ["word1", "word2", "word3"],
      "examples": [
        "English sentence. | Kalimat dalam bahasa Indonesia.",
        "English sentence. | Kalimat dalam bahasa Indonesia.",
        "English sentence. | Kalimat dalam bahasa Indonesia."
      ]
    }
  }
}`;

  try {
    let apiKey = API_KEYS[currentKeyIndex];
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.3
          }
        })
      }
    );

    if (!response.ok) {
      if (response.status === 429 && retries > 0) {
        getNextApiKey(); // Switch to next key
        await new Promise(resolve => setTimeout(resolve, 2000)); // Small delay before retry
        return callGemini(words, retries - 1);
      }
      const err = await response.text();
      throw new Error(`API Error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response from Gemini');

    const parsed = JSON.parse(text);
    return parsed.words || parsed;
  } catch (error) {
    if (error.message.includes('JSON') && retries > 0) {
       console.log(`   ⏳ JSON Parse error. Retrying...`);
       return callGemini(words, retries - 1);
    }
    throw error;
  }
}

function formatDetailEntry(key, detail) {
  const ipa = detail.ipa || '';
  const antonyms = (detail.antonyms || []).map(a => `"${a.replace(/"/g, '\\"')}"`).join(', ');
  const synonyms = (detail.synonyms || []).map(s => `"${s.replace(/"/g, '\\"')}"`).join(', ');
  const examples = (detail.examples || []).map(e => `      "${e.replace(/"/g, '\\"')}"`).join(',\n');

  return `  "${key}": {
    ipa: "${ipa}",
    antonyms: [${antonyms}],
    synonyms: [${synonyms}],
    examples: [
${examples}
    ]
  }`;
}

async function main() {
  const batches = [];
  for (let i = 0; i < missingWords.length; i += BATCH_SIZE) {
    batches.push(missingWords.slice(i, i + BATCH_SIZE));
  }

  console.log(`🚀 Processing ${batches.length} batches of ${BATCH_SIZE} words each...\n`);

  const allResults = {};
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`📦 Batch ${i + 1}/${batches.length}: ${batch.join(', ').substring(0, 80)}...`);

    try {
      const result = await callGemini(batch);
      const keys = Object.keys(result);
      keys.forEach(k => {
        allResults[k.toLowerCase()] = result[k];
      });
      successCount += keys.length;
      console.log(`   ✅ Got ${keys.length} words`);
    } catch (e) {
      console.error(`   ❌ Error: ${e.message}`);
      failCount += batch.length;
    }

    // Rate limiting delay
    if (i < batches.length - 1) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  console.log(`\n📊 Results: ${successCount} success, ${failCount} failed\n`);

  if (Object.keys(allResults).length === 0) {
    console.log('❌ No results to write');
    process.exit(1);
  }

  // Generate the new entries as TypeScript
  const entries = Object.entries(allResults)
    .map(([key, detail]) => formatDetailEntry(key, detail))
    .join(',\n');

  // Insert before the closing }; of STATIC_VOCAB_DETAILS
  const closingIndex = content.lastIndexOf('};');
  if (closingIndex === -1) {
    console.error('❌ Could not find closing }; in vocabData.ts');
    process.exit(1);
  }

  const newContent = content.substring(0, closingIndex) + 
    `,\n  // --- AUTO-GENERATED DETAILS (${new Date().toISOString().split('T')[0]}) ---\n` +
    entries + '\n' +
    content.substring(closingIndex);

  fs.writeFileSync(vocabPath, newContent);
  console.log(`✅ Written ${Object.keys(allResults).length} new detail entries to vocabData.ts`);
  console.log(`📁 File size: ${(fs.statSync(vocabPath).size / 1024).toFixed(0)} KB`);
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
