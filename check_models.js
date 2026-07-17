
import { GoogleGenAI } from "@google/genai";
import { getGeminiApiKey } from "./services/storage";

const checkModels = async () => {
    try {
        const apiKey = getGeminiApiKey();
        if (!apiKey) {
            console.log("No API Key found");
            return;
        }
        const ai = new GoogleGenAI({ apiKey });
        const models = await ai.models.list();
        console.log("Available Models:", JSON.stringify(models, null, 2));
    } catch (e) {
        console.error("Error listing models:", e);
    }
};

checkModels();
