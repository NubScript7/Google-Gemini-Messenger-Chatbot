import type { Content } from "@google/genai";
import type { Connection, PSID } from "./client";

export type History = Connection[]

export class HistoryManager {
    private static instance: HistoryManager
    history = new Map<PSID, History>()

    static EMPTY: Content[] = []

    static getInstance() {
        if (!HistoryManager.instance) {
            HistoryManager.instance = new HistoryManager()
        }
        
        return HistoryManager.instance
    }

    getHistory(_id: PSID) {
        // TODO: make this return true history data
        return []
    }
}
