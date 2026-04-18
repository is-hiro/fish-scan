import type { AnalyzeResponse } from '@fish-scan/shared'

import { getFishName, getStatusLabel, translateValues } from '../../lib/i18n'
import { useUiLanguage } from '../../lib/ui-language'

interface FishRecommendationsCardProps {
  result: AnalyzeResponse
}

export function FishRecommendationsCard({ result }: FishRecommendationsCardProps) {
  const { language, text } = useUiLanguage()

  return (
    <article className="card fishCard">
      <div className="cardHeader">
        <p className="eyebrow">{text.fishRecommendations}</p>
        <h3>{text.fishTitle}</h3>
      </div>
      <div className="fishList">
        {result.analysis.fishRecommendations.map((fish) => (
          <article className="fishItem" key={fish.fishCode}>
            <div className="fishItemHeader">
              <h4>{getFishName(language, fish.fishCode, fish.fishName)}</h4>
              <span className="fishScore">
                {text.chances}: {fish.score}%
              </span>
            </div>
            <p className="subtleText">{getStatusLabel(language, fish.status)}</p>
            <p className="subtleText">
              {text.bait}: {translateValues(fish.bait, language).join(', ')}
            </p>
            <p className="subtleText">
              {text.tactics}: {translateValues(fish.tactics, language).join(', ')}
            </p>
          </article>
        ))}
      </div>
    </article>
  )
}
