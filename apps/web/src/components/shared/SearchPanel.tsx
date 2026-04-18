import type { FormEvent } from 'react'

import { SearchIcon } from '../icons/SearchIcon'
import { useUiLanguage } from '../../lib/ui-language'

interface SearchPanelProps {
  query: string
  loading: boolean
  history: string[]
  onQueryChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onSelectHistory: (value: string) => void
}

export function SearchPanel({
  query,
  loading,
  history,
  onQueryChange,
  onSubmit,
  onSelectHistory,
}: SearchPanelProps) {
  const { text } = useUiLanguage()

  return (
    <form className="searchCard" onSubmit={onSubmit}>
      <label className="searchLabel" htmlFor="location-query">
        {text.searchLabel}
      </label>

      <div className="searchField">
        <span className="searchAdornment" aria-hidden="true">
          <SearchIcon />
        </span>
        <input
          id="location-query"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={text.searchPlaceholder}
        />
      </div>

      <p className="fieldHint">{text.searchHint}</p>

      <button type="submit" disabled={loading}>
        {loading ? text.searchLoading : text.searchSubmit}
      </button>

      {history.length > 0 ? (
        <div className="historyChips" aria-label={text.recentQueriesAria}>
          {history.map((item) => (
            <button
              className="chipButton"
              key={item}
              type="button"
              onClick={() => onSelectHistory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
    </form>
  )
}
