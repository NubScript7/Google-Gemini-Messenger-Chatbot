import { GoogleGenAI, type Chat, type Content } from "@google/genai";
import { env } from "../environment";
import { GenerationError } from "../../error";

const AI_MODEL = env.OVERRIDE_MODEL || "gemini-2.5-flash-lite"
const { GOOGLE_GEMINI_API_KEY } = env;

if (!GOOGLE_GEMINI_API_KEY) {
    throw new GenerationError("The API key must be defined in the environment variable.")
}



export class GenerationManager {
    private static instance: GenerationManager
    private genAI: GoogleGenAI

    constructor() {
        this.genAI = new GoogleGenAI({ apiKey: GOOGLE_GEMINI_API_KEY })
    }

    static getInstance() {
        if (!GenerationManager.instance) {
            GenerationManager.instance = new GenerationManager()
        }
        
        return GenerationManager.instance
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


export const generationManager = GenerationManager.getInstance()


export class Generation {
    private _active = true
    chat: Chat

    get isActive() {
        return this._active
    }

    setIsActive(val: boolean) {
        this._active = val
    }

    constructor(history: Content[]) {
        this.chat = generationManager.createChat(history)
    }

    reset(history: Content[]) {
        this._active = true
        this.chat = generationManager.createChat(history)
    }

    async generateContent(message: string) {
        const response = await this.chat.sendMessage({ message })
        return response.text
    }
}
