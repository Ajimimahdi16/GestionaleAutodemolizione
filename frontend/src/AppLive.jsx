import { useCallback, useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { catalogoMarche, catalogoModelli } from './catalogoVeicoli.js'
import SearchableSelect from './SearchableSelect.jsx'
import './form.css'
import './logo.css'
import './live.css'

const annoMassimoPlausibile = new Date().getFullYear() + 1

// Tutte le richieste passano dal proxy Vite in sviluppo e dallo stesso host in produzione.
async function api(url, options = {}) {
  const risposta = await fetch(url, {
    credentials: 'same-origin',
    ...options,
    headers: options.body instanceof FormData
      ? options.headers
      : { 'Content-Type': 'application/json', ...options.headers },
  })
  const dati = await risposta.json().catch(() => ({}))
  if (!risposta.ok) {
    const errore = new Error(dati.errore || `Richiesta non riuscita (${risposta.status}).`)
    errore.status = risposta.status
    throw errore
  }
  return dati
}

function normalizzaPezzo(pezzo) {
  return {
    ...pezzo,
    prezzo: Number(pezzo.prezzo || 0),
    foto: pezzo.foto || [],
    tinta: 'dark',
    icona: '🚘',
  }
}

function Icon({ children }) {
  return <span aria-hidden="true" className="icon">{children}</span>
}

function LoginPage({ onLogin, erroreServer }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errore, setErrore] = useState('')
  const [invio, setInvio] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setInvio(true)
    setErrore('')
    try {
      await onLogin(username.trim(), password)
    } catch (problema) {
      setErrore(problema.message)
    } finally {
      setInvio(false)
    }
  }

  return <main className="login-page">
    <section className="login-card">
      <div className="login-brand"><span className="login-mark">AT<span>✳</span></span><div><strong>AUTODEMOLIZIONE</strong><small>RICAMBI TORINO</small></div></div>
      <div className="eyebrow"><span /> ACCESSO RISERVATO</div>
      <h1>Area <em>magazzino.</em></h1>
      <p className="page-lead">Accedi per consultare e gestire i ricambi.</p>
      {(errore || erroreServer) && <div className="app-alert" role="alert">{errore || erroreServer}</div>}
      <form className="login-form" onSubmit={submit}>
        <label>UTENTE<input autoComplete="username" required value={username} onChange={event => setUsername(event.target.value)} placeholder="Nome utente" /></label>
        <label>PASSWORD<input autoComplete="current-password" required type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="La tua password" /></label>
        <button className="button button-yellow" type="submit" disabled={invio}>{invio ? 'ACCESSO IN CORSO…' : 'ACCEDI AL GESTIONALE'}</button>
      </form>
      <p className="login-foot">AUTODEMOLIZIONE RICAMBI TORINO SRL · TORINO</p>
    </section>
  </main>
}

function Shell({ children, utente, onLogout }) {
  return <div className="app-shell">
    <aside className="sidebar">
      <Link className="brand" to="/" aria-label="Autodemolizione Ricambi Torino, home"><img className="brand-logo" src="/Screenshot%202026-10-24%20alle%2021.25.15.png" alt="Autodemolizione Ricambi Torino" /></Link>
      <div className="side-label">GESTIONE MAGAZZINO</div>
      <nav className="side-nav">
        <NavLink end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/"><Icon>⌕</Icon> Cerca ricambio <span className="nav-arrow">›</span></NavLink>
        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/aggiungi"><Icon>＋</Icon> Aggiungi pezzo</NavLink>
      </nav>
      <div className="sidebar-bottom">
        <div className="shop-card"><span className="shop-card-icon">✳</span><strong>Il tuo magazzino,<br />sempre sotto controllo.</strong><small>Ricerca rapida · Dati aggiornati</small></div>
        <div className="user-row"><div className="user-avatar">AT</div><div><strong>{utente.nome || utente.username}</strong><small>{utente.ruolo === 'admin' ? 'Amministratore' : 'Operatore'}</small></div><button className="logout-button" onClick={onLogout} title="Esci" aria-label="Esci">↪</button></div>
      </div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div className="breadcrumb">TORINO <span>/</span> GESTIONALE RICAMBI</div><div className="topbar-right"><span className="live-dot" /> DATABASE COLLEGATO <span className="topbar-divider" /> <span className="date-label">SESSIONE ATTIVA</span></div></header>
      {children}
      <footer className="footer"><span>AUTODEMOLIZIONE RICAMBI TORINO SRL</span><span>Corso Orbassano 368/23, Torino <i>·</i> P.IVA 12721980014</span></footer>
    </main>
  </div>
}

function BadgeStato({ stato }) {
  return <span className={`status-badge ${stato === 'Disponibile' ? 'is-available' : 'is-sold'}`}><span />{stato}</span>
}

