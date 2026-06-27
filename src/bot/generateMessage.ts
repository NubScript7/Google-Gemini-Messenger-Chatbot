import type { Content } from "@google/genai";
import { ai, createContentParams, formatContent } from "./util";

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
