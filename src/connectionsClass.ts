import { ConnectionsCannotCreateNewConnectionUserAlreadyExistsError } from "./errors";
import Connection from "./connectionClass";
import { send } from "./send";

type ConnectionList = Map<number | string, Connection>

class Connections {
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
    if (!this._list.has(id))return;
    return this._list.get(id)
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
    if (this._list.get(id)) {
      throw new ConnectionsCannotCreateNewConnectionUserAlreadyExistsError("Cannot create a new user connection, user already exists.");
    }
    
    let connection = this._free.shift();
    if(!connection) {
        connection = new Connection(id);
    } else {
        connection.id = id
    }
    
    connection.createSession()
    this._list.set(id, connection)
    return connection;
  }
  
  /**
   * Fetches if the given id is blocked from making a request
   */
  isBlocked(id: number | string) {
    const client = this._list.get(id)
    if (!client)return false;
    return client.isBlocked();
  }

  /**
   * @returns the specified blocked time of the connection associated with the id
   */
  getBlockTimeMS(id: number | string) {
    const connection = this._list.get(id);
    
    if(!connection)return 0
    const blockedTime = (connection.blockedTime + connection.lastReqTime) || 0
    
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
    if (!connection)return;
    connection.destroy();
    this._free.push(connection);
    this._list.delete(id);
  }
  
}

export default Connections;
