import { Agent } from 'undici'

import { getAiEnv } from './ai-env.js'

export function createAiDispatcher(env: NodeJS.ProcessEnv): Agent | undefined {
  return getAiEnv(env, 'AI_ALLOW_INSECURE_TLS', 'GIGACHAT_ALLOW_INSECURE_TLS') === 'true'
    ? new Agent({
        connect: {
          rejectUnauthorized: false,
        },
      })
    : undefined
}

export function withAiDispatcher(init: RequestInit, dispatcher?: Agent): RequestInit {
  if (!dispatcher) {
    return init
  }

  return {
    ...init,
    dispatcher,
  } as RequestInit
}
