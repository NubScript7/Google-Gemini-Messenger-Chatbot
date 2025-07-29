"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runtime = exports.LOGS = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class MainRuntime {
    isDevRunning = false;
    apiUrl = "";
    devLogPassword = undefined;
    blockedTimeSeconds = 200; //seconds = 3 minutes
    sessionMaxAge = 300; //seconds = 5 minutes
    notifySession = true;
    notifyMessage = `Your connection will become inactive after 30 seconds, please type '!abort' to cancel connection termination.`;
    workerInterval = 60; //seconds = 1 minute
    warningTimeBeforeDeletion = 30; //seconds
    outputServer = process.env.localTestServer ? process.env.localTestServer : `https://graph.facebook.com/v23.0/${process.env.FB_PAGE_ID}/messages`;
    settings = {
        UMMRPM: 5,
        MUPS: 10,
        SMMR: 50,
        CHMPML: 27,
        get sendMaxCount() {
            return this.UMMRPM * this.MUPS * this.SMMR;
        }
    };
}
exports.LOGS = [];
exports.Runtime = new MainRuntime();
