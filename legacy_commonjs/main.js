"use strict";




const VERSION = "1.1.5";


let globalTotalMessages = 0;

const express = require("express");
const axios = require("axios");
/*
var corsOptions = {
  origin: function (origin, callback) {
    // db.loadOrigins is an example call to load
    // a list of origins from a backing database
    db.loadOrigins(function (error, origins) {
      callback(error, origins)
    })
  }
}
*/
const cors = require("cors");
const { GeminiSession, geminiSettings } = require("./gemini"); //r
const appRoute = require("./routes/app");

const Net = require("./netClass");
const Connection = require("./connectionClass"); //r
const Connections = require("./connectionsClass");
const Servers = require("./serversClass");

const { init: aiApiInit, router: aiApiRoute } = require("./sockets/ai");

const app = express();

// Errors

//const IncompleteEnvironmentVariableError = require("./errors/IncompleteEnvironmentVariableError");
const MessageCountExceededError = require("./errors/MessageCountExceededError");
//const CannotCreateNewConnectionUserAlreadyExistsError = require("./errors/CannotCreateNewConnectionUserAlreadyExistsError"); //r
//const CreateNewClientConnectionInvalidPsidError = require("./errors/CreateNewClientConnectionInvalidPsidError"); //r

const socketIO = require("socket.io");
const appServer = require("http").Server(app);

/*
	* users have 10 requests per 5 minutes
	* maximux users is 10 per servers
	* and max send loop is 5
	* so: 5 * 10 * 5 = 250
	* max send count should be 250
*/

const sendMaxCount = 250;

 
//eslint-disable-next-line no-unused-vars
const maxSessionIdleTime = 5 * 1000;

/*
const socketSettings = {
  cors: {
    origin: "i dunno",
    method: ["GET", "POST"]
  }
}
*/

