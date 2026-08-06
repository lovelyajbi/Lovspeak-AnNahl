import fs from 'fs';
import path from 'path';

const SRC_DIR = 'content-source/listening';
const OUT_INDEX = 'public/content/listening/index';
const OUT_ITEMS = 'public/content/listening/items';

if (!fs.existsSync(SRC_DIR)) {
  console.log('No content-source/listening directory found yet — nothing to sync.');
  process.exit(0);
}

const requestedLevel = process.argv[2];
const CEFR_LEVELS = new Set(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);
const availableLevels = fs.readdirSync(SRC_DIR)
  .filter(d => CEFR_LEVELS.has(d) && fs.statSync(path.join(SRC_DIR, d)).isDirectory());
if (requestedLevel && !availableLevels.includes(requestedLevel)) {
  throw new Error(`Unknown listening level: ${requestedLevel}`);
}
const levels = requestedLevel ? [requestedLevel] : availableLevels;

let total = 0;

for (const level of levels) {
  const levelDir = path.join(SRC_DIR, level);
  const themeFiles = fs.readdirSync(levelDir).filter(f => f.endsWith('.json'));
  const librarySummary = { themes: {} };

  for (const file of themeFiles) {
    const themeId = file.replace('.json', '');
    const items = JSON.parse(fs.readFileSync(path.join(levelDir, file), 'utf8'));

    const indexItems = [];

    for (const it of items) {
      const item = {
        id: it.id,
        title: it.title,
        level: it.level,
        themeId: it.themeId,
        type: it.type,
        speakers: it.speakers,
        script: it.script,
        quiz: it.quiz,
      };
      fs.mkdirSync(OUT_ITEMS, { recursive: true });
      fs.writeFileSync(path.join(OUT_ITEMS, `${it.id}.json`), JSON.stringify(item));
      indexItems.push({ id: it.id, title: it.title, level: it.level, themeId: it.themeId, type: it.type });
      total++;
    }

    fs.mkdirSync(path.join(OUT_INDEX, level), { recursive: true });
    fs.writeFileSync(path.join(OUT_INDEX, level, `${themeId}.json`), JSON.stringify({ items: indexItems }));
    librarySummary.themes[themeId] = { total: indexItems.length, titles: indexItems.map(item => item.title) };

    console.log(`${level}/${themeId}: ${items.length} items synced`);
  }

  fs.writeFileSync(path.join(OUT_INDEX, level, '_summary.json'), JSON.stringify(librarySummary));
}

console.log(`\nTotal: ${total} listening items synced.`);
