interface StateCardProps {
  title: string
  description: string
}

export function StateCard({ title, description }: StateCardProps) {
  return (
    <section className="stateCard fadeUp">
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  )
}
