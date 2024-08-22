/// <reference types="node" />
import { geminiSettings } from "./gemini";
import Net from "./netClass";
import Connections from "./connectionsClass";
import Connection from "./connectionClass";
import Servers from "./serversClass";
import { __settings } from "./send";
export declare const VERSION = "1.5.5";
export declare const upStartTime: number;
export declare enum BOT_TYPES {
    Messenger = "Messenger",
    Frontend = "Frontend"
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
declare const mainRuntimeUtils: MainRuntileUtils;
declare const appServer: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
declare const userMaxMessageRequestPerMinute: number;
declare const maxUsersPerServer: number;
declare const serverMaxAvailableMassRequests: number;
declare const chatHistoryMessagePreviewMaxLength: number;
declare const sendMaxCount: number;
declare const net: Net;
declare const servers: Servers;
declare const connections: Connections;
export declare const LOGS: string[];
declare function updateAvailableServers(): string;
export declare function no_new_requests(): void;
export declare function relisten_on_new_requests(): void;
export declare function redirectRequest(url: string, body: object, id: number): void;
export declare function askGemini(connection: Connection, psid: number, msg: string): void;
export declare const helpStr: string;
export declare const modesArr: string[];
export declare const modesStr: string;
export { appServer, net, servers, geminiSettings, connections, updateAvailableServers, userMaxMessageRequestPerMinute, maxUsersPerServer, serverMaxAvailableMassRequests, chatHistoryMessagePreviewMaxLength, sendMaxCount, __settings, mainRuntimeUtils, };
