"use strict";
import Connection from "./connectionClass";
import Connections from "./connectionsClass";
import { send, sendMsgsConsecutively } from "./send";
import chunkify from "./chunkify";
import {
    connections,
    redirectRequest,
    VERSION,
    LOGS,
    mainRuntimeUtils,
    servers,
    modesStr,
    upStartTime,
    no_new_requests,
    modesArr,
    helpStr,
    chatHistoryMessagePreviewMaxLength,
    BOT_TYPES,
    turnOnSenderFunction,
    turnOffSenderFunction
} from "./main";
import {
 SocketConnectionsReferenceNotYetInitializedError
} from "./errors";
import { removeFromWarningList } from "./sessionCleanupWorker";

type processMessageUtilsObject = {
    msg: string,
    senderId: number | string
}

export let socketConnectionsReference: Connections;

export function askGemini(connection: Connection, psid: number, msg: string): void {
    const val = connection.ask(msg);
    console.log(val)
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

export async function processMessage(utils: processMessageUtilsObject, connection: Connection) {
    const output: string[] = [];
    
    const isCommand: boolean = utils.msg[0] === "!";

    const msgArgs: string[] = isCommand ? utils.msg.split(" ") : [utils.msg];
    
    switch (msgArgs[0]) {
        case "!v":
            {
                output.push(`app version: ${VERSION}`);
            }
            break;
        
        case "!off":
            {
                send({ id: utils.senderId, msg: "app can no longer send messages."})
                turnOffSenderFunction();
            }
            break;
        
        case "!on":
            {
                send({ id: utils.senderId, msg: "app can now send messages."})
                turnOnSenderFunction();
            }
            break;
        
        case "!logs": /* not yet implemented */
            {
                /*
                 * msgArgs[1] - the password
                 * msgArgs[2] - log index (to get the log at a given index)
                 */
                if (!msgArgs[1]) return output.push("Password required.");
                if (process.env.LOGS_PASSWORD === msgArgs[1] && !msgArgs[2]) {
                    for (const LOG of LOGS) {
                        output.push(...chunkify(LOG));
                    }
                    break;
                }
                const LOG_INDEX: number = parseInt(msgArgs[2]);
                if (process.env.LOGS_PASSWORD === msgArgs[1] && isNaN(LOG_INDEX) && (LOG_INDEX < 0 || LOG_INDEX >= LOGS.length)) {
                    output.push("LOGS INDEX MUST BE AN INTEGER OR A VALID INDEX RANGE");
                    break;
                }
                if (process.env.LOGS_PASSWORD === msgArgs[1] && isNaN(LOG_INDEX) && LOG_INDEX >= 0 && LOG_INDEX < LOGS.length) {
                    output.push(...chunkify(LOGS[LOG_INDEX]));
                    break;
                }
            }
            break;

        case "!unli":
            {
                /*
                 * msgArgs[1] - password
                 */
                if (!msgArgs[1]) {
                    output.push("password required.");
                    break;
                }

                if (msgArgs[1] === process.env.GEMINI_UNLIMITED_GENERATION) {
                    connection?.bypassUserLimitedGenerationCount();
                    output.push("You can now ask unlimited times.");
                } else {
                    output.push("Wrong password! Cooldown for 5 minutes...");
                    connection?.block(mainRuntimeUtils.blockedTimeSeconds);
                }
            }
            break;

        case "!ch-server":
            {
                const server: string | null = msgArgs[1] || null; //server that user picked
                if (!server) {
                    output.push(servers.strCache, "Type '!ch-server' then name of the server you want to change to:");
                    break;
                }

                if (!servers.names.includes(server)) {
                    output.push("Server does not exists in selectable servers.");
                    break;
                }

                const serverName = server;
                const serverUrl = servers.servers[server];
                
                connection.serverName = serverName;
                connection.serverUrl = serverUrl;
                output.push("Successfully set selected server.");
            }
            break;

        case "!id":
            {
                output.push(`your id: ${utils.senderId}`);
            }
            break;

        case "!server":
            {
                output.push(`your current server: ${connection.serverName}`);
            }
            break;

        case "!modes":
            {
                output.push(modesStr);
            }
            break;

        case "!uptime":
            {
                const elapsedTime = Date.now() - upStartTime;
                output.push(`online for ${Math.floor(elapsedTime / 1000)} seconds!`);
            }
            break;

        case "!mode":
            {
                output.push(`your current selected mode: ${connection.mode}`);
            }
            break;

        case "!reset":
            {
                if (!msgArgs[1]) {
                    output.push("You need to pass the correct password.");
                    break;
                }

                if (msgArgs[1] === process.env.APP_KILL_PASS) {
                    console.log("killing self");
                    no_new_requests();
                    const msg = "Resetting server...";
                    await connections.send(msg);
                    if(socketConnectionsReference)
                        await socketConnectionsReference.send(msg)
                    process.exit(0);
                } else {
                    connection?.block(300);
                    output.push("Incorrect password. Cooldown of 5 minutes!")
                }
            }
            break;

        case "!ch-mode":
            {
                const mode = msgArgs[1];

                if (!mode) {
                    output.push(modesStr, "Type '!ch-mode' then the output mode you want to change to:");
                    break;
                }

                if (!modesArr.includes(mode)) {
                    output.push("that is not a valid mode, please try again.");
                    break;
                }

                connection.mode = mode;
                output.push(`Successfully set the mode to ${mode}`);
            }
            break;

        case "!clear":
            {
                if (!msgArgs[1] && !connection?.IS_CLEARING_CHAT_HISTORY) {
                    if (connection !== undefined) connection.IS_CLEARING_CHAT_HISTORY = true;

                    output.push("You are about to clear your chat history, are you sure? please type '!clear yes' to continue clearing you chat history, or type '!clear no' to cancel this action.",
                    );
                    break;
                }
                const confirmation = msgArgs[1];
                if (connection?.IS_CLEARING_CHAT_HISTORY && confirmation !== "yes") {
                    connection.IS_CLEARING_CHAT_HISTORY = false;
                    output.push("Clearing chat history aborted.");
                    break;
                }

                const historyLength = await connection?.getHistoryLength();
                if (historyLength && historyLength < 1) {
                    output.push("Nothing to clear.");
                    break;
                }

                connection?.wipeSession(utils.senderId);
                output.push("your chat history has been wiped");
            }
            break;

        case "!help":
            {
                output.push(helpStr );
            }
            break;

        case "!history":
            {
                const history = await connection?.getHistory();

                if (history === undefined) {
                    output.push("Nothing to show." );
                    break;
                }

                let messageOutput = "Preview of your message history:\n\n";
                /*
                    chatObject: object[]
                    properties:
                        - role: string
                        - parts: string[]
                */
                for (const chatObject of history) {
                    if (chatObject === undefined || typeof chatObject.parts === undefined) return;

                    const part = chatObject?.parts[0];

                    if (part === undefined || part.text === undefined) continue;

                    messageOutput += `${chatObject.role}: ${part.text.substring(0, chatHistoryMessagePreviewMaxLength)}\n`;
                }

                output.push(...chunkify(messageOutput));
            }
            break;

        default:
            {
                if (connection !== undefined && typeof utils.senderId === "number" && connection.botType === BOT_TYPES.Messenger) {
                    askGemini(connection, utils.senderId, utils.msg)
                }
            }
            break;
    }
    
    
    return {output, isCommand}
}

export function setupSocketConnectionsObject(connectionsReference: Connections) {
    socketConnectionsReference = connectionsReference;
}

export async function handleSocketFrontendUserMessage(msg: string, socketId: string) {
    if(!socketConnectionsReference)
        throw new SocketConnectionsReferenceNotYetInitializedError("The connections class of the frontend socket server is not yet initialized")
        
    let connection = socketConnectionsReference.getUser(socketId)
    
    if (connection === undefined) {
        try {
            connection = connections.createConnection(socketId);
        } catch (e) {
            //if somehow we are creating a new session when user session already exists
            return ["Oh no! Something went wrong when requesting for a new session, please try again later😢..."];
        }
    }

    connection.updateLastReqTime()
    
    /* no support for server changing for frontend yet */
    
    const result = await processMessage({msg, senderId: socketId}, connection);
    
    if(typeof result === "object")
        return result.isCommand === false ? await connection.ask(msg) : result.output;
}

export async function handleMessengerUserMessage(msg: string, connectionId: number, body: any) {
    
    let connection = connections.getUser(connectionId);

    if (connection === undefined) {
        try {
            connection = connections.createConnection(connectionId);
        } catch (e) {
            //if somehow we are creating a new session when user session already exists
            console.log("Error", e);
            return ["Oh no! Something went wrong when requesting for a new session, please try again later😢..."];
        }
    }
    
    connection.updateLastReqTime()
    removeFromWarningList(connectionId);

    const url = connection?.serverUrl;

    if (url !== "self") return redirectRequest(url as string, body, connectionId);
    
    const result = await processMessage({msg, senderId: connectionId}, connection);
    if(typeof result === "object")
        return result.isCommand === false ? await connection.ask(msg) : result.output;

}
