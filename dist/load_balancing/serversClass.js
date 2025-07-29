"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.servers = void 0;
const constants_1 = require("../constants");
class Servers {
    servers;
    names;
    strCache;
    main;
    constructor() {
        this.servers = {};
        this.names = [];
        this.strCache = "Servers not yet initialized.";
        this.main = "self";
    }
}
exports.servers = new Servers;
if (typeof process.env.SERVERS === "string") {
    process.env.SERVERS.split("|").forEach((serverStr) => {
        const [serverName, serverDomain] = serverStr.split(":");
        exports.servers.servers[serverName] = `${serverDomain}/generative-ai/api/v1/webhook`;
        exports.servers.names.push(serverName);
        if (constants_1.HOSTNAME === serverDomain)
            exports.servers.main = constants_1.HOSTNAME;
    });
}
