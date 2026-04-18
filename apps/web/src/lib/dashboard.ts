import type { AnalyzeResponse } from '@fish-scan/shared'

import { formatHour, toMetersPerSecond, toMmHg } from './format'
import type { AppLanguage } from './i18n'

export type WeatherCode = 'clear' | 'cloudy' | 'rain'

export interface RuleCard {
  title: string
  value: string
  tone: 'positive' | 'negative' | 'neutral'
}

export function getWeatherCode(result: AnalyzeResponse | null): WeatherCode {
  const current = result?.weather.current
  if (!current) return 'clear'
  if (current.precipitationMm > 0.2) return 'rain'
  if (current.cloudCover > 55) return 'cloudy'
  return 'clear'
}

export function buildRuleCards(result: AnalyzeResponse | null, language: AppLanguage): RuleCard[] {
  if (!result) return []

  const reasonCodes = new Set(result.analysis.reasonCodes.map((item) => item.code))
  const current = result.weather.current
  const units = {
    pressure: language === 'en' ? 'mmHg' : 'мм рт. ст.',
    wind: language === 'en' ? 'm/s' : 'м/с',
  }

  return [
    {
      title: language === 'en' ? 'Pressure' : 'Давление',
      value: reasonCodes.has('stable_pressure')
        ? language === 'en'
          ? 'Stable'
          : 'Стабильно'
        : reasonCodes.has('pressure_drop')
          ? language === 'en'
            ? 'Dropping'
            : 'Падает'
          : `${toMmHg(current.pressureHpa)} ${units.pressure}`,
      tone: reasonCodes.has('stable_pressure')
        ? 'positive'
        : reasonCodes.has('pressure_drop')
          ? 'negative'
          : 'neutral',
    },
    {
      title: language === 'en' ? 'Wind' : 'Ветер',
      value: reasonCodes.has('comfortable_wind')
        ? language === 'en'
          ? 'Moderate'
          : 'Умеренный'
        : reasonCodes.has('strong_wind')
          ? language === 'en'
            ? 'Strong'
            : 'Сильный'
          : `${toMetersPerSecond(current.windSpeedKmh)} ${units.wind}`,
      tone: reasonCodes.has('comfortable_wind')
        ? 'positive'
        : reasonCodes.has('strong_wind')
          ? 'negative'
          : 'neutral',
    },
    {
      title: language === 'en' ? 'Rain and clouds' : 'Осадки и облачность',
      value:
        current.precipitationMm > 0.2
          ? language === 'en'
            ? 'Precipitation'
            : 'Есть осадки'
          : current.cloudCover >= 30 && current.cloudCover <= 70
            ? language === 'en'
              ? 'Balanced clouds'
              : 'Умеренная облачность'
            : current.cloudCover > 70
              ? language === 'en'
                ? 'Dense clouds'
                : 'Плотная облачность'
              : language === 'en'
                ? 'Clear'
                : 'Ясно',
      tone:
        current.precipitationMm > 0.2
          ? 'negative'
          : current.cloudCover >= 30 && current.cloudCover <= 70
            ? 'positive'
            : 'neutral',
    },
    {
      title: language === 'en' ? 'Best window' : 'Лучшее окно',
      value: result.analysis.bestFishingWindow
        ? `${formatHour(result.analysis.bestFishingWindow.start, language)} - ${formatHour(result.analysis.bestFishingWindow.end, language)}`
        : language === 'en'
          ? 'Not found'
          : 'Не найдено',
      tone: result.analysis.bestFishingWindow ? 'positive' : 'neutral',
    },
  ]
}
