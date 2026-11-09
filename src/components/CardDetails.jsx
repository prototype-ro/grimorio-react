import { useEffect } from 'react'
import ColorBadges from './ColorBadges'
import ManaCost from './ManaCost'
import StatBar from './StatBar'
import { pad, RARITY, STATS, statValue } from '../utils/format'
import { COLOR_INFO, cardColors } from '../utils/colors'

export default function CardDetails({ card, favorite, onToggleFavorite, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const tone = COLOR_INFO[cardColors(card)[0]].css

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={card.name} style={{ '--tone': tone }} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="close" onClick={onClose} aria-label="Fechar">×</button>
        <img className="modal-img" src={card.image} alt={`Carta ${card.name}`} />
        <div className="modal-info">
          <span className="card-id">#{pad(card.id)}</span>
          <h2>{card.name}</h2>
          <ManaCost cost={card.manaCost} />
          <ColorBadges card={card} />
          <p className="type-line">{card.typeLine}</p>
          <p className="meta">{RARITY[card.rarity]} · {card.set}</p>
          {card.oracleText && <p className="oracle">{card.oracleText}</p>}
          <div className="stats">
            {STATS.map((s) => (
              <StatBar key={s.key} label={s.label} max={s.max} value={statValue(card, s.key)} />
            ))}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={() => onToggleFavorite(card.id)} aria-pressed={favorite}>
              {favorite ? '★ Favorita' : '☆ Favoritar'}
            </button>
            <a className="btn ghost" href={card.scryfall} target="_blank" rel="noreferrer">Ver no Scryfall</a>
          </div>
        </div>
      </div>
    </div>
  )
}
