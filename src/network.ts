import { networkInterfaces as getNetworkInterfaces } from "os";

const nt = getNetworkInterfaces();
 
const getNetworkAddress = (): string | void => {
	for (const nid of Object.values(nt)) {
		if(!nid)
			continue;
		for(const d of nid) {
			const { address: addr, family: fam, internal: intr } = d;
			if(fam === "IPv4" && !intr)
				return addr;
		}
	}
	return void 0;
};

export default getNetworkAddress;