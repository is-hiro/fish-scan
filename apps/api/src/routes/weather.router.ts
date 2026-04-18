import { Router } from 'express'

import type { WeatherService } from '../types/services.js'
import { locationQuerySchema } from '../schemas/location-query.js'
import { asyncHandler } from './async-handler.js'

export function createWeatherRouter(weatherService: WeatherService): Router {
  const router = Router()

  router.get(
    '/api/weather',
    asyncHandler(async (request, response) => {
      const location = locationQuerySchema.parse({
        query: typeof request.query.query === 'string' ? request.query.query : undefined,
        latitude: typeof request.query.latitude === 'string' ? Number(request.query.latitude) : undefined,
        longitude:
          typeof request.query.longitude === 'string' ? Number(request.query.longitude) : undefined,
      })

      response.json(await weatherService.getWeather(location))
    })
  )

  return router
}
