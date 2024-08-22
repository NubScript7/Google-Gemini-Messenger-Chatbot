import chunkify from "./chunkify";
import { LOGS, connections, mainRuntimeUtils, no_new_requests, relisten_on_new_requests, servers } from "./main";

export const PREFIX = "!";
let VERSION: string = "";

export type CommandStructure = {
    [commandName: string]: {
        default: string[] | ((...args: any) => string[]);
        run?: (output: string[], ...args: any[]) => void;
    };
};

export const COMMANDS: CommandStructure = {
    v: {
        default: ["app version:", VERSION],
    },
    logs: {
        default: ["Password required."],
        run: (output: string[], id: number | string, password: string, logIndex: string) => {
            if (process.env.LOGS_PASSWORD === password && !logIndex) {
                for (const LOG of LOGS) {
                    output.push(...chunkify(LOG));
                }
            }

            const LOG_INDEX = parseInt(logIndex);

            if (process.env.LOGS_PASSWORD === password && isNaN(LOG_INDEX) && (LOG_INDEX < 0 || LOG_INDEX >= LOGS.length)) {
                output.push("LOGS INDEX MUST BE AN INTEGER OR A VALID INDEX RANGE");
            }
        },
    },
    on: {
        default: () => {
            relisten_on_new_requests();
            return ["bot online."];
        },
    },
    off: {
        default: () => {
            no_new_requests();
            return ["bot offline."];
        },
    },
    unli: {
        default: ["password required."],
        run: (output: string[], id: number | string, password: string) => {
            const connection = connections.getUser(id);

            if (connection === undefined) return;

            if (password === process.env.GEMINI_UNLIMITED_GENERATION) {
                connection.bypassUserLimitedGenerationCount();
                output.push("You can now ask unlimited times.");
            } else {
                output.push("Wrong password! Cooldown for 5 minutes...");
                connection.block(mainRuntimeUtils.blockedTimeSeconds);
            }
        },
    },
    "ch-server": {
        default: [servers?.strCache, "Type '!ch-server' then name of the server you want to change to:"],
        run: (output: string[], id: string | number, server: string) => {
            if (!servers.names.includes(server)) return output.push("Server does not exists in selectable servers.");
            
            const serverUrl = servers.servers[server];
            const connection = connections.getUser(id);
            
            if(connection === undefined)
              return;
            
            connection.serverName = server;
            connection.serverUrl = serverUrl;
            output.push("Successfully set selected server.");
        },
    },
};

export function passAppVersion(version: string) {
    VERSION = version;
}

export function handleCommand(message: string, id: number | string): [string[], boolean] {
    const output: string[] = [];
    const isCommand = message.startsWith(PREFIX);
    
    const messageArgs: string[] = isCommand ? message.slice(PREFIX.length).split(" ") : [message];
    
    if (typeof messageArgs !== "object" && !Array.isArray(messageArgs)) return [output, isCommand];

    const [commandName, ...args] = messageArgs;
    const command = isCommand ? COMMANDS[commandName] : void 0;

    if (command === undefined) return [output, isCommand];

    if (messageArgs.length === 1) {
        if (typeof command.default === "function") {
            output.push(...command.default());
        } else {
            output.push(...command.default);
        }
    } else if (typeof command?.run === "function") {
        command.run(output, id, ...args);
    }
    console.log(output);
    

    return [output, isCommand];
}
