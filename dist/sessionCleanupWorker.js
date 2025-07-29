"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromWarningList = removeFromWarningList;
exports.destroySessionCleanupWorker = destroySessionCleanupWorker;
exports.initSessionCleanupWorker = initSessionCleanupWorker;
const convert_1 = require("./convert");
const send_1 = require("./send");
const constants_1 = require("./constants");
const geminiWebhook_1 = require("./webhooks/geminiWebhook");
const runtime_1 = require("./runtime");
let workerId;
const warnedList = new Set();
function removeFromWarningList(id) {
    warnedList.delete(id);
}
function destroySessionCleanupWorker() {
    if (workerId !== undefined)
        clearInterval(workerId);
    workerId = undefined;
}
function sessionCleanupWorker() {
    const users = geminiWebhook_1.connections.getUsers();
    for (const user of users) {
        const id = user.id;
        const sessionAge = user.lastReqTime + Math.floor((0, convert_1.secToMs)(runtime_1.Runtime.sessionMaxAge));
        const dateNow = Date.now();
        const isApplicableForWarning = sessionAge - runtime_1.Runtime.warningTimeBeforeDeletion <= dateNow;
        const isSessionIdle = sessionAge <= dateNow;
        const hasBeenWarned = warnedList.has(id);
        if (user.isDestroyed())
            return;
        if (isApplicableForWarning && hasBeenWarned === false) {
            if (runtime_1.Runtime.notifySession) {
                switch (user.botType) {
                    case constants_1.BOT_TYPES.Messenger:
                        {
                            (0, send_1.send)({ id, msg: runtime_1.Runtime.notifyMessage }).catch((e) => console.log(e.cause));
                        }
                        break;
                }
            }
            warnedList.add(id);
            return;
        }
        if (isSessionIdle) {
            if (runtime_1.Runtime.notifySession) {
                switch (user.botType) {
                    case constants_1.BOT_TYPES.Messenger:
                        {
                            (0, send_1.send)({ id, msg: "Connection terminated." }).catch((e) => console.log(e.cause));
                        }
                        break;
                }
            }
            warnedList.delete(id);
            geminiWebhook_1.connections.destroySession(id);
        }
    }
}
function initSessionCleanupWorker() {
    workerId = setInterval(sessionCleanupWorker, (0, convert_1.secToMs)(runtime_1.Runtime.workerInterval));
}
