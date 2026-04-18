import crypto from 'node:crypto'

import cors from 'cors'
import express from 'express'
import { Agent } from 'undici'
import { z } from 'zod'

import {
  FISH_SPECIES,
  type AnalyzeResponse,
  type CatchAnalysis,
  type FishCode,
  type LocationDetails,
  type LocationQuery,
  type WeatherBundle,
  type WeatherHourlyPoint,
} from '@fish-scan/shared'
import { analyzeFishing, type WeatherInput } from '@fish-scan/fishing-rules'

const fishCodeSchema = z.enum(['crucian_carp', 'carp', 'pike', 'perch', 'bream'])
const appLanguageSchema = z.enum(['ru', 'en'])

const locationQuerySchema = z
  .object({
    query: z.string().trim().min(2).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
  })
  .refine(
    (value) =>
      Boolean(value.query) || (value.latitude !== undefined && value.longitude !== undefined),
    {
      message: 'Provide location query or coordinates.',
    }
  )

const analyzeRequestSchema = z.object({
  location: locationQuerySchema,
  fishCodes: z.array(fishCodeSchema).optional(),
  language: appLanguageSchema.optional(),
})

const explainRequestSchema = z.object({
  weather: z.any(),
  analysis: z.any(),
  language: appLanguageSchema.optional(),
})

type Fetcher = typeof fetch

interface WeatherService {
  getWeather(location: LocationQuery): Promise<WeatherBundle>
}

interface AiService {
  explain(
    weather: WeatherBundle,
    analysis: CatchAnalysis,
    language?: 'ru' | 'en'
  ): Promise<string | null>
}

interface CacheEntry<T> {
  expiresAt: number
  value: T
}

class TTLCache<T> {
  private readonly store = new Map<string, CacheEntry<T>>()

  constructor(private readonly ttlMs: number) {}

  get(key: string): T | null {
    const entry = this.store.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }

    return entry.value
  }

  set(key: string, value: T): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs,
    })
  }
}

class OpenMeteoWeatherService implements WeatherService {
  private readonly cache = new TTLCache<WeatherBundle>(10 * 60 * 1000)

  constructor(private readonly fetcher: Fetcher = fetch) {}

  async getWeather(locationQuery: LocationQuery): Promise<WeatherBundle> {
    const cacheKey = JSON.stringify(locationQuery)
    const cached = this.cache.get(cacheKey)
    if (cached) return cached

    const location = await this.resolveLocation(locationQuery)
    const url = new URL('https://api.open-meteo.com/v1/forecast')
    url.searchParams.set('latitude', String(location.latitude))
    url.searchParams.set('longitude', String(location.longitude))
    url.searchParams.set(
      'current',
      [
        'temperature_2m',
        'relative_humidity_2m',
        'cloud_cover',
        'precipitation',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'is_day',
      ].join(',')
    )
    url.searchParams.set(
      'hourly',
      [
        'temperature_2m',
        'relative_humidity_2m',
        'cloud_cover',
        'precipitation_probability',
        'precipitation',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'is_day',
      ].join(',')
    )
    url.searchParams.set('forecast_days', '3')
    url.searchParams.set('timezone', 'auto')

    const response = await this.fetcher(url)
    if (!response.ok) {
      throw new Error(`Weather provider failed with status ${response.status}`)
    }

    const payload = await response.json()
    const weather: WeatherBundle = {
      location: {
        ...location,
        timezone: payload.timezone ?? location.timezone,
      },
      current: {
        time: payload.current.time,
        temperatureC: payload.current.temperature_2m,
        relativeHumidity: payload.current.relative_humidity_2m,
        cloudCover: payload.current.cloud_cover,
        precipitationMm: payload.current.precipitation,
        pressureHpa: payload.current.surface_pressure,
        windSpeedKmh: payload.current.wind_speed_10m,
        windDirectionDeg: payload.current.wind_direction_10m,
        isDay: payload.current.is_day === 1,
      },
      hourly: payload.hourly.time.slice(0, 24).map(
        (time: string, index: number): WeatherHourlyPoint => ({
          time,
          temperatureC: payload.hourly.temperature_2m[index],
          relativeHumidity: payload.hourly.relative_humidity_2m[index],
          cloudCover: payload.hourly.cloud_cover[index],
          precipitationProbability: payload.hourly.precipitation_probability[index],
          precipitationMm: payload.hourly.precipitation[index],
          pressureHpa: payload.hourly.surface_pressure[index],
          windSpeedKmh: payload.hourly.wind_speed_10m[index],
          windDirectionDeg: payload.hourly.wind_direction_10m[index],
          isDay: payload.hourly.is_day[index] === 1,
        })
      ),
      provider: 'open-meteo',
    }

    this.cache.set(cacheKey, weather)
    return weather
  }

