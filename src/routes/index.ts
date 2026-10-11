import { Hono } from "hono";
import { status } from "./status";
import { API } from "./api";

export const routes = new Hono();

routes.route("/api", API)
routes.route("/status", status)

routes.get("/", (c) => c.text("Hello! this is not a place to be :)"));
