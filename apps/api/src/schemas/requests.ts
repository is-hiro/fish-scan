import { z } from 'zod'

import { appLanguageSchema } from './app-language.js'
import { fishCodeSchema } from './fish-code.js'
import { locationQuerySchema } from './location-query.js'

export const analyzeRequestSchema = z.object({
  location: locationQuerySchema,
  fishCodes: z.array(fishCodeSchema).optional(),
  language: appLanguageSchema.optional(),
})

export const explainRequestSchema = z.object({
  weather: z.any(),
  analysis: z.any(),
  language: appLanguageSchema.optional(),
})
