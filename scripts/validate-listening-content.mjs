import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SOURCE_ROOT = path.join(ROOT, 'content-source', 'listening');
const LEVELS = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
const TARGET_LEVELS = LEVELS.length ? LEVELS : ['A1', 'A2', 'B1'];
const WORD_RANGES = {
  A1: [240, 360],
  A2: [240, 360],
  B1: [240, 360],
  B2: [260, 380],
  C1: [260, 410],
  C2: [260, 440],
};
const PROTECTED_NAMES = new Set([
  'muhammad', 'ibrahim', 'musa', 'isa', 'nuh', 'yusuf', 'ayyub', 'zakariyya',
  'yunus', 'hud', 'salih', 'lut', 'yaqub', 'ismail', 'ishaq', 'harun', 'dawud',
  'sulaiman', 'ilyas', 'alyasa', 'idris', 'adam',
]);

const errors = [];
const warnings = [];
const addError = (where, message) => errors.push(`${where}: ${message}`);
const addWarning = (where, message) => warnings.push(`${where}: ${message}`);

const cleanSpokenText = (script) => script
  .map((line) => line.replace(/^[^:]+:\s*/, '').replace(/\[[^\]]+\]/g, ' ').trim())
  .join(' ')
  .replace(/\s+/g, ' ')
  .trim();

