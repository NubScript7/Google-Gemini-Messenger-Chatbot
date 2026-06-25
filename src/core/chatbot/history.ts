import type { Content } from "@google/genai";
import type { PSID } from "./client";

export type History = Content[]


export class ChatHistory {
    history: History
    id: PSID

    constructor(id: PSID) {
        this.history = []
        this.id = id
    }

    updateHistory(chatHistory: History) {
        this.history = chatHistory
    }

    getHistoryPreview() {
        const history = this.history

        const preview = []

        for (const message of history) {
            if (!message.parts) continue;

            for (const part of message.parts) {
                if (!part.text) continue;

                const cut = part.text.slice(0, 10)
                cut.concat("...")

                preview.push(cut)
            }
        }

        return preview;
    }
}



export class HistoryManager {
    private static instance: HistoryManager
    collection = new Map<PSID, ChatHistory>()

    static EMPTY: History = []

    static getInstance() {
        if (!HistoryManager.instance) {
            HistoryManager.instance = new HistoryManager()
        }
        
        return HistoryManager.instance
    }

    saveHistory(id: PSID, chatHistory: History) {
        const history = new ChatHistory(id)
        history.updateHistory(chatHistory)

        this.collection.set(id, history)
    }
}
