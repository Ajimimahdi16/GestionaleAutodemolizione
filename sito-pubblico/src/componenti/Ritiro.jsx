import { azienda } from '../dati/azienda.js'
import Rivela from './Rivela.jsx'
import { IconaCamion, IconaTelefono } from './Icone.jsx'

const passi = [
  { numero: '1', titolo: 'Ci chiami', testo: 'Ci dai i dati del veicolo: ti diciamo se è tutto a posto per il ritiro gratuito.' },
  { numero: '2', titolo: 'Ti spieghiamo cosa serve', testo: 'Ti indichiamo i documenti da preparare, senza giri di parole.' },
  { numero: '3', titolo: 'Ritiriamo il veicolo', testo: 'Il nostro carrista viene a prenderlo e ci occupiamo noi della demolizione.' },
]

export default function Ritiro() {
  return (
    <section id="ritiro" className="sezione sezione-ritiro">
      <div className="contenitore">
        <Rivela>
          <div className="ritiro-scheda">
            <div className="ritiro-testo">
              <span className="ritiro-icona"><IconaCamion /></span>
              <p className="etichetta etichetta-scura">RITIRO VEICOLI</p>
              <h2>Devi demolire il tuo veicolo? Il ritiro è gratuito.</h2>
              <p>
                Per i veicoli <strong>senza fermo amministrativo</strong> veniamo a ritirare l&apos;auto senza costi per te.
                Se c&apos;è un fermo amministrativo la procedura è diversa e a pagamento: chiamaci e ti spieghiamo come funziona.
              </p>
              <div className="ritiro-azioni">
                <a className="pulsante pulsante-nero" href={azienda.telefonoUfficio.link}>
                  <IconaTelefono /> Ufficio · {azienda.telefonoUfficio.mostra}
                </a>
                <a className="pulsante pulsante-bordo-scuro" href={azienda.telefonoCarrista.link}>
                  <IconaCamion /> Carrista · {azienda.telefonoCarrista.mostra}
                </a>
              </div>
            </div>
            <ol className="ritiro-passi">
              {passi.map(passo => (
                <li key={passo.numero}>
                  <b>{passo.numero}</b>
                  <div><strong>{passo.titolo}</strong><span>{passo.testo}</span></div>
                </li>
              ))}
            </ol>
          </div>
        </Rivela>
      </div>
    </section>
  )
}