  private async resolveLocation(locationQuery: LocationQuery): Promise<LocationDetails> {
    if (locationQuery.latitude !== undefined && locationQuery.longitude !== undefined) {
      return {
        name:
          locationQuery.query?.trim() ||
          `${locationQuery.latitude.toFixed(3)}, ${locationQuery.longitude.toFixed(3)}`,
        country: 'Unknown',
        latitude: locationQuery.latitude,
        longitude: locationQuery.longitude,
        timezone: 'auto',
      }
    }

    const url = new URL('https://geocoding-api.open-meteo.com/v1/search')
    url.searchParams.set('name', locationQuery.query ?? '')
    url.searchParams.set('count', '1')
    url.searchParams.set('language', 'ru')
    url.searchParams.set('format', 'json')

    const response = await this.fetcher(url)
    if (!response.ok) {
      throw new Error(`Geocoding provider failed with status ${response.status}`)
    }

    const payload = await response.json()
    const match = payload.results?.[0]
    if (!match) {
      throw new Error('Location not found.')
    }

    return {
      name: match.name,
      country: match.country ?? match.country_code ?? 'Unknown',
      latitude: match.latitude,
      longitude: match.longitude,
      timezone: match.timezone ?? 'auto',
    }
  }
}

class GigaChatAiService implements AiService {
  private readonly tokenCache = new TTLCache<string>(25 * 60 * 1000)
  private readonly dispatcher: Agent | undefined

  constructor(
    private readonly fetcher: Fetcher = fetch,
    private readonly env: NodeJS.ProcessEnv = process.env
  ) {
    this.dispatcher =
      this.env.GIGACHAT_ALLOW_INSECURE_TLS === 'true'
        ? new Agent({
            connect: {
              rejectUnauthorized: false,
            },
          })
        : undefined
  }

  async explain(
    weather: WeatherBundle,
    analysis: CatchAnalysis,
    language: 'ru' | 'en' = 'ru'
  ): Promise<string | null> {
    const token = await this.getAccessToken()
    if (!token) {
      return null
    }

    const systemPrompt =
      language === 'en'
        ? 'You are a fishing assistant. Explain briefly and clearly. Do not invent new weather facts and do not change calculated scores. If confidence is limited, say so directly. Answer in English in 3-5 sentences.'
        : 'Ты рыболовный помощник. Объясняй кратко и по делу. Не придумывай новых погодных фактов и не меняй рассчитанные баллы. Если уверенность ограничена, прямо скажи об этом. Ответ дай на русском языке в 3-5 предложениях.'

    const response = await this.fetcher(
      'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
      this.withGigaChatTls({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          model: this.env.GIGACHAT_MODEL ?? 'GigaChat',
          temperature: 0.2,
          max_tokens: 280,
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: JSON.stringify(
                {
                  location: weather.location,
                  currentWeather: weather.current,
                  topFish: analysis.fishRecommendations.slice(0, 3),
                  overallCatchScore: analysis.overallCatchScore,
                  confidenceLevel: analysis.confidenceLevel,
                  status: analysis.status,
                  reasonCodes: analysis.reasonCodes,
                  bestFishingWindow: analysis.bestFishingWindow,
                },
                null,
                2
              ),
            },
          ],
        }),
      })
    )

    if (!response.ok) {
      return null
    }

    const payload = await response.json()
    const content = payload.choices?.[0]?.message?.content
    if (typeof content !== 'string' || content.trim().length === 0) {
      return null
    }

    return content.replace(/\s+/g, ' ').trim().slice(0, 700)
  }

  private async getAccessToken(): Promise<string | null> {
    const explicitToken = this.env.GIGACHAT_ACCESS_TOKEN
    if (explicitToken) {
      return explicitToken
    }

    const credentials = this.env.GIGACHAT_CREDENTIALS
    if (!credentials) {
      return null
    }

    const cached = this.tokenCache.get('gigachat')
    if (cached) {
      return cached
    }

    const response = await this.fetcher(
      'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
      this.withGigaChatTls({
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          Authorization: `Basic ${credentials}`,
          RqUID: crypto.randomUUID(),
        },
        body: new URLSearchParams({
          scope: this.env.GIGACHAT_SCOPE ?? 'GIGACHAT_API_PERS',
        }),
      })
    )

    if (!response.ok) {
      return null
    }

    const payload = await response.json()
    if (!payload.access_token) {
      return null
    }

    this.tokenCache.set('gigachat', payload.access_token)
    return payload.access_token
  }

  private withGigaChatTls(init: RequestInit): RequestInit {
    if (!this.dispatcher) {
      return init
    }

    return {
      ...init,
      dispatcher: this.dispatcher,
    } as RequestInit
  }
}

