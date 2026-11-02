import { useMemo } from 'react'
import { collegaParti } from '../catalogo.js'
import { azienda } from '../dati/azienda.js'
import { parti } from '../dati/parti.js'
import AutoInterattiva from './AutoInterattiva.jsx'
import { IconaCerca, IconaTelefono } from './Icone.jsx'
import StatoApertura from './StatoApertura.jsx'

export default function Eroe({ filtri, disponibilita, onScegliParte }) {
  const partiCollegate = useMemo(() => collegaParti(parti, filtri.tipologie, disponibilita), [filtri.tipologie, disponibilita])

  return (
    <section id="inizio" className="eroe">
      <div className="contenitore">
        <div className="eroe-testo">
          <StatoApertura />
          <h1>Tocca la parte<br /><em>che ti serve.</em></h1>
          <p className="eroe-sottotitolo">
            Scegli il pezzo direttamente dall&apos;auto: ti diciamo subito se è disponibile a Torino.
          </p>
        </div>
        <AutoInterattiva parti={partiCollegate} onScegli={onScegliParte} />
        <div className="eroe-azioni">
          <a className="pulsante pulsante-giallo" href="#cerca"><IconaCerca /> Cerca con i menu</a>
          <a className="pulsante pulsante-bordo" href={azienda.telefonoUfficio.link}><IconaTelefono /> Chiamaci</a>
        </div>
        <ul className="eroe-punti">
          <li>Disponibilità aggiornata in tempo reale</li>
          <li>Ritiro gratuito del veicolo*</li>
          <li>{azienda.indirizzo}, {azienda.citta}</li>
        </ul>
        <small className="nota-eroe">* Per i veicoli senza fermo amministrativo.</small>
      </div>
    </section>
  )
}
