import { Hono } from "hono";
import { status } from "./status";
import { API } from "./api";
import { apikey } from "./checks/apikey";
import { logError } from "../lib/errorLogger";

export const routes = new Hono();

routes.route("/api", API)
routes.route("/status", status)
routes.route("/checks", apikey)

routes.onError((err, c) => {
    logError(err)

    return c.json({
        success: false,
        error: "Internal Server Error"
    }, 500)
})

routes.get("/", (c) => c.text("Hello! this is not a place to be :)"));
