interface MainRuntimeUtils {
    isDevRunning: boolean;
    apiUrl: string;
    devLogPassword: string | undefined;
    blockedTimeSeconds: number;
    sessionMaxAge: number;
    notifySession: boolean;
    notifyMessage: string;
    workerInterval: number;
    warningTimeBeforeDeletion: number;
    outputServer: string;

    settings: {
        UMMRPM: number; //user max message request per minute
        MUPS: number; //max users per server
        SMMR: number; //server max mass request 
        CHMPML: number; //chat history message preview max length
        sendMaxCount: number;
    }
}

class MainRuntime implements MainRuntimeUtils {
    isDevRunning = false;
    apiUrl = "";
    devLogPassword: string | undefined = undefined;
    blockedTimeSeconds = 200; //seconds = 3 minutes
    sessionMaxAge = 300; //seconds = 5 minutes
    notifySession = true;
    notifyMessage =
        "Your connection will become inactive after 30 seconds, please type '!abort', type some commands or ask DigyBot something just to make an activity to cancel connection termination.";
    workerInterval = 60; //seconds = 1 minute
    warningTimeBeforeDeletion = 30; //seconds
    outputServer = process.env.localTestServer ? process.env.localTestServer : "http://localhost:2468/message"

    settings = {
        UMMRPM: 5,
        MUPS: 10,
        SMMR: 50,
        CHMPML: 27,
        get sendMaxCount() {
            return this.UMMRPM * this.MUPS * this.SMMR
        }
    }
}

export const LOGS: string[] = [];

export const Runtime = new MainRuntime();
