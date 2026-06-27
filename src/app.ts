import { Hono } from "hono";
import { routes } from "./routes";
import { errorHandler } from "./error";

export const PORT = Number(process.env.PORT) || 3000;
export const app = new Hono();
app.onError(errorHandler)
app.route("/", routes);

export default app
