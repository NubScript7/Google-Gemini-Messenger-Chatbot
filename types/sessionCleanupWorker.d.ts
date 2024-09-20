import Connections from "./connectionsClass";
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
export declare function removeFromWarningList(id: string | number): void;
export declare function destroySessionCleanupWorker(): void;
export declare function initializeSessionCleanupWorker(workerConfig: sessionCleaupWorkerConfig): void;
export default initializeSessionCleanupWorker;
