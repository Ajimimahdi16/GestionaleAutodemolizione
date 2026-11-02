import { marche } from '../dati/azienda.js'

// Fascia scorrevole con le marche principali. La seconda copia serve solo all'effetto continuo.
export default function Scorrimento() {
  return (
    <div className="scorrimento" aria-label="Alcune delle marche per cui cerchiamo ricambi">
      <div className="scorrimento-pista">
        {[0, 1].map(copia => (
          <ul key={copia} aria-hidden={copia === 1}>
            {marche.map(marca => <li key={marca}>{marca}</li>)}
          </ul>
        ))}
      </div>
    </div>
  )
}
