import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator"
import { userRequestBodySchema } from "../../schema/validator/facebook";
import { ConnectionManager } from "../../core/chatbot/connectionManager";
import { SendableMessage, Sender } from "../../core/sender";
import { handleCommand } from "../../core/command";
import { StateManager } from "../../core/stateManager";
import chunkify from "../../utils/chunkify";

export const fb = new Hono();

export interface UserMessageEntry {
    sender: {
        id: string;
    };
    message: {
        text: string;
    };
}

export interface UserMessageMessagingBody {
    messaging: UserMessageEntry[];
}

export interface UserRequestBody {
    object: string;
    entry: UserMessageMessagingBody[];
}

const ConManager = ConnectionManager.getInstance()
const sender = Sender.getInstance()

const GEMINI_THINKING_MESSAGE = `${StateManager.BOT_NAME} is thinking...`

fb.post("/post_message", zValidator("json", userRequestBodySchema), async (c) => {
    const body: UserRequestBody = await c.req.json();

    if (body.object !== "page") return c.text("Not Found", 404);

    postMessageHandler(body)

    return c.text("EVENT_RECEIVED", 200);
})

async function postMessageHandler(body: UserRequestBody) {
    for (const entry of body.entry) {
        for (const messageEvent of entry.messaging) {
            
            const message = messageEvent.message.text
            const psid = messageEvent.sender.id

            const [ output, isCommand ] = await handleCommand(message, psid)

            if (isCommand) {
                for (const msg of output) {
                    await sender.send(new SendableMessage(psid, msg))
                }
            } else {
                const connection = ConManager.getConnection(psid)
                const response = await connection.linkedGeneration.generateContent(message)

                await sender.send(new SendableMessage(psid, GEMINI_THINKING_MESSAGE))
                
                for (const msg of chunkify(response!)) {
                    await sender.send(new SendableMessage(psid, msg!))
                }
            }

        }
    }
}
 
fb.get("/webhook", (c) => {

    const { req } = c;
    const verifyToken = process.env.FB_PAGE_VERIFY_TOKEN;
    
    const mode = req.query("hub.mode");
    const token = req.query("hub.verify_token");
    const challenge = req.query("hub.challenge");

    if (!mode || !token || mode != "subscribe" || token != verifyToken || !challenge) return c.text("Forbidden", 403);
        
    console.log("WEBHOOK_VERIFIED");
    return c.text(challenge, 200);
    
})
