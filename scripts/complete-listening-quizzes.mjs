import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(process.cwd(), 'content-source', 'listening');
const requestedLevels = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
const levels = requestedLevels.length ? requestedLevels : ['A1', 'A2', 'B1'];

const sentence = (value) => {
  const text = String(value || '').trim().replace(/[.!?]+$/, '');
  return text ? `${text}.` : '';
};

const rotateQuestion = (question, targetIndex) => {
  const options = [...question.options];
  const correct = options[question.correctIndex];
  const remaining = options.filter((_, index) => index !== question.correctIndex);
  remaining.splice(targetIndex, 0, correct);
  return { ...question, options: remaining, correctIndex: targetIndex };
};

const distinct = (values) => {
  const seen = new Set();
  return values.filter((value) => {
    const key = value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

for (const level of levels) {
  const levelDir = path.join(ROOT, level);
  for (const filename of fs.readdirSync(levelDir).filter((name) => name.endsWith('.json')).sort()) {
    const file = path.join(levelDir, filename);
    const items = JSON.parse(fs.readFileSync(file, 'utf8'));

    for (const [itemIndex, item] of items.entries()) {
      if (!Array.isArray(item.quiz) || item.quiz.length < 5) {
        throw new Error(`${item.id}: at least five editorial quiz questions are required`);
      }
      const base = item.quiz.slice(0, 5);
      const peers = [1, 2, 3].map((offset) => items[(itemIndex + offset) % items.length]);
      const peerExplanations = (quizIndex) => peers.map((peer) => sentence(peer.quiz?.[quizIndex]?.explanation));
      const makeOptions = (correct, distractors) => {
        const options = distinct([correct, ...distractors]);
        if (options.length !== 4) throw new Error(`${item.id}: could not create four distinct review options`);
        return options;
      };

      const supportedOne = sentence(base[0].explanation);
      const supportedTwo = sentence(base[1].explanation);
      const supportedThree = sentence(base[2].explanation);
      const ending = sentence(base[4].explanation);
      const combined = `${sentence(base[3].explanation).replace(/\.$/, '')}; ${ending.charAt(0).toLowerCase()}${ending.slice(1)}`;

      const additions = [
        {
          question: 'Which title best represents the main focus of this audio?',
          options: makeOptions(item.title, peers.map((peer) => peer.title)),
          correctIndex: 0,
          explanation: `“${item.title}” captures the central situation or idea developed in the audio.`,
        },
        {
          question: 'Which statement is directly supported near the beginning of the audio?',
          options: makeOptions(supportedOne, peerExplanations(0)),
          correctIndex: 0,
          explanation: supportedOne,
        },
        {
          question: 'Which additional detail is stated by the speaker or speakers?',
          options: makeOptions(supportedTwo, peerExplanations(1)),
          correctIndex: 0,
          explanation: supportedTwo,
        },
        {
          question: 'Which event or idea is part of the development of the audio?',
          options: makeOptions(supportedThree, peerExplanations(2)),
          correctIndex: 0,
          explanation: supportedThree,
        },
        {
          question: 'Which two-part summary best matches the later part of the audio?',
          options: makeOptions(combined, peers.map((peer) => {
            const first = sentence(peer.quiz?.[3]?.explanation).replace(/\.$/, '');
            const last = sentence(peer.quiz?.[4]?.explanation);
            return `${first}; ${last.charAt(0).toLowerCase()}${last.slice(1)}`;
          })),
          correctIndex: 0,
          explanation: combined,
        },
      ];

      const targetIndices = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1];
      item.quiz = [...base, ...additions].map((question, index) => rotateQuestion(question, targetIndices[index]));
    }

    fs.writeFileSync(file, `${JSON.stringify(items, null, 2)}\n`);
    console.log(`${level}/${filename}: quizzes completed for ${items.length} items`);
  }
}
