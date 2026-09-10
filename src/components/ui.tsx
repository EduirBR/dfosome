import type { StatusValue } from '../types/dfo'

export function StatGrid({ values }: { values: StatusValue[] | null }) {
  if (!Array.isArray(values) || values.length === 0) return null
  return (
    <ul className="stat-list">
      {values.map((value, index) => (
        <li key={index}>
          <span className="stat-name">{value.name}:</span>
          <span className="stat-value">{value.value}</span>
        </li>
      ))}
    </ul>
  )
}

export function StatList({
  values,
  title,
}: {
  values: StatusValue[] | null
  title: string
}) {
  if (!Array.isArray(values) || values.length === 0) return null
  return (
    <div className="stat-block">
      <h3>{title}</h3>
      <ul className="stat-list">
        {values.map((value, index) => (
          <li key={`${title}-${value.name}-${index}`}>
            <span className="stat-name">{value.name}</span>
            <span className="stat-value">{value.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}