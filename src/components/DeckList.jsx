import { useState } from 'react'
import { pad } from '../utils/format'
import { COLOR_INFO } from '../utils/colors'

// Equivalente dos "Treinadores": cada deck Commander tem comandante, insignias e cartas.
export default function DeckList({ decks, cardsById, onSelectCard }) {
  const [openId, setOpenId] = useState(null)

  return (
    <div className="decks">
      {decks.map((deck) => {
        const commander = cardsById.get(deck.commander)
        const identity = commander?.colorIdentity ?? []
        const open = openId === deck.id
        return (
          <section key={deck.id} className={`deck ${open ? 'open' : ''}`}>
            <button type="button" className="deck-head" aria-expanded={open} onClick={() => setOpenId(open ? null : deck.id)}>
              {commander && <img src={commander.art} alt="" loading="lazy" />}
              <div>
                <h3>{deck.name}</h3>
                <p className="meta">Comandante: {commander?.name}</p>
                <p className="insignias" aria-label={`${identity.length} insígnias`}>
                  {identity.length === 0 ? <span className="meta">0 insígnias</span> : identity.map((c) => (
                    <span key={c} className="pip" style={{ '--tone': COLOR_INFO[c].css }} title={COLOR_INFO[c].label} />
                  ))}
                  <span className="meta">{identity.length} insígnia{identity.length === 1 ? '' : 's'} · {deck.cards.length + 1} cartas</span>
                </p>
              </div>
            </button>
            {open && (
              <ul className="deck-cards">
                {[deck.commander, ...deck.cards].map((id) => {
                  const c = cardsById.get(id)
                  return (
                    <li key={id}>
                      <button type="button" onClick={() => onSelectCard(id)}>
                        <span className="card-id">#{pad(id)}</span> {c.name}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        )
      })}
    </div>
  )
}
