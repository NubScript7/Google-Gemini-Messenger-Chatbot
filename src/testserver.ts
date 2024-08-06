import express from "express";
import { EventEmitter } from "events";
import cors from "cors";

const app = express();
const messagesEvent = new EventEmitter();

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
	console.log(req?.body);
	res.sendStatus(200)
});

app.post("/", (req, res) => {
	console.log(req?.body);
	res.sendStatus(200)
});

app.post("/message", (req, res) => {
	console.log("\x1b[32m OUTPUT \x1b[0m", req.body?.message?.text || req?.body)
	messagesEvent.emit("message", (req.body.message.text ?? "no message."));
	res.sendStatus(200)
})

app.get("/stream-messages",(req,res) => {
	console.log("a client connected")
	
	res.writeHead(200, {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		"Connection": "keep-alive"
	})
	
	messagesEvent.on("message", (message: string) => {
		const data = {
			message
		}
		res.write(`data: ${JSON.stringify(data)}\n\n`)
		
	})
	
})


function listen(port = 2468) {
	app.listen(port, () => {
		console.log("test server running at port "+port);
	})
}

if(typeof require === "function" && require.main === module)
	listen()

export {
	app,
	listen
}