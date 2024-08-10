import { ConnectionsCannotCreateNewConnectionUserAlreadyExistsError } from "./errors";
import Connection from "./connectionClass";
import { send } from "./send";

interface ConnectionList {
  [id: number | string]: Connection;
}

class Connections {
  #connections: ConnectionList;
  #reuseableConnections: Connection[];
  #connectionsCache: Set<number | string>;
  #ongoingSessionCreation: Set<number | string>;

  constructor() {
    this.#connections = {};
    this.#connectionsCache = new Set();
    this.#ongoingSessionCreation = new Set();
    this.#reuseableConnections = [];
  }
  
  /**
   * @returns the connection object of an id if there is a connection found associated with id, otherwise undefined.
   * @public
   */
  getUser(id: number | string) {
    if (!this.userExists(id)) return undefined;
    return this.#connections[id];
  }

  /**
   * @returns all stored valid users
   */
  getUsers() {
    return this.#connections;
  }
  
  /**
   * Creates a new `Connection` instance.
   * @returns a connection object.
   * @throws if the identifier given already exists
   */
  createConnection(id: number | string) {
    if (this.userExists(id))
      throw new ConnectionsCannotCreateNewConnectionUserAlreadyExistsError(
        "Cannot create a new user connection, user already exists."
      );

    
      this.#ongoingSessionCreation.add(id);
    if(this.#reuseableConnections.length >= 1) {
      const connection = this.#reuseableConnections.shift();
        //@ts-ignore
        this.#connections[id] = connection;

    } else {
      this.#connections[id] = new Connection(id);
    }
    this.#connections[id].createSession();
    this.#ongoingSessionCreation.delete(id);
    this.#connectionsCache.add(id);
    return this.#connections[id];
  }
  
  /**
   * Fetches if the given id is blocked from making a request
   */
  isBlocked(id: number | string) {
    if (!this.userExists(id)) return false;
    return this.#connections[id].isBlocked();
  }

  /**
   * @returns the specified blocked time of the connection associated with the id
   */
  getBlockTimeMS(id: number | string) {
    if (!this.userExists(id)) return 0;
    const connection = this.#connections[id];
    const blockedTime = connection.blockedTime + connection.lastReqTime;
    console.log(blockedTime);
    
    return blockedTime;
  }
  
  /**
   * Sends a message to every connection.
   * @returns a promise that always returns `true` to signal that all messages has been sent.
   */
  async send(message: string) {
      for (const psid of this.#connectionsCache) {
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
    if (!this.userExists(id)) return void 0;
    const connection = this.#connections[id];
    connection.destroy();
    this.#reuseableConnections.push(connection);
    delete this.#connections[id];
    this.#connectionsCache.delete(id);
  }

  /**
   * Checks if the creation of a connection of an id is still ongoing.
   */
  isCreatingSession(psid: number | string) {
    return this.#ongoingSessionCreation.has(psid);
  }
  
  /**
   * Fetches if the given id is a valid connection.
   */
  userExists(id: number | string) {
    if (this.#connectionsCache.has(id))
      return true;
    return false;
  }
}

export default Connections;
