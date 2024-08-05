const { networkInterfaces } = require("os");

const nt = networkInterfaces();

const getNetworkAddress = () => {
	for (const nid of Object.values(nt)) {
		if(!nid)
			continue;
		for(const d of nid) {
			const { addr, fam, intr } = d;
			if(fam === "IPv4" && !intr)
				return addr;
		}
	}
};

module.exports = {
	nt,
	getNetworkAddress
};

module.exports.default = {
	nt,
	getNetworkAddress
};