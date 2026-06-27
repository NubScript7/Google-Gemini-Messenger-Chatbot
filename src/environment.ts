import { type EnvType, load } from 'ts-dotenv';

export type Env = EnvType<typeof schema>;

export const schema = {
    GOOGLE_GEMINI_API_KEY: String,
    GOOGLE_GEMINI_MODEL: String,
    GOOGLE_GEMINI_INSTRUCTIONS: String,
    GOOGLE_GEMINI_LITE_MAX_TOKEN: Number,

    // production | development
    NODE_ENV: String,
    AUTH_API_TOKEN: String
}

export const env = load(schema);

export const IS_DEV = env.NODE_ENV === "development"
