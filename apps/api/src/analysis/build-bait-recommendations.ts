import type { CatchAnalysis } from '@fish-scan/shared'

export function buildBaitRecommendations(
  fishRecommendations: CatchAnalysis['fishRecommendations']
) {
  return fishRecommendations.map((item) => ({
    fishCode: item.fishCode,
    label: `${item.fishName}: ${item.bait.slice(0, 2).join(', ')}`,
    tactics: item.tactics,
  }))
}
