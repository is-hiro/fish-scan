import request from 'supertest'
import { describe, expect, it } from 'vitest'

import { createApp } from '../src/server.js'

const fakeWeather = {
  location: {
    name: 'Москва',
    country: 'Russia',
    latitude: 55.75,
    longitude: 37.61,
    timezone: 'Europe/Moscow',
  },
  current: {
    time: '2026-04-18T05:00',
    temperatureC: 12,
    relativeHumidity: 60,
    cloudCover: 48,
    precipitationMm: 0,
    pressureHpa: 752,
    windSpeedKmh: 13,
    windDirectionDeg: 95,
    isDay: true,
  },
  hourly: Array.from({ length: 6 }, (_, index) => ({
    time: `2026-04-18T0${index + 5}:00`,
    temperatureC: 12 + index,
    relativeHumidity: 58,
    cloudCover: 48,
    precipitationProbability: 10,
    precipitationMm: 0,
    pressureHpa: 752 + index * 0.2,
    windSpeedKmh: 13,
    windDirectionDeg: 95,
    isDay: true,
  })),
  provider: 'open-meteo' as const,
}

describe('POST /api/analyze', () => {
  it('returns deterministic analysis and ai summary fallback', async () => {
    const app = createApp({
      weatherService: {
        async getWeather() {
          return fakeWeather
        },
      },
      aiService: {
        async explain() {
          return 'Сводка от ИИ.'
        },
      },
    })

    const response = await request(app)
      .post('/api/analyze')
      .send({
        location: { query: 'Москва' },
        fishCodes: ['pike', 'perch'],
      })

    expect(response.status).toBe(200)
    expect(response.body.weather.location.name).toBe('Москва')
    expect(response.body.analysis.fishRecommendations).toHaveLength(2)
    expect(response.body.analysis.bestFishingWindow).not.toBeNull()
    expect(response.body.aiSummary).toBe('Сводка от ИИ.')
  })

  it('validates missing location input', async () => {
    const app = createApp({
      weatherService: {
        async getWeather() {
          return fakeWeather
        },
      },
      aiService: {
        async explain() {
          return null
        },
      },
    })

    const response = await request(app).post('/api/analyze').send({
      location: {},
    })

    expect(response.status).toBe(400)
    expect(response.body.error).toContain('Provide location query or coordinates')
  })
})
