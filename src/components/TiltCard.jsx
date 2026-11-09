import { useRef, useState } from 'react'
import { pad, RARITY } from '../utils/format'

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Carta fisica: inclina seguindo o mouse, brilho foil e vira ao clicar.
// Use com key={card.id} para reiniciar o estado (e a animacao de entrada) a cada troca.
export default function TiltCard({ card }) {
  const ref = useRef(null)
  const [flipped, setFlipped] = useState(false)
  const shiny = card.rarity === 'rare' || card.rarity === 'mythic'

  const onMove = (e) => {
    const el = ref.current
    if (!el || reduceMotion()) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${((0.5 - y) * 18).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${((x - 0.5) * 22).toFixed(2)}deg`)
    el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`)
    el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`)
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    for (const v of ['--rx', '--ry']) el.style.setProperty(v, '0deg')
    el.style.setProperty('--mx', '50%')
    el.style.setProperty('--my', '50%')
  }

  return (
    <div className="tilt-scene">
      <button
        ref={ref}
        type="button"
        className={`tilt ${flipped ? 'flipped' : ''} ${shiny ? 'shiny' : ''}`}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? `Virar ${card.name} para a frente` : `Virar ${card.name} para ver o verso`}
        aria-pressed={flipped}
      >
        <span className="flipper">
          <span className="face front">
            <img src={card.image} alt={`Carta ${card.name}`} draggable="false" />
            <span className="foil" aria-hidden="true" />
            <span className="glare" aria-hidden="true" />
          </span>
          <span className="face back">
            <img src={card.art} alt="" draggable="false" />
            <span className="back-info">
              <span className="card-id">#{pad(card.id)}</span>
              <strong>{card.name}</strong>
              <span>{card.typeLine}</span>
              <span>{RARITY[card.rarity]} · {card.set}</span>
            </span>
          </span>
        </span>
      </button>
      <p className="tilt-hint">Passe o mouse para inclinar · clique para virar</p>
    </div>
  )
}
