"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMANDS = exports.PREFIX = void 0;
exports.handleCommand = handleCommand;
const chunkify_1 = __importDefault(require("./chunkify"));
const constants_1 = require("./constants");
const geminiWebhook_1 = require("./webhooks/geminiWebhook");
const runtime_1 = require("./runtime");
exports.PREFIX = "!";
exports.COMMANDS = {
    v: {
        default: ["app version:", constants_1.VERSION],
    },
    logs: {
        default: ["Password required."],
        run: (output, id, password, logIndex) => {
            if (process.env.LOGS_PASSWORD !== password) {
                const connection = geminiWebhook_1.connections.getUser(id);
                if (connection === undefined)
                    return;
                connection.block(runtime_1.Runtime.blockedTimeSeconds);
            }
            if (process.env.LOGS_PASSWORD === password && !logIndex) {
                for (const LOG of runtime_1.LOGS) {
                    output.push(...(0, chunkify_1.default)(LOG));
                }
            }
            const LOG_INDEX = parseInt(logIndex);
            if (process.env.LOGS_PASSWORD === password && isNaN(LOG_INDEX) && (LOG_INDEX < 0 || LOG_INDEX >= runtime_1.LOGS.length)) {
                output.push("LOGS INDEX MUST BE AN INTEGER OR A VALID INDEX RANGE");
            }
        },
    },
    on: {
        default: (output, id) => {
            const conn = geminiWebhook_1.connections.getUser(id);
            if (conn) {
                conn.isMuted = true;
            }
            return ["bot online."];
        },
    },
    off: {
        default: (output, id) => {
            const conn = geminiWebhook_1.connections.getUser(id);
            if (conn) {
                conn.isMuted = true;
            }
            return ["bot offline."];
        },
    },
    unli: {
        default: ["password required."],
        run: (output, id, password) => {
            const connection = geminiWebhook_1.connections.getUser(id);
            if (connection === undefined)
                return;
            if (password === process.env.GEMINI_UNLIMITED_GENERATION) {
                connection.bypassUserLimitedGenerationCount();
                output.push("You can now ask unlimited times.");
            }
            else {
                output.push(`Wrong password! Cooldown for ${runtime_1.Runtime.blockedTimeSeconds} seconds...`);
                connection.block(runtime_1.Runtime.blockedTimeSeconds);
            }
        },
    },
    "ch-server": {
        default: ["server changing is disabled right now!"]
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
            `To use, type the message you want to ask ${constants_1.BOT_NAME} or you could use these commands:\n\n` +
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
    abort: {
        default: ["Connection termination aborted."],
    },
    _default: {
        default: ["That is an invalid command."]
    }
};
function handleCommand(message, id) {
    const output = [];
    const isCommand = message.startsWith(exports.PREFIX);
    const messageArgs = isCommand ? message.slice(exports.PREFIX.length).split(" ") : [message];
    if (typeof messageArgs !== "object" && !Array.isArray(messageArgs))
        return [output, isCommand];
    const [commandName, ...args] = messageArgs;
    const command = exports.COMMANDS[commandName] ?? exports.COMMANDS._default;
    if (!isCommand || command === undefined) {
        return [output, isCommand];
    }
    if (messageArgs.length === 1) {
        if (typeof command.default === "function") {
            output.push(...command.default());
        }
        else {
            output.push(...command.default);
        }
    }
    else if (typeof command?.run === "function") {
        command.run(output, id, ...args);
    }
    return [output, isCommand];
}
