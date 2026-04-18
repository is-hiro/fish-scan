import { Router } from 'express'

import type { AnalyzeResponse } from '@fish-scan/shared'

import { buildAnalysis } from '../analysis/build-analysis.js'
import { analyzeRequestSchema } from '../schemas/requests.js'
import type { AiService, WeatherService } from '../types/services.js'
import { asyncHandler } from './async-handler.js'

export function createAnalyzeRouter(weatherService: WeatherService, aiService: AiService): Router {
  const router = Router()

  router.post(
    '/api/analyze',
    asyncHandler(async (request, response) => {
      const payload = analyzeRequestSchema.parse(request.body)
      const weather = await weatherService.getWeather(payload.location)
      const analysis = buildAnalysis(weather, payload.fishCodes)
      const aiSummary = await aiService.explain(weather, analysis, payload.language)
      const result: AnalyzeResponse = { weather, analysis, aiSummary }
      response.json(result)
    })
  )

  return router
}
