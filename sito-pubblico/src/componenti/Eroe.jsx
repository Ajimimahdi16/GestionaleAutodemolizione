import { useMemo } from 'react'
import { collegaParti, collegaZone } from '../catalogo.js'
import { azienda } from '../dati/azienda.js'
import { parti } from '../dati/parti.js'
import { zone } from '../dati/zone.js'
import AutoEsplosa from './AutoEsplosa.jsx'
import AutoInterattiva from './AutoInterattiva.jsx'
import { IconaCerca, IconaTelefono } from './Icone.jsx'
import StatoApertura from './StatoApertura.jsx'

export default function Eroe({ filtri, disponibilita, onScegliParte }) {
  const partiCollegate = useMemo(() => collegaParti(parti, filtri.tipologie, disponibilita), [filtri.tipologie, disponibilita])
  const zoneCollegate = useMemo(() => collegaZone(zone, filtri.tipologie, disponibilita), [filtri.tipologie, disponibilita])
  // Versione di prova: aggiungendo ?hero=esploso all'indirizzo l'auto si apre per zone.
  const esploso = new URLSearchParams(window.location.search).get('hero') === 'esploso'

  return (
    <section id="inizio" className="eroe">
      <div className="contenitore">
        <div className="eroe-testo">
          <StatoApertura />
          {esploso ? <h1>Apri l&apos;auto,<br /><em>trova il pezzo.</em></h1> : <h1>Tocca la parte<br /><em>che ti serve.</em></h1>}
          <p className="eroe-sottotitolo">
            {esploso
              ? 'Tocca una zona: l\'auto si apre e ti mostra tutti i pezzi che possiamo avere, con la disponibilità in tempo reale.'
              : 'Scegli il pezzo direttamente dall\'auto: ti diciamo subito se è disponibile a Torino.'}
          </p>
        </div>
        {esploso
          ? <AutoEsplosa zone={zoneCollegate} onScegli={onScegliParte} />
          : <AutoInterattiva parti={partiCollegate} onScegli={onScegliParte} />}
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
