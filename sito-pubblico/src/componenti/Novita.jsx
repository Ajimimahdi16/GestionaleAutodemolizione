import { useEffect, useState } from 'react'
import Rivela from './Rivela.jsx'
import SchedaPezzo from './SchedaPezzo.jsx'

// Vetrina degli ultimi pezzi arrivati con foto; se non ce ne sono la sezione non compare.
export default function Novita() {
  const [pezzi, setPezzi] = useState([])

  useEffect(() => {
    const controllo = new AbortController()
    fetch('/api/pubblico/novita', { signal: controllo.signal })
      .then(risposta => (risposta.ok ? risposta.json() : { pezzi: [] }))
      .then(dati => setPezzi(dati.pezzi || []))
      .catch(() => {})
    return () => controllo.abort()
  }, [])

  if (!pezzi.length) return null
  return (
    <section id="novita" className="sezione sezione-novita">
      <div className="contenitore">
        <Rivela>
          <p className="etichetta">APPENA ARRIVATI</p>
          <h2>Gli ultimi pezzi in magazzino.</h2>
        </Rivela>
        <div className="novita-pista">
          {pezzi.map(pezzo => <SchedaPezzo key={pezzo.id} pezzo={pezzo} />)}
        </div>
      </div>
    </section>
  )
}
