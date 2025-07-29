"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send = send;
exports.sendMsgsConsecutively = sendMsgsConsecutively;
const errors_1 = require("./errors");
const axios_1 = __importDefault(require("axios"));
const runtime_1 = require("./runtime");
const logger_1 = require("./development/logger");
const sendSettings = {
    totalSentMsgs: 0,
    maxMessages: runtime_1.Runtime.settings.sendMaxCount,
    timeout: 10_000,
    offline: false
};
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
function send(payload) {
    if (sendSettings.offline)
        return Promise.resolve();
    if (sendSettings.totalSentMsgs >= sendSettings.maxMessages)
        throw new errors_1.SendFunctionMessageCountExceededError("Message limit exceeded.");
    sendSettings.totalSentMsgs++;
    return axios_1.default.post(runtime_1.Runtime.outputServer, {
        recipient: {
            id: payload.id
        },
        message: {
            text: payload.msg || "INTERNAL: response was empty.",
        },
    }, {
        timeout: sendSettings.timeout,
        params: {
            access_token: process.env.FB_PAGE_ACCESS_TOKEN,
        },
    });
}
/**
 * Sends an array of messages to a messenger client
 * @returns `true` to signal that all of the messages has been sent
 */
async function sendMsgsConsecutively(arr, psid) {
    for (const msg of arr) {
        try {
            await send({ id: psid, msg });
        }
        catch (e) {
            (0, logger_1.logAxiosError)(e);
            send({ id: psid, msg: "Failed to send this message 😢" })
                .catch(e => (0, logger_1.logAxiosError)(e));
        }
    }
    return true;
}
