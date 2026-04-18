import type { CatchAnalysis, WeatherBundle } from '@fish-scan/shared'

import { getAiEnv } from './ai-env.js'
import { getSystemPrompt } from './ai-prompts.js'

export function buildGigaChatPayload(
  env: NodeJS.ProcessEnv,
  weather: WeatherBundle,
  analysis: CatchAnalysis,
  language: 'ru' | 'en'
) {
  return {
    model: getAiEnv(env, 'AI_MODEL', 'GIGACHAT_MODEL') ?? 'GigaChat',
    temperature: 0.2,
    max_tokens: 280,
    messages: [
      { role: 'system', content: getSystemPrompt(language) },
      {
        role: 'user',
        content: JSON.stringify(
          {
            location: weather.location,
            currentWeather: weather.current,
            topFish: analysis.fishRecommendations.slice(0, 3),
            overallCatchScore: analysis.overallCatchScore,
            confidenceLevel: analysis.confidenceLevel,
            status: analysis.status,
            reasonCodes: analysis.reasonCodes,
            bestFishingWindow: analysis.bestFishingWindow,
          },
          null,
          2
        ),
      },
    ],
  }
}
