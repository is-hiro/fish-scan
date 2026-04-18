import type { RuleCard } from '../../lib/dashboard'
import { useUiLanguage } from '../../lib/ui-language'

interface FactorsCardProps {
  rules: RuleCard[]
}

export function FactorsCard({ rules }: FactorsCardProps) {
  const { text } = useUiLanguage()

  return (
    <article className="card rulesCard">
      <div className="cardHeader">
        <p className="eyebrow">{text.factors}</p>
        <h3>{text.factorsTitle}</h3>
      </div>
      <div className="rulesGrid">
        {rules.map((rule) => (
          <div className={`ruleItem ${rule.tone}`} key={rule.title}>
            <span className="ruleMark" aria-hidden="true" />
            <div>
              <p>{rule.title}</p>
              <strong>{rule.value}</strong>
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}
