// Equivalente aos "tipos" da Pokedex: as cores de Magic.
export const COLOR_INFO = {
  W: { label: 'Branco', css: 'var(--w)' },
  U: { label: 'Azul', css: 'var(--u)' },
  B: { label: 'Preto', css: 'var(--b)' },
  R: { label: 'Vermelho', css: 'var(--r)' },
  G: { label: 'Verde', css: 'var(--g)' },
  C: { label: 'Incolor', css: 'var(--c)' },
}

export const FILTER_COLORS = ['W', 'U', 'B', 'R', 'G', 'C']

// Cartas incolores recebem "C"; multicoloridas aparecem em cada uma das suas cores.
export function cardColors(card) {
  return card.colors.length ? card.colors : ['C']
}

export function matchesColor(card, color) {
  return color === 'ALL' || cardColors(card).includes(color)
}
