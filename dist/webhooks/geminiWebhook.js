"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connections = void 0;
exports.askGemini = askGemini;
exports.messengerPostWebhookHandler = messengerPostWebhookHandler;
exports.messengerVerifyWebhookHandler = messengerVerifyWebhookHandler;
const connections_1 = require("../connections");
const convert_1 = require("../convert");
const send_1 = require("../send");
const commands_1 = require("../commands");
const chunkify_1 = __importDefault(require("../chunkify"));
const logger_1 = require("../development/logger");
exports.connections = new connections_1.Connections();
function handleUserMessage(msg, id) {
    let connection = exports.connections.getUser(id);
    if (connection === undefined) {
        try {
            connection = exports.connections.createConnection(id);
        }
        catch (e) {
            //if somehow we are creating a new session when user session already exists
            console.log("Error", e);
            const output = ["Oh no! Something went wrong when requesting for a new session, please try again later😢..."];
            return [output, true];
        }
    }
    connection.updateLastReqTime();
    // removeFromWarningList(connectionId);
    const url = connection?.serverUrl;
    // if (url !== "self") return redirectRequest(url as string, body, connectionId);
    return (0, commands_1.handleCommand)(msg, id);
}
async function askGemini(psid, msg) {
    const client = exports.connections.getUser(psid);
    if (!client)
        return;
    try {
        await (0, send_1.send)({ id: psid, msg: "Gemini is thinking..." });
        const val = await client.ask(msg);
        if (!val) {
            (0, send_1.send)({
                id: psid,
                msg: "Please be patient, waiting for DigyBot's response...",
            });
            return;
        }
        await (0, send_1.sendMsgsConsecutively)((0, chunkify_1.default)(val), psid);
    }
    catch (e) {
        (0, logger_1.logAxiosError)(e);
        (0, send_1.send)({
            id: psid,
            msg: "Something wrong went wrong when asking DigyBot 😢",
        });
    }
}
async function messengerPostWebhookHandler(req, res) {
    if (process.env.NO_NEW_REQUESTS)
        return;
    const request = req.body;
    if (process.env.DEBUG_MODE === "verbose") {
        console.dir(request, { depth: null });
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
        const ea = request.entry || null;
        if ("object" !== typeof ea || !Array.isArray(ea) || (ea?.length || 0) < 1)
            return res.sendStatus(400);
        for (const entry of ea) {
            if ("object" !== typeof entry.messaging || !Array.isArray(entry.messaging) || entry.messaging.length !== 1)
                return res.sendStatus(400);
            const [user] = entry.messaging || [];
            const senderId = parseInt(user?.sender?.id) || null;
            const msg = user?.message?.text || null;
            if (!user ||
                typeof user !== "object" ||
                Array.isArray(user) ||
                !senderId ||
                typeof senderId !== "number" ||
                Number.isNaN(senderId) ||
                !msg ||
                typeof msg !== "string" ||
                msg.length === 0)
                return res.sendStatus(400);
            if (exports.connections.isBlocked(senderId)) {
                const dateNow = Date.now();
                let formatted;
                const blockTime = (0, convert_1.msToSec)(exports.connections.getBlockTimeMS(senderId) - dateNow);
                //if the block time is 60 seconds or above
                if (blockTime >= 60) {
                    formatted = `You are still blocked for ${Math.floor((0, convert_1.secToMin)(blockTime))} minutes!`;
                }
                else {
                    formatted = `You are still blocked for ${Math.floor(blockTime)} seconds!`;
                }
                res.sendStatus(200);
                return (0, send_1.send)({
                    id: senderId,
                    msg: formatted,
                });
            }
            try {
                const [output, isCommand] = await handleUserMessage(msg, senderId);
                console.log({
                    output,
                    isCommand
                });
                if (!isCommand) {
                    res.sendStatus(200);
                    return askGemini(senderId, msg);
                }
                if (typeof output === "object" && Array.isArray(output) && output.length >= 1) {
                    for (const msg of output) {
                        await (0, send_1.send)({ id: senderId, msg });
                    }
                }
            }
            catch {
                (0, send_1.send)({ id: senderId, msg: "Something went wrong, please try again😢" })
                    .catch(e => (0, logger_1.logAxiosError)(e));
            }
            res.send("EVENT_RECEIVED");
        }
    }
    else {
        console.log("sent status code 401 Unauthorized");
        res.sendStatus(401);
    }
}
;
function messengerVerifyWebhookHandler(req, res) {
    const verifyToken = process.env.FB_PAGE_VERIFY_TOKEN;
    // Parse the query params
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    // Check if a token and mode is in the query string of the request
    if (mode && token) {
        // Check the mode and token sent is correct
        if (mode === "subscribe" && token === verifyToken) {
            // Respond with the challenge token from the request
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        }
        else {
            // Respond with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
    else {
        res.sendStatus(403);
    }
}
;
