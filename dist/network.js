"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
const nt = (0, os_1.networkInterfaces)();
const getNetworkAddress = () => {
    for (const nid of Object.values(nt)) {
        if (!nid)
            continue;
        for (const d of nid) {
            const { address: addr, family: fam, internal: intr } = d;
            if (fam === "IPv4" && !intr)
                return addr;
        }
    }
    return void 0;
};
exports.default = getNetworkAddress;
