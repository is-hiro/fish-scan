import type { WeatherCode } from '../../lib/dashboard'

interface WeatherIconProps {
  code: WeatherCode
}

export function WeatherIcon({ code }: WeatherIconProps) {
  if (code === 'rain') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path
          d="M14 31h17a7 7 0 1 0-1.6-13.8A10.5 10.5 0 0 0 10 21a6 6 0 0 0 4 10Z"
          fill="currentColor"
        />
        <path
          d="M16 35.5c0 2.2-1.7 4.4-1.7 4.4M24 35.5c0 2.2-1.7 4.4-1.7 4.4M32 35.5c0 2.2-1.7 4.4-1.7 4.4"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.3"
        />
      </svg>
    )
  }

  if (code === 'cloudy') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path
          d="M13 31h19a6.5 6.5 0 1 0-1.2-12.9A10 10 0 0 0 11.6 21 5.5 5.5 0 0 0 13 31Z"
          fill="currentColor"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="8" fill="currentColor" />
      <path
        d="M24 8v5M24 35v5M40 24h-5M13 24H8M35.3 12.7l-3.5 3.5M16.2 31.8l-3.5 3.5M35.3 35.3l-3.5-3.5M16.2 16.2l-3.5-3.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.4"
      />
    </svg>
  )
}
