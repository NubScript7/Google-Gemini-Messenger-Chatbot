import { Hono } from "hono";
import { countToken } from "../../bot/util";
import { zValidator } from "@hono/zod-validator";
import { TokenCountSchema } from "../../schema/token";
import { createZodInvalidFormatHandler } from "../../error";

export const tokenAPI = new Hono()

tokenAPI.post("/count", zValidator("json", TokenCountSchema, createZodInvalidFormatHandler()), async c => {
    const { prompt } = c.req.valid("json")

    const token = await countToken(prompt)

    return c.json({
        count: token.totalTokens,
        cachedContentCount: token.cachedContentTokenCount
    })
})
