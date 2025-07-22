import { Request, Response } from "express";
import { Connection, Connections } from "../connections";
import { msToSec, secToMin } from "../convert";
import { send, sendMsgsConsecutively } from "../send";
import { handleCommand } from "../commands";
import chunkify from "../chunkify";
import { logAxiosError } from "../development/logger";

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

export const connections: Connections = new Connections();

function handleUserMessage(msg: string, id: number) {
    
    let connection = connections.getUser(id);

    if (connection === undefined) {
        try {
            connection = connections.createConnection(id);
        } catch (e) {
            //if somehow we are creating a new session when user session already exists
            console.log("Error", e);
            const output = ["Oh no! Something went wrong when requesting for a new session, please try again later😢..."]
            return [output, true];
        }
    }
    
    connection.updateLastReqTime()
    // removeFromWarningList(connectionId);

    const url = connection?.serverUrl;

    // if (url !== "self") return redirectRequest(url as string, body, connectionId);
    
    return handleCommand(msg, id);
}

export async function askGemini(psid: number, msg: string): Promise<void> {
    const client = connections.getUser(psid);

    if(!client) return;

    try {
        await send({ id: psid, msg: "Gemini is thinking..." });
        const val = await client.ask(msg);

        if (!val) {
            send({
                id: psid,
                msg: "Please be patient, waiting for DigyBot's response...",
            });
            return;
        }

        await sendMsgsConsecutively(chunkify(val), psid)
    } catch(e: any) {
        logAxiosError(e)
        send({
            id: psid,
            msg: "Something wrong went wrong when asking DigyBot 😢",
        });
    }

}

export async function messengerPostWebhookHandler(req: Request, res: Response) {
    if (process.env.NO_NEW_REQUESTS) return;
    const request: UserRequestBody = req.body;
    
    if(process.env.DEBUG_MODE === "verbose") {
        console.dir(request, {depth: null});
    }
    
    /*
        object: "page",
        entry: [
            {
                messaging: [
                    {
                        sender: {
                            id: number,
                        },
                        message: {
                            text: string
                        }
                    }
                ]
            }
        ]
    */

    if (request.object === "page") {
        const ea: object | null = request.entry || null;
        if ("object" !== typeof ea || !Array.isArray(ea) || (ea?.length || 0) < 1) return res.sendStatus(400);
        for (const entry of ea) {
            if ("object" !== typeof entry.messaging || !Array.isArray(entry.messaging) || entry.messaging.length !== 1) return res.sendStatus(400);

            const [user]: [UserMessageEntry] = entry.messaging || [];
            const senderId = parseInt(user?.sender?.id) || null;
            const msg = user?.message?.text || null;

            if (
                !user ||
                typeof user !== "object" ||
                Array.isArray(user) ||
                
                !senderId ||
                typeof senderId !== "number" ||
                Number.isNaN(senderId) ||
                
                !msg ||
                typeof msg !== "string" ||
                msg.length === 0
            )
                return res.sendStatus(400);
            

            if (connections.isBlocked(senderId)) {
                const dateNow = Date.now();
                let formatted: string;
                const blockTime = msToSec(connections.getBlockTimeMS(senderId) - dateNow);
                //if the block time is 60 seconds or above
                if (blockTime >= 60) {
                    formatted = `You are still blocked for ${Math.floor(secToMin(blockTime))} minutes!`;
                } else {
                    formatted = `You are still blocked for ${Math.floor(blockTime)} seconds!`;
                }

                res.sendStatus(200)
                return send({
                    id: senderId,
                    msg: formatted,
                });
            }

            try {
                const [output, isCommand] = await handleUserMessage(msg, senderId)
                
                console.log({
                    output,
                    isCommand
                })
                if(!isCommand) {
                    res.sendStatus(200)
                    return askGemini(senderId, msg)
                }
                
                
                if(typeof output === "object" && Array.isArray(output) && output.length >= 1) {
                    for (const msg of output) {
                        await send({id: senderId, msg})
                    }
                }
            } catch {

                send({id: senderId, msg: "Something went wrong, please try again😢"})
                .catch(e => logAxiosError(e))
            }
            res.send("EVENT_RECEIVED");
        }
    } else {
        console.log("sent status code 401 Unauthorized");
        res.sendStatus(401);
    }
};

export function messengerVerifyWebhookHandler(req: Request, res: Response) {
    const verifyToken = process.env.FB_PAGE_VERIFY_TOKEN;
    // Parse the query params
    const mode = req.query["hub.mode"] as string;
    const token = req.query["hub.verify_token"] as string;
    const challenge = req.query["hub.challenge"] as string;

    // Check if a token and mode is in the query string of the request
    if (mode && token) {
        // Check the mode and token sent is correct
        if (mode === "subscribe" && token === verifyToken) {
            // Respond with the challenge token from the request
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            // Respond with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(403);
    }
};