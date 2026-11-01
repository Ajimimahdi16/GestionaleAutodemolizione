import { useEffect, useMemo, useRef, useState } from 'react'

function normalizzaRicerca(testo) {
  return testo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('it').trim()
}

// Menu riutilizzabile con ricerca, tastiera e aggiunta di una voce personalizzata.
export default function SearchableSelect({
  value,
  options,
  onChange,
  placeholder,
  addLabel,
  onAddNew,
  disabled = false,
  ariaLabel,
  loading = false,
  loadError = '',
}) {
  const contenitore = useRef(null)
  const campoRicerca = useRef(null)
  const [aperto, setAperto] = useState(false)
  const [ricerca, setRicerca] = useState('')
  const [indiceAttivo, setIndiceAttivo] = useState(0)
  const [aggiuntaAperta, setAggiuntaAperta] = useState(false)
  const [nuovoValore, setNuovoValore] = useState('')
  const [errore, setErrore] = useState('')
  const [salvataggio, setSalvataggio] = useState(false)

  const vociOrdinate = useMemo(() => [...new Set(options.filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' })), [options])
  const vociVisibili = useMemo(() => {
    const testo = normalizzaRicerca(ricerca)
    if (!testo) return vociOrdinate
    return vociOrdinate
      .filter(voce => normalizzaRicerca(voce).includes(testo))
      .sort((a, b) => {
        const iniziaA = normalizzaRicerca(a).split(/\s+/).some(parola => parola.startsWith(testo))
        const iniziaB = normalizzaRicerca(b).split(/\s+/).some(parola => parola.startsWith(testo))
        if (iniziaA !== iniziaB) return iniziaA ? -1 : 1
        return a.localeCompare(b, 'it', { sensitivity: 'base' })
      })
  }, [ricerca, vociOrdinate])

  useEffect(() => {
    if (aperto) campoRicerca.current?.focus()
  }, [aperto, aggiuntaAperta])

  useEffect(() => {
    function chiudiFuori(evento) {
      if (!contenitore.current?.contains(evento.target)) setAperto(false)
    }
    document.addEventListener('mousedown', chiudiFuori)
    document.addEventListener('touchstart', chiudiFuori)
    return () => {
      document.removeEventListener('mousedown', chiudiFuori)
      document.removeEventListener('touchstart', chiudiFuori)
    }
  }, [])

  function apri() {
    if (disabled) return
    setRicerca('')
    setIndiceAttivo(0)
    setErrore('')
    setAggiuntaAperta(false)
    setAperto(true)
  }

  function scegli(voce) {
    onChange(voce)
    setAperto(false)
    setAggiuntaAperta(false)
    setRicerca('')
  }

  function tastiMenu(evento) {
    if (evento.key === 'Escape') {
      evento.preventDefault()
      setAperto(false)
      return
    }
    if (evento.key === 'ArrowDown') {
      evento.preventDefault()
      setIndiceAttivo(indice => vociVisibili.length ? (indice + 1) % vociVisibili.length : 0)
    }
    if (evento.key === 'ArrowUp') {
      evento.preventDefault()
      setIndiceAttivo(indice => vociVisibili.length ? (indice - 1 + vociVisibili.length) % vociVisibili.length : 0)
    }
    if (evento.key === 'Enter' && vociVisibili.length) {
      evento.preventDefault()
      scegli(vociVisibili[indiceAttivo] || vociVisibili[0])
    }
  }

  async function salvaNuovaVoce(evento) {
    evento.preventDefault()
    const testo = nuovoValore.trim()
    if (!testo) return
    setSalvataggio(true)
    setErrore('')
    try {
      const voceSalvata = await onAddNew(testo)
      scegli(voceSalvata || testo)
      setNuovoValore('')
    } catch (problema) {
      setErrore(problema.message || 'Non è stato possibile salvare la voce.')
    } finally {
      setSalvataggio(false)
    }
  }

  return <div className={`searchable-select ${aperto ? 'is-open' : ''}`} ref={contenitore}>
    <button
      className="searchable-select-trigger"
      type="button"
      aria-label={ariaLabel}
      aria-haspopup="listbox"
      aria-expanded={aperto}
      disabled={disabled}
      onClick={() => aperto ? setAperto(false) : apri()}
      onKeyDown={evento => {
        if (evento.key === 'ArrowDown' || evento.key === 'Enter' || evento.key === ' ') {
          evento.preventDefault()
          apri()
        }
      }}
    >
      <span className={value ? '' : 'is-placeholder'}>{value || placeholder}</span>
      <span className="searchable-select-arrow" aria-hidden="true" />
    </button>

    {aperto && <div className="searchable-select-menu">
      <input
        ref={campoRicerca}
        className="searchable-select-search"
        type="search"
        role="combobox"
        aria-label={`Cerca ${ariaLabel || 'una voce'}`}
        aria-expanded="true"
        aria-controls="elenco-voci-catalogo"
        aria-activedescendant={vociVisibili.length ? `voce-catalogo-${indiceAttivo}` : undefined}
        placeholder="Scrivi per cercare…"
        value={ricerca}
        onChange={evento => { setRicerca(evento.target.value); setIndiceAttivo(0); setAggiuntaAperta(false) }}
        onKeyDown={tastiMenu}
      />
      <div className="searchable-select-options" id="elenco-voci-catalogo" role="listbox" aria-label={ariaLabel} aria-busy={loading}>
        {loading && <span className="searchable-select-empty" role="status">Caricamento…</span>}
        {!loading && loadError && <span className="searchable-select-empty" role="alert">{loadError}</span>}
        {!loading && !loadError && vociVisibili.map((voce, indice) => <button
          className={`searchable-select-option ${indice === indiceAttivo ? 'is-active' : ''}`}
          id={`voce-catalogo-${indice}`}
          key={voce}
          type="button"
          role="option"
          aria-selected={voce === value}
          onMouseEnter={() => setIndiceAttivo(indice)}
          onClick={() => scegli(voce)}
        >{voce}</button>)}
        {!loading && !loadError && !vociVisibili.length && <span className="searchable-select-empty">Nessun risultato. Usa “{addLabel}” per aggiungerlo.</span>}
      </div>
      {addLabel && onAddNew && <div className="searchable-select-add-area">
        {!aggiuntaAperta
          ? <button className="searchable-select-add" type="button" onClick={() => { setAggiuntaAperta(true); setErrore('') }}>＋ {addLabel}</button>
          : <form className="searchable-select-new-form" onSubmit={salvaNuovaVoce}>
            <input ref={campoRicerca} value={nuovoValore} maxLength="120" onChange={evento => setNuovoValore(evento.target.value)} onKeyDown={evento => { if (evento.key === 'Escape') { evento.preventDefault(); setAggiuntaAperta(false); setNuovoValore('') } }} placeholder="Scrivi il nuovo valore" aria-label={addLabel} />
            <button type="submit" disabled={salvataggio || !nuovoValore.trim()}>{salvataggio ? '…' : 'Salva'}</button>
          </form>}
        {errore && <small className="searchable-select-error" role="alert">{errore}</small>}
      </div>}
    </div>}
  </div>
}
