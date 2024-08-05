interface GeminiHistory {
    role: string;
    parts: string[];
}
declare class Connection {
    #private;
    blockedTime: number;
    constructor(psid: number);
    getId(): number;
    getHistory(): GeminiHistory[];
    createSession(): never;
    ask(msg: string): Promise<string> | boolean;
    historyLen(): number;
    wipeSession(): never;
    serverName(): string;
    serverUrl(): string;
    setUserUnliAsk(): boolean;
    getmode(): string;
    setmode(mode: string): never;
    setServer(name: string, url: string): never;
    block(s: number): never;
    isBlocked(): boolean;
    destroy(): never;
}
export default Connection;
