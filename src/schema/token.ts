import z from "zod";

export const TokenCountSchema = z.object({
    prompt: z.string().min(1)
})
