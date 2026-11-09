import { useEffect } from 'react'
import ManaCost from './ManaCost'
import { pad, dash, STATS, statValue } from '../utils/format'
import { COLOR_INFO, cardColors } from '../utils/colors'

// Para custo de mana, menor e melhor; para os demais, maior.
const LOWER_IS_BETTER = new Set(['manaValue'])

function winner(a, b, key) {
  const va = statValue(a, key)
  const vb = statValue(b, key)
  if (va === null || vb === null || va === vb) return null
  const aWins = LOWER_IS_BETTER.has(key) ? va < vb : va > vb
  return aWins ? a.id : b.id
}

export default function CompareModal({ cards, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const [a, b] = cards

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal compare" role="dialog" aria-modal="true" aria-label={`Comparar ${a.name} e ${b.name}`} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="close" onClick={onClose} aria-label="Fechar">×</button>
        <div className="compare-grid">
          {cards.map((c) => (
            <div key={c.id} className="compare-head" style={{ '--tone': COLOR_INFO[cardColors(c)[0]].css }}>
              <img src={c.image} alt={`Carta ${c.name}`} />
              <span className="card-id">#{pad(c.id)}</span>
              <h3>{c.name}</h3>
              <ManaCost cost={c.manaCost} />
            </div>
          ))}
        </div>
        <table className="compare-table">
          <caption className="sr-only">Atributos lado a lado</caption>
          <tbody>
            {STATS.map((s) => {
              const win = winner(a, b, s.key)
              return (
                <tr key={s.key}>
                  <td className={win === a.id ? 'win' : ''}>{dash(statValue(a, s.key))}</td>
                  <th scope="row">{s.label}</th>
                  <td className={win === b.id ? 'win' : ''}>{dash(statValue(b, s.key))}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="meta">Destaque = melhor valor (no custo de mana, o menor). Atributos ausentes (—) não entram na comparação.</p>
      </div>
    </div>
  )
}
