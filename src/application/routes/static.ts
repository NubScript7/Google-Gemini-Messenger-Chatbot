import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static"

export const publicServe = new Hono()

publicServe
.use("/*", serveStatic({ root: "./" }))
