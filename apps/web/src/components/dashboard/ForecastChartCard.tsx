import type { AnalyzeResponse } from '@fish-scan/shared'

import { buildSparkline, formatHour, toMmHg } from '../../lib/format'
import { useUiLanguage } from '../../lib/ui-language'

interface ForecastChartCardProps {
  result: AnalyzeResponse
  isMobile: boolean
}

export function ForecastChartCard({ result, isMobile }: ForecastChartCardProps) {
  const { language, text } = useUiLanguage()
  const visibleHours = result.weather.hourly.slice(0, isMobile ? 6 : 12)
  const pressureLine = buildSparkline(visibleHours.map((point) => toMmHg(point.pressureHpa)))
  const maxTemp = Math.max(...visibleHours.map((point) => point.temperatureC), 1)

  return (
    <article className="card chartCard">
      <div className="cardHeader">
        <p className="eyebrow">{text.hourlyForecast}</p>
        <h3>{isMobile ? `6 ${text.hoursShort}` : `12 ${text.hoursShort}`}</h3>
      </div>
      <div className="sparklineWrap">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polyline points={pressureLine} />
        </svg>
      </div>
      <div className="hourlyRow">
        {visibleHours.map((item) => (
          <div className="hourItem" key={item.time}>
            <span>{formatHour(item.time, language)}</span>
            <div
              className="tempColumn"
              style={{ height: `${Math.max((item.temperatureC / maxTemp) * 56, 12)}px` }}
            />
            <strong className="mono">{Math.round(item.temperatureC)}°</strong>
          </div>
        ))}
      </div>
    </article>
  )
}
