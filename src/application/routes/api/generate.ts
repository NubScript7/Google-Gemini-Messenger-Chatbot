import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { GenerateAPISchema } from "../../schema/generate";
import { generateContent, generateContentStream } from "../../bot/generateMessage";
import { streamSSE } from "hono/streaming";

export const generateAPI = new Hono()

generateAPI.post('/chat', zValidator("json", GenerateAPISchema), async c => {
    const { history, prompt } = c.req.valid("json")

    const response = await generateContent(history.contents, prompt)

    console.log(response)

    return c.json({ result: response.text });
});

generateAPI.post('/chat/stream', zValidator("json", GenerateAPISchema), c => {
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
        } catch (error: any) {
            await stream.writeSSE({
                data: JSON.stringify({ error: error.message || error }),
                event: "error"
            })
            await stream.close()
        }
    })
})