function mapStatus(score: number): CatchAnalysis['status'] {
  if (score >= 75) return 'excellent'
  if (score >= 60) return 'good'
  if (score >= 40) return 'moderate'
  return 'poor'
}

function buildAnalysis(weather: WeatherBundle, selectedFishCodes?: FishCode[]): CatchAnalysis {
  const ruleInput: WeatherInput[] = weather.hourly.map((point) => ({
    time: point.time,
    temperatureC: point.temperatureC,
    relativeHumidity: point.relativeHumidity,
    cloudCover: point.cloudCover,
    precipitationProbability: point.precipitationProbability,
    precipitationMm: point.precipitationMm,
    pressureHpa: point.pressureHpa,
    windSpeedKmh: point.windSpeedKmh,
    windDirectionDeg: point.windDirectionDeg,
    isDay: point.isDay,
  }))

  const result = analyzeFishing(ruleInput)
  const filtered = selectedFishCodes?.length
    ? result.fishResults.filter((item) => selectedFishCodes.includes(item.fishCode))
    : result.fishResults

  const fishRecommendations = filtered.map((item) => {
    const fish = FISH_SPECIES.find((species) => species.code === item.fishCode)

    return {
      fishCode: item.fishCode,
      fishName: fish?.name ?? item.fishCode,
      score: item.score,
      status: mapStatus(item.score),
      bait: item.bait,
      tactics: item.tactics,
      reasons: item.reasons,
    }
  })

  return {
    generatedAt: new Date().toISOString(),
    overallCatchScore:
      fishRecommendations.length > 0
        ? Math.round(
            fishRecommendations.reduce((sum, item) => sum + item.score, 0) /
              fishRecommendations.length
          )
        : result.overallCatchScore,
    confidenceLevel: result.confidenceLevel,
    status:
      fishRecommendations.length > 0
        ? mapStatus(
            Math.round(
              fishRecommendations.reduce((sum, item) => sum + item.score, 0) /
                fishRecommendations.length
            )
          )
        : result.status,
    bestFishingWindow: result.bestFishingWindow,
    fishRecommendations,
    baitRecommendations: fishRecommendations.map((item) => ({
      fishCode: item.fishCode,
      label: `${item.fishName}: ${item.bait.slice(0, 2).join(', ')}`,
      tactics: item.tactics,
    })),
    reasonCodes: result.reasonCodes,
  }
}

export function createApp(services?: { weatherService?: WeatherService; aiService?: AiService }) {
  const weatherService = services?.weatherService ?? new OpenMeteoWeatherService()
  const aiService = services?.aiService ?? new GigaChatAiService()
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.get('/api/health', (_request, response) => {
    response.json({
      ok: true,
      service: 'fish-scan-api',
      weatherProvider: 'open-meteo',
      aiProvider:
        process.env.GIGACHAT_CREDENTIALS || process.env.GIGACHAT_ACCESS_TOKEN
          ? 'gigachat'
          : 'disabled',
    })
  })

  app.get('/api/fish-species', (_request, response) => {
    response.json({ items: FISH_SPECIES })
  })

  app.get('/api/weather', async (request, response, next) => {
    try {
      const location = locationQuerySchema.parse({
        query: typeof request.query.query === 'string' ? request.query.query : undefined,
        latitude:
          typeof request.query.latitude === 'string' ? Number(request.query.latitude) : undefined,
        longitude:
          typeof request.query.longitude === 'string' ? Number(request.query.longitude) : undefined,
      })

      const weather = await weatherService.getWeather(location)
      response.json(weather)
    } catch (error) {
      next(error)
    }
  })

  app.post('/api/analyze', async (request, response, next) => {
    try {
      const payload = analyzeRequestSchema.parse(request.body)
      const weather = await weatherService.getWeather(payload.location)
      const analysis = buildAnalysis(weather, payload.fishCodes)
      const aiSummary = await aiService.explain(weather, analysis, payload.language)
      const result: AnalyzeResponse = { weather, analysis, aiSummary }

      response.json(result)
    } catch (error) {
      next(error)
    }
  })

  app.post('/api/ai/explain', async (request, response, next) => {
    try {
      const payload = explainRequestSchema.parse(request.body)
      const aiSummary = await aiService.explain(payload.weather, payload.analysis, payload.language)
      response.json({ aiSummary })
    } catch (error) {
      next(error)
    }
  })

  app.use(
    (
      error: unknown,
      _request: express.Request,
      response: express.Response,
      _next: express.NextFunction
    ) => {
      const message = error instanceof Error ? error.message : 'Unexpected error.'
      const statusCode = error instanceof z.ZodError ? 400 : 500
      response.status(statusCode).json({
        error: message,
      })
    }
  )

  return app
}
