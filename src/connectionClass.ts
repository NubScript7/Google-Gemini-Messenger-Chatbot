import { BOT_TYPES } from "./main";
import { secToMs } from "./convert";
import { ConnectionCannotCreateNewClientConnectionInvalidIdError, ConnectionNotYetInitializedOrMessageWasEmptyError, GeminiSessionNotYetInitializedError } from "./errors";
import { GeminiSession } from "./gemini";

  /**
   * Used to create a new client connection
   *
   * When no bot type was specified, defaults to `BOT_TYPES.Messenger`
   */
class Connection {
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
    this.blockedTime = 0;
    this.IS_CLEARING_CHAT_HISTORY = false;
  }
  
  set id(id: number | string) {
    this.updateLastReqTime()
    this._id = id
  }
  
  get id() {
    return this._id
  }

  updateLastReqTime() {
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
    this.updateLastReqTime()
    if(this.#session === undefined)
        return undefined;
    
    return this.#session.getHistory();
  }

  /**
   * Initializes the current connection's session.
   * @throws if the session is not yet initialized.
   */
  createSession() {
    if(this.#session === undefined)
       throw new GeminiSessionNotYetInitializedError("Gemini sesssion not yet inilialized.")
    this.updateLastReqTime()
    this.#session.createSession();
  }

  /**
   * Used to ask gemini to generate a response
   * @returns the generated response string
   * @throws if the passed `msg` parameter is invalid or the current connection's session is not yet initialized
   */
  async ask(msg: string) {
    if (this._isWaiting) return;
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
    } catch(e) {
      this._isWaiting = false;
      throw e;
    }
    
  }

  /**
   * Fetches the current chat history so far and get its length.
   * @returns the length of the current chat session so far, if the session is not yet initialized returns null.
   */
  async getHistoryLength() {
    if(this.#session === undefined)
      return null;
    return (await this.#session.getHistory())?.length;
  }
  
  /**
   * Wipes the previous session and creates a new one.
   */
  wipeSession(id: string | number) {
    if(this.#session === undefined)
      throw new GeminiSessionNotYetInitializedError("Cannot wipe this session, not yet initialized. Cannot request for a new Session.")
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

export default Connection;
