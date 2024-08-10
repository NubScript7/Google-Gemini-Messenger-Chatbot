const { servers, appServer, geminiSettings, net } = require("./main.js");
const hostname = require("os").hostname();

if(process.argv.includes("--dotenv")){
  const path = require("path");
  require("dotenv").config({path: path.resolve(__dirname,"../.env")});
  net.set_output("http://localhost:2468/message");
  console.log("\n\nTo setup testing environment, run these commands on each seperate terminal windows.\n\n- npm run dev\n- npm run test-server\n- npm run test");
}

const requiredEnvironmentVariables = [
  "GOOGLE_GEMINI_API_KEY",
  "FB_PAGE_VERIFY_TOKEN",
  "FB_PAGE_ACCESS_TOKEN",
  "DB_API_URL_FETCH",
  "DB_API_URL_PUSH",
  "SERVERS"
];

// Errors

const IncompleteEnvironmentVariableError = require("./errors/IncompleteEnvironmentVariableError");
//const MessageCountExceededError = require("./errors/MessageCountExceededError");

/*
	servers format: serverName:serverUrl
	
	example:
	geminiserver1:https://example.com
*/
process.env.SERVERS.split("|").forEach(serverStr => {
	const [serverName, serverUrl] = serverStr.split(":");
	servers[serverName] = serverUrl;
	servers.names.push(serverName);
	if(hostname === serverUrl)
		servers.main = hostname;
});

if(requiredEnvironmentVariables.some(e => process.env[e] === undefined))
  throw new IncompleteEnvironmentVariableError("One of required environment variable failed to load or not initialized");

geminiSettings.init(process.env.GOOGLE_GEMINI_API_KEY);

appServer.listen(process.env.PORT || 3000, () => {
  console.log("app is healty and running!");
});

module.exports = appServer;