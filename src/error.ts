import { IS_DEV } from "./environment";
import { z } from 'zod'
import type { Env, ValidationTargets } from 'hono'
import type { Hook } from '@hono/zod-validator'

export const createZodInvalidFormatHandler = <
    T extends z.ZodTypeAny,
    Target extends keyof ValidationTargets,
    E extends Env = Env,
    P extends string = string
> (): Hook<z.infer<T>, E, P, Target> => {

    return (result, c) => {

        if (!result.success && !IS_DEV) {
            const error = {
                name: "ZodError",
                message: "Cannot accept, the format may be invalid or empty."
            }
            return c.json({ success: false, error }, 400)
        }

    }

}



import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'

export const errorHandler = (err: Error, c: Context) => {
  console.error('[Error Caught]:', err)

  if (err instanceof HTTPException) {

    return c.json({
        success: false,
        error: {
            name: "HTTPException",
            message: "Invalid or missing authentication token"
        },
    }, err.status)

  }

  return c.json({
    success: false,
    error: {
        name: "InternalServerError",
        message: "There was something wrong with the server, please try again later."
    }
  }, 500)
}
