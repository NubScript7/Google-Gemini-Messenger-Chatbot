import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { env } from "../../environment";
import { generateAPI } from "./generate";
import { tokenAPI } from "./token";

export const API = new Hono()

API.use(bearerAuth({
    token: env.AUTH_API_TOKEN
}))

API.route("/generate", generateAPI)
API.route("/token",  tokenAPI)
