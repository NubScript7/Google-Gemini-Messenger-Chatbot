import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { routes } from "./routes";
import "./core/envChecker"
import "./core/chatbot/sessionCollector"

const app = new Hono();
const PORT = 3000;

app.route("/", routes);

serve({
    fetch: app.fetch,
    port: PORT
})

console.log(`Server is running on http://localhost:${PORT}`);
