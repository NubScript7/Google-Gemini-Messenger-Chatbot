import { serve } from "@hono/node-server";
import { app, PORT } from "./app"

console.log(`Server is running on http://localhost:${PORT}`);

serve({
    fetch: app.fetch,
    port: PORT
})

