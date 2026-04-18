import type { AnalyzeResponse } from '@fish-scan/shared'

export const sampleAnalysisResponse: AnalyzeResponse = {
  weather: {
    location: {
      name: 'Астрахань',
      country: 'Россия',
      latitude: 46.35,
      longitude: 48.04,
      timezone: 'Europe/Astrakhan',
    },
    current: {
      time: '2026-04-18T06:00:00.000Z',
      temperatureC: 11,
      relativeHumidity: 68,
      cloudCover: 42,
      precipitationMm: 0,
      pressureHpa: 754,
      windSpeedKmh: 14.4,
      windDirectionDeg: 110,
      isDay: true,
    },
    hourly: Array.from({ length: 12 }, (_, index) => ({
      time: `2026-04-18T${String(index + 6).padStart(2, '0')}:00:00.000Z`,
      temperatureC: 11 + Math.min(index, 4),
      relativeHumidity: 64 + (index % 3),
      cloudCover: 35 + index * 3,
      precipitationProbability: Math.min(index * 4, 40),
      precipitationMm: index > 8 ? 0.2 : 0,
      pressureHpa: 754 - index * 0.4,
      windSpeedKmh: 12 + index,
      windDirectionDeg: 110,
      isDay: index < 11,
    })),
    provider: 'open-meteo',
  },
  analysis: {
    generatedAt: '2026-04-18T05:55:00.000Z',
    overallCatchScore: 71,
    confidenceLevel: 82,
    status: 'good',
    bestFishingWindow: {
      start: '2026-04-18T06:00:00.000Z',
      end: '2026-04-18T09:00:00.000Z',
      label: 'Лучшее время утром',
      score: 84,
    },
    fishRecommendations: [
      {
        fishCode: 'pike',
        fishName: 'Щука',
        score: 82,
        status: 'excellent',
        bait: ['воблер', 'силикон'],
        tactics: ['медленная проводка', 'облов кромки травы'],
        reasons: [],
      },
      {
        fishCode: 'perch',
        fishName: 'Окунь',
        score: 74,
        status: 'good',
        bait: ['микроджиг', 'вертушка'],
        tactics: ['поиск стаи', 'ступенчатая проводка'],
        reasons: [],
      },
    ],
    baitRecommendations: [],
    reasonCodes: [
      {
        code: 'stable_pressure',
        impact: 'positive',
        title: 'Стабильное давление',
        details: 'Резких скачков давления нет, рыба ведет себя спокойнее.',
      },
      {
        code: 'comfortable_wind',
        impact: 'positive',
        title: 'Умеренный ветер',
        details: 'Ветер не мешает удерживать точку и подаче приманки.',
      },
    ],
  },
  aiSummary:
    'Утреннее окно выглядит самым перспективным: давление держится стабильно, ветер умеренный, а щука и окунь остаются основными целями.',
}
