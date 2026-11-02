import { useState } from 'react'
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
        <g className="auto-linee">
          <path className="auto-scocca" d="M62 258 C56 232 64 210 92 202 L150 196 C186 150 236 120 304 114 L476 110 C524 110 566 142 604 170 L702 190 C738 194 756 208 760 232 L762 262 L652 262 A62 62 0 0 0 528 262 L272 262 A62 62 0 0 0 148 262 Z" />
          <path className="auto-vetro" d="M214 184 L262 138 L474 134 L554 176 Z" />
          <path d="M388 135 L382 262 M222 190 L226 262 M548 176 L540 262" />
          <path className="auto-sottile" d="M120 196 L706 192 M640 232 L752 232 M150 244 L650 244" />
          <path className="auto-maniglia" d="M418 214 h28 M266 214 h28" />
          <path className="auto-specchio" d="M548 168 L572 164 L580 176 L556 180 Z" />
          <path className="auto-fanale-ant" d="M706 204 C726 200 744 206 750 216 L712 216 Z" />
          <path className="auto-fanale-post" d="M66 214 L96 210 L98 226 L68 228 Z" />
          {[210, 590].map(cx => (
            <g key={cx} className="auto-ruota-disegno">
              <circle className="auto-gomma" cx={cx} cy="268" r="50" />
              <circle cx={cx} cy="268" r="32" />
              <circle cx={cx} cy="268" r="9" />
              <path className="auto-sottile" d={`M${cx} 236v64M${cx - 32} 268h64M${cx - 22} 246l44 44M${cx + 22} 246l-44 44`} />
            </g>
          ))}
        </g>

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
