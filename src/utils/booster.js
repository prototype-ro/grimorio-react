// Probabilidades por slot do pacote (5 cartas). O ultimo slot garante rara ou melhor.
const SLOTS = [
  { common: 40, uncommon: 60 },
  { common: 40, uncommon: 60 },
  { uncommon: 70, rare: 30 },
  { uncommon: 50, rare: 45, mythic: 5 },
  { rare: 85, mythic: 15 },
]

export const RARITY_ORDER = ['common', 'uncommon', 'rare', 'mythic']

function pickWeighted(weights, rng) {
  const entries = Object.entries(weights)
  const total = entries.reduce((sum, [, w]) => sum + w, 0)
  let roll = rng() * total
  for (const [key, w] of entries) {
    roll -= w
    if (roll < 0) return key
  }
  return entries[entries.length - 1][0]
}

// Sorteia um pacote sem cartas repetidas. Se a raridade sorteada acabar no pool, sobe para a proxima.
export function drawPack(cards, rng = Math.random) {
  const used = new Set()
  const pack = []
  for (const slot of SLOTS) {
    let rarity = pickWeighted(slot, rng)
    let pool = []
    for (let i = RARITY_ORDER.indexOf(rarity); i < RARITY_ORDER.length && pool.length === 0; i++) {
      pool = cards.filter((c) => c.rarity === RARITY_ORDER[i] && !used.has(c.id))
    }
    if (pool.length === 0) pool = cards.filter((c) => !used.has(c.id))
    const card = pool[Math.floor(rng() * pool.length)]
    used.add(card.id)
    pack.push(card.id)
  }
  return pack
}

export function bestRarity(cards) {
  return cards.reduce((best, c) => (RARITY_ORDER.indexOf(c.rarity) > RARITY_ORDER.indexOf(best) ? c.rarity : best), 'common')
}
