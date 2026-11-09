const COUNT = { common: 0, uncommon: 12, rare: 26, mythic: 46 }

// Explosao de particulas. Posicoes derivadas do indice (angulo aureo), sem aleatoriedade no render.
export default function Burst({ rarity }) {
  const n = COUNT[rarity] ?? 0
  if (n === 0) return null
  return (
    <span className="burst" data-rarity={rarity} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <i
          key={i}
          style={{
            '--a': `${(i * 137.5) % 360}deg`,
            '--d': `${90 + ((i * 53) % 130)}px`,
            '--s': `${4 + ((i * 7) % 7)}px`,
            '--t': `${(i % 6) * 40}ms`,
          }}
        />
      ))}
    </span>
  )
}
