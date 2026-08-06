import fs from 'node:fs';
import path from 'node:path';
import { q } from './helpers.mjs';

const root=process.cwd();
const clean=(line='')=>line.replace(/^[^:]+:\s*/,'').replace(/\[[^\]]+\]/g,'').replace(/\s+/g,' ').trim();
const brief=(line='')=>clean(line).replace(/[.!?]+$/,'').slice(0,155);
const make=(item)=>{
  const lines=item.script.map(clean);
  const indices=[3,6,8,10,12].map((n)=>Math.min(n,lines.length-1));
  const points=indices.map((n)=>brief(lines[n]));
  const prompts=[
    `What assumption or context appears early in “${item.title}”?`,
    `Which development complicates the case in “${item.title}”?`,
    `What evidence or distinction is introduced later?`,
    `What process is proposed before the conclusion?`,
    `What boundary does the audio preserve?`,
  ];
  return prompts.map((prompt,i)=>{
    const distractors=[];
    for(const line of lines.map(brief)) if(line!==points[i]&&!distractors.includes(line)) distractors.push(line);
    while(distractors.length<3) distractors.push(`An interpretation the audio does not establish (${distractors.length+1})`);
    return q(prompt,points[i],distractors[0],distractors[1],distractors[2],'The answer is stated or carefully developed in the relevant section.');
  });
};
const themes=['adab','akhlak','daily','education','health','nature','prophets','righteous','sahabah','social','tauhid','technology','travel','work'];
export const reviews=themes.flatMap((theme)=>{
  const file=path.join(root,'content-source','listening','C1',`${theme}.json`);
  return JSON.parse(fs.readFileSync(file,'utf8')).map((item)=>({
    id:item.id,level:'C1',scriptDecision:'reviewed for advanced inference, source boundaries, responsible application, and varied listening style',
    tags:{0:'thoughtful',2:'carefully',4:'reflective',6:'honestly',8:'gently',10:'calmly',12:'encouraging',14:'seriously'},additions:make(item),
  }));
});
