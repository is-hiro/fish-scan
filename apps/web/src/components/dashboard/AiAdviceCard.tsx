import { useUiLanguage } from '../../lib/ui-language'

interface AiAdviceCardProps {
  aiSummary: string | null
  refreshing: boolean
  onRefresh: () => void
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M16.2 10a6.2 6.2 0 1 1-1.8-4.4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M12.8 3.9h2.7v2.7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  )
}

export function AiAdviceCard({ aiSummary, refreshing, onRefresh }: AiAdviceCardProps) {
  const { text } = useUiLanguage()

  return (
    <article className="card aiCard">
      <div className="cardHeader cardHeaderRow">
        <div>
          <p className="eyebrow">{text.aiAdvice}</p>
          <h3>{text.aiTitle}</h3>
        </div>
        <button
          aria-label={text.aiRefreshAria}
          className="iconButton"
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
        >
          <RefreshIcon />
        </button>
      </div>
      {refreshing ? (
        <div className="skeletonBlock compact">
          <span className="skeleton line" />
          <span className="skeleton line" />
          <span className="skeleton line short" />
        </div>
      ) : (
        <p className="aiText">{aiSummary ?? text.aiUnavailable}</p>
      )}
    </article>
  )
}
