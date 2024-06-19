if(process.argv.includes("--dotenv")){
  const path = require("path");
  require("dotenv").config({path: path.resolve(__dirname,"../.env")})
}
const express = require("express");
const cors = require("cors");
const ai = require("./gemini");
const IncompleteEnvironmentVariableError = require("./IncompleteEnvironmentVariableError")
const MessageCountExceededError = require("./MessageCountExceededError")
const app = express();

let messagesCount;
let throwError;
/*
const socketIO = require("socket.io");
const server = require("http").Server(app);


const socketSettings = {
  cors: {
    origin: "i dunno",
    method: ["GET", "POST"]
  }
}


const io = socketIO(server);
*/

const requiredEnvironmentVariables = [
  "GOOGLE_GEMINI_API_KEY",
  "FB_PAGE_VERIFY_TOKEN",
  "FB_PAGE_ACCESS_TOKEN"
]

/*
console.log(process.env.GEMINI_API_KEY)
requiredEnvironmentVariables.forEach((e, i) => {
  console.log(requiredEnvironmentVariables[i]," : ",process.env[e])
})
*/

if(requiredEnvironmentVariables.some(e => process.env[e] === undefined))
  throw new IncompleteEnvironmentVariableError("One of required environment variable failed to load or not initialized")

const GOOGLE_GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const gemini = ai.init(GOOGLE_GEMINI_API_KEY);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.disable("x-powered-by");

app.post("/webhook", (req, res) => {
	if (req.body.object === "page") {
		const ea = req.body.entry || null;
		//console.log(ea,typeof ea,Array.isArray(ea),ea?.length || null)
		if("object" !== typeof ea ||
			!Array.isArray(ea) ||
			(ea?.length || 0) < 1)return res.sendStatus(400)
		for (const entry of req.body.entry) {
			if("object" !== typeof entry.messaging ||
				!Array.isArray(entry.messaging) ||
				entry.messaging.length !== 1)
			return res.sendStatus(400);
			
			const [user] = entry?.messaging;
			const senderId = user?.sender?.id || null;
			const msg = user?.message?.text || null;
			if (!msg || "string" !== typeof msg || !senderId || isNaN(senderId))return res.sendStatus(400)
			
			send(senderId, "Gemini is thinking...");
			gemini.ask(msg).then(e => {
				chunkify(e).forEach(i => {
					send(senderId, i)
				})
			})
			.catch(e => send(senderId, "Something went wrong, try again later."))
			
			res.send("EVENT_RECEIVED");
			console.log("sent status code 200 OK")
		}
	} else {
		console.log("sent status code 401 Unauthorized")
		res.sendStatus(401)
	}
});

app.get("/webhook", (req, res) => {
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

app.get("*", (req,res) => {
  res.send(":)");
})

function chunkify(str) {
  const portionSize = 2000;
  const chunk = [];

  for (let i = 0; i < str.length; i += portionSize) {
    chunk.push(str.slice(i, i + portionSize));
  }

  return chunk;
}

function send(id, msg, returnPromise=false) {
	
	if (messagesCount >= 50)return throwError = true;
	
	if(throwError){
		throw new MessageCountExceededError("Message limit exceeded.")
	}
	messagesCount += 1;

	const req = axios.post(
	 "https://graph.facebook.com/v2.6/me/messages",
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
	
	if(returnPromise) {
		return req;
	} else {
		req.then(() => console.log("message posted successfully: " + msg))
		.catch(e => {
			console.log("MESSAGE WAS NOT POSTED.")
			console.log("message report error:", e)
		})
	}
}

app.listen(process.env.PORT || 3000, () => {
  console.log("app is healty and running!")
})

