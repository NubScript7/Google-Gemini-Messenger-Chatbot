import { hostname } from "node:os";

export const VERSION = "1.6.0";

export enum BOT_TYPES {
    Messenger = "Messenger",
    Frontend = "Frontend",
}

export const HOSTNAME = hostname()
export const upStartTime: number = Date.now();

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
