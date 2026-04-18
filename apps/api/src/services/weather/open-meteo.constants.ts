export const OPEN_METEO_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
export const OPEN_METEO_GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'

export const OPEN_METEO_CURRENT_FIELDS = [
  'temperature_2m',
  'relative_humidity_2m',
  'cloud_cover',
  'precipitation',
  'surface_pressure',
  'wind_speed_10m',
  'wind_direction_10m',
  'is_day',
]

export const OPEN_METEO_HOURLY_FIELDS = [
  'temperature_2m',
  'relative_humidity_2m',
  'cloud_cover',
  'precipitation_probability',
  'precipitation',
  'surface_pressure',
  'wind_speed_10m',
  'wind_direction_10m',
  'is_day',
]
