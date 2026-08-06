import fs from 'fs';
import path from 'path';

const requestedLevels = process.argv.slice(2).filter(Boolean);
const levels = requestedLevels.length ? requestedLevels : ['A1', 'A2', 'B1', 'B2'];
const root = 'content-source/reading';

const limits = {
  A1: { average: 17, maximum: 28, grade: 8 },
  A2: { average: 23, maximum: 36, grade: 11 },
  B1: { average: 29, maximum: 44, grade: 15 },
  B2: { average: 35, maximum: 52, grade: 18 },
};

const sensitiveTerms = /\b(?:surgery|medical|medicine|diagnos|clinic|doctor|legal|lawyer|court|prosecution|histor(?:y|ic)|mosque architecture|miracle|prophet|hadith|fatwa)\b/i;
const genericClosers = /\b(?:this (?:experience|story|situation) (?:shows|teaches)|the (?:lesson|experience) (?:is|was)|in the end|over time,? .* (?:realized|learned))\b/i;

const words = text => text.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) || [];
const sentences = paragraphs => paragraphs
  .join(' ')
  .split(/[.!?]+/)
  .map(value => value.trim())
  .filter(Boolean);

const syllables = word => {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, '');
  if (cleaned.length <= 3) return 1;
  const groups = (cleaned.match(/[aeiouy]+/g) || []).length;
  return Math.max(1, groups - (cleaned.endsWith('e') ? 1 : 0) + (cleaned.endsWith('le') ? 1 : 0));
};

const grade = paragraphs => {
  const textWords = words(paragraphs.join(' '));
  const sentenceCount = Math.max(1, sentences(paragraphs).length);
  const syllableCount = textWords.reduce((total, word) => total + syllables(word), 0);
  return 0.39 * (textWords.length / sentenceCount) + 11.8 * (syllableCount / Math.max(1, textWords.length)) - 15.59;
};

let candidates = 0;

for (const level of levels) {
  const limit = limits[level];
  if (!limit) throw new Error(`Unsupported level: ${level}`);
  const files = fs.readdirSync(path.join(root, level)).filter(file => file.endsWith('.json')).sort();
  const findings = [];

  for (const file of files) {
    const items = JSON.parse(fs.readFileSync(path.join(root, level, file), 'utf8'));
    for (const item of items) {
      const textSentences = sentences(item.english);
      const lengths = textSentences.map(sentence => words(sentence).length);
      const average = lengths.reduce((sum, value) => sum + value, 0) / Math.max(1, lengths.length);
      const maximum = Math.max(...lengths, 0);
      const readability = grade(item.english);
      const reasons = [];
      if (average > limit.average) reasons.push(`average sentence ${average.toFixed(1)} > ${limit.average}`);
      if (maximum > limit.maximum) reasons.push(`longest sentence ${maximum} > ${limit.maximum}`);
      if (readability > limit.grade) reasons.push(`readability grade ${readability.toFixed(1)} > ${limit.grade}`);
      if (sensitiveTerms.test(`${item.title} ${item.english.join(' ')}`)) reasons.push('sensitive fact or guidance needs editorial check');
      if (genericClosers.test(item.english.at(-1) || '')) reasons.push('possibly generic closing');
      if (reasons.length) {
        findings.push({ id: item.id, theme: item.themeId, title: item.title, reasons });
      }
    }
  }

  candidates += findings.length;
  console.log(`\n${level}: ${findings.length} of ${files.length * 7} texts need editorial review`);
  for (const finding of findings) console.log(`- ${finding.id} | ${finding.title} | ${finding.reasons.join('; ')}`);
}

console.log(`\nTotal candidates: ${candidates}`);
