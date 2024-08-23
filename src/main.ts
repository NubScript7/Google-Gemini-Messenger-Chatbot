"use strict";

import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors";
import { geminiSettings } from "./gemini";
import appRoute from "./routes/app";
import Net from "./netClass";
import Connections from "./connectionsClass";
import Connection from "./connectionClass";
import Servers from "./serversClass";
import socketHandler from "./sockets/ai";

// import MessageCExceededError from "./errors/MessageCountExceededError";
// import socketIO from "socket.io";

import { createServer } from "node:http";
import { Server as SocketServer } from "socket.io";
import logger from "./logger";
import path from "node:path";
import { send, sendMsgsConsecutively, __settings } from "./send";
import chunkify from "./chunkify";
import { msToSec, secToMin } from "./convert";
import { handleMessengerUserMessage } from "./handleUserMessage";

export const VERSION = "1.5.5";
export const upStartTime: number = Date.now();

export enum BOT_TYPES {
    Messenger = "Messenger",
    Frontend = "Frontend",
  }

interface MainRuntileUtils {
    isDevRunning: boolean;
    apiUrl: string;
    devLogPassword?: string;
    blockedTimeSeconds: number;
    sessionMaxAge: number;
    notifySession: boolean;
    notifyMessage: string;
    workerInterval: number;
    warningTimeBeforeDeletion: number;
}

interface UserMessageEntry {
    sender: {
        id: number;
    };
    message: {
        text: string;
    };
}

interface UserMessageMessagingBody {
    messaging: UserMessageEntry[];
}

/** 
	   requestBody:
	     object: string
	     entry: [
			{
				messaging: [
					{
						sender: {
							id: number
						},
						message: {
							text: string
						}
					}
				]
			}
		 ]
	*/

interface UserRequestBody {
    object: string;
    entry: UserMessageMessagingBody[];
}

//const example: UserRequestBody = new UserRequestBody();

const mainRuntimeUtils = {
    isDevRunning: false,
    devLogPassword: undefined,
    apiUrl: "",
    blockedTimeSeconds: 200, //seconds = 3 minutes
    sessionMaxAge: 300, //seconds = 5 minutes
    notifySession: true,
    workerInterval: 60, //seconds = 1 minute
    warningTimeBeforeDeletion: 30, //seconds
    notifyMessage:
        "Your connection will become inactive after 30 seconds, please type '!abort', type some commands or ask DigyBot something just to make an activity to cancel connection termination.",
} as MainRuntileUtils;


const corsOptions = {
  origin: [ "http://localhost:7700" ]
  /*function (origin: any, callback: any) {
    
    const origins = [ "http://localhost:7700" ];
    
    const error = undefined
    
    callback( error, origins);
    
  }
  */,
  method: [ "POST", "GET" ]
}


function getUsersPsid(): Promise<any> {
    return new Promise(async (res, rej) => {
        try {
            const response = await axios.post(mainRuntimeUtils.apiUrl, {
                ref: "/gemini_chatbot/users/id",
            });

            res(response);
        } catch (e) {
            rej(e);
        }
    });
}

const app = express();
const appServer = createServer(app);

// Errors

//const IncompleteEnvironmentVariableError = require("./errors/IncompleteEnvironmentVariableError");
//const CannotCreateNewConnectionUserAlreadyExistsError = require("./errors/CannotCreateNewConnectionUserAlreadyExistsError"); //r
//const CreateNewClientConnectionInvalidPsidError = require("./errors/CreateNewClientConnectionInvalidPsidError"); //r

/*
 * users have 10 requests per 5 minutes
 * maximux users is 10 per servers
 * and available mass requests per server is 50
 * so: 5 * 10 * 50 = 2500
 * max send count should be 2500
 * the messager connections object and socket.io's are seperate (but they both use this logic)
 */

const userMaxMessageRequestPerMinute: number = 5;
const maxUsersPerServer: number = 10;
const serverMaxAvailableMassRequests: number = 50;
const chatHistoryMessagePreviewMaxLength: number = 27;

const sendMaxCount: number = userMaxMessageRequestPerMinute * maxUsersPerServer * serverMaxAvailableMassRequests;

__settings.maxMessages = sendMaxCount;


const socketSettings = {
    cors: corsOptions
};


const io = new SocketServer(appServer, socketSettings);

io.on("connection", socketHandler);

app.use(express.json());
app.use(
    express.urlencoded({
         extended: true,
    })
);

app.disable("x-powered-by");
app.use(cors(corsOptions));
app.use(logger);
app.use("/public", express.static(path.resolve("./public")));
app.set("view engine", "ejs");

const net: Net = new Net();
const servers: Servers = new Servers();
const connections: Connections = new Connections();

__settings.connections = connections;

export const LOGS: string[] = [];

function updateAvailableServers(): string {
    if (servers.names.length >= 1) servers.strCache = `available servers:\n\n${servers.names.reduce((p, t) => `${p}- ${t}\n`, "")}`;

    return servers.strCache;
}

export function no_new_requests(): void {
    //@ts-ignore
    process.env.NO_NEW_REQUESTS = true;
}

