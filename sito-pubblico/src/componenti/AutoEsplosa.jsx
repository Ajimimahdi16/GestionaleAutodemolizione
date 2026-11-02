import { useEffect, useRef, useState } from 'react'
import DisegnoAuto from './DisegnoAuto.jsx'
import { IconaFreccia } from './Icone.jsx'

function testoDisponibilita(numero) {
  if (numero === null) return 'Controllo la disponibilità…'
  if (numero === 0) return 'Al momento nessun pezzo disponibile'
  return numero === 1 ? '✓ 1 pezzo disponibile' : `✓ ${numero} pezzi disponibili`
}

// L'auto si "apre": toccando una zona il pezzo di carrozzeria si stacca, compaiono i componenti interni
// e sotto si apre l'elenco dei pezzi di quella zona, con la disponibilità reale del magazzino.
export default function AutoEsplosa({ zone, onScegli }) {
  const [sopraId, setSopraId] = useState(null)
  const [apertaId, setApertaId] = useState(null)
  const [soloDisponibili, setSoloDisponibili] = useState(false)
  const pannello = useRef(null)
  const aperta = zone.find(zona => zona.id === apertaId) || null
  const evidenziata = zone.find(zona => zona.id === (sopraId || apertaId)) || null

  // Quando si apre una zona, porta il pannello dei pezzi in vista (utile soprattutto sul telefono).
  useEffect(() => {
    if (apertaId) pannello.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [apertaId])

  function alternaZona(zona) {
    setApertaId(corrente => (corrente === zona.id ? null : zona.id))
  }

  return (
    <div className={`auto-scena auto-esplosa ${aperta ? 'con-zona' : ''}`}>
      <svg className="auto-tecnica" viewBox="36 92 748 244" role="group" aria-label="Auto: scegli una zona da aprire">
        <DisegnoAuto />

        {zone.map(zona => (
          <g key={`interno-${zona.id}`} className={`zona-interno ${apertaId === zona.id ? 'visibile' : ''}`} aria-hidden="true">
            <path d={zona.interno} />
          </g>
        ))}

        {zone.map(zona => (
          <path key={`guscio-${zona.id}`} d={zona.forma}
            className={`zona-guscio ${sopraId === zona.id ? 'sopra' : ''} ${apertaId === zona.id ? 'aperta' : ''}`}
            style={{ '--sx': `${zona.sposta.x}px`, '--sy': `${zona.sposta.y}px` }} />
        ))}

        {zone.map(zona => (
          <path key={`area-${zona.id}`} d={zona.forma} className="zona-area" tabIndex={0} role="button"
            aria-expanded={apertaId === zona.id} aria-label={`${zona.etichetta}: ${apertaId === zona.id ? 'chiudi' : 'apri'}`}
            onMouseEnter={() => setSopraId(zona.id)} onMouseLeave={() => setSopraId(null)}
            onFocus={() => setSopraId(zona.id)} onBlur={() => setSopraId(null)}
            onClick={() => alternaZona(zona)}
            onKeyDown={evento => { if (evento.key === 'Enter' || evento.key === ' ') { evento.preventDefault(); alternaZona(zona) } }} />
        ))}
      </svg>

      <div className="auto-scheda visibile" aria-live="polite">
        {evidenziata ? (
          <>
            <strong>{evidenziata.etichetta}</strong>
            <span className={`auto-stato ${evidenziata.pezziDisponibili === 0 ? 'no' : 'si'}`}>{testoDisponibilita(evidenziata.pezziDisponibili)}</span>
            <em>{apertaId === evidenziata.id ? 'Clicca ancora per richiudere' : 'Clicca per aprire'} <IconaFreccia /></em>
          </>
        ) : (
          <span className="auto-suggerimento">Tocca una zona dell&apos;auto: si apre e ti mostra i pezzi che possiamo avere.</span>
        )}
      </div>

      {aperta && (
        <section className="esploso" ref={pannello} key={aperta.id} aria-label={`Pezzi: ${aperta.etichetta}`}>
          <header>
            <div>
              <h2>{aperta.etichetta}</h2>
              <p>{aperta.intro} Scegli un pezzo per vedere i dettagli.</p>
              <p className={`esploso-totale ${aperta.pezziDisponibili ? 'si' : 'no'}`}>{testoDisponibilita(aperta.pezziDisponibili)}</p>
            </div>
            <div className="esploso-comandi">
              <label className="esploso-filtro">
                <input type="checkbox" checked={soloDisponibili} onChange={evento => setSoloDisponibili(evento.target.checked)} />
                Solo disponibili
              </label>
              <button type="button" className="esploso-chiudi" onClick={() => setApertaId(null)}>Chiudi</button>
            </div>
          </header>
          <div className="esploso-gruppi">
            {aperta.gruppi.map((gruppo, indice) => {
              const voci = soloDisponibili ? gruppo.voci.filter(voce => voce.disponibili > 0) : gruppo.voci
              if (!voci.length) return null
              return (
                <div className="esploso-gruppo" key={gruppo.titolo} style={{ animationDelay: `${indice * 70}ms` }}>
                  <h3>{gruppo.titolo}</h3>
                  <ul>
                    {voci.map(voce => (
                      <li key={voce.id}>
                        <button type="button" className={`pezzo-chip ${voce.disponibili > 0 ? 'si' : 'no'}`} onClick={() => onScegli({ ids: [voce.id], etichetta: voce.nome })}>
                          <i aria-hidden="true" />
                          <span>{voce.nome}</span>
                          {voce.disponibili > 0 && <b>{voce.disponibili}</b>}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
          <p className="esploso-legenda"><i className="si" /> Disponibile <i className="no" /> Al momento non disponibile</p>
        </section>
      )}
    </div>
  )
}
