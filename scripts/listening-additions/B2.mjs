import fs from 'node:fs';
import path from 'node:path';

// The authored source JSON is the canonical B2 content. This compatibility
// module deliberately reads it instead of recreating the retired templates.
const dir = path.join(process.cwd(), 'content-source', 'listening', 'B2');
export const additions = fs.readdirSync(dir)
  .filter((name) => name.endsWith('.json'))
  .sort()
  .flatMap((name) => JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8')))
  .filter((item) => Number(item.id?.slice(-2)) >= 8);
