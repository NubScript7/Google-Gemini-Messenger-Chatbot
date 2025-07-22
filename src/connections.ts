import { BOT_TYPES } from "./constants";
import { secToMs } from "./convert";
import {
    ConnectionCannotCreateNewClientConnectionInvalidIdError,
    ConnectionNotYetInitializedOrMessageWasEmptyError,
    GeminiSessionNotYetInitializedError,
    GeminiSettingsSpecifiedMaxSessionsReachedError,
} from "./errors";
import { GeminiSession, geminiSettings } from "./gemini";

/**
 * Used to create a new client connection
 *
 * When no bot type was specified, defaults to `BOT_TYPES.Messenger`
 */
export class Connection {
    #reqCount: number; /* implement a request limit */
    botType: string;
    _id: number | string;
    lastReqTime: number;
    #isUserUnli: boolean;
    #session: GeminiSession | undefined;
    private _isWaiting: boolean;
    private _serverUrl: string;
    private _serverName: string;
    private _mode: string;
    public isMuted: boolean;
    public blockedTime: number;
    public IS_CLEARING_CHAT_HISTORY: boolean;

    constructor(id: number | string, botType?: BOT_TYPES | string) {
        if ("number" !== typeof id && "string" !== typeof id)
            throw new ConnectionCannotCreateNewClientConnectionInvalidIdError(
                "Cannot create a new client connection, psid must be a type of number or string."
            );
        if (!botType) botType = BOT_TYPES.Messenger;
        this.botType = botType;
        this._id = id;
        this.#reqCount = 0;
        this.#session = new GeminiSession(botType, id);
        this.lastReqTime = Date.now();
        this._isWaiting = false;
        this.#isUserUnli = false;
        this._serverUrl = "self";
        this._serverName = "[default (self)]";
        this._mode = "aftercomplete";
        this.isMuted = false;
        this.blockedTime = 0;
        this.IS_CLEARING_CHAT_HISTORY = false;
    }

    set id(id: number | string) {
        this.updateLastReqTime();
        this._id = id;
    }

    get id() {
        return this._id;
    }

    updateLastReqTime() {
        if (this.blockedTime > 0 && !this.isBlocked()) this.blockedTime = 0;

        this.lastReqTime = Date.now();
    }

    /**
     * @returns a boolean indication the connection has a session initialized.
     */
    hasSession() {
        return this.#session !== undefined;
    }

