declare const __settings: {
    accessToken: string;
    totalSentMsgs: number;
    maxMessages: number;
    net: {};
    connections: {};
    timeout: number;
};
declare function send(id: number, msg: string, returnPromise?: boolean, hasError?: boolean): never | Promise<any>;
declare function sendMsgsConsecutively(arr: string[], psid: number): Promise<boolean>;
export { send, sendMsgsConsecutively, __settings };
