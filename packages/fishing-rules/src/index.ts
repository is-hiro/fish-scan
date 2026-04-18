export type FishCode = 'crucian_carp' | 'carp' | 'pike' | 'perch' | 'bream'
export type CatchStatus = 'poor' | 'moderate' | 'good' | 'excellent'

export interface WeatherInput {
  time: string
  temperatureC: number
  relativeHumidity: number
  cloudCover: number
  precipitationProbability: number
  precipitationMm: number
  pressureHpa: number
  windSpeedKmh: number
  windDirectionDeg: number
  isDay: boolean
}

export interface ReasonCode {
  code: string
  impact: 'positive' | 'negative' | 'neutral'
  title: string
  details: string
}

export interface FishResult {
  fishCode: FishCode
  score: number
  status: CatchStatus
  bait: string[]
  tactics: string[]
  reasons: ReasonCode[]
}

export interface BestFishingWindow {
  start: string
  end: string
  label: string
  score: number
}

export interface FishingAnalysisResult {
  overallCatchScore: number
  confidenceLevel: number
  status: CatchStatus
  bestFishingWindow: BestFishingWindow | null
  fishResults: FishResult[]
  reasonCodes: ReasonCode[]
}

interface SpeciesProfile {
  fishCode: FishCode
  preferredPressure: [number, number]
  idealTemperature: [number, number]
  idealCloudiness: [number, number]
  idealWindLimit: number
  dawnBonus: number
  dayPenalty: number
  baits: string[]
  tactics: string[]
}

const speciesProfiles: SpeciesProfile[] = [
  {
    fishCode: 'crucian_carp',
    preferredPressure: [746, 758],
    idealTemperature: [16, 24],
    idealCloudiness: [25, 70],
    idealWindLimit: 18,
    dawnBonus: 8,
    dayPenalty: 2,
    baits: ['червь', 'опарыш', 'тесто'],
    tactics: ['тихая ловля у камыша', 'тонкая оснастка'],
  },
  {
    fishCode: 'carp',
    preferredPressure: [744, 756],
    idealTemperature: [18, 26],
    idealCloudiness: [20, 60],
    idealWindLimit: 22,
    dawnBonus: 6,
    dayPenalty: 3,
    baits: ['бойлы', 'кукуруза', 'пеллетс'],
    tactics: ['донная ловля', 'прикормка одной точки'],
  },
  {
    fishCode: 'pike',
    preferredPressure: [748, 763],
    idealTemperature: [8, 18],
    idealCloudiness: [35, 85],
    idealWindLimit: 28,
    dawnBonus: 6,
    dayPenalty: 1,
    baits: ['воблер', 'силикон', 'колебалка'],
    tactics: ['облов кромки травы', 'медленная проводка'],
  },
  {
    fishCode: 'perch',
    preferredPressure: [747, 760],
    idealTemperature: [10, 20],
    idealCloudiness: [30, 75],
    idealWindLimit: 24,
    dawnBonus: 9,
    dayPenalty: 1,
    baits: ['микроджиг', 'червь', 'вертушка'],
    tactics: ['активный поиск стаи', 'проводка ступенькой'],
  },
  {
    fishCode: 'bream',
    preferredPressure: [745, 757],
    idealTemperature: [14, 22],
    idealCloudiness: [20, 70],
    idealWindLimit: 20,
    dawnBonus: 7,
    dayPenalty: 2,
    baits: ['опарыш', 'фидерная смесь', 'кукуруза'],
    tactics: ['фидер на дистанции', 'стабильная прикормка'],
  },
]

const dawnHours = new Set([4, 5, 6, 7, 19, 20, 21])

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function toStatus(score: number): CatchStatus {
  if (score >= 75) return 'excellent'
  if (score >= 60) return 'good'
  if (score >= 40) return 'moderate'
  return 'poor'
}

function parseHour(time: string): number {
  return new Date(time).getHours()
}

function directionLabel(deg: number): string {
  if (deg >= 45 && deg < 135) return 'восточный ветер'
  if (deg >= 135 && deg < 225) return 'южный ветер'
  if (deg >= 225 && deg < 315) return 'западный ветер'
  return 'северный ветер'
}

function calculatePressureTrend(points: WeatherInput[]): number {
  if (points.length < 2) return 0
  const first = points[0]!
  const last = points[Math.min(points.length - 1, 5)]!
  return last.pressureHpa - first.pressureHpa
}

function scoreRange(value: number, min: number, max: number, outsidePenalty: number): number {
  if (value >= min && value <= max) return 0
  const delta = value < min ? min - value : value - max
  return -Math.min(outsidePenalty, delta * 2.4)
}

function buildGlobalReasons(current: WeatherInput, pressureTrend: number): ReasonCode[] {
  const reasons: ReasonCode[] = []

  if (Math.abs(pressureTrend) <= 1.5) {
    reasons.push({
      code: 'stable_pressure',
      impact: 'positive',
      title: 'Стабильное давление',
      details: 'Резких скачков давления не видно, рыба обычно реагирует спокойнее.',
    })
  } else if (pressureTrend < -2) {
    reasons.push({
      code: 'pressure_drop',
      impact: 'negative',
      title: 'Давление падает',
      details: 'Быстрое падение давления снижает предсказуемость и часто ухудшает клев.',
    })
  }

  if (current.windSpeedKmh <= 18) {
    reasons.push({
      code: 'comfortable_wind',
      impact: 'positive',
      title: 'Умеренный ветер',
      details: `${directionLabel(current.windDirectionDeg)} не мешает проводке и удержанию точки.`,
    })
  } else if (current.windSpeedKmh >= 30) {
    reasons.push({
      code: 'strong_wind',
      impact: 'negative',
      title: 'Сильный ветер',
      details: 'Сильный ветер ухудшает контроль снасти и снижает общий комфорт ловли.',
    })
  }

  if (current.cloudCover >= 35 && current.cloudCover <= 75) {
    reasons.push({
      code: 'balanced_cloudiness',
      impact: 'positive',
      title: 'Умеренная облачность',
      details: 'Такая облачность часто помогает хищнику и снижает осторожность рыбы.',
    })
  }

  if (dawnHours.has(parseHour(current.time))) {
    reasons.push({
      code: 'dawn_window',
      impact: 'positive',
      title: 'Подходящее время суток',
      details: 'Рассветные и закатные часы часто дают пик активности.',
    })
  }

  return reasons
}

