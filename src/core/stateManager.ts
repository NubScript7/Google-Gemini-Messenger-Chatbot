import { env } from "./environment";

export const StateManager = {
    ACCCEPT_FB_MESSAGES: true,
    VERSION: env.VERSION || "2.0.0",
    BOT_NAME: "GGMC BOT",
    FB_GRAPH_API_URL: env.FB_GRAPH_API_URL || `https://graph.facebook.com/v23.0/me/messages`,
    SEND_TIMEOUT: 25000,
}
