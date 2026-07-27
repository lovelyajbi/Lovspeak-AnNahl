import fs from 'fs';
import path from 'path';

const SRC_DIR = 'content-source/reading';
const OUT_INDEX = 'public/content/reading/index';
const OUT_ITEMS = 'public/content/reading/items';

const countWords = (paragraphs) => paragraphs.join(' ').split(/\s+/).filter(Boolean).length;

const levels = fs.readdirSync(SRC_DIR).filter(d => fs.statSync(path.join(SRC_DIR, d)).isDirectory());

let readTotal = 0, translateTotal = 0;

for (const level of levels) {
  const levelDir = path.join(SRC_DIR, level);
  const themeFiles = fs.readdirSync(levelDir).filter(f => f.endsWith('.json'));

  for (const file of themeFiles) {
    const themeId = file.replace('.json', '');
    const items = JSON.parse(fs.readFileSync(path.join(levelDir, file), 'utf8'));

    const readIndexItems = [];
    const translateIndexItems = [];

    for (const it of items) {
      const wordCount = countWords(it.english);
      const sourceWordCount = countWords(it.indonesian);

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
        paragraphs: it.indonesian,
        answerKey: it.english.join(' '),
        wordCount: sourceWordCount,
        sourceWordCount,
        targetWordCount: wordCount,
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

    console.log(`${level}/${themeId}: ${items.length} items -> read + translate`);
  }
}

console.log(`\nTotal: ${readTotal} read items, ${translateTotal} translate items synced.`);
