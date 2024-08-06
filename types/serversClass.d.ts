export interface ServersListObject {
    [serverName: string]: string;
}
declare class Servers {
    servers: ServersListObject;
    names: string[];
    strCache: string;
    main: string;
    constructor();
}
export default Servers;
