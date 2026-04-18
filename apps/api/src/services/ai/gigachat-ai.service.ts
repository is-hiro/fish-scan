import { TTLCache } from '../../cache/ttl-cache.js'
import type { Fetcher } from '../../types/fetcher.js'
import type { AiService } from '../../types/services.js'
import type { CatchAnalysis, WeatherBundle } from '@fish-scan/shared'

import { createAiDispatcher, withAiDispatcher } from './ai-tls.js'
import { getGigaChatAccessToken } from './gigachat-auth.js'
import { buildGigaChatPayload } from './gigachat-payload.js'

export class GigaChatAiService implements AiService {
  private readonly tokenCache = new TTLCache<string>(25 * 60 * 1000)
  private readonly dispatcher: ReturnType<typeof createAiDispatcher>

  constructor(
    private readonly fetcher: Fetcher = fetch,
    private readonly env: NodeJS.ProcessEnv = process.env
  ) {
    this.dispatcher = createAiDispatcher(this.env)
  }

  async explain(
    weather: WeatherBundle,
    analysis: CatchAnalysis,
    language: 'ru' | 'en' = 'ru'
  ): Promise<string | null> {
    const token = await getGigaChatAccessToken(
      this.fetcher,
      this.env,
      this.tokenCache,
      this.dispatcher
    )
    if (!token) return null

    const response = await this.fetcher(
      'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
      withAiDispatcher(
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(buildGigaChatPayload(this.env, weather, analysis, language)),
        },
        this.dispatcher
      )
    )

    if (!response.ok) return null
    const content = (await response.json()).choices?.[0]?.message?.content
    return typeof content === 'string' && content.trim()
      ? content.replace(/\s+/g, ' ').trim().slice(0, 700)
      : null
  }
}
