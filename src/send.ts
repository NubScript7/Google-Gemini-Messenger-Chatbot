import { SendFunctionMessageCountExceededError } from "./errors";
import axios, { AxiosError } from "axios";
import { Runtime } from "./runtime";
import { logAxiosError } from "./development/logger";

interface SettingUtils {
  totalSentMsgs: number;
  maxMessages: number;
  timeout: number;
  offline: boolean;
}

const sendSettings: SettingUtils = {
  totalSentMsgs: 0,
  maxMessages: Runtime.settings.sendMaxCount,
  timeout: 10_000,
  offline: false
}

interface MessagePayload {
  id: number | string,
  msg: string
}

/**
 * Sends a message to the messenger client
 * @throws if the total message count exceeded the specified max messages
 * @throws any axios errors
 */

type sendApiPayloadObject = {
  id: string | number,
  msg: string
}

/*
function sendApi(payload: sendApiPayloadObject) {
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
}
*/


function send(payload: MessagePayload) {
  
  if(sendSettings.offline)
    return Promise.resolve()
  
  if (sendSettings.totalSentMsgs >= sendSettings.maxMessages)
    throw new SendFunctionMessageCountExceededError("Message limit exceeded.");

  sendSettings.totalSentMsgs++;


  return axios.post(
    Runtime.outputServer,
    {
      recipient: {
        id: payload.id
      },
      message: {
        text: payload.msg || "INTERNAL: response was empty.",
      },
    },
    {
      timeout: sendSettings.timeout,
      params: {
        access_token: process.env.FB_PAGE_ACCESS_TOKEN,
      },
    }
  );
}

/**
 * Sends an array of messages to a messenger client
 * @returns `true` to signal that all of the messages has been sent
 */
async function sendMsgsConsecutively(arr: string[], psid: number) {
    for (const msg of arr) {
      try {
        await send({ id: psid, msg });
      } catch (e: any) {
        logAxiosError(e)
        send({ id: psid, msg: "Failed to send this message 😢"})
        .catch(e => logAxiosError(e))
      }
    }
    return true;
}

export { send, sendMsgsConsecutively };
