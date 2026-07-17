import { GoogleGenAI, ThinkingLevel } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: "DUMMY_KEY" }); // just need to see if it throws a 400 about thinkingConfig, or a 401 unauthorized
async function run() {
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "hello",
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM }
      }
    });
    console.log("Success", res.text);
  } catch (e) {
    console.error("API ERROR:", e.message);
  }
}
run();
