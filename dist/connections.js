"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connections = exports.Connection = void 0;
const constants_1 = require("./constants");
const convert_1 = require("./convert");
const errors_1 = require("./errors");
const gemini_1 = require("./gemini");
/**
 * Used to create a new client connection
 *
 * When no bot type was specified, defaults to `BOT_TYPES.Messenger`
 */
class Connection {
    #reqCount; /* implement a request limit */
    botType;
    _id;
    lastReqTime;
    #isUserUnli;
    #session;
    _isWaiting;
    _serverUrl;
    _serverName;
    _mode;
    isMuted;
    blockedTime;
    IS_CLEARING_CHAT_HISTORY;
    constructor(id, botType) {
        if ("number" !== typeof id && "string" !== typeof id)
            throw new errors_1.ConnectionCannotCreateNewClientConnectionInvalidIdError("Cannot create a new client connection, psid must be a type of number or string.");
        if (!botType)
            botType = constants_1.BOT_TYPES.Messenger;
        this.botType = botType;
        this._id = id;
        this.#reqCount = 0;
        this.#session = new gemini_1.GeminiSession(botType, id);
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
    set id(id) {
        this.updateLastReqTime();
        this._id = id;
    }
    get id() {
        return this._id;
    }
    updateLastReqTime() {
        if (this.blockedTime > 0 && !this.isBlocked())
            this.blockedTime = 0;
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
        if (this.#session === undefined)
            return undefined;
        return this.#session.getHistory();
    }
    /**
     * Initializes the current connection's session.
     * @throws if the session is not yet initialized.
     */
    createSession() {
        if (this.#session === undefined)
            throw new errors_1.GeminiSessionNotYetInitializedError("Gemini sesssion not yet inilialized.");
        this.updateLastReqTime();
        this.#session.createSession();
    }
    /**
     * Used to ask gemini to generate a response
     * @returns the generated response string
     * @throws if the passed `msg` parameter is invalid or the current connection's session is not yet initialized
     */
    async ask(msg) {
        if (this.isMuted || this._isWaiting)
            return false;
        if (!msg || msg == "" || "object" !== typeof this.#session)
            throw new errors_1.ConnectionNotYetInitializedOrMessageWasEmptyError("Message was empty or gemini is not yet initialized.");
        this._isWaiting = true;
        try {
            const response = await this.#session.ask(msg);
            this.updateLastReqTime();
            this.#reqCount++;
            this._isWaiting = false;
            return response;
        }
        catch (e) {
            this._isWaiting = false;
            throw e;
        }
    }
    /**
     * Fetches the current chat history so far and get its length.
     * @returns the length of the current chat session so far, if the session is not yet initialized returns null.
     */
    async getHistoryLength() {
        if (this.#session === undefined)
            return null;
        return (await this.#session.getHistory())?.length;
    }
    /**
     * Wipes the previous session and creates a new one.
     */
    wipeSession(id) {
        if (this.#session === undefined)
            throw new errors_1.GeminiSessionNotYetInitializedError("Cannot wipe this session, not yet initialized. Cannot request for a new Session.");
        this.#session.wipeSession(id);
    }
    get serverName() {
        return this._serverName;
    }
    set serverName(newServerName) {
        this._serverName = newServerName;
    }
    get serverUrl() {
        return this._serverUrl;
    }
    set serverUrl(newUrl) {
        this._serverUrl = newUrl;
    }
    /**
     * Sets this connection to never get limited gemini generation count.
     */
    bypassUserLimitedGenerationCount() {
        if (this.#isUserUnli)
            return true;
        return (this.#isUserUnli = true);
    }
    get mode() {
        return this._mode;
    }
    set mode(mode) {
        this._mode = mode;
    }
    /**
     * Blocks this connection by a specified number of seconds
     */
    block(s) {
        this.lastReqTime = Date.now();
        this.blockedTime = (0, convert_1.secToMs)(s);
    }
    /**
     * @returns a boolean indicating if the current connection is blocked
     */
    isBlocked() {
        return (this.blockedTime !== 0 &&
            this.blockedTime + this.lastReqTime >= Date.now());
    }
    /**
     * destroys this connection.
     */
    destroy() {
        this._id = -1;
        this.#reqCount = 0;
        this.#session?.destroySession();
        this.#session = new gemini_1.GeminiSession(this.botType, this._id);
    }
    /**
     * @returns a boolean indicating whether the connection has been destroyed.
     */
    isDestroyed() {
        return this.#session === undefined;
    }
}
exports.Connection = Connection;
const errors_2 = require("./errors");
const send_1 = require("./send");
class Connections {
    _list;
    _free;
    constructor() {
        this._list = new Map();
        this._free = [];
    }
    /**
     * @returns the connection object of an id if there is a connection found associated with id, otherwise undefined.
     * @public
     */
    getUser(id) {
        if (!this._list.has(id))
            return;
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
    createConnection(id) {
        if (gemini_1.geminiSettings.getSessions() >= gemini_1.geminiSettings.MAX_SESSIONS)
            throw new errors_1.GeminiSettingsSpecifiedMaxSessionsReachedError("Cannot create a new session, max sessions has been reached.");
        if (this._list.get(id)) {
            throw new errors_2.ConnectionsCannotCreateNewConnectionUserAlreadyExistsError("Cannot create a new user connection, user already exists.");
        }
        let connection = this._free.shift();
        if (!connection) {
            connection = new Connection(id);
        }
        else {
            connection.id = id;
        }
        connection.createSession();
        this._list.set(id, connection);
        return connection;
    }
    /**
     * Fetches if the given id is blocked from making a request
     */
    isBlocked(id) {
        const client = this._list.get(id);
        if (!client)
            return false;
        return client.isBlocked();
    }
    /**
     * @returns if the connection is muted
     */
    isMuted(id) {
        const client = this._list.get(id);
        if (!client)
            return false;
        return client.isMuted;
    }
    /**
     * @returns the specified blocked time of the connection associated with the id
     */
    getBlockTimeMS(id) {
        const connection = this._list.get(id);
        if (!connection)
            return 0;
        const blockedTime = connection.blockedTime + connection.lastReqTime || 0;
        return blockedTime;
    }
    /**
     * Sends a message to every connection.
     * @returns a promise that always returns `true` to signal that all messages has been sent.
     */
    async send(message) {
        for (const psid of this._list.keys()) {
            try {
                await (0, send_1.send)({ id: psid, msg: message });
            }
            catch {
                console.log("Failed to send message. (mass sending)");
            }
        }
        return true;
    }
    /**
     * Destroys the connection of an id referencing to it.
     */
    destroySession(id) {
        const connection = this._list.get(id);
        if (!connection)
            return;
        connection.destroy();
        this._free.push(connection);
        this._list.delete(id);
    }
}
exports.Connections = Connections;
