import chunkify from "./chunkify";
import { LOGS, VERSION } from "./main";

export const PREFIX = "!";

export const COMMANDS = {
    "v": `app version: ${VERSION}`,
    "logs": {
        default: "Password required.",
        run: (output: string[], password: string, logIndex: string) => {
            /* const output: string[] = []; */
            if (process.env.LOGS_PASSWORD === password && !logIndex) {
                for (const LOG of LOGS) {
                    output.push(...chunkify(LOG));
                }
            }

            const LOG_INDEX = parseInt(logIndex);
            
                if (process.env.LOGS_PASSWORD === password && isNaN(LOG_INDEX) && (LOG_INDEX < 0 || LOG_INDEX >= LOGS.length)) {
                    output.push("LOGS INDEX MUST BE AN INTEGER OR A VALID INDEX RANGE");
                }
        }
    }
}
