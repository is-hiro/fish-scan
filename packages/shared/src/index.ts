export type FishCode = 'crucian_carp' | 'carp' | 'pike' | 'perch' | 'bream'

export type CatchStatus = 'poor' | 'moderate' | 'good' | 'excellent'

export interface LocationQuery {
  query?: string | undefined
  latitude?: number | undefined
  longitude?: number | undefined
}

export interface LocationDetails {
  name: string
  country: string
  latitude: number
  longitude: number
  timezone: string
}

export interface WeatherCurrent {
  time: string
  temperatureC: number
  relativeHumidity: number
  cloudCover: number
  precipitationMm: number
  pressureHpa: number
  windSpeedKmh: number
  windDirectionDeg: number
  isDay: boolean
}

export interface WeatherHourlyPoint {
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

export interface WeatherBundle {
  location: LocationDetails
  current: WeatherCurrent
  hourly: WeatherHourlyPoint[]
  provider: 'open-meteo'
}

export interface ReasonCode {
  code: string
  impact: 'positive' | 'negative' | 'neutral'
  title: string
  details: string
}

export interface BaitRecommendation {
  fishCode: FishCode
  label: string
  tactics: string[]
}

export interface FishRecommendation {
  fishCode: FishCode
  fishName: string
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

export interface CatchAnalysis {
  generatedAt: string
  overallCatchScore: number
  confidenceLevel: number
  status: CatchStatus
  bestFishingWindow: BestFishingWindow | null
  fishRecommendations: FishRecommendation[]
  baitRecommendations: BaitRecommendation[]
  reasonCodes: ReasonCode[]
}

export interface AnalysisRequest {
  location?: LocationQuery | undefined
  fishCodes?: FishCode[] | undefined
}

export interface AnalyzeResponse {
  weather: WeatherBundle
  analysis: CatchAnalysis
  aiSummary: string | null
}

export interface FishSpeciesDefinition {
  code: FishCode
  name: string
  habitat: string
  preferredBaits: string[]
  tactics: string[]
}

export const FISH_SPECIES: FishSpeciesDefinition[] = [
  {
    code: 'crucian_carp',
    name: 'Карась',
    habitat: 'Стоячая вода, заливы, заросшие участки',
    preferredBaits: ['червь', 'опарыш', 'тесто', 'перловка'],
    tactics: ['поплавочная удочка', 'тихая подача', 'ловля у растительности'],
  },
  {
    code: 'carp',
    name: 'Карп',
    habitat: 'Пруды, карьеры, медленные участки рек',
    preferredBaits: ['бойлы', 'кукуруза', 'пеллетс', 'червь'],
    tactics: ['донная оснастка', 'прикормка точки', 'ожидание на глубине'],
  },
  {
    code: 'pike',
    name: 'Щука',
    habitat: 'Бровки, коряжник, травянистые окна',
    preferredBaits: ['воблер', 'силикон', 'блесна', 'живец'],
    tactics: ['медленная ступенька', 'облов кромки травы', 'работа по окнам'],
  },
  {
    code: 'perch',
    name: 'Окунь',
    habitat: 'Стаи у свалов, камни, трава',
    preferredBaits: ['микроджиг', 'червь', 'вертушка', 'мотыль'],
    tactics: ['активный поиск', 'проводка у дна', 'ловля на рассвете'],
  },
  {
    code: 'bream',
    name: 'Лещ',
    habitat: 'Глубокие ямы и русловые участки',
    preferredBaits: ['фидерная смесь', 'опарыш', 'червь', 'кукуруза'],
    tactics: ['фидер', 'стабильная прикормка', 'дальняя точка'],
  },
]

export const STATUS_LABELS: Record<CatchStatus, string> = {
  poor: 'Слабый клев',
  moderate: 'Средний клев',
  good: 'Хороший клев',
  excellent: 'Отличный клев',
}
