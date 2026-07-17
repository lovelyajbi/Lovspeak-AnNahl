const fs = require('fs');
const content = fs.readFileSync('/src/constants/shadowingData.ts', 'utf8');

const themesRegExp = /\{\s*id:\s*'([^']+)',\s*title:\s*'([^']+)',[\s\S]*?tasks:\s*\[([\s\S]*?)\]\s*\}/g;
let match;
const results = [];

while ((match = themesRegExp.exec(content)) !== null) {
  const themeId = match[1];
  const themeTitle = match[2];
  const tasksContent = match[3];
  
  const tasks = tasksContent.match(/\{[\s\S]*?id:\s*'[^']+'[\s\S]*?\}/g) || [];
  const easy = tasks.filter(t => t.includes("difficulty: 'Easy'")).length;
  const medium = tasks.filter(t => t.includes("difficulty: 'Medium'")).length;
  const hard = tasks.filter(t => t.includes("difficulty: 'Hard'")).length;
  
  results.push({
    id: themeId,
    title: themeTitle,
    total: tasks.length,
    easy,
    medium,
    hard
  });
}

console.table(results);
