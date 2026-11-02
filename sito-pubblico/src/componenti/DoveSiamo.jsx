import { useState } from 'react'
import { azienda, orari } from '../dati/azienda.js'
import { useStatoApertura } from '../orario.js'
import Rivela from './Rivela.jsx'
import { IconaFreccia, IconaPosizione } from './Icone.jsx'

// Ordine di visualizzazione: da lunedì a domenica.
const ordineGiorni = [1, 2, 3, 4, 5, 6, 0]

export default function DoveSiamo() {
  const stato = useStatoApertura()
  // La mappa di Google si carica solo dopo il clic: finché non serve, nessun dato va a Google.
  const [mappaAttiva, setMappaAttiva] = useState(false)

  return (
    <section id="dove" className="sezione sezione-chiara">
      <div className="contenitore">
        <Rivela>
          <p className="etichetta">DOVE SIAMO</p>
          <h2>Vieni a trovarci.</h2>
        </Rivela>
        <div className="dove-griglia">
          <Rivela ritardo={60}>
            <div className="dove-info">
              <address>
                <span className="dove-icona"><IconaPosizione /></span>
                <strong>{azienda.indirizzo}</strong>
                <span>{azienda.citta}</span>
              </address>
              <div className="dove-azioni">
                <a className="pulsante pulsante-giallo" href={azienda.indicazioni} target="_blank" rel="noreferrer noopener">Indicazioni stradali <IconaFreccia /></a>
                <a className="pulsante pulsante-bordo-scuro" href={azienda.googleMaps} target="_blank" rel="noreferrer noopener">Apri su Google Maps</a>
              </div>
              <h3>Orari di apertura</h3>
              <span className={`stato-apertura ${stato.aperto ? 'aperto' : 'chiuso'}`} role="status"><i aria-hidden="true" /> {stato.testo}</span>
              <table className="tabella-orari">
                <tbody>
                  {ordineGiorni.map(indice => (
                    <tr key={indice} className={indice === stato.giorno ? 'oggi' : ''}>
                      <th scope="row">{orari[indice].giorno}</th>
                      <td>{orari[indice].fasce.length ? orari[indice].fasce.map(([apre, chiude]) => `${apre.replace(':', '.')} – ${chiude.replace(':', '.')}`).join('   ·   ') : 'Chiuso'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Rivela>
          <Rivela ritardo={140}>
            <div className="mappa">
              {mappaAttiva ? (
                <iframe
                  title={`Mappa: ${azienda.indirizzo}, ${azienda.citta}`}
                  src={azienda.mappaIncorporata}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <div className="mappa-anteprima">
                  <span className="mappa-pin"><IconaPosizione /></span>
                  <strong>{azienda.indirizzo}, {azienda.citta}</strong>
                  <button type="button" className="pulsante pulsante-giallo" onClick={() => setMappaAttiva(true)}>Mostra la mappa</button>
                  <small>La mappa è fornita da Google: caricandola, Google riceve il tuo indirizzo IP.</small>
                </div>
              )}
            </div>
          </Rivela>
        </div>
      </div>
    </section>
  )
}
