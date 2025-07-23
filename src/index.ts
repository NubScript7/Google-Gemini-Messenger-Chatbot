import { config } from "dotenv";
import path from "node:path";
import { VERSION } from "./constants";
import { Runtime } from "./runtime";
import { IncompleteEnvironmentVariableError } from "./errors";
import { appServer } from "./server";
import { geminiSettings } from "./gemini";
import { initSessionCleanupWorker } from "./sessionCleanupWorker";
//import { geminiSettings } from "./gemini";

config({ path: path.resolve(__dirname, "../.env") });

if (!process.argv.includes("--prod"))
    console.log(
        "\n\nTo setup testing environment, run these commands on each seperate terminal windows.\n\n  - npm run dev\n  - npm run test:server\n"
    );

if (["--devrun", "-d"].some((e) => process.argv.includes(e))) {
    Runtime.isDevRunning = true;
    Runtime.sessionMaxAge = 15;
    Runtime.warningTimeBeforeDeletion = 5;
    Runtime.workerInterval = 5;

    console.log("RUNNING IN DEV MODE.");
    console.log("SESSION CLEANUP WILL BE QUICKER");
}

if (process.env.DEBUG_MODE === "verbose") {
    console.log("DEBUG MODE: EVERY WEBHOOK REQUESTS WILL BE LOGGED.");
}

if (["--emulate-ai", "-e"].some((e) => process.argv.includes(e))) {
    geminiSettings.emulated = true
    console.log("EMULATING GEMINI'S RESPONSE.");
}

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY as string;
const FB_PAGE_VERIFY_TOKEN = process.env.FB_PAGE_VERIFY_TOKEN as string;

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
        throw new IncompleteEnvironmentVariableError(
            `The environment variable "${e}" was not found which is required.`
        );
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

geminiSettings.init(GEMINI_API_KEY)

initSessionCleanupWorker()

appServer.listen(process.env.PORT || 3000, () => {
    console.log("app is healty and running!");
});

console.log(`APP VERSION: ${VERSION}`);

