import { Hono } from "hono";
import { env } from "../../environment";

export const apikey = new Hono()

apikey.post("/apikey", (c) => {
    const key = c.req.query("value")
    const result = env.AUTH_API_TOKEN === key
    
    c.status(result ? 200 : 403)
    return c.body(null)
})
