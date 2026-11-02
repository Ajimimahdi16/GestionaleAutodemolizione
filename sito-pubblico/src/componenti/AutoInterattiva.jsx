import { useState } from 'react'
import DisegnoAuto from './DisegnoAuto.jsx'
import { IconaFreccia } from './Icone.jsx'

// Disegno tecnico dell'auto con punti cliccabili: ogni punto mostra se il pezzo è disponibile
// e, al clic, compila la ricerca. `parti` arriva già collegata ai dati reali del magazzino.
export default function AutoInterattiva({ parti, onScegli }) {
  const [attivaId, setAttivaId] = useState(null)
  const attiva = parti.find(parte => parte.id === attivaId) || null

  function tastiera(evento, parte) {
    if (evento.key === 'Enter' || evento.key === ' ') { evento.preventDefault(); onScegli(parte) }
  }

  return (
    <div className="auto-scena">
      <svg className="auto-tecnica" viewBox="36 92 748 244" role="group" aria-label="Auto: scegli la parte che ti serve">
        <DisegnoAuto />

        {attiva && <path className="auto-evidenza" d={attiva.forma} />}

        {parti.map(parte => (
          <g key={parte.id} className={`punto ${attivaId === parte.id ? 'attivo' : ''} ${parte.disponibili === 0 ? 'esaurito' : ''}`}
            tabIndex={0} role="button" aria-label={`${parte.etichetta}: cerca i pezzi`}
            onMouseEnter={() => setAttivaId(parte.id)} onFocus={() => setAttivaId(parte.id)}
            onMouseLeave={() => setAttivaId(null)} onBlur={() => setAttivaId(null)}
            onClick={() => { setAttivaId(parte.id); onScegli(parte) }} onKeyDown={evento => tastiera(evento, parte)}>
            <circle className="punto-area" cx={parte.x} cy={parte.y} r="26" />
            <circle className="punto-onda" cx={parte.x} cy={parte.y} r="10" />
            <circle className="punto-nucleo" cx={parte.x} cy={parte.y} r="9" />
          </g>
        ))}
      </svg>

      <div className={`auto-scheda ${attiva ? 'visibile' : ''}`} aria-live="polite">
        {attiva ? (
          <>
            <strong>{attiva.etichetta}</strong>
            <span className={`auto-stato ${attiva.disponibili === 0 ? 'no' : 'si'}`}>
              {attiva.disponibili === null ? 'Controllo la disponibilità…'
                : attiva.disponibili === 0 ? 'Al momento non disponibile'
                : attiva.disponibili === 1 ? '✓ Disponibile · 1 pezzo' : `✓ Disponibile · ${attiva.disponibili} pezzi`}
            </span>
            <em>Clicca per vedere i dettagli <IconaFreccia /></em>
          </>
        ) : (
          <span className="auto-suggerimento">Passa sopra un punto luminoso, o toccalo, per scoprire se il pezzo è disponibile.</span>
        )}
      </div>
    </div>
  )
}
