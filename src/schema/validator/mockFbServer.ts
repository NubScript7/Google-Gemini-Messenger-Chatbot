import z, { string } from "zod";

const recipientSchema = z.object({
    id: string().min(1)
})

const messageSchema = z.object({
    text: string().min(1)
})

export const userPostMessageBodySchema = z.object({
    recipient: recipientSchema,
    message: messageSchema,
})