export function relisten_on_new_requests() {
    //@ts-ignore
    porcess.env.NO_NEW_REQUESTS = false;
}

export function redirectRequest(url: string, body: object, id: number): void {
    if (!url || !body || !id || "string" !== typeof url || "object" !== typeof body || Array.isArray(body) || isNaN(id)) return;

    axios.post(url, body).catch(() => {
        send({
            id,
            msg: "Failed to send payload to given server, reverting back to default server.",
        });
    });
}

export function askGemini(connection: Connection, psid: number, msg: string): void {
    const val = connection.ask(msg);
    if (typeof val === "boolean") {
        send({
            id: psid,
            msg: "Please be patient, waiting for DigyBot's response...",
        });
        return void 0;
    }

    send({ id: psid, msg: "Gemini is thinking..." });

    val.then((message) => {
        sendMsgsConsecutively(chunkify(message as string), psid);
    }).catch((error) => {
        console.log("error report: ", error);
        send({
            id: psid,
            msg: "Something wrong went wrong when asking DigyBot 😢",
        });
    });
}

export const helpStr: string =
    "To use, type the message you want to ask DigyBot or you could use these commands:\n\n" +
    "!v - get app version\n" +
    "!help - used to print this help message\n" +
    "!ch-server - change the server to ask DigyBot (type '!ch-server' to change current server)\n" +
    "!server - to get the server you are currently on\n" +
    "!modes - used to know about the output modes\n" +
    "!mode - used to get what output mode you are using\n" +
    "!ch-mode - change the output mode (type '!modes' to know about the modes)\n" +
    "!clear - used to clear the chat history from the app\n" +
    "!history - used to print your chat history\n";

export const modesArr: string[] = ["aftercomplete", "streamchunk"];

export const modesStr: string =
    "The two different output modes are:\n\n" +
    "  • aftercomplete - the app will wait for DigyBot to complete the whole response then send the message\n" +
    "  • streamchunk - the app will send little chunks of messages as soon as possible without waiting for DigyBot to complete the whole response\n";

app.use("/", appRoute);

app.get("/pingme", (req, res) => {
    res.send("healthy!");
});

app.get("/favicon.ico", (req, res) => {
    res.sendFile(__dirname + "/public/favicon.ico");
});

/* setAiSocketMessageHandler(handleUserMessage); */

async function messengerPostWebhookHandler(req: Request, res: Response) {
    if (process.env.NO_NEW_REQUESTS) return;
    const request: UserRequestBody = req.body;
    
    if(process.env.DEBUG_MODE === "verbose") {
        console.dir(request, {depth: null});
    }

    if (request.object === "page") {
        const ea: object | null = request.entry || null;
        if ("object" !== typeof ea || !Array.isArray(ea) || (ea?.length || 0) < 1) return res.sendStatus(400);
        for (const entry of req.body.entry) {
            if ("object" !== typeof entry.messaging || !Array.isArray(entry.messaging) || entry.messaging.length !== 1) return res.sendStatus(400);

            const [user]: [UserMessageEntry] = entry.messaging || [];
            const senderId = user?.sender?.id || null;
            const msg = user?.message?.text || null;

            console.log({
                user,
                senderId,
                msg
            })
            if (
                !user ||
                typeof user !== "object" ||
                Array.isArray(user) ||
                
                !senderId ||
                isNaN(senderId) ||
                typeof senderId !== "string" ||
                
                !msg ||
                "string" !== typeof msg ||
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

                return send({
                    id: senderId,
                    msg: formatted,
                });
            }

            try {
                const output = await handleMessengerUserMessage(msg, senderId, req.body);
                if(process.env.DEBUG_MODE === "verbose") {
                    console.dir(output, {depth: null});
                }
                
                if(typeof output === "object" && Array.isArray(output) && output.length >= 1) {
                    for (const msg of output) {
                        await send({id: senderId, msg})
                    }
                }
                res.send("EVENT_RECEIVED");
            
            } catch {
                res.sendStatus(400);
            }
        }
    } else {
        console.log("sent status code 401 Unauthorized");
        res.sendStatus(401);
    }
};

function messengerVerifyWebhookHandler(req: Request, res: Response) {
    const verifyToken = process.env.FB_PAGE_VERIFY_TOKEN || "@default";
    // Parse the query params
    const mode: string = req.query["hub.mode"] as string;
    const token: string = req.query["hub.verify_token"] as string;
    const challenge: string = req.query["hub.challenge"] as string;

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

app.post("/generative-ai/api/v1/webhook", messengerPostWebhookHandler);
app.post("/webhook", messengerPostWebhookHandler);

app.get("/generative-ai/api/v1/webhook", messengerVerifyWebhookHandler);
app.get("/webhook", messengerVerifyWebhookHandler);


app.all("*", (req, res) => {
    res.status(404).send(":)");
});



export {
    appServer,
    net,
    servers,
    geminiSettings,
    connections,
    updateAvailableServers,
    userMaxMessageRequestPerMinute,
    maxUsersPerServer,
    serverMaxAvailableMassRequests,
    chatHistoryMessagePreviewMaxLength,
    sendMaxCount,
    __settings,
    mainRuntimeUtils,
};
