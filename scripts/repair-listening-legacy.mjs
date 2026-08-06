import fs from 'node:fs';
import path from 'node:path';

const sourceRoot = path.join(process.cwd(), 'content-source', 'listening');

const updateFile = (level, themeId, updater) => {
  const file = path.join(sourceRoot, level, `${themeId}.json`);
  const items = JSON.parse(fs.readFileSync(file, 'utf8'));
  updater(items);
  fs.writeFileSync(file, `${JSON.stringify(items, null, 2)}\n`);
};

updateFile('A1', 'akhlak', (items) => {
  const item = items.find(({ id }) => id === 'a1-akhlak-06');
  if (!item) throw new Error('Missing a1-akhlak-06');
  item.title = 'A Talk Show Conversation on Why Keeping Promises Still Matters';
  item.speakers = [
    { name: 'Mira', gender: 'female' },
    { name: 'Yuni', gender: 'female' },
  ];
  item.script = item.script.map((line, index) => {
    if (index === 0) return "Mira: [warmly] Welcome back to the show. Tonight we're discussing something simple but powerful: keeping our promises. Joining me is Yuni.";
    return line.replace(/^Pak Hendra:/, 'Yuni:').replace('Thank you for having me, Mira. This topic matters a lot in business, believe me.', 'Thank you for having me, Mira. This topic matters in both work and daily life.');
  });
  for (const question of item.quiz.slice(0, 5)) {
    question.question = question.question.replaceAll('Pak Hendra', 'Yuni');
    question.explanation = question.explanation.replaceAll('Pak Hendra', 'Yuni').replaceAll(' he ', ' she ').replaceAll('He ', 'She ').replaceAll(' his ', ' her ');
  }
});

console.log('Legacy listening repairs applied.');
