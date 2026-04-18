export function getAiEnv(
  env: NodeJS.ProcessEnv,
  primaryKey: string,
  legacyKey: string
): string | undefined {
  return env[primaryKey] ?? env[legacyKey]
}

export function hasAiProviderConfig(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(
    getAiEnv(env, 'AI_CREDENTIALS', 'GIGACHAT_CREDENTIALS') ||
      getAiEnv(env, 'AI_ACCESS_TOKEN', 'GIGACHAT_ACCESS_TOKEN')
  )
}