function PartVisual({ piece, large = false }) {
  const foto = piece.foto_principale || piece.foto?.[0]?.url
  return <div className={`part-visual ${piece.tinta || 'dark'} ${large ? 'visual-large' : ''}`}>
    {foto ? <img className="part-photo" src={foto} alt={`${piece.tipo} ${piece.marca} ${piece.modello}`} /> : <><div className="visual-grid" /><span className="visual-stamp">RICAMBI<br />TORINO</span><span className="part-emoji">{piece.icona || '🚘'}</span><span className="visual-caption">{piece.tipo}</span></>}
  </div>
}

function PezzoCard({ piece, onChangeStatus }) {
  const navigate = useNavigate()
  return <article className="piece-card">
    <button className="card-image-button" onClick={() => navigate(`/pezzo/${piece.id}`)} aria-label={`Apri ${piece.tipo}`}><PartVisual piece={piece} /><span className="photo-count">▧ {piece.foto?.length || (piece.foto_principale ? 1 : 0)}</span></button>
    <div className="card-content">
      <div className="card-topline"><span className="part-code">{piece.codice_oem || piece.codice}</span><BadgeStato stato={piece.stato} /></div>
      <h3>{piece.tipo}</h3><p className="vehicle-name">{piece.marca} <b>{piece.modello}</b><span> · </span>{piece.anno}</p>
      <div className="piece-tags"><span>◉ {piece.colore}</span><span>↔ {piece.lato}</span><span>⌖ {piece.posizione || '—'}</span><span>◇ {piece.condizione}</span></div>
      <div className="card-bottom"><strong className="price">€ {piece.prezzo.toFixed(2)}</strong><button className="text-button" onClick={() => navigate(`/pezzo/${piece.id}`)}>Dettaglio <span>↗</span></button></div>
      <button className="sold-link" onClick={() => onChangeStatus(piece.id, piece.stato === 'Disponibile' ? 'Venduto' : 'Disponibile')}>{piece.stato === 'Disponibile' ? 'Segna come venduto' : 'Rimetti disponibile'}</button>
    </div>
  </article>
}

function SearchPage({ pieces, marche, modelli, onChangeStatus, errore, caricamento, query, setQuery, marca: brand, setMarca: setBrand, soloDisponibili: onlyAvailable, setSoloDisponibili: setOnlyAvailable, modello, setModello, anno, setAnno, codice, setCodice }) {
  const annoMassimo = annoMassimoPlausibile
  const annoValido = anno === '' || (Number.isInteger(Number(anno)) && Number(anno) >= 1950 && Number(anno) <= annoMassimo)
  const filtered = useMemo(() => pieces.filter(piece => {
    const text = `${piece.tipo} ${piece.marca} ${piece.modello} ${piece.colore} ${piece.anno} ${piece.codice}`.toLowerCase()
    const parole = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
    return parole.every(parola => text.includes(parola)) && (!brand || piece.marca === brand) && (!onlyAvailable || piece.stato === 'Disponibile')
  }), [pieces, query, brand, onlyAvailable])
  const brands = marche
  return <section className="page-content">
    <div className="page-heading"><div><div className="eyebrow"><span /> MAGAZZINO RICAMBI <span className="eyebrow-line" /></div><h1>Trova il tuo <em>ricambio.</em></h1><p className="page-lead">Cerca tra i pezzi disponibili e rispondi al cliente in pochi secondi.</p></div><Link className="button button-yellow" to="/aggiungi"><span>＋</span> Aggiungi pezzo</Link></div>
    <div className="search-panel">
      <div className="search-main"><span className="search-icon">⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Cerca un pezzo, un veicolo o un codice..." aria-label="Cerca un pezzo"/><kbd>RICERCA</kbd></div>
      <div className="filter-row"><label className="filter-control"><span>MARCA</span><select value={brand} onChange={event => { setBrand(event.target.value); setModello('') }}><option value="">Tutte le marche</option>{brands.map(item => <option key={item}>{item}</option>)}</select></label><label className="filter-toggle"><input type="checkbox" checked={onlyAvailable} onChange={event => setOnlyAvailable(event.target.checked)} /><span className="toggle-track" /> Solo disponibili</label><span className="filter-help">Marche e modelli del catalogo <b>⌄</b></span></div>
      <div className="advanced-filters form-grid search-filter-grid">
        <label>Modello<select value={modello} onChange={event => setModello(event.target.value)} disabled={!brand}><option value="">{brand ? 'Tutti i modelli' : 'Seleziona prima la marca'}</option>{modelli.filter(item => brand && item.marca === brand).map(item => <option key={`${item.marca}-${item.modello}`} value={item.modello}>{item.modello}</option>)}</select></label>
        <label>Anno<input type="number" min="1950" max={annoMassimo} value={anno} onChange={event => setAnno(event.target.value)} placeholder="Es. 2008" aria-invalid={!annoValido} aria-describedby="errore-anno-ricerca" />{!annoValido && <small id="errore-anno-ricerca" className="search-field-error">Inserisci un anno tra 1950 e {annoMassimo}.</small>}</label>
        <label>Codice ricambio / OEM<input value={codice} onChange={event => setCodice(event.target.value)} placeholder="Es. 51787324" /></label>
      </div>
    </div>
    {errore && <div className="app-alert" role="alert">{errore}</div>}
    <div className="results-heading"><div><h2>RICAMBI IN MAGAZZINO <span className="result-count">{filtered.length.toString().padStart(2, '0')}</span></h2><p>{caricamento ? 'Aggiornamento archivio…' : onlyAvailable ? 'Visualizzazione dei soli pezzi disponibili' : 'Visualizzazione di tutti i pezzi'}</p></div><span className="sort-button">DATI AGGIORNATI</span></div>
    {caricamento ? <div className="empty-state"><h3>Caricamento ricambi…</h3></div> : filtered.length ? <div className="pieces-grid">{filtered.map(piece => <PezzoCard key={piece.id} piece={piece} onChangeStatus={onChangeStatus} />)}</div> : <div className="empty-state"><span>⌕</span><h3>Nessun ricambio trovato</h3><p>Prova a modificare la ricerca oppure mostra anche i pezzi venduti.</p><button className="button button-dark" onClick={() => { setQuery(''); setBrand(''); setOnlyAvailable(false); setModello(''); setAnno(''); setCodice('') }}>Azzera i filtri</button></div>}
    <div className="inventory-note"><span>✳</span><p><strong>Ricerca rapida, servizio migliore.</strong> I dati visualizzati provengono dall’archivio del magazzino.</p><span className="note-arrow">↗</span></div>
  </section>
}