    /**
     * @returns the chat history so far of this connection.
     */
    getHistory() {
        this.updateLastReqTime();
        if (this.#session === undefined) return undefined;

        return this.#session.getHistory();
    }

    /**
     * Initializes the current connection's session.
     * @throws if the session is not yet initialized.
     */
    createSession() {
        if (this.#session === undefined)
            throw new GeminiSessionNotYetInitializedError(
                "Gemini sesssion not yet inilialized."
            );
        this.updateLastReqTime();
        this.#session.createSession();
    }

    /**
     * Used to ask gemini to generate a response
     * @returns the generated response string
     * @throws if the passed `msg` parameter is invalid or the current connection's session is not yet initialized
     */
    async ask(msg: string) {
        if (this.isMuted || this._isWaiting) return false;
        if (!msg || msg == "" || "object" !== typeof this.#session)
            throw new ConnectionNotYetInitializedOrMessageWasEmptyError(
                "Message was empty or gemini is not yet initialized."
            );

        this._isWaiting = true;
        try {
            const response = await this.#session.ask(msg);
            this.updateLastReqTime();
            this.#reqCount++;
            this._isWaiting = false;
            return response;
        } catch (e) {
            this._isWaiting = false;
            throw e;
        }
    }

    /**
     * Fetches the current chat history so far and get its length.
     * @returns the length of the current chat session so far, if the session is not yet initialized returns null.
     */
    async getHistoryLength() {
        if (this.#session === undefined) return null;
        return (await this.#session.getHistory())?.length;
    }

    /**
     * Wipes the previous session and creates a new one.
     */
    wipeSession(id: string | number) {
        if (this.#session === undefined)
            throw new GeminiSessionNotYetInitializedError(
                "Cannot wipe this session, not yet initialized. Cannot request for a new Session."
            );
        this.#session.wipeSession(id);
    }

    get serverName() {
        return this._serverName;
    }

    set serverName(newServerName: string) {
        this._serverName = newServerName;
    }

    get serverUrl() {
        return this._serverUrl;
    }

    set serverUrl(newUrl: string) {
        this._serverUrl = newUrl;
    }

    /**
     * Sets this connection to never get limited gemini generation count.
     */
    bypassUserLimitedGenerationCount() {
        if (this.#isUserUnli) return true;
        return (this.#isUserUnli = true);
    }

    get mode() {
        return this._mode;
    }

    set mode(mode: string) {
        this._mode = mode;
    }

    /**
     * Blocks this connection by a specified number of seconds
     */
    block(s: number) {
        this.lastReqTime = Date.now();
        this.blockedTime = secToMs(s);
    }

    /**
     * @returns a boolean indicating if the current connection is blocked
     */
    isBlocked() {
        return (
            this.blockedTime !== 0 &&
            this.blockedTime + this.lastReqTime >= Date.now()
        );
    }

    /**
     * destroys this connection.
     */
    destroy() {
        this._id = -1;
        this.#reqCount = 0;
        this.#session?.destroySession();
        this.#session = new GeminiSession(this.botType, this._id);
    }

    /**
     * @returns a boolean indicating whether the connection has been destroyed.
     */
    isDestroyed() {
        return this.#session === undefined;
    }
}

import { ConnectionsCannotCreateNewConnectionUserAlreadyExistsError } from "./errors";
import { send } from "./send";

type ConnectionList = Map<number | string, Connection>;

export class Connections {
    _list: ConnectionList;
    _free: Connection[];

    constructor() {
        this._list = new Map();
        this._free = [];
    }

    /**
     * @returns the connection object of an id if there is a connection found associated with id, otherwise undefined.
     * @public
     */
    getUser(id: number | string) {
        if (!this._list.has(id)) return;
        return this._list.get(id);
    }

    /**
     * @returns all stored valid users
     */
    getUsers() {
        return this._list.values();
    }

    /**
     * Creates a new `Connection` instance.
     * @returns a connection object.
     * @throws if the identifier given already exists
     */
    createConnection(id: number | string) {
        if (geminiSettings.getSessions() >= geminiSettings.MAX_SESSIONS)
            throw new GeminiSettingsSpecifiedMaxSessionsReachedError(
                "Cannot create a new session, max sessions has been reached."
            );

        if (this._list.get(id)) {
            throw new ConnectionsCannotCreateNewConnectionUserAlreadyExistsError(
                "Cannot create a new user connection, user already exists."
            );
        }

        let connection = this._free.shift();
        if (!connection) {
            connection = new Connection(id);
        } else {
            connection.id = id;
        }

        connection.createSession();
        this._list.set(id, connection);
        return connection;
    }

    /**
     * Fetches if the given id is blocked from making a request
     */
    isBlocked(id: number | string) {
        const client = this._list.get(id);
        if (!client) return false;
        return client.isBlocked();
    }

    /**
     * @returns if the connection is muted
     */
    isMuted(id: number | string) {
        const client = this._list.get(id);
        if (!client) return false;
        return client.isMuted;
    }

    /**
     * @returns the specified blocked time of the connection associated with the id
     */
    getBlockTimeMS(id: number | string) {
        const connection = this._list.get(id);

        if (!connection) return 0;
        const blockedTime =
            connection.blockedTime + connection.lastReqTime || 0;

        return blockedTime;
    }

    /**
     * Sends a message to every connection.
     * @returns a promise that always returns `true` to signal that all messages has been sent.
     */
    async send(message: string) {
        for (const psid of this._list.keys()) {
            try {
                await send({ id: psid, msg: message });
            } catch {
                console.log("Failed to send message. (mass sending)");
            }
        }
        return true;
    }

    /**
     * Destroys the connection of an id referencing to it.
     */
    destroySession(id: number | string): void {
        const connection = this._list.get(id);
        if (!connection) return;
        connection.destroy();
        this._free.push(connection);
        this._list.delete(id);
    }
}
