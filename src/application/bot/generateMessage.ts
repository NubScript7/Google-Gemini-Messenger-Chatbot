import { GoogleGenAI } from "@google/genai";
import type { Content } from "@google/genai";
import { env } from "../environment";

export const ai = new GoogleGenAI({ apiKey: env.GOOGLE_GEMINI_API_KEY })

function formatContent(contents: Content[], prompt: string) {
    const promptContent: Content = {
        role: "user",
        parts: [{ text: prompt }]
    }
    contents.push(promptContent)

    return contents
}

function createContentParams(history: Content[]) {
    return {
        model: env.GOOGLE_GEMINI_MODEL,
        config: {
            systemInstruction: env.GOOGLE_GEMINI_INSTRUCTIONS,
            tools: [{ googleSearch: {} }]
        },
        contents: history,
    }
}

export function generateContent(contents: Content[], prompt: string) {
    const history = formatContent(contents, prompt)
    const parameter = createContentParams(history)

    return ai.models.generateContent(parameter)
}

export function generateContentStream(contents: Content[], prompt: string) {
    const history = formatContent(contents, prompt)
    const parameter = createContentParams(history)

    return ai.models.generateContentStream(parameter)
}
