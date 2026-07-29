import fs from 'fs';
import path from 'path';

const SRC_DIR = 'content-source/listening';
const OUT_INDEX = 'public/content/listening/index';
const OUT_ITEMS = 'public/content/listening/items';

if (!fs.existsSync(SRC_DIR)) {
  console.log('No content-source/listening directory found yet — nothing to sync.');
  process.exit(0);
}

const levels = fs.readdirSync(SRC_DIR).filter(d => fs.statSync(path.join(SRC_DIR, d)).isDirectory());

let total = 0;

for (const level of levels) {
  const levelDir = path.join(SRC_DIR, level);
  const themeFiles = fs.readdirSync(levelDir).filter(f => f.endsWith('.json'));

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

    console.log(`${level}/${themeId}: ${items.length} items synced`);
  }
}

console.log(`\nTotal: ${total} listening items synced.`);
