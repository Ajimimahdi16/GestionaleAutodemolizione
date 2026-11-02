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
          <path className="auto-scocca" d="M60 262 C54 240 62 222 92 214 L158 207 C206 168 262 138 330 126 L436 120 C496 120 552 142 594 172 L706 196 C742 200 760 214 763 236 L764 262 L652 262 A62 62 0 0 0 528 262 L272 262 A62 62 0 0 0 148 262 Z" />
          <path className="auto-sottile" d="M178 196 C226 160 276 138 338 130 L434 125 C490 125 540 146 580 176" />
          <path className="auto-vetro" d="M236 198 L304 150 C312 144 320 142 330 142 L430 142 C446 142 460 146 474 152 L556 184 Z" />
          <path d="M392 143 L388 262 M234 198 L230 262 M552 184 L536 262" />
          <path className="auto-sottile" d="M118 204 L708 200 M640 238 L752 238 M150 248 L650 248 M736 224 h22 M732 232 h30" />
          <path className="auto-maniglia" d="M426 218 h28 M272 218 h28" />
          <path className="auto-specchio" d="M548 176 L574 170 C581 170 584 176 581 181 L552 185 Z" />
          <path className="auto-fanale-ant" d="M706 208 C728 204 746 210 752 220 L712 220 Z" />
          <path className="auto-fanale-post" d="M64 218 L96 214 L98 230 L68 232 Z" />
          <path className="auto-sottile" d="M148 262 A62 62 0 0 1 272 262 M528 262 A62 62 0 0 1 652 262" />
          {[210, 590].map(cx => (
            <g key={cx} className="auto-ruota-disegno">
              <circle className="auto-gomma" cx={cx} cy="268" r="50" />
              <circle cx={cx} cy="268" r="34" />
              <path className="auto-razze" d={cx === 210 ? 'M210 268 L210.0 238.0 M210 268 L181.5 258.7 M210 268 L192.4 292.3 M210 268 L227.6 292.3 M210 268 L238.5 258.7' : 'M590 268 L590.0 238.0 M590 268 L561.5 258.7 M590 268 L572.4 292.3 M590 268 L607.6 292.3 M590 268 L618.5 258.7'} />
              <circle className="auto-mozzo" cx={cx} cy="268" r="8" />
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
