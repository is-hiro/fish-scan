import { z } from 'zod'

export const locationQuerySchema = z
  .object({
    query: z.string().trim().min(2).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
  })
  .refine(
    (value) =>
      Boolean(value.query) || (value.latitude !== undefined && value.longitude !== undefined),
    {
      message: 'Provide location query or coordinates.',
    }
  )
