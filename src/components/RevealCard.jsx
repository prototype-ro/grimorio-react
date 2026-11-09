import Burst from './Burst'
import { RARITY } from '../utils/format'

// Carta virada para baixo que revela a frente ao clicar. Raridade alta dispara brilho e particulas.
export default function RevealCard({ card, flipped, isNew, onClick }) {
  return (
    <div className="reveal-wrap" data-rarity={card.rarity}>
      <button
        type="button"
        className={`reveal ${flipped ? 'flipped' : ''}`}
        onClick={onClick}
        aria-label={flipped ? `${card.name}, ${RARITY[card.rarity]}. Próxima carta` : 'Virar carta'}
      >
        <span className="rflipper">
          <span className="rface rback"><span className="sigil">G</span></span>
          <span className="rface rfront">
            <img src={card.image} alt={`Carta ${card.name}`} draggable="false" />
            {(card.rarity === 'rare' || card.rarity === 'mythic') && <span className="sheen" aria-hidden="true" />}
          </span>
        </span>
      </button>
      {flipped && <Burst rarity={card.rarity} />}
      {flipped && (
        <p className="reveal-tag" role="status">
          <span className="rarity-pill" data-rarity={card.rarity}>{RARITY[card.rarity]}</span>
          {isNew && <span className="new-pill">NOVA</span>}
        </p>
      )}
    </div>
  )
}