function DetailPage({ pieces, onChangeStatus, utente, aggiorna }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [piece, setPiece] = useState(() => pieces.find(item => item.id === Number(id)))
  const [errore, setErrore] = useState('')
  useEffect(() => {
    let attivo = true
    api(`/api/pezzi/${id}`).then(dati => { if (attivo) setPiece(normalizzaPezzo(dati.pezzo)) }).catch(problema => { if (attivo) setErrore(problema.message) })
    return () => { attivo = false }
  }, [id])
  const dettaglio = piece || pieces.find(item => item.id === Number(id))
  if (!dettaglio) return <section className="page-content"><div className="empty-state"><h3>{errore || 'Caricamento scheda ricambio…'}</h3><Link to="/">Torna alla ricerca</Link></div></section>
  async function caricaFoto(event) {
    const files = Array.from(event.target.files || [])
    if (!files.length) return
    const dati = new FormData()
    files.forEach(file => dati.append('foto', file))
    try {
      await api(`/api/pezzi/${id}/foto`, { method: 'POST', body: dati })
      const risposta = await api(`/api/pezzi/${id}`)
      setPiece(normalizzaPezzo(risposta.pezzo))
      await aggiorna()
    } catch (problema) { setErrore(problema.message) }
    event.target.value = ''
  }
  async function eliminaFoto(idFoto) {
    if (!window.confirm('Vuoi eliminare questa foto?')) return
    try {
      await api(`/api/foto/${idFoto}`, { method: 'DELETE' })
      const risposta = await api(`/api/pezzi/${id}`)
      setPiece(normalizzaPezzo(risposta.pezzo))
      await aggiorna()
    } catch (problema) { setErrore(problema.message) }
  }
  async function eliminaPezzo() {
    if (!window.confirm('Eliminare definitivamente questo ricambio?')) return
    try {
      await api(`/api/pezzi/${id}`, { method: 'DELETE' })
      await aggiorna()
      navigate('/')
    } catch (problema) { setErrore(problema.message) }
  }
  async function cambiaStatoScheda() {
    const nuovoStato = dettaglio.stato === 'Disponibile' ? 'Venduto' : 'Disponibile'
    await onChangeStatus(dettaglio.id, nuovoStato)
    try {
      const risposta = await api(`/api/pezzi/${id}`)
      setPiece(normalizzaPezzo(risposta.pezzo))
    } catch (problema) { setErrore(problema.message) }
  }
  const immagini = dettaglio.foto || []
  return (
    <section className="page-content">
      <Link className="back-link" to="/">← TORNA AI RISULTATI</Link>
      {errore && <div className="app-alert" role="alert">{errore}</div>}
      <div className="detail-layout">
        <div>
          <PartVisual piece={dettaglio} large />
          <div className="photo-gallery">
            {immagini.map(immagine => <div className="photo-thumb" key={immagine.id}>
              <a href={immagine.url} target="_blank" rel="noreferrer"><img src={immagine.url} alt={`${dettaglio.tipo} ${dettaglio.codice}`} /></a>
              {utente.ruolo === 'admin' && <button type="button" onClick={() => eliminaFoto(immagine.id)} aria-label="Elimina foto">×</button>}
            </div>)}
            <label className="photo-add">＋ Aggiungi foto<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={caricaFoto} /></label>
          </div>
        </div>
        <div className="detail-info">
          <div className="eyebrow"><span /> SCHEDA RICAMBIO</div>
          <div className="detail-code">Codice interno: {dettaglio.codice}</div>
          <h1>{dettaglio.tipo}<br /><em>{dettaglio.marca} {dettaglio.modello}</em></h1>
          <BadgeStato stato={dettaglio.stato} />
          <div className="detail-price">€ {dettaglio.prezzo.toFixed(2)} <small>PREZZO INDICATIVO</small></div>
          <div className="detail-specs">{[['ANNO', dettaglio.anno], ['COLORE', dettaglio.colore], ['POSIZIONE', dettaglio.posizione || '—'], ['LATO', dettaglio.lato], ['CONDIZIONE', dettaglio.condizione]].map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}</div>
          {(dettaglio.codice_oem || dettaglio.sigla_motore || dettaglio.matricola_motore) && <div className="technical-codes">
            <strong>CODICI E DATI TECNICI</strong>
            {dettaglio.codice_oem && <span>Codice OEM: <b>{dettaglio.codice_oem}</b></span>}
            {dettaglio.sigla_motore && <span>Sigla motore: <b>{dettaglio.sigla_motore}</b></span>}
            {dettaglio.matricola_motore && <span>Matricola motore: <b>{dettaglio.matricola_motore}</b></span>}
          </div>}
          <div className="detail-actions"><button className="button button-yellow" onClick={() => navigate(`/modifica/${dettaglio.id}`)}>✎ Modifica scheda</button><button className="button button-dark" onClick={cambiaStatoScheda}>{dettaglio.stato === 'Disponibile' ? 'Segna come venduto' : 'Rimetti disponibile'}</button>{utente.ruolo === 'admin' && <button className="button button-dark" onClick={eliminaPezzo}>Elimina ricambio</button>}</div>
        </div>
      </div>
    </section>
  )
}

