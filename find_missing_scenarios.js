const fs = require('fs');
const content = fs.readFileSync('/src/constants/shadowingData.ts', 'utf8');

const themesRegExp = /\{\s*id:\s*'([^']+)',\s*title:\s*'([^']+)',[\s\S]*?tasks:\s*\[([\s\S]*?)\]\s*\}/g;
let match;
const offenders = [];

while ((match = themesRegExp.exec(content)) !== null) {
  const themeId = match[1];
  const themeTitle = match[2];
  const tasksContent = match[3];
  
  const tasks = tasksContent.match(/\{[\s\S]*?id:\s*'[^']+'[\s\S]*?\}/g) || [];
  const missingScenario = tasks.filter(t => !t.includes("scenario:"));
  
  if (missingScenario.length > 0) {
    offenders.push({
      themeId,
      themeTitle,
      missingCount: missingScenario.length
    });
  }
}

console.table(offenders);
