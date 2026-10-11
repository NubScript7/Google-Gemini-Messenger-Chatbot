import { Hono } from "hono";
import { routes } from "./routes";
import { errorHandler } from "./error";

export const app = new Hono();
app.onError(errorHandler)
app.route("/", routes);

export default app
