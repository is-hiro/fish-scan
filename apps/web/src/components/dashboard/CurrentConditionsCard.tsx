import type { AnalyzeResponse } from '@fish-scan/shared'

import { toMetersPerSecond, toMmHg } from '../../lib/format'
import { useUiLanguage } from '../../lib/ui-language'

interface CurrentConditionsCardProps {
  result: AnalyzeResponse
}

export function CurrentConditionsCard({ result }: CurrentConditionsCardProps) {
  const { language, text } = useUiLanguage()
  const pressureUnit = language === 'en' ? 'mmHg' : 'мм рт. ст.'
  const windUnit = language === 'en' ? 'm/s' : 'м/с'

  return (
    <article className="card metricsCard">
      <div className="cardHeader">
        <p className="eyebrow">{text.currentWeather}</p>
      </div>
      <dl className="metricsTiles">
        <div className="metricTile">
          <dt>{text.temperature}</dt>
          <dd className="mono metricValue">{result.weather.current.temperatureC}°C</dd>
        </div>
        <div className="metricTile">
          <dt>{text.pressure}</dt>
          <dd className="mono metricValue">
            {toMmHg(result.weather.current.pressureHpa)} {pressureUnit}
          </dd>
        </div>
        <div className="metricTile">
          <dt>{text.wind}</dt>
          <dd className="mono metricValue">
            {toMetersPerSecond(result.weather.current.windSpeedKmh)} {windUnit}
          </dd>
        </div>
        <div className="metricTile">
          <dt>{text.humidity}</dt>
          <dd className="mono metricValue">{result.weather.current.relativeHumidity}%</dd>
        </div>
      </dl>
    </article>
  )
}
