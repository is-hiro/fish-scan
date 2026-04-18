import type { LocationDetails, LocationQuery } from '@fish-scan/shared'

export function buildCoordinateLocation(locationQuery: LocationQuery): LocationDetails {
  return {
    name:
      locationQuery.query?.trim() ||
      `${locationQuery.latitude?.toFixed(3)}, ${locationQuery.longitude?.toFixed(3)}`,
    country: 'Unknown',
    latitude: locationQuery.latitude!,
    longitude: locationQuery.longitude!,
    timezone: 'auto',
  }
}

export function mapGeocodingLocation(match: any): LocationDetails {
  return {
    name: match.name,
    country: match.country ?? match.country_code ?? 'Unknown',
    latitude: match.latitude,
    longitude: match.longitude,
    timezone: match.timezone ?? 'auto',
  }
}
