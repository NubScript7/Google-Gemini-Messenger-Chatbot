class Servers {
	
	constructor() {
		this.servers = {};
		this.names = [];
		this.strCache = "Servers not yet initialized.";
		this.main = "self";
	}
	
}

module.exports = Servers;
module.exports.default = Servers;