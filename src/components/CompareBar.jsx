// Barra fixa no rodape: mostra as cartas escolhidas para comparar (maximo 2).
export default function CompareBar({ cards, onRemove, onClear, onOpen }) {
  if (cards.length === 0) return null
  return (
    <div className="compare-bar" role="region" aria-label="Comparação de cartas">
      <ul>
        {cards.map((c) => (
          <li key={c.id}>
            <img src={c.art} alt="" />
            <span>{c.name}</span>
            <button type="button" onClick={() => onRemove(c.id)} aria-label={`Remover ${c.name} da comparação`}>×</button>
          </li>
        ))}
        {cards.length === 1 && <li className="hint">Escolha mais uma carta</li>}
      </ul>
      <div className="compare-actions">
        <button type="button" className="btn ghost" onClick={onClear}>Limpar</button>
        <button type="button" className="btn" disabled={cards.length < 2} onClick={onOpen}>Comparar</button>
      </div>
    </div>
  )
}
