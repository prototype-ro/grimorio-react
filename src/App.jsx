import { useEffect, useMemo, useState } from 'react'
import data from './data/cards-data.json'
import SearchBar from './components/SearchBar'
import ColorFilter from './components/ColorFilter'
import CardList from './components/CardList'
import CardDetails from './components/CardDetails'
import Pokedex from './components/Pokedex'
import DeckList from './components/DeckList'
import CompareBar from './components/CompareBar'
import CompareModal from './components/CompareModal'
import { useLocalStorage } from './hooks/useLocalStorage'
import { matchesColor } from './utils/colors'
import { statValue } from './utils/format'
import './css/App.css'

const SORTS = [
  { value: 'id', label: 'Número' },
  { value: 'name', label: 'Nome' },
  { value: 'power', label: 'Poder' },
  { value: 'toughness', label: 'Resistência' },
  { value: 'manaValue', label: 'Custo de mana' },
  { value: 'popularity', label: 'Popularidade' },
]

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

export default function App() {
  const { cards, decks } = data
  const cardsById = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards])

  const [view, setView] = useState('cards')
  const [query, setQuery] = useState('')
  const [color, setColor] = useState('ALL')
  const [sort, setSort] = useState('id')
  const [onlyFavs, setOnlyFavs] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [layout, setLayout] = useLocalStorage('grimorio:layout', 'dex')
  const [focusId, setFocusId] = useState(1)
  const [compareIds, setCompareIds] = useState([])
  const [compareOpen, setCompareOpen] = useState(false)
  const [favorites, setFavorites] = useLocalStorage('grimorio:favorites', [])
  const [theme, setTheme] = useLocalStorage('grimorio:theme', 'dark')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // Estado derivado: lista filtrada e ordenada.
  const visible = useMemo(() => {
    const q = norm(query.trim()).replace(/^#/, '')
    const list = cards.filter((c) => {
      const text = q === '' || norm(c.name).includes(q) || String(c.id) === q.replace(/^0+/, '') || String(c.id).padStart(3, '0').includes(q)
      return text && matchesColor(c, color) && (!onlyFavs || favorites.includes(c.id))
    })
    return list.sort((a, b) => {
      if (sort === 'id') return a.id - b.id
      if (sort === 'name') return a.name.localeCompare(b.name)
      // Numericos: maior primeiro; cartas sem valor vao para o fim.
      const va = statValue(a, sort) ?? -1
      const vb = statValue(b, sort) ?? -1
      return vb - va || a.id - b.id
    })
  }, [cards, query, color, sort, onlyFavs, favorites])

  const toggleFavorite = (id) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))

  // Maximo de 2 cartas: ao escolher uma terceira, a mais antiga sai.
  const toggleCompare = (id) =>
    setCompareIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(-2)))
  const compareCards = compareIds.map((id) => cardsById.get(id))

  const clearFilters = () => {
    setQuery('')
    setColor('ALL')
    setOnlyFavs(false)
  }

  const random = () => {
    const id = cards[Math.floor(Math.random() * cards.length)].id
    if (view === 'cards' && layout === 'dex') {
      // Na Pokedex a carta sorteada pode estar fora do filtro atual: limpa antes.
      clearFilters()
      setFocusId(id)
    } else {
      setSelectedId(id)
    }
  }
  const selected = selectedId ? cardsById.get(selectedId) : null

  return (
    <>
      <header className="top">
        <h1>Grimório</h1>
        <p className="tag">Pokédex de Magic: The Gathering</p>
        <nav className="tabs" aria-label="Seções">
          <button type="button" className={view === 'cards' ? 'active' : ''} aria-current={view === 'cards'} onClick={() => setView('cards')}>Cartas</button>
          <button type="button" className={view === 'decks' ? 'active' : ''} aria-current={view === 'decks'} onClick={() => setView('decks')}>Decks</button>
        </nav>
        <div className="top-actions">
          <button type="button" className="btn ghost" onClick={random}>Carta aleatória</button>
          <button type="button" className="btn ghost" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Alternar tema">
            {theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
          </button>
        </div>
      </header>

      <main>
        {view === 'cards' ? (
          <>
            <div className="toolbar">
              <SearchBar value={query} onChange={setQuery} />
              <label className="select">
                <span>Ordenar</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </label>
              <div className="layout-toggle" role="group" aria-label="Modo de visualização">
                <button type="button" className={`chip ${layout === 'dex' ? 'active' : ''}`} aria-pressed={layout === 'dex'} onClick={() => setLayout('dex')}>Pokédex</button>
                <button type="button" className={`chip ${layout === 'grid' ? 'active' : ''}`} aria-pressed={layout === 'grid'} onClick={() => setLayout('grid')}>Grade</button>
              </div>
              <button type="button" className={`chip ${onlyFavs ? 'active' : ''}`} aria-pressed={onlyFavs} onClick={() => setOnlyFavs(!onlyFavs)}>
                ★ Favoritas ({favorites.length})
              </button>
            </div>
            <ColorFilter value={color} onChange={setColor} />
            <p className="count" role="status">{visible.length} de {cards.length} cartas</p>
            {layout === 'dex' ? (
              <Pokedex
                cards={visible}
                focusId={focusId}
                onFocus={setFocusId}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                compareIds={compareIds}
                onToggleCompare={toggleCompare}
                onClear={clearFilters}
              />
            ) : (
              <CardList cards={visible} favorites={favorites} onToggleFavorite={toggleFavorite} compareIds={compareIds} onToggleCompare={toggleCompare} onSelect={setSelectedId} onClear={clearFilters} />
            )}
          </>
        ) : (
          <DeckList decks={decks} cardsById={cardsById} onSelectCard={setSelectedId} />
        )}
      </main>

      <footer>
        Dados e imagens: <a href="https://scryfall.com" target="_blank" rel="noreferrer">Scryfall</a>. Magic: The Gathering é marca da Wizards of the Coast; projeto acadêmico sem fins lucrativos.
      </footer>

      <CompareBar
        cards={compareCards}
        onRemove={toggleCompare}
        onClear={() => setCompareIds([])}
        onOpen={() => setCompareOpen(true)}
      />
      {compareOpen && compareCards.length === 2 && (
        <CompareModal cards={compareCards} onClose={() => setCompareOpen(false)} />
      )}

      {selected && (
        <CardDetails
          card={selected}
          favorite={favorites.includes(selected.id)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  )
}
