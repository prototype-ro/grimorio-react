export default function StatBar({ label, value, max }) {
  const has = value !== null && value !== undefined
  const pct = has ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className="stat">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{has ? value : '—'}</span>
      <div className="stat-track" role="progressbar" aria-label={label} aria-valuenow={has ? value : undefined} aria-valuemax={max}>
        <div className="stat-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
