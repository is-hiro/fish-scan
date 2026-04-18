import { formatTime } from '../../lib/format'
import { useUiLanguage } from '../../lib/ui-language'

interface HistoryEntry {
  label: string
  createdAt: string
}

interface HistoryCardProps {
  history: HistoryEntry[]
}

export function HistoryCard({ history }: HistoryCardProps) {
  const { language, text } = useUiLanguage()

  return (
    <article className="card historyCard">
      <div className="cardHeader">
        <p className="eyebrow">{text.history}</p>
        <h3>{text.historyTitle}</h3>
      </div>
      {history.length > 0 ? (
        <ul className="historyList">
          {history.map((item) => (
            <li key={item.label}>
              <span>{item.label}</span>
              <time>{formatTime(item.createdAt, language)}</time>
            </li>
          ))}
        </ul>
      ) : (
        <p className="subtleText">{text.historyEmpty}</p>
      )}
    </article>
  )
}
