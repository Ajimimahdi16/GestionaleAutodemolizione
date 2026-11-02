import { useEffect, useState } from 'react'
import { azienda } from '../dati/azienda.js'
import { recensioni as recensioniManuali } from '../dati/recensioni.js'
import Rivela from './Rivela.jsx'
import { IconaFreccia, IconaStella } from './Icone.jsx'

const Stelle = ({ numero }) => (
  <span className="stelle" role="img" aria-label={`${numero} stelle su 5`}>
    {[1, 2, 3, 4, 5].map(posizione => <IconaStella key={posizione} piena={posizione <= numero} />)}
  </span>
)

// Le recensioni arrivano da Google Maps quando il server è configurato per leggerle (chiave e ID del luogo).
// Altrimenti si usano quelle scritte a mano in dati/recensioni.js; se non ce ne sono, resta l'invito a leggerle su Google.
export default function Recensioni() {
  const [google, setGoogle] = useState(null)

  useEffect(() => {
    const controllo = new AbortController()
    fetch('/api/pubblico/recensioni', { signal: controllo.signal })
      .then(risposta => (risposta.ok ? risposta.json() : null))
      .then(dati => { if (dati && dati.attive && dati.recensioni?.length) setGoogle(dati) })
      .catch(() => {})
    return () => controllo.abort()
  }, [])

  const elenco = google ? google.recensioni : recensioniManuali
  const linkGoogle = google?.mappa || azienda.googleMaps

  return (
    <section id="recensioni" className="sezione">
      <div className="contenitore">
        <Rivela>
          <p className="etichetta">RECENSIONI</p>
          <h2>Cosa dicono di noi.</h2>
          {google && google.valutazione !== null && (
            <p className="recensioni-media">
              <Stelle numero={Math.round(google.valutazione)} />
              <strong>{google.valutazione.toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} su 5</strong>
              <span>· {google.totale} recensioni su Google</span>
            </p>
          )}
        </Rivela>
        {elenco.length > 0 && (
          <div className="recensioni-griglia">
            {elenco.map((recensione, indice) => (
              <Rivela key={`${recensione.autore}-${indice}`} ritardo={indice * 70}>
                <figure className="recensione">
                  <Stelle numero={recensione.stelle} />
                  <blockquote>{recensione.testo}</blockquote>
                  <figcaption>
                    {recensione.autore}
                    {(recensione.quando || recensione.data) ? ` · ${recensione.quando || recensione.data}` : ''}
                    {google && <em>Recensione su Google</em>}
                  </figcaption>
                </figure>
              </Rivela>
            ))}
          </div>
        )}
        <Rivela ritardo={80}>
          <div className="recensioni-invito">
            <div>
              <Stelle numero={5} />
              <strong>{elenco.length ? 'Hai comprato da noi o ritirato un veicolo?' : 'Sei stato nostro cliente?'}</strong>
              <span>Leggi tutte le recensioni su Google e raccontaci la tua esperienza: ci aiuta a migliorare.</span>
            </div>
            <a className="pulsante pulsante-giallo" href={linkGoogle} target="_blank" rel="noreferrer noopener">
              Recensioni su Google <IconaFreccia />
            </a>
          </div>
        </Rivela>
      </div>
    </section>
  )
}
