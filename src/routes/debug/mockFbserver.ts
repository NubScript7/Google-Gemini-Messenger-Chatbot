import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { userPostMessageBodySchema } from "../../schema/validator/mockFbServer";

export const mockFb = new Hono();

mockFb.post("/messages", zValidator("json", userPostMessageBodySchema), async (c) => {
    const body = await c.req.json()

    console.log("Mock FB Server received message:", body);

    return c.text("EVENT_RECEIVED")
})

mockFb.get("/messages", (c) => c.text("Switch to POST request dumbass"))
