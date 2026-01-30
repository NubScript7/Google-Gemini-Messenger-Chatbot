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
    ENABLE_DEBUG_API: boolean
}

config()

export const loaded = { ...process.env };

export const env = dotenvParser(loaded.parsed!) as EnvironmentVariables;

