// Converte "{3}{W}{W}{B}" em simbolos de mana coloridos.
export default function ManaCost({ cost }) {
  if (!cost) return null
  const symbols = cost.match(/\{[^}]+\}/g) ?? []
  return (
    <span className="mana" aria-label={`Custo de mana ${cost}`}>
      {symbols.map((s, i) => {
        const sym = s.slice(1, -1)
        const kind = /^[WUBRGC]$/.test(sym) ? sym : 'N'
        return (
          <span key={i} className={`mana-sym mana-${kind}`} aria-hidden="true">
            {kind === 'N' ? sym : ''}
          </span>
        )
      })}
    </span>
  )
}
