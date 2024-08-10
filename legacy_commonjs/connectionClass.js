const CreateNewClientConnectionInvalidPsidError = require("./errors/CreateNewClientConnectionInvalidPsidError");
const { GeminiSession } = require("./gemini");

class Connection {
	#userId;
	#reqCount;
	#gemini;
	#lastReqTime;

	constructor(psid) {
		if (!psid || "number" !== typeof psid)
			throw new CreateNewClientConnectionInvalidPsidError(
				"Cannot create a new client connection, invalid psid."
			);
		this.#userId = psid;
		this.#reqCount = 0;
		this.session = new GeminiSession(psid);
		this.#lastReqTime = Date.now();
		this.serverUrl = "self";
		this.serverName = "[default (self)]";
		this.mode = "aftercomplete";
	}
	
	getHistory() {
		return this.session.gethistory();
	}
	
	setmode(mode) {
		this.mode = mode;
	}
	
	setUrlName(name, url) {
		this.serverName = name;
		this.serverUrl = url;
	}
	
	destroy() {
		this.#userId = null;
		this.#reqCount = 0;
		this.session.clearChatHistory();
	}
	
}

module.exports = Connection;
module.exports.default = Connection;