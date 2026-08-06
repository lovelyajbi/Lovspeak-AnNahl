import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve('data');
const OUTPUT_PATH = path.resolve('public/content/vocab/details.json');

const readObjectExport = (fileName, exportName, injectedValues = {}) => {
  const source = fs.readFileSync(path.join(DATA_DIR, fileName), 'utf8');
  const assignment = new RegExp(`export\\s+const\\s+${exportName}[\\s\\S]*?=\\s*`).exec(source);
  if (!assignment) throw new Error(`Could not find ${exportName} in ${fileName}`);
  const objectLiteral = source.slice(assignment.index + assignment[0].length, source.lastIndexOf(';')).trim();
  return new Function(...Object.keys(injectedValues), `return (${objectLiteral});`)(...Object.values(injectedValues));
};

const advanced1 = readObjectExport('vocab_advanced_details_1.ts', 'ADVANCED_VOCAB_DETAILS_1');
const advanced2 = readObjectExport('vocab_advanced_details_2.ts', 'ADVANCED_VOCAB_DETAILS_2');
const advanced3 = readObjectExport('vocab_advanced_details_3.ts', 'ADVANCED_VOCAB_DETAILS_3');
const details = readObjectExport('vocabDetails.ts', 'STATIC_VOCAB_DETAILS', {
  ADVANCED_VOCAB_DETAILS_1: advanced1,
  ADVANCED_VOCAB_DETAILS_2: advanced2,
  ADVANCED_VOCAB_DETAILS_3: advanced3,
});

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(details));
console.log(`Synced ${Object.keys(details).length} vocabulary detail entries.`);
