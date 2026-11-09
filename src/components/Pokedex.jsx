import { useEffect, useRef } from 'react'
import TiltCard from './TiltCard'
import ColorBadges from './ColorBadges'
import ManaCost from './ManaCost'
import StatBar from './StatBar'
import { pad, STATS, statValue } from '../utils/format'
import { COLOR_INFO, cardColors } from '../utils/colors'
import '../css/Pokedex.css'

// Visao principal: carta em foco (aparelho de Pokedex) + faixa de miniaturas.
export default function Pokedex({ cards, focusId, onFocus, favorites, onToggleFavorite, compareIds, onToggleCompare, onClear }) {
  const stripRef = useRef(null)
  const card = cards.find((c) => c.id === focusId) ?? cards[0]
  const index = card ? cards.indexOf(card) : -1

  const go = (delta) => {
    const next = cards[Math.min(cards.length - 1, Math.max(0, index + delta))]
    if (next) onFocus(next.id)
  }

  // Setas do teclado, exceto enquanto digita nos campos.
  useEffect(() => {
    const onKey = (e) => {
      if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) || document.querySelector('[role="dialog"]')) return
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // Mantem a miniatura ativa visivel na faixa.
  useEffect(() => {
    const el = stripRef.current?.querySelector('[aria-current="true"]')
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [card?.id])

  if (!card) {
    return (
      <div className="empty" role="status">
        <p>Nenhuma carta encontrada.</p>
        <button type="button" className="btn" onClick={onClear}>Limpar filtros</button>
      </div>
    )
  }

  const colors = cardColors(card)
  const tone = COLOR_INFO[colors[0]].css
  const favorite = favorites.includes(card.id)
  const compared = compareIds.includes(card.id)

  return (
    <section className="dex" style={{ '--tone': tone }} aria-label="Pokédex">
      <div className="dex-top">
        <span className="lens" aria-hidden="true" />
        <span className="leds" aria-hidden="true">
          {colors.map((c) => <i key={c} style={{ background: COLOR_INFO[c].css }} />)}
        </span>
        <span className="dex-pos" role="status">{index + 1} / {cards.length}</span>
      </div>

      <div className="dex-screen" key={card.id}>
        <TiltCard card={card} />

        <div className="dex-info">
          <p className="dex-num">#{pad(card.id)}</p>
          <h2>{card.name}</h2>
          <ManaCost cost={card.manaCost} />
          <ColorBadges card={card} />
          <p className="type-line">{card.typeLine}</p>
          {card.oracleText && <p className="oracle">{card.oracleText}</p>}
          <div className="stats">
            {STATS.map((s) => (
              <StatBar key={s.key} label={s.label} max={s.max} value={statValue(card, s.key)} />
            ))}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn" aria-pressed={favorite} onClick={() => onToggleFavorite(card.id)}>
              {favorite ? '★ Favorita' : '☆ Favoritar'}
            </button>
            <button type="button" className="btn ghost" aria-pressed={compared} onClick={() => onToggleCompare(card.id)}>
              {compared ? '⇄ Na comparação' : '⇄ Comparar'}
            </button>
            <a className="btn ghost" href={card.scryfall} target="_blank" rel="noreferrer">Scryfall</a>
          </div>
        </div>
      </div>

      <div className="dex-nav">
        <button type="button" className="dpad" onClick={() => go(-1)} disabled={index === 0} aria-label="Carta anterior">◀</button>
        <ul className="strip" ref={stripRef} aria-label="Cartas">
          {cards.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className={`thumb ${c.id === card.id ? 'active' : ''}`}
                style={{ '--tone': COLOR_INFO[cardColors(c)[0]].css }}
                aria-current={c.id === card.id}
                aria-label={`${pad(c.id)} ${c.name}`}
                onClick={() => onFocus(c.id)}
              >
                <img src={c.art} alt="" loading="lazy" />
                <span>#{pad(c.id)}</span>
                {favorites.includes(c.id) && <b aria-hidden="true">★</b>}
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="dpad" onClick={() => go(1)} disabled={index === cards.length - 1} aria-label="Próxima carta">▶</button>
      </div>
    </section>
  )
}
