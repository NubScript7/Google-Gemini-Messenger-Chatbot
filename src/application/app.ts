import { Hono } from "hono";
import { routes } from "./routes";

export const PORT = Number(process.env.PORT) || 3000;
export const app = new Hono();
app.route("/", routes);
