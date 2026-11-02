import { azienda } from '../dati/azienda.js'
import { recensioni } from '../dati/recensioni.js'
import Rivela from './Rivela.jsx'
import { IconaFreccia, IconaStella } from './Icone.jsx'

const Stelle = ({ numero }) => (
  <span className="stelle" role="img" aria-label={`${numero} stelle su 5`}>
    {[1, 2, 3, 4, 5].map(posizione => <IconaStella key={posizione} piena={posizione <= numero} />)}
  </span>
)

export default function Recensioni() {
  return (
    <section id="recensioni" className="sezione">
      <div className="contenitore">
        <Rivela>
          <p className="etichetta">RECENSIONI</p>
          <h2>Cosa dicono di noi.</h2>
        </Rivela>
        {recensioni.length > 0 && (
          <div className="recensioni-griglia">
            {recensioni.map((recensione, indice) => (
              <Rivela key={`${recensione.autore}-${indice}`} ritardo={indice * 70}>
                <figure className="recensione">
                  <Stelle numero={recensione.stelle} />
                  <blockquote>{recensione.testo}</blockquote>
                  <figcaption>{recensione.autore}{recensione.data ? ` · ${recensione.data}` : ''}</figcaption>
                </figure>
              </Rivela>
            ))}
          </div>
        )}
        <Rivela ritardo={80}>
          <div className="recensioni-invito">
            <div>
              <Stelle numero={5} />
              <strong>{recensioni.length ? 'Hai comprato da noi o ritirato un veicolo?' : 'Sei stato nostro cliente?'}</strong>
              <span>Leggi le recensioni su Google e raccontaci la tua esperienza: ci aiuta a migliorare.</span>
            </div>
            <a className="pulsante pulsante-giallo" href={azienda.googleMaps} target="_blank" rel="noreferrer noopener">
              Recensioni su Google <IconaFreccia />
            </a>
          </div>
        </Rivela>
      </div>
    </section>
  )
}
