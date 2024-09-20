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
let config: sessionCleaupWorkerConfig;
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

export function removeFromWarningList(id: string | number) {
  issuedWarningIds.delete(id);
}

export function destroySessionCleanupWorker() {
  if (workerIntervalId !== undefined) clearInterval(workerIntervalId);

  workerIntervalId = undefined;
}

function sessionCleanupWorker() {
  const users = config.connections.getUsers();

  for(const user of users) {
    const id = user.id
    const sessionAge = user.lastReqTime + Math.floor(secToMs(config.sessionMaxAge));
    const dateNow = Date.now();
    const isApplicableForWarning = (sessionAge - config.warningTimeBeforeDeletion) <= dateNow
    const isSessionIdle = sessionAge <= dateNow
    const hasBeenWarned = issuedWarningIds.has(id);

    if (user.isDestroyed())
        return;
    
        if(isApplicableForWarning && hasBeenWarned === false) {
            if(config.notifySession) {
                switch(user.botType) {
                    case BOT_TYPES.Messenger: {
                        send({ id, msg: config.notifyMessage })
                        .catch(e => console.log(e.cause))
                    } break;
                }
            }
            
            issuedWarningIds.add(id);
            return;
        }
        
        if (isSessionIdle) {
            
            if(config.notifySession) {
              switch(user.botType) {
                case BOT_TYPES.Messenger: {
                    send({ id, msg: "Connection terminated." })
                    .catch(e => console.log(e.cause))
                } break;
              }
            }
            
            issuedWarningIds.delete(id);
            config.connections.destroySession(id);
        }
    
    
  };
}

export function initializeSessionCleanupWorker(
  workerConfig: sessionCleaupWorkerConfig
) {
  const {
    sessionMaxAge,
    notifySession,
    notifyMessage,
    workerInterval,
    connections,
  } = workerConfig;
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

  config = workerConfig;
  workerIntervalId = setInterval(sessionCleanupWorker, secToMs(workerInterval));
}

export default initializeSessionCleanupWorker;
