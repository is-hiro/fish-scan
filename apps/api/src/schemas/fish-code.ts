import { z } from 'zod'

export const fishCodeSchema = z.enum(['crucian_carp', 'carp', 'pike', 'perch', 'bream'])
