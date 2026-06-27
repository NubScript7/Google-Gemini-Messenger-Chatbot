import type { Content, GenerateContentParameters } from "@google/genai";
import { env } from "../environment";
import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({ apiKey: env.GOOGLE_GEMINI_API_KEY })
const MODEL_TOKEN_LIMIT_MARGIN = 15

export function calculateWordLimit(maxTokens = 10) {
  if (isNaN(maxTokens) || maxTokens <= 0) return 30

  const TOKEN_TO_WORD_RATE = 0.75
  const maxWordsPossible = maxTokens * TOKEN_TO_WORD_RATE;
  const targetWords = Math.max(5, Math.floor(maxWordsPossible * TOKEN_TO_WORD_RATE));
  
  return targetWords;
}

export function formatContent(contents: Content[], prompt: string) {
    const promptContent: Content = {
        role: "user",
        parts: [{ text: prompt }]
    };
    contents.push(promptContent);

    return contents;
}

export function createContentParams(history: Content[]) {
    return {
        model: env.GOOGLE_GEMINI_MODEL,
        config: {
            systemInstruction: env.GOOGLE_GEMINI_INSTRUCTIONS,
            tools: [{ googleSearch: {} }]
        },
        contents: history,
    } as GenerateContentParameters
}

export function createContentParamsLite(history: Content[]) {
    const MAX_TOKEN = env.GOOGLE_GEMINI_LITE_MAX_TOKEN + MODEL_TOKEN_LIMIT_MARGIN
    const wordLimit = calculateWordLimit(MAX_TOKEN)
    const INSTRUCTIONS = `You are a lite model version. CRITICAL: Your response must be completely finished and under ${wordLimit} words. Stop immediately once you answer. Never exceed this length.\n${env.GOOGLE_GEMINI_INSTRUCTIONS}`
    
    return {
        model: env.GOOGLE_GEMINI_MODEL,
        config: {
            systemInstruction: INSTRUCTIONS,
            maxOutputTokens: MAX_TOKEN,
            temperature: 0.3,
            thinkingConfig: {
                thinkingBudget: 0
            }
        },
        contents: history,
    } as GenerateContentParameters
}

export function countToken(prompt: string) {
    return ai.models.countTokens({
        model: env.GOOGLE_GEMINI_MODEL,
        contents: prompt,
    })
}

