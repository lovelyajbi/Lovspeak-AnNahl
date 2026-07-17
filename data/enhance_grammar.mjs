import { Project, SyntaxKind } from "ts-morph";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";

// Load API keys from environment variable to support BYOK (Bring Your Own Key)
// You can provide a single key or multiple keys separated by commas
const rawKeys = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
const API_KEYS = rawKeys ? rawKeys.split(',').map(k => k.trim()) : [];

if (API_KEYS.length === 0) {
  console.error('❌ Error: No API keys found. Please set GEMINI_API_KEY environment variable.');
  console.error('   Example: GEMINI_API_KEY=your_key_1,your_key_2 node data/enhance_grammar.mjs');
  process.exit(1);
}

let currentKeyIndex = 0;
let ai = new GoogleGenAI({ apiKey: API_KEYS[currentKeyIndex] });

function switchKey() {
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  if (API_KEYS.length > 1) {
    console.log(`\n[API KEY SWITCH] Switched to key index ${currentKeyIndex}`);
  }
  ai = new GoogleGenAI({ apiKey: API_KEYS[currentKeyIndex] });
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getEnhancementsFromAI(title, content, examplesTextArray) {
  const prompt = `
You are an expert English teacher specializing in CEFR curriculum and Islamic context.
We are enhancing an English grammar lesson module.

Lesson Section Content:
"${content}"

Examples to translate:
${examplesTextArray.map((ex, i) => `${i + 1}. ${ex}`).join('\n')}

Based on the content and examples above, provide a JSON response with:
1. "formula": A very concise, technical grammar formula representation (e.g., "Subject + Am/Is/Are + Noun/Adjective" or "If + Present Simple, Present Simple"). Max 10-15 words. Keep it clear and punchy.
2. "exceptions": A short paragraph (1-2 sentences) highlighting common traps, edge cases, or exceptions related to this grammar point, especially for Indonesian learners.
3. "translations": An array of strings containing the natural Indonesian translations for the exact examples provided above, in the exact same order.

JSON Format:
{
  "formula": "...",
  "exceptions": "...",
  "translations": ["...", "..."]
}
Return ONLY valid JSON.
`;

  let retries = 3;
  while (retries > 0) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            temperature: 0.2,
            responseMimeType: "application/json"
        }
      });
      return JSON.parse(response.text);
    } catch (error) {
      if (error?.status === 429 || error?.message?.includes("429")) {
        console.warn(`[RATE LIMIT] Hit limit on key ${currentKeyIndex}. Switching...`);
        switchKey();
        retries--;
        await sleep(2000); // Wait a bit before retry
      } else {
        console.error("AI Generation Error:", error.message);
        throw error;
      }
    }
  }
  throw new Error("All retries failed.");
}

async function enhanceGrammar(levels) {
  const project = new Project();
  
  for (const level of levels) {
    const filePath = `data/grammar/level${level}.ts`;
    console.log(`Processing ${filePath}...`);
    project.addSourceFileAtPath(filePath);
    
    const sourceFile = project.getSourceFile(filePath);
    const varDecl = sourceFile.getVariableDeclaration(`LEVEL_${level}`);
    if (!varDecl) {
        console.error(`Could not find LEVEL_${level} declaration.`);
        continue;
    }
    
    const arrayExpr = varDecl.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
    const lessons = arrayExpr.getElements();

    for (let l = 0; l < lessons.length; l++) {
      const lessonObj = lessons[l].asKind(SyntaxKind.ObjectLiteralExpression);
      const title = lessonObj.getProperty("title")?.getInitializer()?.getText()?.replace(/['"]/g, '');
      console.log(`\n>> Lesson: ${title}`);

      const sectionsProp = lessonObj.getProperty("sections").asKind(SyntaxKind.PropertyAssignment);
      const sectionsArray = sectionsProp.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
      const sections = sectionsArray.getElements();

      for (let s = 0; s < sections.length; s++) {
        const sectionObj = sections[s].asKind(SyntaxKind.ObjectLiteralExpression);
        const heading = sectionObj.getProperty("heading")?.getInitializer()?.getText();
        
        // Skip if already has formula and exceptions
        if (sectionObj.getProperty("formula") && sectionObj.getProperty("exceptions")) {
            console.log(`   Skipping Section ${s+1} (already enhanced)`);
            continue;
        }

        const content = sectionObj.getProperty("content")?.getInitializer()?.getText()?.replace(/^['"`]/, '')?.replace(/['"`]$/, '');
        
        const examplesProp = sectionObj.getProperty("examples").asKind(SyntaxKind.PropertyAssignment);
        const examplesArray = examplesProp.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
        const exampleNodes = examplesArray.getElements();
        
        const examplesTexts = [];
        for (const exNode of exampleNodes) {
           const exObj = exNode.asKind(SyntaxKind.ObjectLiteralExpression);
           const textNode = exObj.getProperty("text")?.getInitializer();
           examplesTexts.push(textNode.getText().replace(/^['"`]/, '').replace(/['"`]$/, ''));
        }

        console.log(`   Fetching data for section: ${heading}...`);
        
        try {
            const enhancedData = await getEnhancementsFromAI(title, content, examplesTexts);
            
            // Add formula and exceptions to section
            if (!sectionObj.getProperty("formula")) {
                // escape quotes
                const safeFormula = enhancedData.formula.replace(/'/g, "\\'");
                sectionObj.addPropertyAssignment({ name: "formula", initializer: `'${safeFormula}'` });
            }
            if (!sectionObj.getProperty("exceptions")) {
                const safeExceptions = enhancedData.exceptions.replace(/'/g, "\\'");
                sectionObj.addPropertyAssignment({ name: "exceptions", initializer: `'${safeExceptions}'` });
            }

            // Add translation to examples
            for (let i = 0; i < exampleNodes.length; i++) {
                const exObj = exampleNodes[i].asKind(SyntaxKind.ObjectLiteralExpression);
                if (!exObj.getProperty("translation") && enhancedData.translations[i]) {
                    const safeTrans = enhancedData.translations[i].replace(/'/g, "\\'");
                    exObj.addPropertyAssignment({ name: "translation", initializer: `'${safeTrans}'` });
                }
            }

            // Save file per section to avoid losing progress
            sourceFile.saveSync();
            await sleep(1000); // Rate limit buffer

        } catch (err) {
            console.error(`   Failed to enhance section: ${err.message}`);
        }
      }
    }
  }
  console.log("\nFinished Batch!");
}

const levelsToRun = process.argv.slice(2);
if (levelsToRun.length === 0) {
    console.log("Please provide levels, e.g., node script.mjs A1 A2");
    process.exit(1);
}

enhanceGrammar(levelsToRun);
