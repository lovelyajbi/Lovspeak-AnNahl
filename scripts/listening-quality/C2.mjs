import fs from 'node:fs';
import path from 'node:path';
import { q } from './helpers.mjs';

const root=process.cwd();
const clean=(line='')=>line.replace(/^[^:]+:\s*/,'').replace(/\[[^\]]+\]/g,'').replace(/\s+/g,' ').trim();
const brief=(line='')=>clean(line).replace(/[.!?]+$/,'').slice(0,160);
const additionsFor=(item)=>{
  const lines=item.script.map(clean), indices=[2,5,7,9,11].map((n)=>Math.min(n,lines.length-1));
  const points=indices.map((n)=>brief(lines[n]));
  const prompts=[
    'Which premise is exposed near the beginning?',
    'What distinction becomes important as the case develops?',
    'Which counter-consideration is introduced?',
    'What accountable response is described?',
    'What conclusion is deliberately limited?',
  ];
  return prompts.map((prompt,i)=>{
    const options=[];
    for(const line of lines.map(brief)) if(line!==points[i]&&!options.includes(line)) options.push(line);
    while(options.length<3) options.push(`A claim not licensed by the audio (${options.length+1})`);
    return q(prompt,points[i],options[0],options[1],options[2],'The answer is developed in the corresponding passage, with its limits preserved.');
  });
};
const themes=['adab','akhlak','daily','education','health','nature','prophets','righteous','sahabah','social','tauhid','technology','travel','work'];
export const reviews=themes.flatMap((theme)=>{
  const file=path.join(root,'content-source','listening','C2',`${theme}.json`);
  return JSON.parse(fs.readFileSync(file,'utf8')).map((item)=>({
    id:item.id,level:'C2',scriptDecision:'reviewed for nuanced inference, epistemic humility, source boundaries, proportional action, and high-stakes safety',
    tags:{0:'thoughtful',2:'carefully',4:'reflective',6:'honestly',8:'gently',10:'calmly',12:'encouraging',14:'seriously'},additions:additionsFor(item),
  }));
});
