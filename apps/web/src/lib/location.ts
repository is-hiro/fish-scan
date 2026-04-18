export interface ParsedLocationInput {
  query?: string
  latitude?: number
  longitude?: number
}

export function parseLocationInput(input: string): ParsedLocationInput {
  const normalized = input.trim()
  const coords = normalized.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/)

  if (coords) {
    return {
      latitude: Number(coords[1]),
      longitude: Number(coords[2]),
    }
  }

  return { query: normalized }
}
