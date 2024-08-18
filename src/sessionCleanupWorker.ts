import Connections from "./connectionsClass";
import { secToMs } from "./convert";
import { SessionCleanupWorkerCannotInitializeInvalidConfig } from "./errors";
import { send } from "./send";
import { BOT_TYPES } from "./main";

export interface sessionCleaupWorkerConfig {
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

let workerIntervalId: ReturnType<typeof setInterval> | undefined;
let localConfigCopy: sessionCleaupWorkerConfig;
const warningTimeBeforeDeletion = secToMs(30); //30 seconds into ms
const issuedWarningIds: Set<number | string> = new Set();

function isNum(num: any) {
  return !isNaN(num);
}

function isStr(str: any) {
  return typeof str === "string" || str instanceof String;
}

function isBool(bool: any) {
  return typeof bool === "boolean" || bool instanceof Boolean;
}

export function reactivateConnection(id: string | number) {
  if (issuedWarningIds.has(id)) issuedWarningIds.delete(id);
}

export function destroySessionCleanupWorker() {
  if (workerIntervalId !== undefined) clearInterval(workerIntervalId);

  workerIntervalId = undefined;
}

function sessionCleanupWorker() {
  const users = localConfigCopy.connections.getUsers();
  const userIds = Object.keys(users);

  if (userIds.length === 0) return;

  userIds.forEach((id) => {
    const user = users[id];
    const sessionAge =
      user.lastReqTime + Math.floor(secToMs(localConfigCopy.sessionMaxAge));
    const dateNow = Date.now();

    if (user.isDestroyed())
        return;
      
      if (
        localConfigCopy.notifySession &&
        !issuedWarningIds.has(id) &&
        (sessionAge - localConfigCopy.warningTimeBeforeDeletion) <= dateNow
      ) {
        user.botType === BOT_TYPES.Messenger
          ? send({ id, msg: localConfigCopy.notifyMessage })
          : void 0; /* not yet implemented */
        issuedWarningIds.add(id);
      } else if (sessionAge <= dateNow) {
        if(localConfigCopy.notifySession)
          user.botType === BOT_TYPES.Messenger ?
           send({ id, msg: "Connection terminated." }) :
           void 0; /* not yet implemented */
        
          issuedWarningIds.delete(id);
          localConfigCopy.connections.destroySession(
            user.botType === BOT_TYPES.Messenger ? parseInt(id) : id
          );
      }
    
    
  });
}

export function initializeSessionCleanupWorker(
  config: sessionCleaupWorkerConfig
) {
  const {
    sessionMaxAge,
    notifySession,
    notifyMessage,
    workerInterval,
    connections,
  } = config;
  if (
    !sessionMaxAge ||
    !notifySession ||
    !notifyMessage ||
    !connections ||
    !workerInterval ||
    !warningTimeBeforeDeletion ||
    !isNum(sessionMaxAge) ||
    !isBool(notifySession) ||
    !isStr(notifyMessage) ||
    !isNum(workerInterval) ||
    !isNum(warningTimeBeforeDeletion) ||
    !(connections instanceof Connections)
  )
    throw new SessionCleanupWorkerCannotInitializeInvalidConfig(
      "Cannot initialize session cleanup worker, the config was invalid."
    );

  localConfigCopy = config;
  workerIntervalId = setInterval(sessionCleanupWorker, secToMs(workerInterval));
}

export default initializeSessionCleanupWorker;