function tipologiaRichiedeCodice(tipo) {
  return /centralin|\babs\b|\becu\b|autoradio|\bradio\b|quadro strumenti|navigatore|body computer/i.test(tipo || '')
}

function PieceForm({ pieces, tipologie, marche, modelli, colori, suggerimenti, onAddTipologia, onAddMarca, onAddModello, onAddColore, onSave }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const existing = pieces.find(piece => piece.id === Number(id))
  const [form, setForm] = useState(() => existing ? { ...existing } : { tipo: '', marca: '', modello: '', anno: new Date().getFullYear(), colore: '', lato: 'Nessuno', posizione: 'Anteriore', condizione: 'Usato', prezzo: '', codice_oem: '', sigla_motore: '', matricola_motore: '' })
  const [files, setFiles] = useState([])
  const [anteprime, setAnteprime] = useState([])
  const [errore, setErrore] = useState('')
  const [salvataggio, setSalvataggio] = useState(false)
  const [modelliRemoti, setModelliRemoti] = useState({ marca: '', valori: [] })
  const [tipologiePezzo, setTipologiePezzo] = useState(tipologie)
  const [coloriCatalogo, setColoriCatalogo] = useState(colori)
  const [caricaPezzi, setCaricaPezzi] = useState(true)
  const [caricaColori, setCaricaColori] = useState(true)
  const [errorePezzi, setErrorePezzi] = useState('')
  const [erroreColori, setErroreColori] = useState('')
  const isMotore = /motore|engine/i.test(form.tipo)
  const mostraCodiceOem = tipologiaRichiedeCodice(form.tipo)
  const mostraDatiMotore = isMotore && !mostraCodiceOem
  useEffect(() => () => anteprime.forEach(URL.revokeObjectURL), [anteprime])
  useEffect(() => {
    let attivo = true
    api('/api/tipologie').then(risultato => {
      if (!attivo) return
      const nomi = risultato.tipologie.map(voce => typeof voce === 'string' ? voce : voce.nome)
      setTipologiePezzo([...new Set(nomi)].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' })))
      setErrorePezzi('')
    }).catch(() => {
      if (attivo) setErrorePezzi('Catalogo pezzi non disponibile. Riprova tra poco.')
    }).finally(() => { if (attivo) setCaricaPezzi(false) })

    api('/api/colori').then(risultato => {
      if (!attivo) return
      const nomi = risultato.colori.map(voce => typeof voce === 'string' ? voce : voce.nome)
      setColoriCatalogo([...new Set(nomi)].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' })))
      setErroreColori('')
    }).catch(() => {
      if (attivo) setErroreColori('Catalogo colori non disponibile. Verifica che il seed colori sia stato caricato.')
    }).finally(() => { if (attivo) setCaricaColori(false) })

    return () => { attivo = false }
  }, [])
  useEffect(() => {
    if (!form.marca) return undefined
    let attivo = true
    api(`/api/modelli?marca=${encodeURIComponent(form.marca)}`)
      .then(dati => { if (attivo) setModelliRemoti({ marca: form.marca, valori: dati.modelli.map(voce => voce.modello) }) })
      .catch(() => { if (attivo) setModelliRemoti({ marca: form.marca, valori: [] }) })
    return () => { attivo = false }
  }, [form.marca])
  const update = event => {
    const { name, value } = event.target
    setForm(current => {
      const aggiornato = { ...current, [name]: value }
      if (name === 'tipo') {
        if (!tipologiaRichiedeCodice(value)) aggiornato.codice_oem = ''
        if (!/motore|engine/i.test(value) || tipologiaRichiedeCodice(value)) {
          aggiornato.sigla_motore = ''
          aggiornato.matricola_motore = ''
        }
      }
      if (name === 'marca') aggiornato.modello = ''
      return aggiornato
    })
  }
  function selezionaFoto(event) {
    const selezionate = Array.from(event.target.files || []).slice(0, 8)
    setFiles(selezionate)
    setAnteprime(selezionate.map(file => URL.createObjectURL(file)))
    if (event.target.files.length > 8) setErrore('Puoi selezionare al massimo otto foto per volta.')
    else setErrore('')
  }
  const modelliMarca = [...new Set([
    ...(modelli[form.marca] || []),
    ...(modelliRemoti.marca === form.marca ? modelliRemoti.valori : []),
    ...pieces.filter(piece => piece.marca === form.marca).map(piece => piece.modello),
    ...(form.modello ? [form.modello] : []),
  ])].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }))
  const marcheMenu = [...new Set([...marche, ...(form.marca ? [form.marca] : [])])].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }))
  const tipologieMenu = [...new Set([...tipologiePezzo, ...(form.tipo ? [form.tipo] : [])])].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }))
  const coloriMenu = [...new Set([...coloriCatalogo, ...(form.colore ? [form.colore] : [])])].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }))
  async function aggiungiPezzoCatalogo(nome) {
    const salvato = await onAddTipologia(nome)
    setTipologiePezzo(current => [...new Set([...current, salvato])].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' })))
    return salvato
  }
  async function aggiungiColoreCatalogo(nome) {
    const salvato = await onAddColore(nome)
    setColoriCatalogo(current => [...new Set([...current, salvato])].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' })))
    return salvato
  }
  async function submit(event) {
    event.preventDefault()
    if (!form.tipo || !form.marca || !form.modello || !form.colore) {
      setErrore('Compila questo campo.')
      return
    }
    setSalvataggio(true)
    setErrore('')
    try {
      await onSave({
        ...(existing ? { id: existing.id, codice: existing.codice } : {}),
        tipo: form.tipo, marca: form.marca, modello: form.modello,
        anno: Number(form.anno), colore: form.colore,
        lato: ({ Destro: 'dx', Sinistro: 'sx', Nessuno: 'nessuno' })[form.lato] || form.lato.toLowerCase(),
        posizione: (form.posizione || 'Altro').toLowerCase(),
        condizione: form.condizione.toLowerCase(), prezzo: form.prezzo,
        note: form.note || '', codice_oem: mostraCodiceOem ? (form.codice_oem || '') : '',
        sigla_motore: mostraDatiMotore ? (form.sigla_motore || '') : '',
        matricola_motore: mostraDatiMotore ? (form.matricola_motore || '') : '',
      }, files)
      navigate('/')
    } catch (problema) { setErrore(problema.message) } finally { setSalvataggio(false) }
  }
  return <section className="page-content"><Link className="back-link" to="/">← TORNA ALLA RICERCA</Link><div className="form-heading"><div className="eyebrow"><span /> GESTIONE MAGAZZINO</div><h1>{existing ? 'Modifica ricambio.' : <>Nuovo <em>ricambio.</em></>}</h1><p className="company-name">AUTODEMOLIZIONE RICAMBI TORINO S.R.L.</p><p className="page-lead">I dati saranno salvati nell’archivio del magazzino.</p></div>{errore && <div className="app-alert" role="alert">{errore}</div>}
    <form className="piece-form" onSubmit={submit}><div className="form-section-title">01 <span>INFORMAZIONI RICAMBIO</span></div><div className="form-grid">
      <label>Pezzo<SearchableSelect ariaLabel="Pezzo" value={form.tipo} options={tipologieMenu} onChange={tipo => setForm(current => ({ ...current, tipo }))} placeholder="Es. Paraurti anteriore" addLabel="Altro pezzo…" onAddNew={aggiungiPezzoCatalogo} loading={caricaPezzi} loadError={errorePezzi} /></label>
      <label>MARCA<SearchableSelect ariaLabel="Marca" value={form.marca} options={marcheMenu} onChange={marca => setForm(current => ({ ...current, marca, modello: '' }))} placeholder="Seleziona una marca" addLabel="Altra marca…" onAddNew={onAddMarca} /></label>
      <label>MODELLO<SearchableSelect ariaLabel="Modello" value={form.modello} options={modelliMarca} onChange={modello => setForm(current => ({ ...current, modello }))} placeholder={form.marca ? 'Seleziona un modello' : 'Seleziona prima la marca'} addLabel="Altro modello…" onAddNew={modello => onAddModello(form.marca, modello)} disabled={!form.marca} /></label>
      <label>ANNO<input name="anno" required type="number" min="1950" max="2100" value={form.anno} onChange={update} /></label>
      {mostraCodiceOem && <label className="form-wide">Codice ricambio / OEM<input name="codice_oem" maxLength="60" value={form.codice_oem || ''} onChange={update} list="codici-oem-lista" placeholder="Es. 51787324" /><datalist id="codici-oem-lista">{(suggerimenti.codici_oem || []).map(codice => <option key={codice} value={codice} />)}</datalist><small className="field-help">Inserisci il codice stampato sul pezzo per una ricerca più precisa.</small></label>}
      {mostraDatiMotore && <>
        <label>Sigla motore<input name="sigla_motore" maxLength="40" value={form.sigla_motore || ''} onChange={update} list="sigle-motore-lista" placeholder="Es. 199A2000" /><datalist id="sigle-motore-lista">{(suggerimenti.sigle_motore || []).map(sigla => <option key={sigla} value={sigla} />)}</datalist></label>
        <label>Matricola motore<input name="matricola_motore" maxLength="60" value={form.matricola_motore || ''} onChange={update} list="matricole-motore-lista" placeholder="Numero identificativo motore" /><datalist id="matricole-motore-lista">{(suggerimenti.matricole_motore || []).map(matricola => <option key={matricola} value={matricola} />)}</datalist></label>
      </>}
      <label>COLORE<SearchableSelect ariaLabel="Colore" value={form.colore} options={coloriMenu} onChange={colore => setForm(current => ({ ...current, colore }))} placeholder="Seleziona un colore" addLabel="Altro colore…" onAddNew={aggiungiColoreCatalogo} loading={caricaColori} loadError={erroreColori} /></label>
      <label>POSIZIONE SULL’AUTO<select name="posizione" value={form.posizione || 'Anteriore'} onChange={update}><option>Anteriore</option><option>Posteriore</option><option>Laterale</option><option>Interno abitacolo</option><option>Vano motore</option><option>Sottoscocca</option><option>Altro</option></select></label>
      <label>LATO<select name="lato" value={form.lato} onChange={update}><option>Nessuno</option><option>Destro</option><option>Sinistro</option></select></label>
      <label>CONDIZIONE<select name="condizione" value={form.condizione} onChange={update}><option>Usato</option><option>Nuovo</option></select></label>
      <label>PREZZO (€)<input name="prezzo" type="number" min="0" step="0.01" value={form.prezzo} onChange={update} placeholder="0,00" /></label>
      <label className="form-wide">NOTE<textarea name="note" maxLength="5000" value={form.note || ''} onChange={update} rows="3" placeholder="Dettagli utili sul ricambio" /></label>
      <label className="form-wide">FOTO (JPEG, PNG O WEBP)<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={selezionaFoto} /><small>{files.length ? `${files.length} file selezionati` : 'Massimo 8 immagini, ridimensionate automaticamente.'}</small><div className="file-previews">{anteprime.map((url, indice) => <img key={url} src={url} alt={`Anteprima foto ${indice + 1}`} />)}</div></label>
    </div><div className="form-actions"><span>* Campi obbligatori</span><button className="button button-yellow" type="submit" disabled={salvataggio}>{salvataggio ? 'SALVATAGGIO…' : existing ? 'Salva modifiche' : '＋ Aggiungi ricambio'}</button></div></form></section>
}

function AppContent() {
  const [utente, setUtente] = useState(null)
  const [controlloSessione, setControlloSessione] = useState(true)
  const [erroreServer, setErroreServer] = useState('')
  const [pieces, setPieces] = useState([])
  const [filtri, setFiltri] = useState({ marche: [], modelli: [], colori: [], tipologie: [], codici_oem: [], sigle_motore: [], matricole_motore: [] })
  const [query, setQuery] = useState('')
  const [errore, setErrore] = useState('')
  const [caricamento, setCaricamento] = useState(true)
  const [soloDisponibili, setSoloDisponibili] = useState(true)
  const [marca, setMarca] = useState('')
  const [modello, setModello] = useState('')
  const [anno, setAnno] = useState('')
  const [codice, setCodice] = useState('')

  async function aggiornaCataloghi() {
    const [risultatoTipologie, risultatoMarche, risultatoModelli, risultatoColori] = await Promise.all([
      api('/api/tipologie'), api('/api/marche'), api('/api/veicoli'), api('/api/colori'),
    ])
    setFiltri(current => ({
      ...current,
      tipologie: risultatoTipologie.tipologie,
      marche: risultatoMarche.marche,
      modelli: risultatoModelli.veicoli.map(({ marca, modello }) => ({ marca, modello })),
      colori: risultatoColori.colori.map(colore => typeof colore === 'string' ? colore : colore.nome),
    }))
  }

  useEffect(() => {
    let attivo = true
    api('/api/auth/me').then(dati => { if (attivo) setUtente(dati.utente) }).catch(problema => {
      if (attivo && problema.status !== 401) setErroreServer(`Backend non pronto: ${problema.message}`)
    }).finally(() => { if (attivo) setControlloSessione(false) })
    return () => { attivo = false }
  }, [])

  useEffect(() => {
    if (!utente) return undefined
    let attivo = true
    const timer = window.setTimeout(() => {
      aggiornaCataloghi().catch(problema => {
        if (attivo) setErrore(`Impossibile caricare i cataloghi: ${problema.message}`)
      })
    }, 0)
    return () => { attivo = false; window.clearTimeout(timer) }
  }, [utente])

  // Parametri della ricerca corrente: usati sia dai filtri sia dopo ogni salvataggio, così la lista resta coerente.
  const parametriRicerca = useCallback(() => {
    const parametri = new URLSearchParams()
    parametri.set('includi_venduti', 'true')
    if (query.trim()) parametri.set('q', query.trim())
    if (marca) parametri.set('marca', marca)
    if (modello) parametri.set('modello', modello)
    const annoInserito = Number(anno)
    const annoMassimo = new Date().getFullYear() + 1
    if (anno && Number.isInteger(annoInserito) && annoInserito >= 1950 && annoInserito <= annoMassimo) parametri.set('anno', anno)
    if (codice.trim()) parametri.set('codice', codice.trim())
    if (soloDisponibili) parametri.set('stato', 'disponibile')
    return parametri.toString()
  }, [query, marca, modello, anno, codice, soloDisponibili])

  async function aggiorna() {
    const [risultatoPezzi] = await Promise.all([
      api(`/api/pezzi?${parametriRicerca()}`), aggiornaCataloghi(),
    ])
    setPieces(risultatoPezzi.pezzi.map(normalizzaPezzo))
  }

  useEffect(() => {
    if (!utente) return undefined
    let attivo = true
    const timer = window.setTimeout(async () => {
      try {
        const [risultatoPezzi, risultatoFiltri] = await Promise.all([
          api(`/api/pezzi?${parametriRicerca()}`), api('/api/filtri'),
        ])
        if (attivo) {
          setPieces(risultatoPezzi.pezzi.map(normalizzaPezzo))
          setFiltri(current => ({ ...current, modelli: risultatoFiltri.modelli }))
          setErrore('')
        }
      } catch (problema) { if (attivo) setErrore(problema.message) }
      finally { if (attivo) setCaricamento(false) }
    }, 250)
    return () => { attivo = false; window.clearTimeout(timer) }
  }, [utente, parametriRicerca])

  async function login(username, password) {
    const dati = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) })
    setErroreServer('')
    setCaricamento(true)
    setUtente(dati.utente)
  }

  const cambiaQuery = valore => { setCaricamento(true); setQuery(valore) }
  const cambiaMarca = valore => { setCaricamento(true); setMarca(valore); setModello('') }
  const cambiaDisponibilita = valore => { setCaricamento(true); setSoloDisponibili(valore) }
  const cambiaModello = valore => { setCaricamento(true); setModello(valore) }
  const cambiaAnno = valore => { setCaricamento(true); setAnno(valore) }
  const cambiaCodice = valore => { setCaricamento(true); setCodice(valore) }

  async function logout() {
    try { await api('/api/auth/logout', { method: 'POST' }) } catch { /* sessione già scaduta: si esce comunque */ } finally { setUtente(null); setPieces([]) }
  }

  async function changeStatus(id, stato) {
    if (stato === 'Venduto' && !window.confirm('Confermi di segnare questo ricambio come venduto?')) return
    try {
      await api(`/api/pezzi/${id}/${stato === 'Venduto' ? 'venduto' : 'disponibile'}`, { method: 'PATCH' })
      await aggiorna()
      setErrore('')
    } catch (problema) { setErrore(problema.message) }
  }

  async function savePiece(pezzo, files) {
    const modifica = Boolean(pezzo.id)
    const dati = await api(modifica ? `/api/pezzi/${pezzo.id}` : '/api/pezzi', {
      method: modifica ? 'PUT' : 'POST', body: JSON.stringify(pezzo),
    })
    const id = pezzo.id || dati.id
    if (files.length) {
      const formData = new FormData()
      files.forEach(file => formData.append('foto', file))
      await api(`/api/pezzi/${id}/foto`, { method: 'POST', body: formData })
    }
    await aggiorna()
  }

  async function aggiungiTipologia(nome) {
    const risultato = await api('/api/tipologie', { method: 'POST', body: JSON.stringify({ nome }) })
    const voce = risultato.tipologia?.nome || risultato.nome || nome
    setFiltri(current => ({ ...current, tipologie: [...current.tipologie, { id: risultato.id || risultato.tipologia?.id, nome: voce }] }))
    return voce
  }

  async function aggiungiMarca(nome) {
    const risultato = await api('/api/marche', { method: 'POST', body: JSON.stringify({ nome }) })
    const voce = risultato.marca?.nome || risultato.nome || nome
    setFiltri(current => ({ ...current, marche: [...current.marche, voce] }))
    return voce
  }

  async function aggiungiModello(marcaSelezionata, nome) {
    const risultato = await api('/api/modelli', { method: 'POST', body: JSON.stringify({ marca: marcaSelezionata, modello: nome }) })
    const voce = risultato.modello?.modello || nome
    const marcaFinale = risultato.modello?.marca || marcaSelezionata
    setFiltri(current => ({ ...current, modelli: [...current.modelli, { marca: marcaFinale, modello: voce }] }))
    return voce
  }

  async function aggiungiColore(nome) {
    const risultato = await api('/api/colori', { method: 'POST', body: JSON.stringify({ nome }) })
    const voce = risultato.colore?.nome || nome
    setFiltri(current => ({ ...current, colori: [...current.colori, voce] }))
    return voce
  }

  if (controlloSessione) return <div className="login-page"><div className="login-card"><div className="eyebrow"><span /> CONTROLLO SESSIONE</div><h1>Un momento…</h1></div></div>
  if (!utente) return <LoginPage onLogin={login} erroreServer={erroreServer} />

  const modelliPerMarca = Object.fromEntries(Object.entries(catalogoModelli).map(([nomeMarca, elenco]) => [nomeMarca, [...elenco]]))
  filtri.modelli.forEach(elemento => {
    modelliPerMarca[elemento.marca] = [...new Set([...(modelliPerMarca[elemento.marca] || []), elemento.modello])]
  })
  const marcheComplete = [...new Set([...catalogoMarche, ...Object.keys(catalogoModelli), ...filtri.marche])].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }))
  const modelli = Object.entries(modelliPerMarca).flatMap(([nomeMarca, elenco]) => elenco.map(nomeModello => ({ marca: nomeMarca, modello: nomeModello })))
  const tipologie = filtri.tipologie.map(elemento => elemento.nome)
  return <BrowserRouter><Shell utente={utente} onLogout={logout}><Routes>
    <Route path="/" element={<SearchPage pieces={pieces} marche={marcheComplete} modelli={modelli} onChangeStatus={changeStatus} errore={errore} caricamento={caricamento} query={query} setQuery={cambiaQuery} marca={marca} setMarca={cambiaMarca} soloDisponibili={soloDisponibili} setSoloDisponibili={cambiaDisponibilita} modello={modello} setModello={cambiaModello} anno={anno} setAnno={cambiaAnno} codice={codice} setCodice={cambiaCodice} />} />
    <Route path="/pezzo/:id" element={<DetailPage pieces={pieces} onChangeStatus={changeStatus} utente={utente} aggiorna={aggiorna} />} />
    <Route path="/aggiungi" element={<PieceForm pieces={pieces} tipologie={tipologie} marche={marcheComplete} modelli={modelliPerMarca} colori={filtri.colori} suggerimenti={filtri} onAddTipologia={aggiungiTipologia} onAddMarca={aggiungiMarca} onAddModello={aggiungiModello} onAddColore={aggiungiColore} onSave={savePiece} />} />
    <Route path="/modifica/:id" element={<PieceForm pieces={pieces} tipologie={tipologie} marche={marcheComplete} modelli={modelliPerMarca} colori={filtri.colori} suggerimenti={filtri} onAddTipologia={aggiungiTipologia} onAddMarca={aggiungiMarca} onAddModello={aggiungiModello} onAddColore={aggiungiColore} onSave={savePiece} />} />
    <Route path="*" element={<SearchPage pieces={pieces} marche={marcheComplete} modelli={modelli} onChangeStatus={changeStatus} errore={errore} caricamento={caricamento} query={query} setQuery={cambiaQuery} marca={marca} setMarca={cambiaMarca} soloDisponibili={soloDisponibili} setSoloDisponibili={cambiaDisponibilita} modello={modello} setModello={cambiaModello} anno={anno} setAnno={cambiaAnno} codice={codice} setCodice={cambiaCodice} />} />
  </Routes></Shell></BrowserRouter>
}

export default function AppLive() {
  return <AppContent />
}
