import { useEffect, useId, useMemo, useRef, useState } from 'react'

const normalizza = testo => testo.normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase('it').trim()

// Menu a tendina con ricerca, usabile anche da tastiera. `opzioni` = [{ valore, etichetta }].
export default function Menu({ etichetta, segnaposto, opzioni, valore, onChange, disabilitato = false, caricamento = false }) {
  const contenitore = useRef(null)
  const campo = useRef(null)
  const idLista = useId()
  const [aperto, setAperto] = useState(false)
  const [ricerca, setRicerca] = useState('')
  const [attivo, setAttivo] = useState(0)

  const visibili = useMemo(() => {
    const testo = normalizza(ricerca)
    return testo ? opzioni.filter(voce => normalizza(voce.etichetta).includes(testo)) : opzioni
  }, [opzioni, ricerca])
  const scelta = opzioni.find(voce => String(voce.valore) === String(valore))

  useEffect(() => {
    if (!aperto) return undefined
    campo.current?.focus()
    const chiudiFuori = evento => { if (!contenitore.current?.contains(evento.target)) setAperto(false) }
    document.addEventListener('pointerdown', chiudiFuori)
    return () => document.removeEventListener('pointerdown', chiudiFuori)
  }, [aperto])

  function apri() {
    if (disabilitato) return
    setRicerca('')
    setAttivo(0)
    setAperto(true)
  }

  function seleziona(nuovoValore) {
    onChange(nuovoValore)
    setAperto(false)
  }

  function tasti(evento) {
    if (evento.key === 'Escape') { setAperto(false); return }
    if (evento.key === 'ArrowDown') { evento.preventDefault(); setAttivo(corrente => Math.min(corrente + 1, visibili.length - 1)) }
    if (evento.key === 'ArrowUp') { evento.preventDefault(); setAttivo(corrente => Math.max(corrente - 1, 0)) }
    if (evento.key === 'Enter' && visibili[attivo]) { evento.preventDefault(); seleziona(visibili[attivo].valore) }
  }

  return (
    <div className={`menu ${aperto ? 'aperto' : ''} ${disabilitato ? 'disabilitato' : ''}`} ref={contenitore}>
      <span className="menu-etichetta">{etichetta}</span>
      <button type="button" className="menu-bottone" disabled={disabilitato} aria-haspopup="listbox" aria-expanded={aperto} onClick={() => (aperto ? setAperto(false) : apri())}>
        <span className={scelta ? '' : 'segnaposto'}>{caricamento ? 'Caricamento…' : scelta ? scelta.etichetta : segnaposto}</span>
        <i aria-hidden="true" />
      </button>
      {aperto && (
        <div className="menu-pannello">
          <input ref={campo} type="search" value={ricerca} placeholder="Scrivi per cercare…" aria-label={`Cerca ${etichetta.toLowerCase()}`} aria-controls={idLista}
            onChange={evento => { setRicerca(evento.target.value); setAttivo(0) }} onKeyDown={tasti} />
          <ul id={idLista} role="listbox" aria-label={etichetta}>
            {valore !== '' && <li><button type="button" className="menu-voce menu-azzera" onClick={() => seleziona('')}>Qualsiasi · azzera</button></li>}
            {visibili.map((voce, indice) => (
              <li key={voce.valore}>
                <button type="button" role="option" aria-selected={String(voce.valore) === String(valore)}
                  className={`menu-voce ${indice === attivo ? 'attiva' : ''}`} onMouseEnter={() => setAttivo(indice)} onClick={() => seleziona(voce.valore)}>
                  {voce.etichetta}
                </button>
              </li>
            ))}
            {!visibili.length && <li className="menu-vuoto">Nessun risultato</li>}
          </ul>
        </div>
      )}
    </div>
  )
}
