import fs from 'node:fs';
import path from 'node:path';

const levels = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!levels.length) throw new Error('Usage: node scripts/audit-listening-script-variety.mjs B2 [C1 C2]');

const clean = (line) => String(line)
  .replace(/^[^:]+:\s*/, '')
  .replace(/\[[^\]]+\]/g, '')
  .replace(/\s+/g, ' ')
  .trim();
const normalize = (value) => clean(value).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

const errors = [];
for (const level of levels) {
  const dir = path.join(process.cwd(), 'content-source', 'listening', level);
  const lineOwners = new Map();
  const suffixOwners = new Map();
  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith('.json')).sort()) {
    const items = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    for (const item of items) {
      const id = item.id || `${level}/${file}`;
      const suffix = normalize((item.title || '').split(':').slice(1).join(':'));
      if (suffix.length >= 16) {
        const owners = suffixOwners.get(suffix) || [];
        owners.push(id);
        suffixOwners.set(suffix, owners);
      }
      for (const line of item.script || []) {
        const value = normalize(line);
        if (value.length < 80) continue;
        const owners = lineOwners.get(value) || [];
        owners.push(id);
        lineOwners.set(value, owners);
      }
    }
  }
  for (const [suffix, owners] of suffixOwners) {
    if (new Set(owners).size > 2) errors.push(`${level}: title suffix repeats ${new Set(owners).size} times: "${suffix.slice(0, 80)}"`);
  }
  for (const [line, owners] of lineOwners) {
    if (new Set(owners).size > 1) errors.push(`${level}: script line repeats in ${new Set(owners).size} items: "${line.slice(0, 120)}"`);
  }
}

if (errors.length) {
  console.error(`Listening variety audit: ${errors.length} issue(s).`);
  for (const error of errors) console.error(`ERROR ${error}`);
  process.exitCode = 1;
} else {
  console.log('Listening variety audit: 0 issue(s).');
}
