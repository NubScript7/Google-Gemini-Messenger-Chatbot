"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const node_path_1 = __importDefault(require("node:path"));
const constants_1 = require("./constants");
const runtime_1 = require("./runtime");
const errors_1 = require("./errors");
const server_1 = require("./server");
const gemini_1 = require("./gemini");
const sessionCleanupWorker_1 = require("./sessionCleanupWorker");
//import { geminiSettings } from "./gemini";
(0, dotenv_1.config)({ path: node_path_1.default.resolve(__dirname, "../.env") });
if (!process.argv.includes("--prod"))
    console.log("\n\nTo setup testing environment, run these commands on each seperate terminal windows.\n\n  - npm run dev\n  - npm run test:server\n");
if (["--devrun", "-d"].some((e) => process.argv.includes(e))) {
    runtime_1.Runtime.isDevRunning = true;
    runtime_1.Runtime.sessionMaxAge = 15;
    runtime_1.Runtime.warningTimeBeforeDeletion = 5;
    runtime_1.Runtime.workerInterval = 5;
    console.log("RUNNING IN DEV MODE.");
    console.log("SESSION CLEANUP WILL BE QUICKER");
}
if (process.env.DEBUG_MODE === "verbose") {
    console.log("DEBUG MODE: EVERY WEBHOOK REQUESTS WILL BE LOGGED.");
}
if (["--emulate-ai", "-e"].some((e) => process.argv.includes(e))) {
    gemini_1.geminiSettings.emulated = true;
    console.log("EMULATING GEMINI'S RESPONSE.");
}
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const FB_PAGE_VERIFY_TOKEN = process.env.FB_PAGE_VERIFY_TOKEN;
const requiredEnvironmentVariables = [
    /* YOUR GOOGLE AI API KEY */
    "GOOGLE_GEMINI_API_KEY",
    /* YOUR FB PAGE ACCESS TOKEN */
    "FB_PAGE_ACCESS_TOKEN",
    /* YOUR FB PAGE ID */
    "FB_PAGE_ID",
    /* your fb page verify token */
    "FB_PAGE_VERIFY_TOKEN",
];
const optionalEnvironmentVariables = [
    /* your database webhook for getting data */
    "DB_API_URL_FETCH",
    /* your database webhook for setting data */
    "DB_API_URL_PUSH",
    /* your list of servers to balance load */
    "SERVERS",
    /* used to kill the app if you want */
    "APP_KILL_KEY",
    /* used to grant unlimited ai generation to client (cmd: !unli) */
    "GEMINI_UNLIMITED_GENERATION",
];
requiredEnvironmentVariables.forEach((e) => {
    if (process.env[e] === undefined)
        throw new errors_1.IncompleteEnvironmentVariableError(`The environment variable "${e}" was not found which is required.`);
});
/*
optional environment variables
APP_KILL_PASS - used by the `!reset` command, to reset the server
    __UNLI_ASK_PASS - used by `idongivafuk` to grant a user no limit ask for gemini
    */
/*
    servers format: serverName:serverUrl
    
    example:
    geminiserver1:https://example.com
    
*/
/* initializeSessionCleanupWorker({
    sessionMaxAge: mainRuntimeUtils.sessionMaxAge,
    notifySession: mainRuntimeUtils.notifySession,
    notifyMessage: mainRuntimeUtils.notifyMessage,
    workerInterval: mainRuntimeUtils.workerInterval,
    warningTimeBeforeDeletion: mainRuntimeUtils.warningTimeBeforeDeletion,
    connections,
}); */
/*
updateAvailableServers();

geminiSettings.init(GEMINI_API_KEY);
__settings.accessToken = FB_PAGE_VERIFY_TOKEN;
__settings.net = net;
*/
gemini_1.geminiSettings.init(GEMINI_API_KEY);
(0, sessionCleanupWorker_1.initSessionCleanupWorker)();
server_1.appServer.listen(process.env.PORT || 3000, () => {
    console.log("app is healty and running!");
});
console.log(`APP VERSION: ${constants_1.VERSION}`);
