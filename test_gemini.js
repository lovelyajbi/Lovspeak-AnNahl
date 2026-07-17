const { GoogleGenAI } = require("@google/genai");

async function run() {
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyFakeKeyForTestingPurposesOnly";
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "hello",
    });
    console.log("Success:", response.text);
  } catch (e) {
    console.log("Error Name:", e.name);
    console.log("Error Message:", e.message);
    console.log("Error String:", e.toString());
    console.log("Error Status:", e.status);
    console.log("Full Error Object:", JSON.stringify(e, null, 2));
  }
}
run();
