import express from "express"
import { createServer } from "node:http";
import cors from "cors"
import { logger } from "./development/logger";
import path from "node:path";
import { Server as SocketServer } from "socket.io";
import { corsOptions } from "./settings";
import { messengerPostWebhookHandler, messengerVerifyWebhookHandler } from "./webhooks/geminiWebhook";

export const app = express()
export const appServer = createServer(app)

const io = new SocketServer(appServer, {
    cors: corsOptions
});

//io.on("connection", socketHandler);

app.use(express.json());
app.use(
    express.urlencoded({
         extended: true,
    })
);

app.disable("x-powered-by");
app.use(cors(corsOptions));
app.use(logger);
app.use("/public", express.static(path.resolve(__dirname, "./public")));
app.set("view engine", "ejs");

app.get("/pingme", (req, res) => {
    res.send("healthy!");
});

app.get("/favicon.ico", (req, res) => {
    res.sendFile(__dirname + "/public/favicon.ico");
});

app.post("/generative-ai/api/v1/webhook", messengerPostWebhookHandler);
app.post("/webhook", messengerPostWebhookHandler);

app.get("/generative-ai/api/v1/webhook", messengerVerifyWebhookHandler);
app.get("/webhook", messengerVerifyWebhookHandler);

app.all("*", (req, res) => {
    res.status(404).send("hello! This is not the place to be :)")
});