function scoreFish(
  profile: SpeciesProfile,
  current: WeatherInput,
  pressureTrend: number
): FishResult {
  let score = 62
  const reasons: ReasonCode[] = []

  const pressurePenalty = scoreRange(
    current.pressureHpa,
    profile.preferredPressure[0],
    profile.preferredPressure[1],
    18
  )
  score += pressurePenalty
  if (pressurePenalty === 0) {
    reasons.push({
      code: `${profile.fishCode}_pressure_fit`,
      impact: 'positive',
      title: 'Давление подходит виду рыбы',
      details: 'Текущее давление близко к комфортному диапазону для этого вида.',
    })
  }

  const tempPenalty = scoreRange(
    current.temperatureC,
    profile.idealTemperature[0],
    profile.idealTemperature[1],
    16
  )
  score += tempPenalty

  const cloudPenalty = scoreRange(
    current.cloudCover,
    profile.idealCloudiness[0],
    profile.idealCloudiness[1],
    10
  )
  score += cloudPenalty

  if (current.windSpeedKmh <= profile.idealWindLimit) {
    score += 8
  } else {
    score -= Math.min(18, (current.windSpeedKmh - profile.idealWindLimit) * 1.5)
    reasons.push({
      code: `${profile.fishCode}_wind_penalty`,
      impact: 'negative',
      title: 'Ветер выше комфортного',
      details: 'Для выбранного вида рыбы текущий ветер уже чувствуется как помеха.',
    })
  }

  if (Math.abs(pressureTrend) <= 1.5) {
    score += 6
  } else if (pressureTrend < -2) {
    score -= 10
  }

  if (dawnHours.has(parseHour(current.time))) {
    score += profile.dawnBonus
  } else if (current.isDay) {
    score -= profile.dayPenalty
  }

  if (current.precipitationProbability >= 70 || current.precipitationMm >= 1.5) {
    score -= 7
    reasons.push({
      code: `${profile.fishCode}_rain_penalty`,
      impact: 'negative',
      title: 'Осадки ухудшают сценарий',
      details: 'Интенсивные осадки делают активность рыбы менее стабильной.',
    })
  }

  const normalized = Math.round(clamp(score, 5, 98))
  return {
    fishCode: profile.fishCode,
    score: normalized,
    status: toStatus(normalized),
    bait: profile.baits,
    tactics: profile.tactics,
    reasons,
  }
}

export function analyzeFishing(weatherPoints: WeatherInput[]): FishingAnalysisResult {
  if (weatherPoints.length === 0) {
    throw new Error('Weather data is required to analyze fishing conditions.')
  }

  const current = weatherPoints[0]!
  const pressureTrend = calculatePressureTrend(weatherPoints)
  const fishResults = speciesProfiles
    .map((profile) => scoreFish(profile, current, pressureTrend))
    .sort((left, right) => right.score - left.score)

  const bestHourly =
    weatherPoints
      .map((point) => {
        const hourScore =
          55 +
          (Math.abs(pressureTrend) <= 1.5 ? 6 : pressureTrend < -2 ? -7 : 0) +
          (point.windSpeedKmh <= 18 ? 7 : -Math.min(12, point.windSpeedKmh - 18)) +
          (point.cloudCover >= 25 && point.cloudCover <= 70 ? 5 : -4) +
          (dawnHours.has(parseHour(point.time)) ? 10 : point.isDay ? -2 : 3) +
          (point.precipitationProbability <= 35 ? 4 : -6)

        return { point, score: Math.round(clamp(hourScore, 0, 100)) }
      })
      .sort((left, right) => right.score - left.score)[0] ?? null

  const overallCatchScore = Math.round(
    clamp(fishResults.reduce((sum, item) => sum + item.score, 0) / fishResults.length, 0, 100)
  )

  const confidenceLevel = Math.round(
    clamp(72 - Math.abs(pressureTrend) * 7 - current.precipitationMm * 3, 35, 94)
  )

  const bestHourlyIndex = bestHourly ? weatherPoints.indexOf(bestHourly.point) : -1
  const nextBestPoint = bestHourly
    ? (weatherPoints[Math.min(bestHourlyIndex + 1, weatherPoints.length - 1)] ?? bestHourly.point)
    : null

  return {
    overallCatchScore,
    confidenceLevel,
    status: toStatus(overallCatchScore),
    bestFishingWindow: bestHourly
      ? {
          start: bestHourly.point.time,
          end: nextBestPoint?.time ?? bestHourly.point.time,
          label: `Лучшее окно около ${new Date(bestHourly.point.time).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          })}`,
          score: bestHourly.score,
        }
      : null,
    fishResults,
    reasonCodes: buildGlobalReasons(current, pressureTrend),
  }
}
