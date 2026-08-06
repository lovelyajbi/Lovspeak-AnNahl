import fs from 'node:fs';
import path from 'node:path';

const level = process.argv[2];
if (!level) throw new Error('Usage: node scripts/apply-listening-additions.mjs A1');
const modulePath = new URL(`./listening-additions/${level}.mjs`, import.meta.url);
const { additions } = await import(modulePath);
const byTheme = Map.groupBy(additions, (item) => item.themeId);

for (const [themeId, newItems] of byTheme) {
  const file = path.join(process.cwd(), 'content-source', 'listening', level, `${themeId}.json`);
  const current = JSON.parse(fs.readFileSync(file, 'utf8'));
  const newIds = new Set(newItems.map((item) => item.id));
  const kept = current.filter((item) => !newIds.has(item.id));
  const merged = [...kept, ...newItems].sort((a, b) => a.id.localeCompare(b.id));
  fs.writeFileSync(file, `${JSON.stringify(merged, null, 2)}\n`);
  console.log(`${level}/${themeId}: ${current.length} -> ${merged.length}`);
}
