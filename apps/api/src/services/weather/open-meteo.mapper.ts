import type { LocationDetails, WeatherBundle, WeatherHourlyPoint } from '@fish-scan/shared'

export function mapWeatherBundle(payload: any, location: LocationDetails): WeatherBundle {
  return {
    location: {
      ...location,
      timezone: payload.timezone ?? location.timezone,
    },
    current: {
      time: payload.current.time,
      temperatureC: payload.current.temperature_2m,
      relativeHumidity: payload.current.relative_humidity_2m,
      cloudCover: payload.current.cloud_cover,
      precipitationMm: payload.current.precipitation,
      pressureHpa: payload.current.surface_pressure,
      windSpeedKmh: payload.current.wind_speed_10m,
      windDirectionDeg: payload.current.wind_direction_10m,
      isDay: payload.current.is_day === 1,
    },
    hourly: payload.hourly.time.slice(0, 24).map(mapHourlyPoint(payload)),
    provider: 'open-meteo',
  }
}

function mapHourlyPoint(payload: any) {
  return (time: string, index: number): WeatherHourlyPoint => ({
    time,
    temperatureC: payload.hourly.temperature_2m[index],
    relativeHumidity: payload.hourly.relative_humidity_2m[index],
    cloudCover: payload.hourly.cloud_cover[index],
    precipitationProbability: payload.hourly.precipitation_probability[index],
    precipitationMm: payload.hourly.precipitation[index],
    pressureHpa: payload.hourly.surface_pressure[index],
    windSpeedKmh: payload.hourly.wind_speed_10m[index],
    windDirectionDeg: payload.hourly.wind_direction_10m[index],
    isDay: payload.hourly.is_day[index] === 1,
  })
}
