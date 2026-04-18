export function getAverageScore(scores: number[], fallback: number): number {
  if (scores.length === 0) {
    return fallback
  }

  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
}
