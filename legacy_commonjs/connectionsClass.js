const CannotCreateNewConnectionUserAlreadyExistsError = require("./errors/CannotCreateNewConnectionUserAlreadyExistsError");
const Connection = require("./connectionClass");

class Connections {
	#connections;
	#length;
	#connectionsCache;
	#ongoingSessionCreation;

	constructor() {
		this.#connections = {};
		this.#connectionsCache = new Set();
		this.#length = 0;
		this.#ongoingSessionCreation = new Set();
	}

	getUser(psid) {
		if (!this.userExists(psid)) return null;
		return this.#connections[psid];
	}

	createConnection(psid) {
		if (this.userExists(psid))
			throw new CannotCreateNewConnectionUserAlreadyExistsError("Cannot create a new user connection, user already exists.");
		return new Promise((res, rej) => {
			try {
				this.#ongoingSessionCreation.add(psid); //thats why Set is OP, i dont need to check if a value exists to prevent duplicate
				this.#connections[psid] = new Connection(psid);
				this.#length++;
				res(this.#connections[psid]);
				this.#ongoingSessionCreation.delete(psid);
			} catch (e) {
				rej(e);
			}
		});
	}
	
	destroySession(psid) {
		if(!this.userExists(psid))
			return;
		this.#connections[psid].destroy();
	}
	
	isCreatingSession(psid) {
		return this.#ongoingSessionCreation.has(psid);
	}

	userExists(psid) {
		if (this.#connectionsCache.size === this.#length)
			return this.#connectionsCache.has(psid);
		this.#connectionsCache = new Set(Object.keys(this.#connections));
		if (this.#connectionsCache.has(String(psid))) //turned psid into a string because object return number keys as string
			return true;
		return false;
	}
}

module.exports = Connections;
module.exports.default = Connections;