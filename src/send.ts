import { SendFunctionMessageCountExceededError } from "./errors";
import axios, { AxiosError } from "axios";
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
  id: number | string,
  msg: string
}

const __settings = {} as SettingUtils;

/**
 * Sends a message to the messenger client
 * @throws if the total message count exceeded the specified max messages
 * @throws any axios errors
 */
function send(payload: MessagePayload) {
  if (__settings.totalSentMsgs >= __settings.maxMessages)
    throw new SendFunctionMessageCountExceededError("Message limit exceeded.");

  __settings.totalSentMsgs++;

  const req = axios.post(
    __settings.net.output,
    {
      recipient: {
        id: payload.id
      },
      message: {
        text: payload.msg || "INTERNAL: response was empty.",
      },
    },
    {
      timeout: __settings.timeout,
      params: {
        access_token: process.env.FB_PAGE_ACCESS_TOKEN,
      },
    }
  );

  return req;
}

/**
 * Sends an array of messges to a messenger client
 * @returns `true` to signal that all of the messages has been sent
 */
async function sendMsgsConsecutively(arr: string[], psid: number) {
    for (const msg of arr) {
      try {
        await send({ id: psid, msg });
      } catch (e: any) {
        console.log("error report:", e?.response?.data || e, "code:", e?.code); //axios error or other error
        send({ id: psid, msg: "Failed to send this message 😢" }).catch((e) =>
          console.log("error report:", e?.response?.data || e, "code:", e?.code)
        );
      }
    }
    return true;
}

export { send, sendMsgsConsecutively, __settings };
