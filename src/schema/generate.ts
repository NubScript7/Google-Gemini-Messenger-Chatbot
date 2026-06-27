import * as z from "zod"

const CHAT_HISTORY_MAX_CONTENT = 150

export const ContentPartSchema = z.object({
    text: z.string()
})

export const ChatContentSchema = z.object({
    role: z.literal(["user", "model"]),
    parts: z.array(ContentPartSchema)
})

export const ChatHistorySchema = z.object({
    contents: z.array(ChatContentSchema).max(CHAT_HISTORY_MAX_CONTENT)
})

export const GenerateAPISchema = z.object({
    history: ChatHistorySchema,
    prompt: z.string().min(1)
})
