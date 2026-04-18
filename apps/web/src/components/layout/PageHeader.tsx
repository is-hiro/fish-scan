import { FishLogo } from '../icons/FishLogo'
import { useUiLanguage } from '../../lib/ui-language'

export function PageHeader() {
  const { language, setLanguage, text } = useUiLanguage()

  return (
    <header className="pageHeader fadeUp">
      <div className="brand">
        <span className="brandIcon" aria-hidden="true">
          <FishLogo />
        </span>
        <div>
          <p className="eyebrow">Fish Scan</p>
          <h1 className="pageTitle">{text.appTitle}</h1>
        </div>
      </div>

      <div className="headerActions">
        <div className="langSwitcher" aria-label={text.language}>
          <button
            className={`langButton ${language === 'ru' ? 'active' : ''}`}
            type="button"
            onClick={() => setLanguage('ru')}
          >
            RU
          </button>
          <button
            className={`langButton ${language === 'en' ? 'active' : ''}`}
            type="button"
            onClick={() => setLanguage('en')}
          >
            EN
          </button>
        </div>
        <a
          className="authorLink"
          href="https://github.com/is-hiro"
          target="_blank"
          rel="noreferrer"
        >
          is-hiro
        </a>
      </div>
    </header>
  )
}
