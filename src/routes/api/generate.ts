import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { GenerateAPISchema } from "../../schema/generate";
import { generateContent, generateContentStream } from "../../bot/generateMessage";
import { streamSSE } from "hono/streaming";
import { generateContentLite } from "../../bot/generateLite";
import { createZodInvalidFormatHandler } from "../../error";
import { logError } from "../../lib/errorLogger";

export const generateAPI = new Hono()

const chatValidator = () => zValidator("json", GenerateAPISchema, createZodInvalidFormatHandler())

generateAPI.post('/chat', chatValidator(), async c => {
    const { history, prompt } = c.req.valid("json")

    try {
        const response = await generateContent(history.contents, prompt)
        return c.json({ result: response.text, success: true });
    } catch(err) {
        logError(err)
        return c.json({ result: null, success: false }, 500)
    }

})

generateAPI.post('/chat/stream', chatValidator(), c => {
    const { history, prompt } = c.req.valid("json")

    return streamSSE(c, async (stream) => {
        try {
            const response = await generateContentStream(history.contents, prompt)
    
            for await (const chunk of response) {
                if (chunk.text) {
                    await stream.writeSSE({
                        data: chunk.text
                    })
                }
            }
    
            await stream.writeSSE({
                data: "[DONE]"
            })
            await stream.close()
        } catch (err: any) {
            logError(err)
            await stream.writeSSE({
                data: JSON.stringify({ error: err.message || err }),
                event: "error"
            })
            await stream.close()
        }
    })
})


generateAPI.post('/chat/lite', chatValidator(), async c => {
    const { history, prompt } = c.req.valid("json")

    try {
        const response = await generateContentLite(history.contents, prompt)
        return c.json({ result: response.text, success: true });
    } catch {
        return c.json({ result: null, success: false }, 500)
    }
})
