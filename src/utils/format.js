export const pad = (id) => String(id).padStart(3, '0')
export const dash = (v) => (v === null || v === undefined ? '—' : v)
export const RARITY = { common: 'Comum', uncommon: 'Incomum', rare: 'Rara', mythic: 'Mítica' }

// Barras de atributo: valor relativo a um teto fixo por atributo.
export const STATS = [
  { key: 'power', label: 'Poder', max: 8 },
  { key: 'toughness', label: 'Resistência', max: 8 },
  { key: 'manaValue', label: 'Custo de mana', max: 8 },
  { key: 'popularity', label: 'Popularidade', max: 100 },
]

// EDHREC rank menor = mais popular. Converte para 0-100 (rank 1 = 100).
export function popularity(card) {
  if (card.edhrecRank === null) return null
  return Math.max(0, Math.round(100 - Math.log10(card.edhrecRank) * 25))
}

export function statValue(card, key) {
  return key === 'popularity' ? popularity(card) : card[key]
}
