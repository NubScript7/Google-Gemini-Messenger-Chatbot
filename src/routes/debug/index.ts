import { Hono } from "hono";
import { mockFb } from "./mockFbserver";
import { env } from "../../core/environment";

export const debug = new Hono()

const ENABLE_DEBUG_API = env.ENABLE_DEBUG_API

debug.get("/enabled", (c) => c.text(ENABLE_DEBUG_API.toString()))

if (ENABLE_DEBUG_API) {

    console.log("THE DEBUG API IS ENABLED SPECIFIED IN ENV VARIABLE, BE CAREFUL")
    debug.route("/mock", mockFb);

}
