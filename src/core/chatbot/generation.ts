import { GoogleGenAI, type Chat, type Content } from "@google/genai";
import { env } from "../environment";
import { GenerationError } from "../../error";

const AI_MODEL = env.OVERRIDE_MODEL || "gemini-2.5-flash-lite"
const { GOOGLE_GEMINI_API_KEY } = env;

if (!GOOGLE_GEMINI_API_KEY) {
    throw new GenerationError("The API key must be defined in the environment variable.")
}



export class GenerationManager {
    private genAI: GoogleGenAI

    constructor() {
        this.genAI = new GoogleGenAI({ apiKey: GOOGLE_GEMINI_API_KEY })
    }

    createChat(history: Content[] = []) {
        return this.genAI.chats.create({
            model: AI_MODEL,
            history
        })
    }

    async generateContent(message: string) {
        const response = await this.genAI.models.generateContent({
            model: AI_MODEL,
            contents: message
        })

        return response.text
    }
}



export const generationManager = new GenerationManager()



export class Generation {
    active = true
    timeCreated: number
    lastActive: number
    chat: Chat

    constructor(history: Content[]) {
        const time = Date.now()
        this.timeCreated = time
        this.lastActive = time

        this.chat = generationManager.createChat(history)
    }

    reset(history: Content[]) {
        this.active = true
        
        const time = Date.now()
        this.timeCreated = time
        this.lastActive = time
        this.chat = generationManager.createChat(history)
    }

    private updateTime() {
        this.lastActive = Date.now()
    }

    async generateContent(message: string) {
        this.updateTime()
        const response = await this.chat.sendMessage({ message })
        return response.text
    }

    deactivate() {
        this.active = false
        
        const time = Date.now()
        this.timeCreated = time
        this.lastActive = time
    }
}
