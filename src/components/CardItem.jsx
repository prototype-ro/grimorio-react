import ColorBadges from './ColorBadges'
import ManaCost from './ManaCost'
import { pad, dash } from '../utils/format'
import { COLOR_INFO, cardColors } from '../utils/colors'

export default function CardItem({ card, favorite, onToggleFavorite, onSelect }) {
  const tone = COLOR_INFO[cardColors(card)[0]].css
  return (
    <article className="card" style={{ '--tone': tone }}>
      <button type="button" className="card-main" onClick={() => onSelect(card.id)} aria-label={`Ver detalhes de ${card.name}`}>
        <div className="card-art">
          <img src={card.art} alt="" loading="lazy" />
        </div>
        <div className="card-body">
          <span className="card-id">#{pad(card.id)}</span>
          <h3>{card.name}</h3>
          <ManaCost cost={card.manaCost} />
          <ColorBadges card={card} />
          <dl className="mini-stats">
            <div><dt>P</dt><dd>{dash(card.power)}</dd></div>
            <div><dt>R</dt><dd>{dash(card.toughness)}</dd></div>
            <div><dt>CMC</dt><dd>{card.manaValue}</dd></div>
          </dl>
        </div>
      </button>
      <button
        type="button"
        className={`fav ${favorite ? 'on' : ''}`}
        aria-pressed={favorite}
        aria-label={favorite ? `Remover ${card.name} dos favoritos` : `Favoritar ${card.name}`}
        onClick={() => onToggleFavorite(card.id)}
      >
        {favorite ? '★' : '☆'}
      </button>
    </article>
  )
}
