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

export default Servers;
