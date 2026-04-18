import type { CatchAnalysis, LocationQuery, WeatherBundle } from '@fish-scan/shared'

export interface WeatherService {
  getWeather(location: LocationQuery): Promise<WeatherBundle>
}

export interface AiService {
  explain(
    weather: WeatherBundle,
    analysis: CatchAnalysis,
    language?: 'ru' | 'en'
  ): Promise<string | null>
}

export interface AppServices {
  weatherService?: WeatherService
  aiService?: AiService
}
