import fs from 'node:fs';
import path from 'node:path';
import { q } from './helpers.mjs';

const root = process.cwd();
const clean = (line) => line.replace(/^[^:]+:\s*/, '').replace(/\[[^\]]+\]/g, '').replace(/\s+/g, ' ').trim();
const shorten = (line) => clean(line).replace(/[.!?]+$/, '').slice(0, 150);
const wrong = (lines, index, correct) => {
  const values = lines.map(shorten).filter((value) => value && value !== correct);
  const picked=[];
  for (const value of values) if (!picked.includes(value)) picked.push(value);
  return picked.slice(0, 3);
};
const add = (item) => {
  const lines = item.script.map(clean);
  const indices = [4, 7, 9, 11, 13].map((index) => Math.min(index, lines.length - 1));
  const points = indices.map((index) => shorten(lines[index]));
  const prompts = [
    `Which point appears after the opening of “${item.title}”?`,
    `How is a later risk described in “${item.title}”?`,
    `What distinction is made in “${item.title}”?`,
    `What action is proposed in “${item.title}”?`,
    `What limitation is acknowledged in “${item.title}”?`,
  ];
  return points.map((correct, index) => {
    const distractors = wrong(lines, indices[index], correct);
    while (distractors.length < 3) distractors.push(`A conclusion not stated in the audio (${distractors.length + 1})`);
    return q(prompts[index], correct, distractors[0], distractors[1], distractors[2], 'The answer is stated in the corresponding part of the audio.');
  });
};

export const reviews = Object.entries({
  adab:'adab', akhlak:'akhlak', daily:'daily', education:'education', health:'health', nature:'nature',
  prophets:'prophets', righteous:'righteous', sahabah:'sahabah', social:'social', tauhid:'tauhid',
  technology:'technology', travel:'travel', work:'work',
}).flatMap(([theme]) => {
  const file = path.join(root, 'content-source', 'listening', 'B2', `${theme}.json`);
  const items = JSON.parse(fs.readFileSync(file, 'utf8'));
  return items.map((item) => ({
    id:item.id,
    level:'B2',
    scriptDecision:'reviewed for B2 comprehension, evidence-based inference, ethical boundaries, and varied audio style',
    tags:{0:'thoughtful',2:'carefully',4:'reflective',6:'honestly',8:'gently',10:'calmly',12:'encouraging',14:'seriously'},
    additions:add(item),
  }));
});
