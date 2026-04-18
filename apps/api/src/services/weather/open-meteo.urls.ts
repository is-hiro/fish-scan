import type { LocationDetails, LocationQuery } from '@fish-scan/shared'

import {
  OPEN_METEO_CURRENT_FIELDS,
  OPEN_METEO_FORECAST_URL,
  OPEN_METEO_GEOCODING_URL,
  OPEN_METEO_HOURLY_FIELDS,
} from './open-meteo.constants.js'

export function buildForecastUrl(location: LocationDetails): URL {
  const url = new URL(OPEN_METEO_FORECAST_URL)
  url.searchParams.set('latitude', String(location.latitude))
  url.searchParams.set('longitude', String(location.longitude))
  url.searchParams.set('current', OPEN_METEO_CURRENT_FIELDS.join(','))
  url.searchParams.set('hourly', OPEN_METEO_HOURLY_FIELDS.join(','))
  url.searchParams.set('forecast_days', '3')
  url.searchParams.set('timezone', 'auto')
  return url
}

export function buildGeocodingUrl(locationQuery: LocationQuery): URL {
  const url = new URL(OPEN_METEO_GEOCODING_URL)
  url.searchParams.set('name', locationQuery.query ?? '')
  url.searchParams.set('count', '1')
  url.searchParams.set('language', 'ru')
  url.searchParams.set('format', 'json')
  return url
}
