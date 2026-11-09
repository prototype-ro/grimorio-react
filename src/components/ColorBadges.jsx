import { COLOR_INFO, cardColors } from '../utils/colors'

export default function ColorBadges({ card }) {
  return (
    <ul className="badges">
      {cardColors(card).map((c) => (
        <li key={c} className="badge" style={{ '--tone': COLOR_INFO[c].css }}>
          {COLOR_INFO[c].label}
        </li>
      ))}
    </ul>
  )
}
