import cors from 'cors'
import express from 'express'

import { errorHandler } from '../middleware/error-handler.js'
import { createAiRouter } from '../routes/ai.router.js'
import { createAnalyzeRouter } from '../routes/analyze.router.js'
import { createFishRouter } from '../routes/fish.router.js'
import { createHealthRouter } from '../routes/health.router.js'
import { createWeatherRouter } from '../routes/weather.router.js'
import { GigaChatAiService } from '../services/ai/gigachat-ai.service.js'
import { OpenMeteoWeatherService } from '../services/weather/open-meteo-weather.service.js'
import type { AppServices } from '../types/services.js'

export function createApp(services?: AppServices) {
  const weatherService = services?.weatherService ?? new OpenMeteoWeatherService()
  const aiService = services?.aiService ?? new GigaChatAiService()
  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use(createHealthRouter())
  app.use(createFishRouter())
  app.use(createWeatherRouter(weatherService))
  app.use(createAnalyzeRouter(weatherService, aiService))
  app.use(createAiRouter(aiService))
  app.use(errorHandler)

  return app
}
