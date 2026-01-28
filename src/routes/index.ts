import { Hono } from "hono";
import { api } from "./api";
import { status } from "./status";
import { debug } from "./debug";
import { publicServe } from "./static";

export const routes = new Hono();

routes.route("/api", api)
routes.route("/status", status)
routes.route("/debug", debug)
routes.route("/public", publicServe)

routes.get("/", (c) => c.text("Hello! this is not a place to be :)"));
