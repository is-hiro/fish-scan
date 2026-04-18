import { describe, expect, it } from 'vitest'

import { analyzeFishing, type WeatherInput } from './index.js'

function makePoint(overrides: Partial<WeatherInput> = {}): WeatherInput {
  return {
    time: '2026-04-18T05:00:00Z',
    temperatureC: 14,
    relativeHumidity: 58,
    cloudCover: 44,
    precipitationProbability: 10,
    precipitationMm: 0,
    pressureHpa: 752,
    windSpeedKmh: 11,
    windDirectionDeg: 120,
    isDay: true,
    ...overrides,
  }
}

describe('analyzeFishing', () => {
  it('returns strong scores for stable dawn conditions', () => {
    const points = [
      makePoint(),
      makePoint({ time: '2026-04-18T06:00:00Z', pressureHpa: 752.4 }),
      makePoint({ time: '2026-04-18T07:00:00Z', pressureHpa: 752.8 }),
    ]

    const result = analyzeFishing(points)

    expect(result.overallCatchScore).toBeGreaterThan(60)
    expect(result.bestFishingWindow).not.toBeNull()
    expect(result.reasonCodes.some((reason) => reason.code === 'stable_pressure')).toBe(true)
    expect(result.fishResults[0]?.score).toBeGreaterThan(result.fishResults.at(-1)?.score ?? 0)
  })

  it('penalizes strong wind and pressure drop', () => {
    const points = [
      makePoint({
        pressureHpa: 751,
        windSpeedKmh: 36,
        precipitationProbability: 82,
        precipitationMm: 2.2,
      }),
      makePoint({ time: '2026-04-18T06:00:00Z', pressureHpa: 748, windSpeedKmh: 34 }),
      makePoint({ time: '2026-04-18T07:00:00Z', pressureHpa: 746, windSpeedKmh: 33 }),
    ]

    const result = analyzeFishing(points)

    expect(result.overallCatchScore).toBeLessThan(55)
    expect(result.reasonCodes.some((reason) => reason.code === 'pressure_drop')).toBe(true)
    expect(result.reasonCodes.some((reason) => reason.code === 'strong_wind')).toBe(true)
  })
})