const countWords = (text) => text.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)?.length || 0;
const normalize = (text) => text.toLowerCase().replace(/[^a-z0-9' ]/g, ' ').replace(/\s+/g, ' ').trim();

for (const level of TARGET_LEVELS) {
  const levelDir = path.join(SOURCE_ROOT, level);
  if (!fs.existsSync(levelDir)) {
    addError(level, 'source directory is missing');
    continue;
  }

  const firstPhraseOwners = new Map();
  for (const file of fs.readdirSync(levelDir).filter((name) => name.endsWith('.json')).sort()) {
    const themeId = file.replace('.json', '');
    const where = `${level}/${themeId}`;
    const items = JSON.parse(fs.readFileSync(path.join(levelDir, file), 'utf8'));
    const monologues = items.filter((item) => item.type === 'monologue');
    const dialogues = items.filter((item) => item.type === 'dialogue');

    if (items.length !== 10) addError(where, `expected 10 items, found ${items.length}`);
    if (monologues.length !== 5) addError(where, `expected 5 monologues, found ${monologues.length}`);
    if (dialogues.length !== 5) addError(where, `expected 5 dialogues, found ${dialogues.length}`);

    const titleSet = new Set();
    const scriptSet = new Set();
    for (const item of items) {
      const itemWhere = `${where}/${item.id || 'missing-id'}`;
      const titleKey = normalize(item.title || '');
      if (!titleKey) addError(itemWhere, 'title is missing');
      if (titleSet.has(titleKey)) addError(itemWhere, `duplicate title "${item.title}"`);
      titleSet.add(titleKey);

      if (!Array.isArray(item.script) || item.script.length === 0) {
        addError(itemWhere, 'script is empty');
        continue;
      }

      const spokenText = cleanSpokenText(item.script);
      const scriptKey = normalize(spokenText);
      if (scriptSet.has(scriptKey)) addError(itemWhere, 'duplicate script in the same theme');
      scriptSet.add(scriptKey);

      const firstPhrase = scriptKey.split(' ').slice(0, 12).join(' ');
      const earlierOwner = firstPhraseOwners.get(firstPhrase);
      if (firstPhrase && earlierOwner) {
        addError(itemWhere, `opening repeats ${earlierOwner}`);
      } else if (firstPhrase) {
        firstPhraseOwners.set(firstPhrase, itemWhere);
      }

      const [minimumWords, maximumWords] = WORD_RANGES[level] || [240, 360];
      const wordCount = countWords(spokenText);
      if (wordCount < minimumWords || wordCount > maximumWords) {
        addError(itemWhere, `clean script has ${wordCount} words; expected ${minimumWords}-${maximumWords}`);
      }

      const speakers = Array.isArray(item.speakers) ? item.speakers : [];
      const expectedSpeakers = item.type === 'dialogue' ? 2 : 1;
      if (speakers.length !== expectedSpeakers) {
        addError(itemWhere, `expected ${expectedSpeakers} speaker(s), found ${speakers.length}`);
      }
      const speakerNames = new Set(speakers.map((speaker) => speaker.name));
      if (item.type === 'dialogue' && ['prophets', 'sahabah'].includes(themeId)) {
        for (const speaker of speakers) {
          if (PROTECTED_NAMES.has(normalize(speaker.name))) {
            addError(itemWhere, `must not role-play protected figure "${speaker.name}"`);
          }
        }
      }

      const normalizedLines = new Set();
      let previousOpeningTag = '';
      for (const [lineIndex, line] of item.script.entries()) {
        const lineWhere = `${itemWhere}/line-${lineIndex + 1}`;
        if (typeof line !== 'string' || !line.trim()) {
          addError(lineWhere, 'line is empty');
          continue;
        }
        const match = line.match(/^([^:]+):\s*(.*)$/);
        if (!match) {
          addError(lineWhere, 'must use "Speaker: [tag] text" format');
          continue;
        }
        const [, prefix, body] = match;
        const validPrefix = item.type === 'monologue'
          ? prefix === 'Narrator' || speakerNames.has(prefix)
          : speakerNames.has(prefix);
        if (!validPrefix) addError(lineWhere, `unknown speaker prefix "${prefix}"`);
        if (/\[|\]/.test(body.replace(/\[[^\]]+\]/g, ''))) {
          addError(lineWhere, 'contains an unmatched audio tag bracket');
        }
        for (const tag of body.matchAll(/\[([^\]]+)\]/g)) {
          if (!/^[a-z][a-z ,'-]*$/.test(tag[1])) addError(lineWhere, `invalid audio tag "[${tag[1]}]"`);
        }
        const openingTag = body.match(/^\[([^\]]+)\]/)?.[1] || '';
        if (openingTag && openingTag === previousOpeningTag) {
          addWarning(lineWhere, `opening tag [${openingTag}] repeats on consecutive lines`);
        }
        previousOpeningTag = openingTag;

        const lineKey = normalize(body.replace(/\[[^\]]+\]/g, ''));
        if (lineKey && normalizedLines.has(lineKey)) addError(lineWhere, 'repeats an earlier line');
        normalizedLines.add(lineKey);
      }

      if (!Array.isArray(item.quiz) || item.quiz.length !== 10) {
        addError(itemWhere, `expected 10 quiz questions, found ${item.quiz?.length || 0}`);
      } else {
        const correctIndexCounts = [0, 0, 0, 0];
        const questionSet = new Set();
        for (const [quizIndex, question] of item.quiz.entries()) {
          const quizWhere = `${itemWhere}/quiz-${quizIndex + 1}`;
          const questionKey = normalize(question.question || '');
          if (!questionKey) addError(quizWhere, 'question is empty');
          if (questionSet.has(questionKey)) addError(quizWhere, 'duplicate question');
          questionSet.add(questionKey);
          if (!Array.isArray(question.options) || question.options.length !== 4) {
            addError(quizWhere, `expected 4 options, found ${question.options?.length || 0}`);
          } else if (new Set(question.options.map(normalize)).size !== 4) {
            addError(quizWhere, 'options must be unique');
          }
          if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex > 3) {
            addError(quizWhere, `invalid correctIndex ${question.correctIndex}`);
          } else {
            correctIndexCounts[question.correctIndex] += 1;
          }
          if (!question.explanation?.trim()) addError(quizWhere, 'explanation is missing');
        }
        if (correctIndexCounts.some((count) => count < 2)) {
          addError(itemWhere, `correct answers are not balanced: ${correctIndexCounts.join('/')}`);
        }
      }
    }
  }
}

console.log(`Listening validation: ${errors.length} error(s), ${warnings.length} warning(s).`);
for (const warning of warnings.slice(0, 40)) console.warn(`WARN ${warning}`);
if (warnings.length > 40) console.warn(`...and ${warnings.length - 40} more warning(s).`);
for (const error of errors.slice(0, 120)) console.error(`ERROR ${error}`);
if (errors.length > 120) console.error(`...and ${errors.length - 120} more error(s).`);
if (errors.length) process.exitCode = 1;
