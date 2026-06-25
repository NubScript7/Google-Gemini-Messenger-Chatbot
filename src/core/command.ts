import type { PSID } from "./chatbot/client";
import { ClientFactory } from "./chatbot/connectionManager";
import { HistoryManager } from "./chatbot/history";
import { StateManager } from "./stateManager";

export const PREFIX = "!";
const historyManager = HistoryManager.getInstance()

export type CommandStructure = {
    [commandName: string]: {
        default: string[] | ((id: PSID, ...args: any[]) => string[]);
        run?: (output: string[], id: PSID, ...args: any[]) => void;
    };
};

export const COMMANDS: CommandStructure = {
    v: {
        default: [`app version: ${StateManager.VERSION}`],
    },
    logs: {
        default: ["Currently Disabled."]
        // default: ["Password required."],
        // run: (output: string[], id: number | string, password: string, logIndex: string) => {
        //     if(process.env.LOGS_PASSWORD !== password) {
        //         const connection = connections.getUser(id);

        //         if (connection === undefined) return;
        //         connection.block(Runtime.blockedTimeSeconds)
        //     }

        //     if (process.env.LOGS_PASSWORD === password && !logIndex) {
        //         for (const LOG of LOGS) {
        //             output.push(...chunkify(LOG));
        //         }
        //     }

        //     const LOG_INDEX = parseInt(logIndex);

        //     if (process.env.LOGS_PASSWORD === password && isNaN(LOG_INDEX) && (LOG_INDEX < 0 || LOG_INDEX >= LOGS.length)) {
        //         output.push("LOGS INDEX MUST BE AN INTEGER OR A VALID INDEX RANGE");
        //     }
        // },
    },
    on: {
        default: () => {
            StateManager.ACCCEPT_FB_MESSAGES = true;
            return ["bot online."];
        },
    },
    off: {
        default: () => {
            StateManager.ACCCEPT_FB_MESSAGES = false;
            return ["bot offline."];
        },
    },
    "ch-server": {
        default: ["Currently Disabled."]
        /* default: [servers?.strCache, "Type '!ch-server' then name of the server you want to change to:"],
        run: (output: string[], id: string | number, server: string) => {
            if (!servers.names.includes(server)) return output.push("Server does not exists in selectable servers.");
            
            const serverUrl = servers.servers[server];
            const connection = connections.getUser(id);
            
            if(connection === undefined)
              return;
            
            connection.serverName = server;
            connection.serverUrl = serverUrl;
            output.push("Successfully set selected server.");
        }, */
    },

    help: {
        default: [
            `To use, type the message you want to ask ${StateManager.BOT_NAME} or you could use these commands:\n\n` +
            "!v - get app version\n" +
            "!help - used to print this help message\n" +
            "!ch-server - change the server to ask DigyBot (type '!ch-server' to change current server)\n" +
            "!server - to get the server you are currently on\n" +
            "!modes - used to know about the output modes\n" +
            "!mode - used to get what output mode you are using\n" +
            "!ch-mode - change the output mode (type '!modes' to know about the modes)\n" +
            "!clear - used to clear the chat history from the app\n" +
            "!history - used to print your chat history\n"
        ]
    },

    clear: {
        default(id: PSID) {
            const client = ClientFactory.getInstance().getClient(id)

            client.linkedGeneration.reset(HistoryManager.EMPTY)
            return ["Chat history cleared."];
        }
    },

    history: {
        default(id: PSID) {
            const client = ClientFactory.getInstance().getClient(id)
            const history = historyManager.collection.get(id)
            if (history) {
                history.updateHistory(client.linkedGeneration.chat.getHistory())
                return history.getHistoryPreview()
            }

            return ["Nothing to show..."]
        }
    },

    abort: {
        default: ["Connection termination aborted."],
    },
    
    _default: {
        default: ["That is an invalid command."]
    }
};


export function handleCommand(message: string, id: PSID): [string[], boolean] {
    const output: string[] = [];
    const isCommand = message.startsWith(PREFIX);
    
    const messageArgs: string[] = isCommand ? message.slice(PREFIX.length).split(" ") : [message];
    
    if (typeof messageArgs !== "object" && !Array.isArray(messageArgs)) return [output, isCommand];

    const [commandName, ...args] = messageArgs;
    const command = COMMANDS[commandName] ?? COMMANDS._default;

    if(!isCommand || command === undefined) {
        return [output, isCommand];
    }

    if (messageArgs.length === 1) {
        if (typeof command.default === "function") {
            output.push(...command.default(id, ...args));
        } else {
            output.push(...command.default);
        }
    } else if (typeof command?.run === "function") {
        command.run(output, id, ...args);
    }
    

    return [output, isCommand];
}
