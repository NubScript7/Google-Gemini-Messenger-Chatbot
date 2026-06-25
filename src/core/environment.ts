import { config } from "dotenv";
import dotenvParser from "dotenv-parse-variables"

type EnvironmentVariables = {
    GOOGLE_GEMINI_API_KEY: string,
    FB_PAGE_ACCESS_TOKEN: string,
    FB_PAGE_ID: number,
    FB_PAGE_VERIFY_TOKEN: string,
    VERSION: string,
    OVERRIDE_MODEL: string,
    FB_GRAPH_API_URL: string,
    ENABLE_DEBUG_API: boolean,
    DEBUG_CHAT_GENERATION: boolean,
    DEBUG_CHAT_GENERATION_MESSAGE: string
}

const loaded = config()

const filtered = Object.entries({
    ...process.env,
    ...loaded.parsed,
})
.filter(([, value]) => value !== undefined)

const temp = Object.fromEntries(filtered) as Record<string, string>

export const env = dotenvParser(temp) as EnvironmentVariables;
