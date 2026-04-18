import { Router } from 'express'

import { hasAiProviderConfig } from '../services/ai/ai-env.js'

export function createHealthRouter(env: NodeJS.ProcessEnv = process.env): Router {
  const router = Router()

  router.get('/api/health', (_request, response) => {
    response.json({
      ok: true,
      service: 'fish-scan-api',
      weatherProvider: 'open-meteo',
      aiProvider: hasAiProviderConfig(env) ? 'gigachat' : 'disabled',
    })
  })

  return router
}
