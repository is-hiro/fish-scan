import type { LocationDetails, LocationQuery, WeatherBundle } from '@fish-scan/shared'

import { TTLCache } from '../../cache/ttl-cache.js'
import type { Fetcher } from '../../types/fetcher.js'
import type { WeatherService } from '../../types/services.js'
import { buildCoordinateLocation, mapGeocodingLocation } from './open-meteo.location.js'
import { mapWeatherBundle } from './open-meteo.mapper.js'
import { buildForecastUrl, buildGeocodingUrl } from './open-meteo.urls.js'

export class OpenMeteoWeatherService implements WeatherService {
  private readonly cache = new TTLCache<WeatherBundle>(10 * 60 * 1000)

  constructor(private readonly fetcher: Fetcher = fetch) {}

  async getWeather(locationQuery: LocationQuery): Promise<WeatherBundle> {
    const cacheKey = JSON.stringify(locationQuery)
    const cached = this.cache.get(cacheKey)
    if (cached) return cached

    const location = await this.resolveLocation(locationQuery)
    const response = await this.fetcher(buildForecastUrl(location))
    if (!response.ok) throw new Error(`Weather provider failed with status ${response.status}`)

    const weather = mapWeatherBundle(await response.json(), location)
    this.cache.set(cacheKey, weather)
    return weather
  }

  private async resolveLocation(locationQuery: LocationQuery): Promise<LocationDetails> {
    if (locationQuery.latitude !== undefined && locationQuery.longitude !== undefined) {
      return buildCoordinateLocation(locationQuery)
    }

    const response = await this.fetcher(buildGeocodingUrl(locationQuery))
    if (!response.ok) throw new Error(`Geocoding provider failed with status ${response.status}`)

    const payload = await response.json()
    const match = payload.results?.[0]
    if (!match) throw new Error('Location not found.')
    return mapGeocodingLocation(match)
  }
}
