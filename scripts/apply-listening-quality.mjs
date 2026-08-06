import fs from 'node:fs';
import path from 'node:path';

const [level, requestedTheme] = process.argv.slice(2);
if (!level) throw new Error('Usage: node scripts/apply-listening-quality.mjs A1 [theme]');
const qualityDir = path.join(process.cwd(), 'scripts', 'listening-quality', level);
const themes = requestedTheme
  ? [requestedTheme]
  : fs.readdirSync(qualityDir).filter((name) => name.endsWith('.mjs')).map((name) => name.replace('.mjs', '')).sort();

const hash = (value) => {
  let result = 2166136261;
  for (const char of value) {
    result ^= char.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
};

const positionPlan = (itemId) => {
  const positions = [0, 0, 1, 1, 2, 2, 3, 3, hash(itemId) % 4, hash(`${itemId}:extra`) % 4];
  let seed = hash(`${itemId}:positions`);
  for (let i = positions.length - 1; i > 0; i -= 1) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  return positions;
};

const moveCorrectOption = (question, targetIndex) => {
  const correct = question.options[question.correctIndex];
  const others = question.options.filter((_, index) => index !== question.correctIndex);
  others.splice(targetIndex, 0, correct);
  return { ...question, options: others, correctIndex: targetIndex };
};

for (const theme of themes) {
  const themeModule = path.join(process.cwd(), 'scripts', 'listening-quality', level, `${theme}.mjs`);
  const moduleUrl = fs.existsSync(themeModule)
    ? new URL(`./listening-quality/${level}/${theme}.mjs`, import.meta.url)
    : new URL(`./listening-quality/${level}.mjs`, import.meta.url);
  const loaded = await import(moduleUrl);
  const reviews = loaded.reviews.filter((review) => review.id.startsWith(`${level.toLowerCase()}-${theme}-`));
  const file = path.join(process.cwd(), 'content-source', 'listening', level, `${theme}.json`);
  const items = JSON.parse(fs.readFileSync(file, 'utf8'));
  const byId = new Map(items.map((item) => [item.id, item]));

  for (const review of reviews) {
    const item = byId.get(review.id);
    if (!item) throw new Error(`${theme}: missing ${review.id}`);
    if (review.title) item.title = review.title;
    if (review.speakers) item.speakers = [...review.speakers];
    if (review.replaceScript) item.script = [...review.replaceScript];
    if (review.replaceText) {
      item.script = item.script.map((line) => {
        let updated = line;
        for (const [from, to] of review.replaceText) updated = updated.replace(from, to);
        return updated;
      });
    }
    item.script = item.script.map((line, index) => {
      const clean = line.replace(/^(.*?:)\s*(?:\[[^\]]+\]\s*)?/, '$1 ').trim();
      const tag = review.tags?.[index];
      return tag ? clean.replace(/^([^:]+:)\s*/, `$1 [${tag}] `) : clean;
    });
    const base = review.baseQuiz || item.quiz.slice(0, 5);
    if (base.length !== 5 || review.additions.length !== 5) throw new Error(`${item.id}: expected 5 base + 5 added questions`);
    const positions = positionPlan(item.id);
    item.quiz = [...base, ...review.additions].map((question, index) => moveCorrectOption(question, positions[index]));
    item.qualityReview = {
      level: review.level || level,
      theme,
      scriptDecision: review.scriptDecision,
      reviewedAt: '2026-07-30',
    };
  }
  if (reviews.length !== items.length) throw new Error(`${theme}: reviewed ${reviews.length}/${items.length} items`);
  fs.writeFileSync(file, `${JSON.stringify(items, null, 2)}\n`);
  console.log(`${level}/${theme}: applied ${reviews.length} individual quality reviews`);
}
