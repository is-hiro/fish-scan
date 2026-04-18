import { analyzeFishing } from '@fish-scan/fishing-rules'
import type { CatchAnalysis, FishCode, WeatherBundle } from '@fish-scan/shared'

import { buildBaitRecommendations } from './build-bait-recommendations.js'
import { buildFishRecommendations } from './build-fish-recommendations.js'
import { getAverageScore } from './get-average-score.js'
import { mapStatus } from './map-status.js'
import { toWeatherInput } from './to-weather-input.js'

export function buildAnalysis(weather: WeatherBundle, selectedFishCodes?: FishCode[]): CatchAnalysis {
  const result = analyzeFishing(toWeatherInput(weather))
  const fishRecommendations = buildFishRecommendations(result.fishResults, selectedFishCodes)
  const averageScore = getAverageScore(
    fishRecommendations.map((item) => item.score),
    result.overallCatchScore
  )

  return {
    generatedAt: new Date().toISOString(),
    overallCatchScore: averageScore,
    confidenceLevel: result.confidenceLevel,
    status: fishRecommendations.length > 0 ? mapStatus(averageScore) : result.status,
    bestFishingWindow: result.bestFishingWindow,
    fishRecommendations,
    baitRecommendations: buildBaitRecommendations(fishRecommendations),
    reasonCodes: result.reasonCodes,
  }
}
