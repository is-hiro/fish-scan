import type { CatchAnalysis } from '@fish-scan/shared'

export function mapStatus(score: number): CatchAnalysis['status'] {
  if (score >= 75) return 'excellent'
  if (score >= 60) return 'good'
  if (score >= 40) return 'moderate'
  return 'poor'
}
