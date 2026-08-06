import fs from 'node:fs';
import path from 'node:path';

const levels = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!levels.length) throw new Error('Usage: node scripts/audit-listening-quiz-quality.mjs B2 [C1 C2]');

const normalize = (value) => String(value || '').toLowerCase()
  .replace(/[^a-z0-9' ]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();
const wordCount = (value) => String(value || '').match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)?.length || 0;
const retiredPrompts = [
  'which point appears after the opening',
  'how is a later risk described',
  'what distinction is made in',
  'what action is proposed in',
  'what limitation is acknowledged in',
  'what assumption or context appears early',
  'which development complicates the case',
  'what evidence or distinction is introduced later',
  'what process is proposed before the conclusion',
  'what boundary does the audio preserve',
  'which premise is exposed near the beginning',
  'what distinction becomes important as the case develops',
  'which counter-consideration is introduced',
  'what accountable response is described',
  'what conclusion is deliberately limited',
  'which phrase is used',
  'which wording is heard',
  'which wording is used',
  'which statement comes from',
  'which statement is explicitly made',
  'which detail is included',
  'which observation appears',
  'which claim is voiced',
  'which idea is expressed',
  'which position appears',
  'which point belongs to the reasoning',
  'which statement describes the opening',
  'which detail is mentioned early',
  'which later detail strengthens',
  'which idea is introduced early',
  'what is mentioned early',
  'what is reported later',
  'what does the opening mention',
  'which line',
  'what words',
];

const errors = [];
for (const level of levels) {
  const dir = path.join(process.cwd(), 'content-source', 'listening', level);
  const owners = new Map();
  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith('.json')).sort()) {
    const items = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    for (const item of items) {
      for (const [index, quiz] of (item.quiz || []).entries()) {
        const where = `${level}/${item.id}/Q${index + 1}`;
        const question = String(quiz.question || '').trim();
        const key = normalize(question);
        if (question.length < 12 || question.length > 180) errors.push(`${where}: question length must be 12–180 characters`);
        if (retiredPrompts.some((prompt) => key.startsWith(prompt))) errors.push(`${where}: retired generic prompt remains`);
        const prior = owners.get(key) || [];
        prior.push(where);
        owners.set(key, prior);
        for (const [optionIndex, option] of (quiz.options || []).entries()) {
          const optionText = String(option || '').trim();
          if (optionText.length < 2 || optionText.length > 110) errors.push(`${where}/option-${optionIndex + 1}: option length must be 2–110 characters`);
          if (wordCount(optionText) > 18) errors.push(`${where}/option-${optionIndex + 1}: option must be concise (18 words maximum)`);
          if (/\b(?:confus|outpace|assig|becomin|cruelly)\s*$/i.test(optionText) && !/[.!?]$/.test(optionText)) errors.push(`${where}/option-${optionIndex + 1}: option appears cut off`);
        }
      }
    }
  }
  for (const [question, places] of owners) {
    if (places.length > 1) errors.push(`${level}: duplicate question in ${places.join(', ')}: "${question.slice(0, 100)}"`);
  }
}

if (errors.length) {
  console.error(`Listening quiz audit: ${errors.length} issue(s).`);
  for (const error of errors) console.error(`ERROR ${error}`);
  process.exitCode = 1;
} else {
  console.log('Listening quiz audit: 0 issue(s).');
}
