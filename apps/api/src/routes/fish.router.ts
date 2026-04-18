import { Router } from 'express'

import { FISH_SPECIES } from '@fish-scan/shared'

export function createFishRouter(): Router {
  const router = Router()

  router.get('/api/fish-species', (_request, response) => {
    response.json({ items: FISH_SPECIES })
  })

  return router
}
