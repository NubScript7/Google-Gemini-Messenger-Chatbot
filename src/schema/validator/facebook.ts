import z from "zod";


const senderSchema = z.object({
  id: z.string().min(1),
})

const messageSchema = z.object({
  text: z.string().min(1),
})

const userMessageEntrySchema = z.object({
  sender: senderSchema,
  message: messageSchema,
})

const userMessageMessagingBodySchema = z.object({
  messaging: z.array(userMessageEntrySchema).min(1),
})

export const userRequestBodySchema = z.object({
  object: z.string(),
  entry: z.array(userMessageMessagingBodySchema).min(1),
})
