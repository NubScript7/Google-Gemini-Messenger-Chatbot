import Connection from "./connectionClass";
interface ConnectionList {
    [id: number | string]: Connection;
}
declare class Connections {
    #private;
    constructor();
    /**
     * @returns the connection object of an id if there is a connection found associated with id, otherwise undefined.
     * @public
     */
    getUser(id: number | string): Connection | undefined;
    /**
     * @returns all stored valid users
     */
    getUsers(): ConnectionList;
    /**
     * Creates a new `Connection` instance.
     * @returns a connection object.
     * @throws if the identifier given already exists
     */
    createConnection(id: number | string): Connection;
    /**
     * Fetches if the given id is blocked from making a request
     */
    isBlocked(id: number | string): boolean;
    /**
     * @returns the specified blocked time of the connection associated with the id
     */
    getBlockTimeMS(id: number | string): number;
    /**
     * Sends a message to every connection.
     * @returns a promise that always returns `true` to signal that all messages has been sent.
     */
    send(message: string): Promise<boolean>;
    /**
     * Destroys the connection of an id referencing to it.
     */
    destroySession(id: number | string): void;
    /**
     * Checks if the creation of a connection of an id is still ongoing.
     */
    isCreatingSession(psid: number | string): boolean;
    /**
     * Fetches if the given id is a valid connection.
     */
    userExists(id: number | string): boolean;
}
export default Connections;
