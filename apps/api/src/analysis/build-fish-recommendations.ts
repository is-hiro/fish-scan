import { FISH_SPECIES, type FishCode } from '@fish-scan/shared'

import type { analyzeFishing } from '@fish-scan/fishing-rules'

import { mapStatus } from './map-status.js'

type FishResult = ReturnType<typeof analyzeFishing>['fishResults'][number]

export function buildFishRecommendations(items: FishResult[], selectedFishCodes?: FishCode[]) {
  const filtered = selectedFishCodes?.length
    ? items.filter((item) => selectedFishCodes.includes(item.fishCode))
    : items

  return filtered.map((item) => {
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
}
