interface GeminiSessionOptions {
    botType: string;
    instruction: string;
}
declare class GeminiSettings {
    #private;
    constructor();
    isInitialized(): boolean;
    init(apiKey: string): Promise<boolean>;
    askOnce(msg: string): Promise<string>;
    test(): string;
    getSessions(): number;
    requestSession(psid: number, options: GeminiSessionOptions): object;
    requestDestroySession(psid: number): never;
}
declare const geminiSettings: GeminiSettings;
interface GeminiHistory {
    role: string;
    parts: string[];
}
interface GeminiToTextObject {
    text: () => string;
}
interface GeminiResponseStream {
    stream: GeminiToTextObject[];
}
type geminiSessionId = string | number;
declare class GeminiSession {
    #private;
    constructor(botType: string, id: geminiSessionId);
    static askOnce(message: any): Promise<string>;
    hasSession(): boolean;
    createSession(): Promise<boolean>;
    destroySession(): never;
    wipeSession(): never;
    getHistory(): GeminiHistory[];
    ask(message: string): Promise<string>;
    askStream(message: string): Promise<GeminiResponseStream>;
}
export { GeminiSession, geminiSettings };
