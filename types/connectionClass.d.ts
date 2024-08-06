import { BOT_TYPES } from "./botTypes";
/**
 * Used to create a new client connection
 *
 * When no bot type was specified, defaults to `BOT_TYPES.Messenger`
 */
declare class Connection {
    #private;
    botType: string;
    lastReqTime: number;
    lastActiveTime: number;
    private _isWaiting;
    private _serverUrl;
    private _serverName;
    private _mode;
    blockedTime: number;
    IS_CLEARING_CHAT_HISTORY: boolean;
    constructor(id: number | string, botType?: BOT_TYPES | string);
    /**
     * @returns a boolean indication the connection has a session initialized.
     */
    hasSession(): boolean;
    /**
     * @returns the id of this connection.
     */
    getId(): string | number;
    /**
     * @returns the chat history so far of this connection.
     */
    getHistory(): Promise<import("@google/generative-ai").Content[]> | undefined;
    /**
     * Initializes the current connection's session.
     * @throws if the session is not yet initialized.
     */
    createSession(): void;
    get isWaiting(): boolean;
    /**
     * Used to ask gemini to generate a response
     * @returns the generated response string
     * @throws if the passed `msg` parameter is invalid or the current connection's session is not yet initialized
     */
    ask(msg: string): Promise<string | false>;
    /**
     * Fetches the current chat history so far and get its length.
     * @returns the length of the current chat session so far, if the session is not yet initialized returns null.
     */
    getHistoryLength(): Promise<number | null | undefined>;
    /**
     * Wipes the previous session and creates a new one.
     */
    wipeSession(id: string | number): void;
    get serverName(): string;
    set serverName(newServerName: string);
    get serverUrl(): string;
    set serverUrl(newUrl: string);
    /**
     * Sets this connection to never get limited gemini generation count.
     */
    bypassUserLimitedGenerationCount(): boolean;
    get mode(): string;
    set mode(mode: string);
    /**
     * Block a connection by a specified number of seconds
     */
    block(s: number): void;
    /**
     * @returns a boolean indicating if the current connection is blocked
     */
    isBlocked(): boolean;
    /**
     * destroys this connection.
     */
    destroy(): void;
    /**
     * @returns a boolean indicating whether the connection has been destroyed.
     */
    isDestroyed(): boolean;
}
export default Connection;
