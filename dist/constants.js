"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modesStr = exports.modesArr = exports.helpStr = exports.upStartTime = exports.HOSTNAME = exports.BOT_TYPES = exports.BOT_NAME = exports.VERSION = void 0;
const node_os_1 = require("node:os");
exports.VERSION = "1.6.0";
exports.BOT_NAME = "GenBot";
var BOT_TYPES;
(function (BOT_TYPES) {
    BOT_TYPES["Messenger"] = "Messenger";
    BOT_TYPES["Frontend"] = "Frontend";
})(BOT_TYPES || (exports.BOT_TYPES = BOT_TYPES = {}));
exports.HOSTNAME = (0, node_os_1.hostname)();
exports.upStartTime = Date.now();
exports.helpStr = "To use, type the message you want to ask DigyBot or you could use these commands:\n\n" +
    "!v - get app version\n" +
    "!help - used to print this help message\n" +
    "!ch-server - change the server to ask DigyBot (type '!ch-server' to change current server)\n" +
    "!server - to get the server you are currently on\n" +
    "!modes - used to know about the output modes\n" +
    "!mode - used to get what output mode you are using\n" +
    "!ch-mode - change the output mode (type '!modes' to know about the modes)\n" +
    "!clear - used to clear the chat history from the app\n" +
    "!history - used to print your chat history\n";
exports.modesArr = ["aftercomplete", "streamchunk"];
exports.modesStr = "The two different output modes are:\n\n" +
    "  • aftercomplete - the app will wait for DigyBot to complete the whole response then send the message\n" +
    "  • streamchunk - the app will send little chunks of messages as soon as possible without waiting for DigyBot to complete the whole response\n";
