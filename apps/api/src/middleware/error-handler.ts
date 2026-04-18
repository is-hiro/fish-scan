import type { ErrorRequestHandler } from 'express'
import { z } from 'zod'

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  const message = error instanceof Error ? error.message : 'Unexpected error.'
  const statusCode = error instanceof z.ZodError ? 400 : 500

  response.status(statusCode).json({
    error: message,
  })
}
