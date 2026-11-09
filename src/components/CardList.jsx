import CardItem from './CardItem'

export default function CardList({ cards, favorites, onToggleFavorite, compareIds, onToggleCompare, onSelect, onClear }) {
  if (cards.length === 0) {
    return (
      <div className="empty" role="status">
        <p>Nenhuma carta encontrada.</p>
        <button type="button" className="btn" onClick={onClear}>Limpar filtros</button>
      </div>
    )
  }
  return (
    <div className="grid">
      {cards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          favorite={favorites.includes(card.id)}
          onToggleFavorite={onToggleFavorite}
          compared={compareIds.includes(card.id)}
          onToggleCompare={onToggleCompare}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
