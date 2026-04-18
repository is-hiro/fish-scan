import { Router } from 'express'

import { explainRequestSchema } from '../schemas/requests.js'
import type { AiService } from '../types/services.js'
import { asyncHandler } from './async-handler.js'

export function createAiRouter(aiService: AiService): Router {
  const router = Router()

  router.post(
    '/api/ai/explain',
    asyncHandler(async (request, response) => {
      const payload = explainRequestSchema.parse(request.body)
      const aiSummary = await aiService.explain(payload.weather, payload.analysis, payload.language)
      response.json({ aiSummary })
    })
  )

  return router
}
