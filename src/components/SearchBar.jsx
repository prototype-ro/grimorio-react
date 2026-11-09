export default function SearchBar({ value, onChange }) {
  return (
    <label className="search">
      <span className="sr-only">Pesquisar carta por nome ou número</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Pesquisar por nome ou número…"
      />
    </label>
  )
}
