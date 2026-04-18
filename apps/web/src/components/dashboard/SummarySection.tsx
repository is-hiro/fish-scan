import type { AnalyzeResponse } from '@fish-scan/shared'

import { WeatherIcon } from '../icons/WeatherIcon'
import type { WeatherCode } from '../../lib/dashboard'
import { describeTimeOfDay, estimatedWaterTemp, formatTime } from '../../lib/format'
import { getStatusLabel } from '../../lib/i18n'
import { useUiLanguage } from '../../lib/ui-language'

interface SummarySectionProps {
  result: AnalyzeResponse
  weatherCode: WeatherCode
}

export function SummarySection({ result, weatherCode }: SummarySectionProps) {
  const { language, text } = useUiLanguage()

  return (
    <section className="summaryGrid">
      <article className="card locationCard">
        <div className="locationHeader">
          <div>
            <p className="eyebrow">{text.locationConditions}</p>
            <h2>{result.weather.location.name}</h2>
            <p className="subtleText">
              {result.weather.location.country} · {result.weather.location.latitude.toFixed(2)},{' '}
              {result.weather.location.longitude.toFixed(2)}
            </p>
          </div>
          <span className="weatherBadge" aria-hidden="true">
            <WeatherIcon code={weatherCode} />
          </span>
        </div>

        <div className="locationMeta">
          <div>
            <span className="metaLabel">{text.time}</span>
            <strong>{formatTime(result.weather.current.time, language)}</strong>
          </div>
          <div>
            <span className="metaLabel">{text.period}</span>
            <strong>{describeTimeOfDay(result.weather.current.time, language)}</strong>
          </div>
          <div>
            <span className="metaLabel">{text.waterTemp}</span>
            <strong className="mono">
              {estimatedWaterTemp(result.weather.current.temperatureC)}°C
            </strong>
          </div>
        </div>
      </article>

      <article className="card scoreCard">
        <p className="eyebrow">Catch score</p>
        <div
          className="scoreRing"
          style={{ ['--score' as string]: `${result.analysis.overallCatchScore}%` }}
        >
          <div className="scoreInner">
            <strong>{result.analysis.overallCatchScore}</strong>
            <span>{text.outOfHundred}</span>
          </div>
        </div>
        <div className="scoreCopy">
          <h3>{getStatusLabel(language, result.analysis.status)}</h3>
          <p>
            {text.confidence}: {result.analysis.confidenceLevel}%
          </p>
        </div>
      </article>
    </section>
  )
}
