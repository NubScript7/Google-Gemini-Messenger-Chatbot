"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiSettings = exports.GeminiSession = void 0;
const genai_1 = require("@google/genai");
const errors_1 = require("./errors");
const constants_1 = require("./constants");
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 2048,
    responseMimeType: "text/plain",
};
/**
 * The settings for `GeminiSession` to use for communicating with gemini.
 */
class GeminiSettings {
    #API_KEY;
    #genAI;
    #INITIALIZED;
    MAX_SESSIONS;
    #ids;
    _emulated;
    _emulatorResponse;
    constructor() {
        this.#INITIALIZED = false;
        this.MAX_SESSIONS = 3;
        this.#ids = new Set();
        this._emulated = false;
        this._emulatorResponse = "EMULATED: DEFAULT RESPONSE";
        this.#API_KEY = "";
        this.#genAI = undefined;
    }
    set emulated(newVal) {
        this._emulated = newVal;
    }
    get emulated() {
        return this._emulated;
    }
    set emulatorResponse(newValue) {
        this._emulatorResponse = newValue;
    }
    get emulatorResponse() {
        return this._emulatorResponse;
    }
    /**
     * Checks if the settings are initialized.
     */
    isInitialized() {
        return this.#INITIALIZED;
    }
    /**
     * Initializes the settings
     * @returns `true` if the initialization was successful.
     * @throws if the api key is invalid.
     */
    init(apiKey) {
        return new Promise((res) => {
            if (!apiKey)
                throw new errors_1.GeminiSettingsApiKeyNotSetError("Cannot initialized, no api key was specified.");
            if (this.isInitialized())
                return console.warn("Gemini already initialized.");
            this.#API_KEY = apiKey;
            this.#genAI = new genai_1.GoogleGenAI({ apiKey });
            this.#INITIALIZED = true;
            res(this.#INITIALIZED);
        });
    }
    /**
     * Asks gemini to generate content based on the given message.
     * Does not support chat history
     * @returns gemini's response
     * @throws if the message was invalid or the setting is not yet initilaized.
     */
    async askOnce(msg) {
        if (!msg || msg?.length === 0)
            throw new errors_1.GeminiSettingsInvalidMessageString("Invalid message string.");
        if (!this.#INITIALIZED)
            throw new errors_1.GeminiSettingsNotYetInitializedError("Cannot create a new chat session, not yet initialized.");
        if (this.emulated)
            return this.emulatorResponse;
        const result = await this.#genAI?.models.generateContent({
            model: "gemini-2.0-flash",
            contents: msg,
        });
        return result?.text;
    }
    /**
     * Fetches the sessions stored.
     * Does not count deleted and uninitialized sessions
     * @returns the number of valid sessions.
     */
    getSessions() {
        return this.#ids.size;
    }
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
    requestSession(id, options) {
        if (typeof id !== "string" && typeof id !== "number")
            throw new errors_1.GeminiSettingsNoIdWasFoundError("Cannot create a new chat session, no psid was given.");
        if (this.#ids.has(id))
            throw new errors_1.GeminiSettingsIdentifierAlreadyHasSessionError("Cannot create a new session the id provided is already a valid session.");
        if (!this.#INITIALIZED)
            throw new errors_1.GeminiSettingsNotYetInitializedError("Cannot create a new chat session, not yet initialized.");
        if (this.#ids.size >= this.MAX_SESSIONS)
            throw new errors_1.GeminiSettingsSpecifiedMaxSessionsReachedError("Cannot create a new session, max sessions has been reached.");
        if (typeof constants_1.BOT_TYPES[options.botType] !== "string")
            throw new errors_1.GeminiSettingsInvalidBotType("Cannot initialize, the given bot type is invalid.");
        if ("string" === typeof options?.instruction)
            throw new errors_1.GeminiSettingsInvalidSystemInstruction("Invalid model system instruction");
        const chat = this.#genAI?.chats.create({
            model: "gemini-2.0-flash",
            config: {
                systemInstruction: "string" === typeof options?.instruction
                    ? options.instruction
                    : `your name is '${constants_1.BOT_NAME}', dont answer in markdown format.`,
            },
            history: [],
        });
        this.#ids.add(id);
        return chat;
    }
    /**
     * Used to destroy a session.
     * Will free up a session for another connection to use.
     */
    requestDestroySession(id) {
        if (this.#ids.has(id))
            this.#ids.delete(id);
    }
}
const geminiSettings = new GeminiSettings();
exports.geminiSettings = geminiSettings;
/**
 * Used to create a new gemini session
 * @throws if the given bot type is invalid
 * @throws if the given identifier is invalid
 */
class GeminiSession {
    #session;
    #id;
    #hasBeenInitialized;
    constructor(botType, id) {
        if (!Object.keys(constants_1.BOT_TYPES).includes(botType))
            throw new errors_1.GeminiSessionNotAvailableError("Cannot create a new chat session, bot type is not available.");
        if (typeof id !== "string" && typeof id !== "number")
            throw new errors_1.GeminiSessionNoIdWasFoundError("Cannot create a new chat session, no id was given.");
        this.#session = undefined;
        this.#id = id;
        this.#hasBeenInitialized = false;
    }
    /**
     * Asks gemini to generate content based on the given message.
     * Does not support chat history
     */
    static askOnce(message) {
        return geminiSettings.askOnce(message);
    }
    /**
     * @returns a boolean indicating whether this session has already been initialized or not.
     */
    hasSession() {
        return undefined !== this.#session;
    }
    /**
     * Initializes this session
     * @throws if this session has been previously initialized.
     */
    createSession() {
        if (this.hasSession())
            throw new errors_1.GeminiSessionAlreadyInitializedError("Cannot create a new session, a previous session was already created.");
        this.#session = geminiSettings.requestSession(this.#id, {
            botType: constants_1.BOT_TYPES.Messenger,
        });
    }
    /**
     * Used to destroy this session
     * @throws if the session is not yet initialized.
     */
    destroySession() {
        if (!this.hasSession())
            throw new errors_1.GeminiSessionNotYetInitializedError("Cannot destroy this session, no session to destroy.");
        geminiSettings.requestDestroySession(this.#id);
        this.#id == null;
        this.#session == null;
    }
    /**
     * Used to destroy then create a new session
     */
    wipeSession(id) {
        if (!this.hasSession())
            throw new errors_1.GeminiSessionNotYetInitializedError("Cannot destroy this session, no session to destroy.");
        this.#session;
        this.#id = id;
        this.createSession();
    }
    /**
     * Used to get history from the current session
     */
    getHistory() {
        if (!this.hasSession())
            throw new errors_1.GeminiSessionNotYetInitializedError("Cannot get user session history, not yet initialized.");
        return this.#session?.getHistory();
    }
    /**
     * Used to generate and retrieve response from gemini in string format
     */
    async ask(message) {
        if (!message || message == "" || "object" !== typeof this.#session)
            throw new errors_1.GeminiSessionCannotAskMessageWasEmptyOrNotInitialized("Message was empty or gemini not yet initialized.");
        if (geminiSettings.emulated)
            return geminiSettings.emulatorResponse;
        const response = await this.#session.sendMessage({ message });
        return response.text;
    }
    /**
     * Used to generate and retrieve response from gemini in chunks
     */
    async askStream(message) {
        if (!message || message == "" || "object" !== typeof this.#session)
            throw new errors_1.GeminiSessionCannotAskMessageWasEmptyOrNotInitialized("Message was empty or gemini not yet initialized.");
        const streamObject = await this.#session.sendMessageStream({ message });
        return streamObject;
    }
}
exports.GeminiSession = GeminiSession;
