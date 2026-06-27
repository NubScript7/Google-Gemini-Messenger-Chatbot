import type { Content } from "@google/genai";
import { ai, createContentParamsLite } from "./util";
import { formatContent } from "./util";


export function generateContentLite(contents: Content[], prompt: string) {
    const history = formatContent(contents, prompt)
    const parameter = createContentParamsLite(history)

    return ai.models.generateContent(parameter)
}
