import { COLOR_INFO, FILTER_COLORS } from '../utils/colors'

export default function ColorFilter({ value, onChange }) {
  const options = ['ALL', ...FILTER_COLORS]
  return (
    <div className="filters" role="group" aria-label="Filtrar por cor">
      {options.map((c) => (
        <button
          key={c}
          type="button"
          className={`chip ${value === c ? 'active' : ''}`}
          style={c === 'ALL' ? undefined : { '--tone': COLOR_INFO[c].css }}
          aria-pressed={value === c}
          onClick={() => onChange(c)}
        >
          {c === 'ALL' ? 'Todas' : COLOR_INFO[c].label}
        </button>
      ))}
    </div>
  )
}
