"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const events_1 = require("events");
const cors_1 = __importDefault(require("cors"));
const path_1 = require("path");
const app = (0, express_1.default)();
const messagesEvent = new events_1.EventEmitter();
app.use(express_1.default.json());
app.use(express_1.default.static((0, path_1.resolve)(__dirname, "../testserver-assests")));
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.post("/message", (req, res) => {
    console.log("\x1b[32m OUTPUT \x1b[0m", req.body?.message?.text || req?.body);
    messagesEvent.emit("message", (req.body.message.text ?? "no message."));
    res.sendStatus(200);
});
app.get("/stream-messages", (req, res) => {
    console.log("a client connected");
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
    });
    messagesEvent.on("message", (message) => {
        const data = {
            message
        };
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    });
});
function listen(port = 2468) {
    app.listen(port, () => {
        console.log("test server running at port " + port);
    });
}
listen();
/*

if(typeof require === "function" && require.main === module)
    listen()

export {
    app,
    listen
}
*/ 
