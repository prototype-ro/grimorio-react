import { useEffect, useMemo, useState } from 'react'
import RevealCard from './RevealCard'
import { drawPack, bestRarity } from '../utils/booster'
import { RARITY } from '../utils/format'
import { useLocalStorage } from '../hooks/useLocalStorage'
import '../css/Booster.css'

const TEAR_MS = 1100

// Maquina de estados: idle -> tearing -> reveal -> done
export default function Booster({ cards, cardsById, onSelectCard }) {
  const [collection, setCollection] = useLocalStorage('grimorio:collection', {})
  const [stage, setStage] = useState('idle')
  const [pack, setPack] = useState([])
  const [newIds, setNewIds] = useState([])
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const packCards = useMemo(() => pack.map((id) => cardsById.get(id)), [pack, cardsById])
  const best = packCards.length ? bestRarity(packCards) : 'common'
  const current = packCards[idx]
  const owned = Object.keys(collection).length
  const reveal = stage === 'reveal' && flipped ? current?.rarity : null

  const openPack = () => {
    const ids = drawPack(cards)
    setNewIds(ids.filter((id) => !collection[id]))
    setCollection((prev) => {
      const next = { ...prev }
      for (const id of ids) next[id] = (next[id] ?? 0) + 1
      return next
    })
    setPack(ids)
    setIdx(0)
    setFlipped(false)
    setStage('tearing')
  }

  useEffect(() => {
    if (stage !== 'tearing') return
    const t = setTimeout(() => setStage('reveal'), TEAR_MS)
    return () => clearTimeout(t)
  }, [stage])

  const advance = () => {
    if (!flipped) return setFlipped(true)
    if (idx + 1 >= pack.length) return setStage('done')
    setIdx(idx + 1)
    setFlipped(false)
  }

  const reset = () => {
    setStage('idle')
    setPack([])
  }

  const clearCollection = () => setCollection({})

  return (
    <section className={`booster ${reveal ? `fx-${reveal}` : ''}`} aria-label="Booster packs">
      <div className="booster-head">
        <p className="count" role="status">Coleção: {owned} de {cards.length} cartas únicas</p>
        {owned > 0 && stage === 'idle' && (
          <button type="button" className="btn ghost" onClick={clearCollection}>Zerar coleção</button>
        )}
      </div>

      {(stage === 'idle' || stage === 'tearing') && (
        <div className="pack-stage">
          <button
            type="button"
            className={`pack ${stage === 'tearing' ? 'tearing' : ''}`}
            data-best={stage === 'tearing' ? best : undefined}
            onClick={openPack}
            disabled={stage === 'tearing'}
            aria-label="Abrir booster pack"
          >
            <span className="pack-top" />
            <span className="pack-body">
              <span className="pack-title">Grimório</span>
              <span className="pack-sub">Commander Booster</span>
              <span className="pack-count">5 cartas</span>
            </span>
            <span className="pack-shine" aria-hidden="true" />
          </button>
          {stage === 'tearing' && <span className="tear-burst" data-best={best} aria-hidden="true" />}
          <p className="hint">{stage === 'idle' ? 'Clique no pacote para abrir' : 'Abrindo…'}</p>
        </div>
      )}

      {stage === 'reveal' && current && (
        <div className="reveal-stage">
          <p className="count" role="status">Carta {idx + 1} de {pack.length}</p>
          <RevealCard key={current.id} card={current} flipped={flipped} isNew={newIds.includes(current.id)} onClick={advance} />
          <div className="reveal-actions">
            <button type="button" className="btn" onClick={advance}>
              {!flipped ? 'Virar carta' : idx + 1 >= pack.length ? 'Ver resumo' : 'Próxima'}
            </button>
            <button type="button" className="btn ghost" onClick={() => setStage('done')}>Revelar todas</button>
          </div>
        </div>
      )}

      {stage === 'done' && (
        <div className="summary">
          <h2>Resultado do pacote</h2>
          <ul className="summary-row">
            {packCards.map((c) => (
              <li key={c.id} data-rarity={c.rarity}>
                <button type="button" onClick={() => onSelectCard(c.id)} aria-label={`${c.name}, ${RARITY[c.rarity]}. Ver detalhes`}>
                  <img src={c.image} alt="" />
                </button>
                <span className="rarity-pill" data-rarity={c.rarity}>{RARITY[c.rarity]}</span>
                {newIds.includes(c.id) && <span className="new-pill">NOVA</span>}
              </li>
            ))}
          </ul>
          <button type="button" className="btn" onClick={reset}>Abrir outro pacote</button>
        </div>
      )}
    </section>
  )
}