const io = socketIO(appServer);
aiApiInit(io);

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true
	})
);
app.disable("x-powered-by");
app.use(require("./logger"));
app.use("/public", express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

//net class

//connection class

//connections class

const net = new Net();
const servers = new Servers();
const connections = new Connections();

const LOGS = [];

function getAvailableServers() {
	if(servers.names.length >= 1)
		servers.strCache = `available servers:\n\n${servers.names.reduce((p, t) => `${p}- ${t}\n`, "")}`;
	
	return servers.strCache;
}

function askGemini(connection, psid, msg) {
	send(psid, "Gemini is thinking...");
	connection.session
		.ask(msg)
		.then(e => {
			sendMsgsConsecutively(chunkify(e), psid);
			//console.log(ai.getchat().params.history);
		})
		.catch(e => {
			console.log("error report: ", e);
			send(psid, "Something wrong went wrong when asking gemini 😢");
		});
}

const helpStr = "To use, type the message you want to ask gemini or you could use these commands:\n\n" +
	"!v - get app version\n" +
	"!help - used to print this help message\n" +
	"!ch-server - change the server to ask gemini (type '!ch-server' to change current server)\n" +
	"!server - to get the server you are currently on\n" +
	"!id - used to retrieve your client id which the app uses to know its you\n" +
	"!modes - used to know about the output modes\n" +
	"!mode - used to get what output mode you are using\n" +
	"!ch-mode - change the output mode (type '!modes' to know about the modes)\n" +
	"!clear - used to clear the chat history from the app\n" +
	"!history - used to print your chat history\n";

const modesArr = ["aftercomplete", "streamchunk"];

const modesStr = "The two different output modes are:\n\n"
	+"  • aftercomplete - the app will wait for gemini to complete the whole response then send the message\n"
	+"  • streamchunk - the app will send little chunks of messages as soon as possible without waiting for gemini to complete the whole response\n";



app.use("/", appRoute);
app.use("/generative-ai/api/ai", aiApiRoute);

app.get("/pingme", (req,res) => {
	res.send("healthy!");
});

app.get("/favicon.ico", (req, res) => {
	res.sendFile(__dirname + "/public/favicon.ico");
});

app.post("/generative-ai/api/v1/webhook", async (req, res) => {
	if (req.body.object === "page") {
		const ea = req.body.entry || null;
		//console.log(ea,typeof ea,Array.isArray(ea),ea?.length || null)
		if ("object" !== typeof ea || !Array.isArray(ea) || (ea?.length || 0) < 1)
			return res.sendStatus(400);
		for (const entry of req.body.entry) {
			if (
				"object" !== typeof entry.messaging ||
				!Array.isArray(entry.messaging) ||
				entry.messaging.length !== 1
			)
				return res.sendStatus(400);
			

			const [user] = entry.messaging ?? [null];
			const senderId = user?.sender?.id || null;
			const msg = user?.message?.text || null;
			
			
			
			if (!msg || "string" !== typeof msg || !senderId || isNaN(senderId))
				return res.sendStatus(400);
			
			

			const msgArgs = msg[0] === "!" ? msg.split("!")[1].split(" ") : [msg];
			// console.log(msgArgs)

			res.send("EVENT_RECEIVED");
			console.log("sent status code 200 OK");
			
			if(connections.isCreatingSession(senderId)) //if user cant wait
				return send(senderId, "Please be patient! Already creating a new session...");
			
			let connection = connections.getUser(senderId);
			console.log(connection);
			if(!connection) {
				
				await sendAsync(senderId, "Please hold on, requesting a new session instance...");
				try {
					connection = await connections.createConnection(senderId);
					await connection.session.createSession();
					await send(senderId, "Done creating a new session!", true);
			//		});
				} catch (e) { //if somehow we are creating a new session when user session already exists
						send(
							senderId,
							"Oh no! Something went wrong when requesting for a new gemini, please try again later😢..."
						);
						console.log("Error",e);
					} //put ) here if it caused destruction;
			}

			switch (msgArgs[0]) {
				case "v":
					{
						send(senderId, `app version: ${VERSION}`);
						// console.log("user requested version")
					}
					break;
				
				case "logs": {
					if(!msgArgs[1])
						return send(senderId, "Password required.");
					if(DEVELOPER_LOGS_PASSWORD === msgArgs[1] && !msgArgs[2]) {
						for (const LOG of LOGS) {
							await sendMsgsConsecutively(chunkify(LOG), senderId); //logs might exceed 2000 chars, you say its impossible but we dont really know
						}
						return;
					}
					const LOG_INDEX = parseInt(msgArgs[2]);
					if(DEVELOPER_LOGS_PASSWORD === msgArgs[1] && isNaN(LOG_INDEX) && (LOG_INDEX < 0 || LOG_INDEX >= LOGS.length))
						return send(senderId, "LOGS INDEX MUST BE AN INTEGER OR A VALID INDEX RANGE");
					if(DEVELOPER_LOGS_PASSWORD === msgArgs[1] && isNaN(LOG_INDEX) && LOG_INDEX >= 0 && LOG_INDEX < LOGS.length)
						return sendMsgsConsecutively(chuckify(LOGS[LOG_INDEX]), senderId);
				} break;

				case "ch-server":
					{
						const server = msgArgs[1] || null; //server that user picked
						if(!server) {
								await send(senderId, getAvailableServers(), true);
								send(senderId, "Type '!ch-server' then name of the server you want to change to:");
							return;
						}
						if(!servers.names.includes(server))
							return send(senderId, "Server does not exists in selectable servers.");
						
						net.url = servers.server[server];
						send(senderId, "Successfully set selected server.");
					}
					break;

				case "id":
					{
						send(senderId, `your id: ${senderId}`);
					}
					break;

				case "server":
					{
						send(senderId, `your current server: ${connection.serverName}`);
					}
					break;

				case "modes":
					{
						send(senderId, modesStr);
					}
					break;

				case "mode":
					{
						send(senderId, `your current selected mode: ${connection.mode}`);
					}
					break;

				case "ch-mode":
					{
						if(!msgArgs[1]) {
							await send(senderId, modesStr);
							send(senderId, "Type '!ch-mode' then the output mode you want to change to:");
							return;
						}
						
						if(!modesArr.include(msgArgs[1]))
							return send(senderId, "that is not a valid mode, please try again.");
						
						connection.mode = msgArgs[1];
						send(senderId, `Successfully set the mode to ${msgArgs[1]}`);
					}
					break;

				case "clear":
					{
						if(!msgArgs[1])
							return send(senderId, "You are about to clear your chat history, are you sure? please type '!clear iamsure' to continue clearing you chat history, or type '!clear nope' to cancel this action.");
						
						if(msgArgs[1] !== "iamsure" || msgArgs[1] === "nope")
							return send(senderId, "Clearing chat history aborted.");
						
						connection.session.wipeSession();
						send(senderId, "your chat history has been wiped");
					}
					break;

				case "help":
					{
						send(
							senderId,
							helpStr
						);
					}
					break;

				case "history":
					{
						const history = connection.getchat().params.history;
						
					}
					break;

				default:
					{
						if (net.url !== "self")
							return axios
								.post(net.url, req.body)
								.then(() => send(senderId, `redirected payload to server: ${net.url}`))
								.catch(() => {
									send(
										senderId,
										"Failed to send payload to given server, reverting back to self."
									);
									net.set_url("self");
								});
						console.log(connection.session);
						askGemini(connection, senderId, msg);
					}
					break;
			}
		}
		// for loop ending
	} else {
		console.log("sent status code 401 Unauthorized");
		res.sendStatus(401);
	}
});

app.get("/generative-ai/api/v1/webhook", (req, res) => {
	const verifyToken = process.env.FB_PAGE_VERIFY_TOKEN;
	// Parse the query params
	const mode = req.query["hub.mode"];
	const token = req.query["hub.verify_token"];
	const challenge = req.query["hub.challenge"];

	// Check if a token and mode is in the query string of the request
	if (mode && token) {
		// Check the mode and token sent is correct
		if (mode === "subscribe" && token === verifyToken) {
			// Respond with the challenge token from the request
			console.log("WEBHOOK_VERIFIED");
			res.status(200).send(challenge);
		} else {
			// Respond with '403 Forbidden' if verify tokens do not match
			res.sendStatus(403);
		}
	} else {
		res.sendStatus(403);
	}
});

app.all("*", (req, res) => {
	res.send(":)");
});

function sendMsgs(arr, psid) {
	arr.forEach(e => {
		send(e, psid);
	});
}

/*
function sendMsgsConsecutively(arr,psid) {
  arr.reduce((p, item, i) => {
    return new Promise((resolve,reject) => {
				send(psid, i, true)
				.catch(e=>{
					send(psid, "Failed to send a chuck 😢")
						.catch(e=>{
							console.log("Something wrong when posting a message?")
							return reject()
						})
					return resolve()
				})
      })
    .catch(() => {
				return send(psid, translateString("INTERNAL: failed to send this data 😢"),true)
				.then(Promise.resolve)
				.catch(() => console.log("Something is wrong with posting message?"))
			})
  }, Promise.resolve())
}
*/

function sendMsgsConsecutively(arr, psid) {
	return new Promise(async res => {//this promise is just to let us know all the messages has been sent
		for (let msg of arr) {
			try {
				await send(psid, msg, true);
			} catch (e) {
				console.log(e.response.data || e); //axios error or other error
				send("Failed to send this message 😢").catch(e =>
					console.log(e.response.data || e)
				);
			}
		}
		res();
	});
}

function chunkify(str) {
	const portionSize = 2000;
	const chunk = [];

	for (let i = 0; i < str.length; i += portionSize) {
		chunk.push(str.slice(i, i + portionSize));
		// console.log("\n\nchuck report:",chunk[i])
	}

	return chunk;
}

function sendAsync(id, msg) {
	if (globalTotalMessages >= sendMaxCount)
		throw new MessageCountExceededError("Message limit exceeded.");
	
	globalTotalMessages += 1;

	return new Promise((res,rej) => {
		axios.post(
			net.output,
			{
				recipient: {
					id: id
				},
				message: {
					text: msg || "INTERNAL: response was empty."
				}
			},
			{
				params: {
					access_token: process.env.FB_PAGE_ACCESS_TOKEN
				}
			}
		)
		.then(e => {
			console.log("na send na");
			res(e);
			
		})
		.catch(e => {
			console.log("na reject", e?.response?.data || e);
			rej(e);
			});
	});
}

function send(id, msg, returnPromise = false, customUrl = null) {
	if (globalTotalMessages >= sendMaxCount)
		throw new MessageCountExceededError("Message limit exceeded.");

	globalTotalMessages += 1;

	const req = axios.post(
		net.output,
		{
			recipient: {
				id: id
			},
			message: {
				text: msg || "INTERNAL: response was empty."
			}
		},
		{
			params: {
				access_token: process.env.FB_PAGE_ACCESS_TOKEN
			}
		}
	);

	if (returnPromise) return req;
	req.catch(e => {
		console.log(e.response.data || e); //axios error or other error
		send("Failed to send this message 😢").catch(e =>
			console.log(e.response.data || e)
		);
	});
}

module.exports = {
	appServer,
	send,
	net,
	servers,
	geminiSettings
};

module.exports.default = {
	appServer,
	send,
	net,
	servers,
	geminiSettings
};
