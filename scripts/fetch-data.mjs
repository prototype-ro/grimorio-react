// Gera src/data/cards-data.json a partir da API publica do Scryfall.
// Uso: node scripts/fetch-data.mjs
import { writeFileSync, mkdirSync } from 'node:fs'

const DECKS = [
  { name: 'Atraxa', commander: 'Atraxa, Praetors\' Voice', cards: ['Doubling Season', 'Deepglow Skate', 'Sol Ring', 'Cultivate', 'Vampire Nighthawk', 'Swords to Plowshares', 'Sun Titan', 'Birds of Paradise'] },
  { name: 'Kaalia', commander: 'Kaalia of the Vast', cards: ['Angel of Despair', 'Utvara Hellkite', 'Inferno Titan', 'Sol Ring', 'Lightning Bolt', 'Shivan Dragon', 'Restoration Angel', 'Bogardan Hellkite'] },
  { name: 'Edgar Markov', commander: 'Edgar Markov', cards: ['Vampire Nighthawk', 'Blood Artist', 'Sol Ring', 'Anguished Unmaking', 'Falkenrath Noble', 'Skullclamp', 'Bloodthirsty Aerialist', 'Sanguine Bond'] },
  { name: 'Meren', commander: 'Meren of Clan Nel Toth', cards: ['Eternal Witness', 'Sakura-Tribe Elder', 'Sol Ring', 'Victimize', 'Reanimate', 'Mulldrifter', 'Spore Frog', 'Gray Merchant of Asphodel'] },
  { name: 'Korvold', commander: 'Korvold, Fae-Cursed King', cards: ['Mayhem Devil', 'Treasure Vault', 'Sakura-Tribe Elder', 'Sol Ring', 'Blood Artist', 'Cabal Stronghold', 'Cultivate', 'Mind Stone'] },
  { name: 'Muldrotha', commander: 'Muldrotha, the Gravetide', cards: ['Eternal Witness', 'Mulldrifter', 'Sol Ring', 'Mystic Snake', 'Spore Frog', 'Reclamation Sage', 'Cultivate', 'Cyclonic Rift'] },
  { name: 'Yuriko', commander: 'Yuriko, the Tiger\'s Shadow', cards: ['Ninja of the Deep Hours', 'Changeling Outcast', 'Sol Ring', 'Rhystic Study', 'Dark Ritual', 'Thassa\'s Oracle', 'Mystic Snake', 'Cyclonic Rift'] },
  { name: 'Prosper', commander: 'Prosper, Tome-Bound', cards: ['Lightning Bolt', 'Sol Ring', 'Dark Ritual', 'Mayhem Devil', 'Chaos Warp', 'Gray Merchant of Asphodel', 'Blood Artist', 'Mind Stone'] },
  { name: 'Ur-Dragon', commander: 'The Ur-Dragon', cards: ['Shivan Dragon', 'Bogardan Hellkite', 'Utvara Hellkite', 'Sol Ring', 'Cultivate', 'Inferno Titan', 'Birds of Paradise', 'Angel of Despair'] },
  { name: 'Ghave', commander: 'Ghave, Guru of Spores', cards: ['Doubling Season', 'Skullclamp', 'Sakura-Tribe Elder', 'Sol Ring', 'Blood Artist', 'Cultivate', 'Vampire Nighthawk', 'Sun Titan'] },
  { name: 'Teferi', commander: 'Teferi, Temporal Archmage', cards: ['Rhystic Study', 'Cyclonic Rift', 'Mystic Snake', 'Sol Ring', 'Mind Stone', 'Thassa\'s Oracle', 'Mulldrifter', 'Swords to Plowshares'] },
  { name: 'Ezuri', commander: 'Ezuri, Renegade Leader', cards: ['Birds of Paradise', 'Cultivate', 'Sakura-Tribe Elder', 'Sol Ring', 'Reclamation Sage', 'Eternal Witness', 'Doubling Season', 'Spore Frog'] },
]

const names = [...new Set(DECKS.flatMap((d) => [d.commander, ...d.cards]))]

async function collection(batch) {
  const res = await fetch('https://api.scryfall.com/cards/collection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': 'grimorio-react-class-project/1.0', Accept: 'application/json' },
    body: JSON.stringify({ identifiers: batch.map((name) => ({ name })) }),
  })
  if (!res.ok) throw new Error(`Scryfall ${res.status}`)
  return res.json()
}

const found = []
const missing = []
for (let i = 0; i < names.length; i += 50) {
  const json = await collection(names.slice(i, i + 50))
  found.push(...json.data)
  missing.push(...json.not_found.map((n) => n.name))
  await new Promise((r) => setTimeout(r, 200))
}

const face = (c) => c.image_uris ?? c.card_faces?.[0]?.image_uris ?? {}
const num = (v) => (v === undefined || v === null || Number.isNaN(Number(v)) ? null : Number(v))

const byName = new Map()
const cards = found
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((c, i) => {
    const id = i + 1
    byName.set(c.name, id)
    const front = c.card_faces?.[0]
    return {
      id,
      name: c.name,
      manaCost: c.mana_cost ?? front?.mana_cost ?? '',
      manaValue: c.cmc,
      typeLine: c.type_line,
      types: c.type_line.split('—')[0].trim().split(' ').filter((t) => !['Legendary', 'Basic', 'Snow'].includes(t)),
      colors: c.colors ?? front?.colors ?? [],
      colorIdentity: c.color_identity,
      power: num(c.power ?? front?.power),
      toughness: num(c.toughness ?? front?.toughness),
      rarity: c.rarity,
      set: c.set_name,
      oracleText: c.oracle_text ?? front?.oracle_text ?? '',
      edhrecRank: c.edhrec_rank ?? null,
      image: face(c).normal ?? '',
      art: face(c).art_crop ?? '',
      scryfall: c.scryfall_uri,
    }
  })

const decks = DECKS.map((d, i) => ({
  id: i + 1,
  name: d.name,
  commander: byName.get(d.commander) ?? null,
  cards: [...new Set(d.cards)].map((n) => byName.get(n)).filter(Boolean),
}))

mkdirSync('src/data', { recursive: true })
writeFileSync('src/data/cards-data.json', JSON.stringify({ cards, decks }, null, 2))
console.log(`${cards.length} cartas, ${decks.length} decks`)
if (missing.length) console.log('Nao encontradas:', missing)
