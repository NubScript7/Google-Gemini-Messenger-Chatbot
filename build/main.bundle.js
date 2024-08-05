'use strict';

var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./main");
const hostname_1 = __importDefault(require("./hostname"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
const IncompleteEnvironmentVariableError_1 = __importDefault(require("./errors/IncompleteEnvironmentVariableError"));
const hostname = (0, hostname_1.default)();
if (!process.argv.includes("--prod"))
    console.log("\n\nTo setup testing environment, run these commands on each seperate terminal windows.\n\n  - npm run start:watch-dev\n  - npm run test:server\n");
(0, dotenv_1.config)({ path: path_1.default.resolve(__dirname, "../.env") });
if (process.argv.includes("--devrun")) {
    main_1.isDevRunning = true;
    main_1.__settings.isDev = true;
    main_1.net.set_output("http://localhost:2468/message");
    console.log("RUNNING IN DEV MODE.");
}
const requiredEnvironmentVariables = [
    "GOOGLE_GEMINI_API_KEY",
    "FB_PAGE_VERIFY_TOKEN",
    "FB_PAGE_ACCESS_TOKEN",
    "DB_API_URL_FETCH",
    "DB_API_URL_PUSH",
    "SERVERS"
];
if (requiredEnvironmentVariables.some((e) => process.env[e] === undefined))
    throw new IncompleteEnvironmentVariableError_1.default("One of required environment variable failed to load or not initialized");
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
process.env.SERVERS.split("|").forEach((serverStr) => {
    const [serverName, serverDomain] = serverStr.split(":");
    main_1.servers[serverName] = `${serverDomain}/generative-ai/api/v1/webhook`;
    main_1.servers.names.push(serverName);
    if (hostname === serverDomain)
        main_1.servers.main = hostname;
});
(0, main_1.updateAvailableServers)();
main_1.geminiSettings.init(process.env.GOOGLE_GEMINI_API_KEY);
main_1.__settings.accessToken = process.env.FB_PAGE_ACCESS_TOKEN;
main_1.__settings.net = main_1.net;
if (typeof require === "function" && require.main === module)
    main_1.appServer.listen(process.env.PORT || 3000, () => {
        console.log("app is healty and running!");
    });
exports.default = main_1.appServer;
