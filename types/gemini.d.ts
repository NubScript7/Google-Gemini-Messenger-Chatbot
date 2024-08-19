import { ChatSession, Content } from "@google/generative-ai";
import { BOT_TYPES } from "./main";
interface GeminiSessionOptions {
    botType: BOT_TYPES;
    instruction?: string;
}
/**
 * The settings for `GeminiSession` to use for communicating with gemini.
*/
declare class GeminiSettings {
    #private;
    private _emulated;
    private _emulatorResponse;
    constructor();
    set emulated(newVal: boolean);
    get emulated(): boolean;
    set emulatorResponse(newValue: string);
    get emulatorResponse(): string;
    /**
     * Checks if the settings are initialized.
     */
    isInitialized(): boolean;
    /**
     * Initializes the settings
     * @returns `true` if the initialization was successful.
     * @throws if the api key is invalid.
     */
    init(apiKey: string): Promise<boolean>;
    /**
     * Asks gemini to generate content based on the given message.
     * Does not support chat history
     * @returns gemini's response
     * @throws if the message was invalid or the setting is not yet initilaized.
     */
    askOnce(msg: string): Promise<string | undefined>;
    /**
     * Fetches the sessions stored.
     * Does not count deleted and uninitialized sessions
     * @returns the number of valid sessions.
     */
    getSessions(): number;
    /**
     * Used to initialize a session.
     * @returns the created session
     * @throws if no identifier was given.
     * @throws if the identifier given has already initialized a session.
     * @throws if the settings is not yet initialized.
     * @throws if the specified max sessions has been reached.
     * @throws if the given bot type is not a valid bot type, see `BOT_TYPES`.
     * @throws if the given system instruction for a session is invalid.
     */
    requestSession(id: geminiSessionId, options: GeminiSessionOptions): ChatSession | undefined;
    /**
     * Used to destroy a session.
     * Will free up a session for another connection to use.
     */
    requestDestroySession(id: geminiSessionId): void;
}
declare const geminiSettings: GeminiSettings;
type geminiSessionId = string | number;
/**
 * Used to create a new gemini session
 * @throws if the given bot type is invalid
 * @throws if the given identifier is invalid
 */
declare class GeminiSession {
    #private;
    constructor(botType: string, id: geminiSessionId);
    /**
     * Asks gemini to generate content based on the given message.
     * Does not support chat history
     */
    static askOnce(message: string): Promise<string | undefined>;
    /**
     * @returns a boolean indicating whether this session has already been initialized or not.
     */
    hasSession(): boolean;
    /**
     * Initializes this session
     * @throws if this session has been previously initialized.
     */
    createSession(): void;
    /**
     * Used to destroy this session
     * @throws if the session is not yet initialized.
     */
    destroySession(): void;
    /**
     * Used to destroy then create a new session
     */
    wipeSession(id: geminiSessionId): void;
    /**
     * Used to get history from the current session
    */
    getHistory(): Promise<Content[]> | undefined;
    /**
     * Used to generate and retrieve response from gemini in string format
    */
    ask(message: string): Promise<string>;
    /**
     * Used to generate and retrieve response from gemini in chunks
    */
    askStream(message: string): Promise<AsyncGenerator<import("@google/generative-ai").EnhancedGenerateContentResponse, any, unknown>>;
}
export { GeminiSession, geminiSettings };
