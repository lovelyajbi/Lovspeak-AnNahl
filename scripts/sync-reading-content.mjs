import fs from 'fs';
import path from 'path';

const SRC_DIR = 'content-source/reading';
const OUT_INDEX = 'public/content/reading/index';
const OUT_ITEMS = 'public/content/reading/items';
const TWO_PARAGRAPH_TRANSLATE_LEVELS = new Set(['A1', 'A2', 'B1']);

const countWords = (paragraphs) => paragraphs.join(' ').split(/\s+/).filter(Boolean).length;

// Translate practice uses two coherent paragraphs for A1–B1. The original
// authored order and every word are preserved. We join complete source
// paragraphs instead of splitting punctuation, so quoted dialogue is never
// damaged. Reading mode continues to use the untouched source paragraphs.
const shapeTranslateParagraphs = (paragraphs, level) => {
  if (!TWO_PARAGRAPH_TRANSLATE_LEVELS.has(level)) return paragraphs;
  const sourceParagraphs = paragraphs.map((paragraph) => paragraph.trim()).filter(Boolean);
  const splitAt = Math.ceil(sourceParagraphs.length / 2);
  const shaped = [
    sourceParagraphs.slice(0, splitAt).join(' '),
    sourceParagraphs.slice(splitAt).join(' '),
  ].filter(Boolean);
  if (shaped.length !== 2) {
    throw new Error(`Translate item must contain exactly two paragraphs at ${level}`);
  }
  const normalize = (value) => value.replace(/\s+/g, ' ').trim();
  if (normalize(shaped.join(' ')) !== normalize(sourceParagraphs.join(' '))) {
    throw new Error(`Translate item lost content while shaping paragraphs at ${level}`);
  }
  return shaped;
};

const CEFR_LEVELS = new Set(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);
const levels = fs.readdirSync(SRC_DIR)
  .filter(d => CEFR_LEVELS.has(d) && fs.statSync(path.join(SRC_DIR, d)).isDirectory());

let readTotal = 0, translateTotal = 0;

for (const level of levels) {
  const levelDir = path.join(SRC_DIR, level);
  const themeFiles = fs.readdirSync(levelDir).filter(f => f.endsWith('.json'));
  const readSummary = { themes: {} };
  const translateSummary = { themes: {} };

  for (const file of themeFiles) {
    const themeId = file.replace('.json', '');
    const items = JSON.parse(fs.readFileSync(path.join(levelDir, file), 'utf8'));

    const readIndexItems = [];
    const translateIndexItems = [];

    for (const it of items) {
      const wordCount = countWords(it.english);
      const translateParagraphs = shapeTranslateParagraphs(it.indonesian, level);
      const translateAnswerParagraphs = shapeTranslateParagraphs(it.english, level);
      const sourceWordCount = countWords(translateParagraphs);

      // READ item — shows English
      const readItem = {
        id: it.id,
        mode: 'read',
        level: it.level,
        themeId: it.themeId,
        title: it.title,
        paragraphs: it.english,
        wordCount,
      };
      fs.mkdirSync(path.join(OUT_ITEMS, 'read'), { recursive: true });
      fs.writeFileSync(path.join(OUT_ITEMS, 'read', `${it.id}.json`), JSON.stringify(readItem));
      readIndexItems.push({ id: it.id, title: it.title, mode: 'read', level: it.level, themeId: it.themeId, wordCount });
      readTotal++;

      // TRANSLATE item — shows Indonesian, English is the answer key
      const translateId = `${it.id}-tr`;
      const translateItem = {
        id: translateId,
        mode: 'translate',
        level: it.level,
        themeId: it.themeId,
        title: it.title,
        paragraphs: translateParagraphs,
        answerKey: translateAnswerParagraphs.join(' '),
        wordCount: sourceWordCount,
        sourceWordCount,
        targetWordCount: countWords(translateAnswerParagraphs),
      };
      fs.mkdirSync(path.join(OUT_ITEMS, 'translate'), { recursive: true });
      fs.writeFileSync(path.join(OUT_ITEMS, 'translate', `${translateId}.json`), JSON.stringify(translateItem));
      translateIndexItems.push({ id: translateId, title: it.title, mode: 'translate', level: it.level, themeId: it.themeId, wordCount: sourceWordCount });
      translateTotal++;
    }

    fs.mkdirSync(path.join(OUT_INDEX, 'read', level), { recursive: true });
    fs.writeFileSync(path.join(OUT_INDEX, 'read', level, `${themeId}.json`), JSON.stringify({ items: readIndexItems }));

    fs.mkdirSync(path.join(OUT_INDEX, 'translate', level), { recursive: true });
    fs.writeFileSync(path.join(OUT_INDEX, 'translate', level, `${themeId}.json`), JSON.stringify({ items: translateIndexItems }));

    // One compact request supplies library-card counts and title lookups for
    // every theme. The app no longer needs one request per theme on entry.
    readSummary.themes[themeId] = { total: readIndexItems.length, titles: readIndexItems.map(item => item.title) };
    translateSummary.themes[themeId] = { total: translateIndexItems.length, titles: translateIndexItems.map(item => item.title) };

    console.log(`${level}/${themeId}: ${items.length} items -> read + translate`);
  }

  fs.writeFileSync(path.join(OUT_INDEX, 'read', level, '_summary.json'), JSON.stringify(readSummary));
  fs.writeFileSync(path.join(OUT_INDEX, 'translate', level, '_summary.json'), JSON.stringify(translateSummary));
}

console.log(`\nTotal: ${readTotal} read items, ${translateTotal} translate items synced.`);
