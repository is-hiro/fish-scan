import crypto from 'node:crypto'
import type { Agent } from 'undici'

import { TTLCache } from '../../cache/ttl-cache.js'
import type { Fetcher } from '../../types/fetcher.js'
import { getAiEnv } from './ai-env.js'
import { withAiDispatcher } from './ai-tls.js'

export async function getGigaChatAccessToken(
  fetcher: Fetcher,
  env: NodeJS.ProcessEnv,
  tokenCache: TTLCache<string>,
  dispatcher?: Agent
): Promise<string | null> {
  const explicitToken = getAiEnv(env, 'AI_ACCESS_TOKEN', 'GIGACHAT_ACCESS_TOKEN')
  if (explicitToken) return explicitToken

  const credentials = getAiEnv(env, 'AI_CREDENTIALS', 'GIGACHAT_CREDENTIALS')
  if (!credentials) return null

  const cached = tokenCache.get('gigachat')
  if (cached) return cached

  const response = await fetcher(
    'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
    withAiDispatcher(
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          Authorization: `Basic ${credentials}`,
          RqUID: crypto.randomUUID(),
        },
        body: new URLSearchParams({
          scope: getAiEnv(env, 'AI_SCOPE', 'GIGACHAT_SCOPE') ?? 'GIGACHAT_API_PERS',
        }),
      },
      dispatcher
    )
  )

  if (!response.ok) return null

  const payload = await response.json()
  if (!payload.access_token) return null
  tokenCache.set('gigachat', payload.access_token)
  return payload.access_token
}
