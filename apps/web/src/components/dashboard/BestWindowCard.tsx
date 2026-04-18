import type { AnalyzeResponse } from '@fish-scan/shared'

import { formatHour } from '../../lib/format'
import { translateBestWindowLabel } from '../../lib/i18n'
import { useUiLanguage } from '../../lib/ui-language'

interface BestWindowCardProps {
  result: AnalyzeResponse
}

export function BestWindowCard({ result }: BestWindowCardProps) {
  const { language, text } = useUiLanguage()

  return (
    <article className="card windowCard">
      <div className="cardHeader">
        <p className="eyebrow">{text.bestWindow}</p>
        <h3>
          {result.analysis.bestFishingWindow
            ? `${formatHour(result.analysis.bestFishingWindow.start, language)} - ${formatHour(result.analysis.bestFishingWindow.end, language)}`
            : text.bestWindowEmpty}
        </h3>
      </div>
      <p className="windowText">
        {result.analysis.bestFishingWindow
          ? translateBestWindowLabel(result.analysis.bestFishingWindow.label, language)
          : text.bestWindowFallback}
      </p>
    </article>
  )
}
