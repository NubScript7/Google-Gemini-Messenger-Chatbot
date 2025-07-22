import { Connections } from "./connections";
import { secToMs } from "./convert";
import { send } from "./send";
import { BOT_TYPES } from "./constants";
import { connections } from "./webhooks/geminiWebhook";
import { Runtime } from "./runtime";

export interface SessionCleanupWorkerConfig {
    /**
     * The max age of the session before the session cleaup worker destroys it.
     * Value is treated as seconds
     */
    sessionMaxAge: number;
    /**
     * Should the session cleanup worker notify the session when its about to destroy it
     */
    notifySession: boolean;
    /**
     * The message the session cleanup worker will sent to the session when its about to be destroyed.
     * Only works when `notifySession` is set to `true`
     */
    notifyMessage: string;

    /**
     * The frequency/interval of the session cleanup worker when checking idle sessions.
     * Value is treated as seconds
     */
    workerInterval: number;

    /**
     * The second(s) before sending a warning message to the connection when its about to be inactive.
     * It should be less than `sessionMaxAge`.
     * Only works when `notifySession` is set to `true`
     */
    warningTimeBeforeDeletion: number;

    /**
     * !REQUIRED!
     * Pass a connections object that contains all connections, for the session cleanup worker to use.
     */
    connections: Connections;
}

let workerId: ReturnType<typeof setInterval> | undefined;
const warnedList: Set<number | string> = new Set();

export function removeFromWarningList(id: string | number) {
    warnedList.delete(id);
}

export function destroySessionCleanupWorker() {
    if (workerId !== undefined) clearInterval(workerId);

    workerId = undefined;
}

function sessionCleanupWorker() {
    const users = connections.getUsers();

    for (const user of users) {
        const id = user.id;
        const sessionAge =
            user.lastReqTime + Math.floor(secToMs(Runtime.sessionMaxAge));
        const dateNow = Date.now();
        const isApplicableForWarning =
            sessionAge - Runtime.warningTimeBeforeDeletion <= dateNow;
        const isSessionIdle = sessionAge <= dateNow;
        const hasBeenWarned = warnedList.has(id);

        if (user.isDestroyed()) return;

        if (isApplicableForWarning && hasBeenWarned === false) {
            if (Runtime.notifySession) {
                switch (user.botType) {
                    case BOT_TYPES.Messenger:
                        {
                            send({ id, msg: Runtime.notifyMessage }).catch(
                                (e) => console.log(e.cause)
                            );
                        }
                        break;
                }
            }

            warnedList.add(id);
            return;
        }

        if (isSessionIdle) {
            if (Runtime.notifySession) {
                switch (user.botType) {
                    case BOT_TYPES.Messenger:
                        {
                            send({ id, msg: "Connection terminated." }).catch(
                                (e) => console.log(e.cause)
                            );
                        }
                        break;
                }
            }

            warnedList.delete(id);
            connections.destroySession(id);
        }
    }
}

export function initSessionCleanupWorker() {
    workerId = setInterval(
        sessionCleanupWorker,
        secToMs(Runtime.workerInterval)
    );
}
