import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { AnalyzeResponse } from '@fish-scan/shared'

import { AiAdviceCard } from '../components/dashboard/AiAdviceCard'
import { CurrentConditionsCard } from '../components/dashboard/CurrentConditionsCard'
import { FactorsCard } from '../components/dashboard/FactorsCard'
import { FishRecommendationsCard } from '../components/dashboard/FishRecommendationsCard'
import { ForecastChartCard } from '../components/dashboard/ForecastChartCard'
import { HistoryCard } from '../components/dashboard/HistoryCard'
import { SummarySection } from '../components/dashboard/SummarySection'
import { PageHeader } from '../components/layout/PageHeader'
import { LoadingState } from '../components/shared/LoadingState'
import { SearchPanel } from '../components/shared/SearchPanel'
import { StateCard } from '../components/shared/StateCard'
import { buildRuleCards, getWeatherCode } from '../lib/dashboard'
import { getUiText, type AppLanguage } from '../lib/i18n'
import { parseLocationInput } from '../lib/location'
import { UiLanguageContext } from '../lib/ui-language'
import '../styles/app.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8787'
const HISTORY_STORAGE_KEY = 'fish-scan:recent-queries'
const LANGUAGE_STORAGE_KEY = 'fish-scan:language'

interface RecentQuery {
  label: string
  createdAt: string
}

export default function App() {
  const [history, setHistory] = useState<RecentQuery[]>(() => {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY)
    if (!raw) return []

    try {
      return JSON.parse(raw) as RecentQuery[]
    } catch {
      localStorage.removeItem(HISTORY_STORAGE_KEY)
      return []
    }
  })
  const [query, setQuery] = useState('Москва')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)
  const [refreshingAi, setRefreshingAi] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768)
  const [language, setLanguage] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return saved === 'ru' ? 'ru' : 'en'
  })
  const previousLanguageRef = useRef<AppLanguage>(language)

  const text = useMemo(() => getUiText(language), [language])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  }, [language])

  const weatherCode = getWeatherCode(result)
  const rules = useMemo(() => buildRuleCards(result, language), [result, language])

  function persistHistory(label: string) {
    const nextHistory = [{ label, createdAt: new Date().toISOString() }, ...history]
      .filter(
        (item, index, array) =>
          array.findIndex((candidate) => candidate.label === item.label) === index
      )
      .slice(0, 5)

    setHistory(nextHistory)
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(nextHistory))
  }

  async function requestAnalysis(input: string) {
    const location = parseLocationInput(input)
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location, language }),
      })

      const data = (await response.json()) as AnalyzeResponse | { error: string }
      if (!response.ok || 'error' in data) {
        throw new Error('error' in data ? data.error : text.errorTitle)
      }

      setResult(data)
      persistHistory(data.weather.location.name)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : text.errorTitle)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await requestAnalysis(query)
  }

  const refreshAiAdvice = useCallback(
    async (sourceResult: AnalyzeResponse | null = result) => {
      if (!sourceResult) return

      setRefreshingAi(true)
      setError(null)

      try {
        const response = await fetch(`${API_BASE_URL}/api/ai/explain`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            weather: sourceResult.weather,
            analysis: sourceResult.analysis,
            language,
          }),
        })

        const data = (await response.json()) as { aiSummary?: string | null; error?: string }
        if (!response.ok || data.error) {
          throw new Error(data.error ?? text.errorTitle)
        }

        setResult((current) =>
          current
            ? {
                ...current,
                aiSummary: data.aiSummary ?? null,
              }
            : current
        )
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : text.errorTitle)
      } finally {
        setRefreshingAi(false)
      }
    },
    [language, result, text.errorTitle]
  )

  useEffect(() => {
    if (!result) {
      previousLanguageRef.current = language
      return
    }

    if (previousLanguageRef.current === language) return

    previousLanguageRef.current = language
    void refreshAiAdvice(result)
  }, [language, refreshAiAdvice, result])

  return (
    <UiLanguageContext.Provider value={{ language, setLanguage }}>
      <main className="page">
        <PageHeader />

        <section className="hero fadeUp">
          <div className="heroCopy">
            <p className="eyebrow">{text.heroEyebrow}</p>
            <h2>{text.heroTitle}</h2>
            <p className="heroText">{text.heroDescription}</p>
          </div>

          <SearchPanel
            history={history.slice(0, 3).map((item) => item.label)}
            loading={loading}
            onQueryChange={setQuery}
            onSelectHistory={(value) => {
              setQuery(value)
              void requestAnalysis(value)
            }}
            onSubmit={handleSubmit}
            query={query}
          />
        </section>

        {loading && !result ? <LoadingState /> : null}
        {error && !result ? <StateCard description={error} title={text.errorTitle} /> : null}

        {result ? (
          <section className="dashboard fadeUp">
            <SummarySection result={result} weatherCode={weatherCode} />

            <section className="mainGrid">
              <CurrentConditionsCard result={result} />
              <ForecastChartCard isMobile={isMobile} result={result} />
            </section>

            <section className="analysisRow">
              <FactorsCard rules={rules} />
            </section>

            <section className="bottomGrid">
              <FishRecommendationsCard result={result} />
              <div className="sideColumn">
                <AiAdviceCard
                  aiSummary={result.aiSummary}
                  onRefresh={() => void refreshAiAdvice()}
                  refreshing={refreshingAi}
                />
                <HistoryCard history={history} />
              </div>
            </section>

            {error ? <p className="inlineError">{error}</p> : null}
          </section>
        ) : !loading && !error ? (
          <StateCard description={text.emptyDescription} title={text.emptyTitle} />
        ) : null}

        <footer className="footer fadeUp">
          <p>Fish Scan</p>
          <a href="https://github.com/is-hiro" target="_blank" rel="noreferrer">
            github.com/is-hiro
          </a>
        </footer>
      </main>
    </UiLanguageContext.Provider>
  )
}
