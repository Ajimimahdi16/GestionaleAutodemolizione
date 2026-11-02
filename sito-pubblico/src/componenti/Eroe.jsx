import { azienda } from '../dati/azienda.js'
import { IconaCerca, IconaTelefono } from './Icone.jsx'
import StatoApertura from './StatoApertura.jsx'

function AutoAnimata() {
  return (
    <svg className="auto-animata" viewBox="0 0 64 36" role="img" aria-label="Illustrazione di un'auto">
      <path className="auto-corpo" d="M3 28v-6c0-2.600 1.700-4.600 4.200-5.200l6.300-1.600 5.600-8.200c1-1.400 2.300-2 4-2h11.600c1.700 0 3.100.7 4.100 2.100l5.200 7.600c3.300.8 5.200 2.900 5.200 6.200V28c0 1.100-.9 2-2 2H5c-1.100 0-2-.9-2-2z" />
      <path className="auto-vetri" d="M19.200 15.500l3.900-5.600c.4-.6.900-.9 1.600-.9h4.800v6.500zM32.200 9h2.600c.7 0 1.200.3 1.600.9l3.600 5.600H32.200z" />
      <rect className="auto-fanale" x="47" y="20" width="3.500" height="3" rx="1" />
      {[15, 37].map(cx => (
        <g key={cx} transform={`translate(${cx} 30)`}>
          <circle r="7.500" className="auto-gomma" />
          <g className="auto-ruota">
            <circle r="5" className="auto-cerchio" />
            <path className="auto-razze" d="M0-4.500v9M-4.500 0h9M-3.200-3.200l6.400 6.400M3.200-3.200l-6.400 6.400" />
            <circle r="1.600" className="auto-gomma" />
          </g>
        </g>
      ))}
    </svg>
  )
}

export default function Eroe() {
  return (
    <section id="inizio" className="eroe">
      <div className="contenitore eroe-griglia">
        <div className="eroe-testo">
          <StatoApertura />
          <h1>Il ricambio che cerchi, <em>a Torino.</em></h1>
          <p className="eroe-sottotitolo">
            Cerca online il pezzo che ti serve e scopri subito se è disponibile.
            E se devi demolire il tuo veicolo, <strong>il ritiro è gratuito</strong>.
          </p>
          <div className="eroe-azioni">
            <a className="pulsante pulsante-giallo" href="#cerca"><IconaCerca /> Cerca un ricambio</a>
            <a className="pulsante pulsante-bordo" href={azienda.telefonoUfficio.link}><IconaTelefono /> Chiamaci</a>
          </div>
          <ul className="eroe-punti">
            <li>Disponibilità aggiornata in tempo reale</li>
            <li>Ritiro gratuito del veicolo*</li>
            <li>{azienda.indirizzo}, {azienda.citta}</li>
          </ul>
          <small className="nota-eroe">* Per i veicoli senza fermo amministrativo.</small>
        </div>
        <div className="eroe-visuale" aria-hidden="false">
          <div className="alone" />
          <AutoAnimata />
          <div className="strada"><span /></div>
        </div>
      </div>
    </section>
  )
}
