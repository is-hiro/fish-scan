import type { WeatherInput } from '@fish-scan/fishing-rules'
import type { WeatherBundle } from '@fish-scan/shared'

export function toWeatherInput(weather: WeatherBundle): WeatherInput[] {
  return weather.hourly.map((point) => ({
    time: point.time,
    temperatureC: point.temperatureC,
    relativeHumidity: point.relativeHumidity,
    cloudCover: point.cloudCover,
    precipitationProbability: point.precipitationProbability,
    precipitationMm: point.precipitationMm,
    pressureHpa: point.pressureHpa,
    windSpeedKmh: point.windSpeedKmh,
    windDirectionDeg: point.windDirectionDeg,
    isDay: point.isDay,
  }))
}
