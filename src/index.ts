import {
  servers,
  appServer,
  geminiSettings,
  net,
  updateAvailableServers,
  __settings,
  mainRuntimeUtils,
  connections
} from "./main";

import { IncompleteEnvironmentVariableError } from "./errors";
import getInternalHostname from "./hostname";
import path from "path";
import { config } from "dotenv";
import initializeSessionCleanupWorker from "./sessionCleanupWorker";
import { setRoot } from "./encryptor";

const hostname = getInternalHostname();

if (!process.argv.includes("--prod"))
  console.log(
    "\n\nTo setup testing environment, run these commands on each seperate terminal windows.\n\n  - npm run start:watch-dev\n  - npm run test:server\n"
  );

config({ path: path.resolve(__dirname, "../.env") });
setRoot(path.resolve(__dirname, "../"));

if (process.argv.includes("--devrun")) {
  mainRuntimeUtils.isDevRunning = true;
  mainRuntimeUtils.sessionMaxAge = 15;
  mainRuntimeUtils.warningTimeBeforeDeletion = 5;
  mainRuntimeUtils.workerInterval = 5;
  net.set_output(process.env.localTestServer ? process.env.localTestServer : "http://localhost:2468/message");
  console.log("RUNNING IN DEV MODE.");
  console.log("SESSION CLEANUP WILL BE QUICKER");
}

if(process.argv.includes("--emulate-ai")) {
  geminiSettings.emulated = true;
  console.log("EMULATING GEMINI'S RESPONSE.");
}

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY as string;
const FB_PAGE_VERIFY_TOKEN = process.env.FB_PAGE_VERIFY_TOKEN as string;

const requiredEnvironmentVariables = [
  /* YOUR GOOGLE AI API KEY */
  "GOOGLE_GEMINI_API_KEY",

  /* YOUR FB PAGE ACCESS TOKEN */
  "FB_PAGE_ACCESS_TOKEN",

];

const optionalEnvironmentVariables = [
  /* your fb page verify token */
  "FB_PAGE_VERIFY_TOKEN",

  /* your database webhook for getting data */
  "DB_API_URL_FETCH",

  /* your database webhook for setting data */
  "DB_API_URL_PUSH",
  
  /* your list of servers to balance load */
  "SERVERS",
  
  /* used to kill the app if you want */
  "APP_KILL_KEY",

  /* used to get unlimited ai generation (cmd: !unli) */
  "GEMINI_UNLIMITED_GENERATION"
]

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

if (typeof process.env.SERVERS === "string") {
  process.env.SERVERS.split("|").forEach((serverStr: string) => {
    const [serverName, serverDomain] = serverStr.split(":");
    servers.servers[
      serverName
    ] = `${serverDomain}/generative-ai/api/v1/webhook`;
    servers.names.push(serverName);
    if (hostname === serverDomain) servers.main = hostname;
  });
}

initializeSessionCleanupWorker({
  sessionMaxAge: mainRuntimeUtils.sessionMaxAge,
  notifySession: mainRuntimeUtils.notifySession,
  notifyMessage: mainRuntimeUtils.notifyMessage,
  workerInterval: mainRuntimeUtils.workerInterval,
  warningTimeBeforeDeletion: mainRuntimeUtils.warningTimeBeforeDeletion,
  connections
})

updateAvailableServers();

geminiSettings.init(GEMINI_API_KEY);
__settings.accessToken = FB_PAGE_VERIFY_TOKEN;
__settings.net = net;


appServer.listen(process.env.PORT || 3000, () => {
  console.log("app is healty and running!");
});
