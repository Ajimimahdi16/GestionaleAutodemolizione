import { useMemo } from 'react'
import { collegaZone } from '../catalogo.js'
import { azienda } from '../dati/azienda.js'
import { zone } from '../dati/zone.js'
import AutoEsplosa from './AutoEsplosa.jsx'
import { IconaCerca, IconaTelefono } from './Icone.jsx'
import StatoApertura from './StatoApertura.jsx'

export default function Eroe({ filtri, disponibilita, onScegliParte }) {
  const zoneCollegate = useMemo(() => collegaZone(zone, filtri.tipologie, disponibilita), [filtri.tipologie, disponibilita])

  return (
    <section id="inizio" className="eroe">
      <div className="contenitore">
        <div className="eroe-testo">
          <StatoApertura />
          <h1>Apri l&apos;auto,<br /><em>trova il pezzo.</em></h1>
          <p className="eroe-sottotitolo">
            Tocca una zona: l&apos;auto si apre e ti mostra tutti i pezzi che possiamo avere, con la disponibilità in tempo reale.
          </p>
        </div>
        <AutoEsplosa zone={zoneCollegate} onScegli={onScegliParte} />
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
