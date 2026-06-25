import type { PSID } from "./chatbot/client";
import { StateManager } from "./stateManager";
import { env } from "./environment";
import axios from "axios";


export class Sender {
    private static instance: Sender

    static getInstance() {
        if (!Sender.instance) {
            Sender.instance = new Sender()
        }

        return Sender.instance
    }

    private async postMessage(payload: SendableMessage) {
        return axios.post(
            StateManager.FB_GRAPH_API_URL,
                {
                    recipient: {
                        id: payload.id
                    },
                    message: {
                        text: payload.message || "INTERNAL: response was empty.",
                    },
                },
                {
                    timeout: StateManager.SEND_TIMEOUT,
                    params: {
                        access_token: env.FB_PAGE_ACCESS_TOKEN,
                    },
                }
        )
    }

    async send(payload: SendableMessage | SendableMessage[]) {
        const queue: SendableMessage[] = []

        if (typeof payload == "object" && Array.isArray(payload)) {
            queue.push(...payload)
        } else {
            queue.push(payload)
        }

        try {
            for (const item of queue) {
                await this.postMessage(item)
            }
        } catch(e) {
            console.log(typeof e)
        }
    }
}

export class SendableMessage {
    readonly id: PSID
    readonly message: string
    readonly timestamp: number

    constructor(id: PSID, message: string) {
        this.id = id
        this.message = message
        this.timestamp = Date.now()
    }
}
