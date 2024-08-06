import Connections from "./connectionsClass";
import Net from "./netClass";
interface SettingUtils {
    accessToken: string;
    totalSentMsgs: number;
    maxMessages: number;
    net: Net;
    connections: Connections;
    timeout: number;
}
interface MessagePayload {
    id: number | string;
    msg: string;
}
declare const __settings: SettingUtils;
/**
 * Sends a message to the messenger client
 * @throws if the total message count exceeded the specified max messages
 * @throws any axios errors
 */
declare function send(payload: MessagePayload): Promise<import("axios").AxiosResponse<any, any>>;
/**
 * Sends an array of messges to a messenger client
 * @returns `true` to signal that all of the messages has been sent
 */
declare function sendMsgsConsecutively(arr: string[], psid: number): Promise<boolean>;
export { send, sendMsgsConsecutively, __settings };
