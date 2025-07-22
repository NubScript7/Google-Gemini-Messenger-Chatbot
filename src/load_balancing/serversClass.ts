import { HOSTNAME } from "../constants";

export interface ServersListObject {
  [serverName: string]: string;
}

class Servers {
  public servers: ServersListObject;
  public names: string[];
  public strCache: string;
  public main: string;

  constructor() {
    this.servers = {};
    this.names = [];
    this.strCache = "Servers not yet initialized.";
    this.main = "self";
  }
}

export const servers = new Servers


if (typeof process.env.SERVERS === "string") {
    process.env.SERVERS.split("|").forEach((serverStr: string) => {
        const [serverName, serverDomain] = serverStr.split(":");
        servers.servers[
            serverName
        ] = `${serverDomain}/generative-ai/api/v1/webhook`;
        servers.names.push(serverName);
        if (HOSTNAME === serverDomain) servers.main = HOSTNAME;
    });
}