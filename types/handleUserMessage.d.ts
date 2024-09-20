import Connection from "./connectionClass";
import Connections from "./connectionsClass";
type processMessageUtilsObject = {
    msg: string;
    senderId: number | string;
};
export declare let socketConnectionsReference: Connections;
export declare function askGemini(connection: Connection, psid: number, msg: string): void;
export declare function processMessage(utils: processMessageUtilsObject, connection: Connection): Promise<number | {
    output: string[];
    isCommand: boolean;
} | undefined>;
export declare function setupSocketConnectionsObject(connectionsReference: Connections): void;
export declare function handleSocketFrontendUserMessage(msg: string, socketId: string): Promise<string | string[] | undefined>;
export declare function handleMessengerUserMessage(msg: string, connectionId: number, body: any): Promise<string | void | string[]>;
export {};
