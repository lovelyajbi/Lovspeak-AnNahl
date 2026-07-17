import fs from 'fs';

const content = fs.readFileSync('src/constants/shadowingData.ts', 'utf8');

// Simple regex to extract theme definitions. 
// This is brittle but might work for a quick check.
const themeBlocks = content.split(/id: '/).slice(1);

themeBlocks.forEach(block => {
    const id = block.split("'")[0];
    const taskCount = (block.match(/id: '/g) || []).length;
    // The match finds tasks inside the block. 
    // Note: The first match is the theme ID itself, so we subtract 1 or adjust logic.
    // Actually, block starts AFTER id: '...
    // So (block.match(/id: '/g) || []).length will count the TASKS in that block.
    console.log(`${id}: ${taskCount} tasks`);
});
