import { getLocale, getTimeOfDayLabel, type AppLanguage } from './i18n'

export function formatTime(value: string, language: AppLanguage = 'ru'): string {
  return new Date(value).toLocaleString(getLocale(language), {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatHour(value: string, language: AppLanguage = 'ru'): string {
  return new Date(value).toLocaleTimeString(getLocale(language), {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function toMmHg(value: number): number {
  return Math.round(value * 0.75006156)
}

export function toMetersPerSecond(value: number): number {
  return Number((value / 3.6).toFixed(1))
}

export function estimatedWaterTemp(value: number): number {
  return Number((value * 0.72 + 3).toFixed(1))
}

export function describeTimeOfDay(value: string, language: AppLanguage = 'ru'): string {
  return getTimeOfDayLabel(language, value)
}

export function buildSparkline(points: number[]): string {
  if (points.length === 0) return ''

  const min = Math.min(...points)
  const max = Math.max(...points)
  const spread = max - min || 1

  return points
    .map((value, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * 100
      const y = 90 - ((value - min) / spread) * 70
      return `${x},${y}`
    })
    .join(' ')
}
