import Connection from "./connectionClass";
import Connections from "./connectionsClass";
type processMessageUtilsObject = {
    msg: string;
    senderId: number | string;
};
export declare let socketConnectionsReference: Connections;
export declare function processMessage(utils: processMessageUtilsObject, connection: Connection): Promise<{
    output: string[];
    isCommand: boolean;
}>;
export declare function setupSocketConnectionsObject(connectionsReference: Connections): void;
export declare function handleSocketFrontendUserMessage(msg: string, socketId: string): Promise<string | false | string[] | undefined>;
export declare function handleMessengerUserMessage(msg: string, connectionId: number, body: any): Promise<void | string[]>;
export {};
