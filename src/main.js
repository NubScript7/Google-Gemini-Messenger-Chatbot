"use strict"

if(process.argv.includes("--dotenv")){
  const path = require("path");
  require("dotenv").config({path: path.resolve(__dirname,"../.env")})
}
const express = require("express");
const axios = require("axios");
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

ai.init(process.env.GOOGLE_GEMINI_API_KEY);

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
			
			res.send("EVENT_RECEIVED");
			console.log("sent status code 200 OK");
			send(senderId, "Gemini is thinking...");
			
			ai.ask(msg).then(e => {
				sendMsgsConsecutively(chunkify(e), senderId)
			})
			.catch(e => {
				console.log("error report: ", e)
				send(senderId, "Something wrong went wrong when asking gemini 😢")
			})
			/*
			.catch(e => {
				send(senderId, "Something went wrong, try again later.")
				console.log("error report: ",e)
				})
			*/
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

function sendMsgsConsecutively(arr,psid) {
  arr.reduce((p, item, i) => {
    return p.then(() => {
      return new Promise((resolve,reject) => {
				send(senderId, i, true)
				.catch(e=>{
					send(senderId, "Failed to send a chuck 😢")
						.catch(e=>{
							console.log("Something wrong when posting a message?")
							return reject()
						})
					return resolve()
				})
      })
    })
    .catch(() => {
				return send(id, translateString("INTERNAL: failed to send this data 😢"),true)
				.then(Promise.resolve)
				.catch(() => console.log("Something is wrong with posting message?"))
			})
  }, Promise.resolve())
}

function chunkify(str) {
  const portionSize = 2000;
  const chunk = [];

  for (let i = 0; i < str.length; i += portionSize) {
    chunk.push(str.slice(i, i + portionSize));
  }

  return chunk;
}

function send(id, msg, returnPromise=false) {
	
	if (messagesCount >= 15)return throwError = true;
	
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

