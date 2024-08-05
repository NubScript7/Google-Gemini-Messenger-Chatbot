import Connection from "./connectionClass";
declare class Connections {
    #private;
    constructor();
    getUser(psid: number): Connection | null;
    createConnection(psid: number): Promise<Connection>;
    isBlocked(psid: number): boolean;
    send(): Promise<boolean>;
    destroySession(psid: number): never;
    isCreatingSession(psid: number): boolean;
    userExists(psid: number): boolean;
}
export default Connections;
