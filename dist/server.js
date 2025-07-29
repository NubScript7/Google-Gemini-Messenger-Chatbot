"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appServer = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const cors_1 = __importDefault(require("cors"));
const logger_1 = require("./development/logger");
const node_path_1 = __importDefault(require("node:path"));
const socket_io_1 = require("socket.io");
const settings_1 = require("./settings");
const geminiWebhook_1 = require("./webhooks/geminiWebhook");
exports.app = (0, express_1.default)();
exports.appServer = (0, node_http_1.createServer)(exports.app);
const io = new socket_io_1.Server(exports.appServer, {
    cors: settings_1.corsOptions
});
//io.on("connection", socketHandler);
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({
    extended: true,
}));
exports.app.disable("x-powered-by");
exports.app.use((0, cors_1.default)(settings_1.corsOptions));
exports.app.use(logger_1.logger);
exports.app.use("/public", express_1.default.static(node_path_1.default.resolve(__dirname, "./public")));
exports.app.set("view engine", "ejs");
exports.app.get("/pingme", (req, res) => {
    res.send("healthy!");
});
exports.app.get("/favicon.ico", (req, res) => {
    res.sendFile(__dirname + "/public/favicon.ico");
});
exports.app.post("/generative-ai/api/v1/webhook", geminiWebhook_1.messengerPostWebhookHandler);
exports.app.post("/webhook", geminiWebhook_1.messengerPostWebhookHandler);
exports.app.get("/generative-ai/api/v1/webhook", geminiWebhook_1.messengerVerifyWebhookHandler);
exports.app.get("/webhook", geminiWebhook_1.messengerVerifyWebhookHandler);
exports.app.all("*", (req, res) => {
    res.status(404).send("hello! This is not the place to be :)");
});
