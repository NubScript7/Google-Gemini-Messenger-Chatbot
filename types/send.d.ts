import Connections from "./connectionsClass";
import Net from "./netClass";
interface SettingUtils {
    accessToken: string;
    totalSentMsgs: number;
    maxMessages: number;
    net: Net;
    connections: Connections;
    timeout: number;
    offline: boolean;
}
interface MessagePayload {
    id: number | string;
    msg: string;
}
declare const __settings: SettingUtils;
declare function send(payload: MessagePayload): Promise<import("axios").AxiosResponse<any, any>> | undefined;
/**
 * Sends an array of messages to a messenger client
 * @returns `true` to signal that all of the messages has been sent
 */
declare function sendMsgsConsecutively(arr: string[], psid: number): Promise<boolean>;
export { send, sendMsgsConsecutively, __settings };
