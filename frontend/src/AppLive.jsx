import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import './form.css'
import './logo.css'
import './live.css'

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
      <div className="card-topline"><span className="part-code">{piece.codice}</span><BadgeStato stato={piece.stato} /></div>
      <h3>{piece.tipo}</h3><p className="vehicle-name">{piece.marca} <b>{piece.modello}</b><span> · </span>{piece.anno}</p>
      <div className="piece-tags"><span>◉ {piece.colore}</span><span>↔ {piece.lato}</span><span>⌖ {piece.posizione || '—'}</span><span>◇ {piece.condizione}</span></div>
      <div className="card-bottom"><strong className="price">€ {piece.prezzo.toFixed(2)}</strong><button className="text-button" onClick={() => navigate(`/pezzo/${piece.id}`)}>Dettaglio <span>↗</span></button></div>
      <button className="sold-link" onClick={() => onChangeStatus(piece.id, piece.stato === 'Disponibile' ? 'Venduto' : 'Disponibile')}>{piece.stato === 'Disponibile' ? 'Segna come venduto' : 'Rimetti disponibile'}</button>
    </div>
  </article>
}

function SearchPage({ pieces, marche, modelli, colori, onChangeStatus, errore, caricamento, query, setQuery, marca: brand, setMarca: setBrand, soloDisponibili: onlyAvailable, setSoloDisponibili: setOnlyAvailable, modello, setModello, anno, setAnno, colore, setColore, lato, setLato, condizione, setCondizione }) {
  const filtered = useMemo(() => pieces.filter(piece => {
    const text = `${piece.tipo} ${piece.marca} ${piece.modello} ${piece.colore} ${piece.anno} ${piece.codice}`.toLowerCase()
    const parole = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
    return parole.every(parola => text.includes(parola)) && (!brand || piece.marca === brand) && (!onlyAvailable || piece.stato === 'Disponibile')
  }), [pieces, query, brand, onlyAvailable])
  const brands = [...new Set([...marche, ...pieces.map(piece => piece.marca)])].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }))
  return <section className="page-content">
    <div className="page-heading"><div><div className="eyebrow"><span /> MAGAZZINO RICAMBI <span className="eyebrow-line" /></div><h1>Trova il tuo <em>ricambio.</em></h1><p className="page-lead">Cerca tra i pezzi disponibili e rispondi al cliente in pochi secondi.</p></div><Link className="button button-yellow" to="/aggiungi"><span>＋</span> Aggiungi pezzo</Link></div>
    <div className="search-panel"><div className="search-main"><span className="search-icon">⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Cerca un pezzo, un veicolo o un colore..." aria-label="Cerca un pezzo"/><kbd>RICERCA</kbd></div><div className="filter-row"><label className="filter-control"><span>MARCA</span><select value={brand} onChange={event => setBrand(event.target.value)}><option value="">Tutte le marche</option>{brands.map(item => <option key={item}>{item}</option>)}</select></label><label className="filter-toggle"><input type="checkbox" checked={onlyAvailable} onChange={event => setOnlyAvailable(event.target.checked)} /><span className="toggle-track" /> Solo disponibili</label><span className="filter-help">Filtra i ricambi del magazzino <b>⌄</b></span></div><div className="advanced-filters"><label>MODELLO<select value={modello} onChange={event => setModello(event.target.value)}><option value="">Tutti i modelli</option>{modelli.filter(item => !brand || item.marca === brand).map(item => <option key={`${item.marca}-${item.modello}`} value={item.modello}>{item.modello}</option>)}</select></label><label>ANNO<input type="number" min="1950" max="2100" value={anno} onChange={event => setAnno(event.target.value)} placeholder="Tutti" /></label><label>COLORE<select value={colore} onChange={event => setColore(event.target.value)}><option value="">Tutti i colori</option>{colori.map(item => <option key={item}>{item}</option>)}</select></label><label>LATO<select value={lato} onChange={event => setLato(event.target.value)}><option value="">Tutti</option><option value="dx">Destro</option><option value="sx">Sinistro</option><option value="nessuno">Nessuno</option></select></label><label>CONDIZIONE<select value={condizione} onChange={event => setCondizione(event.target.value)}><option value="">Tutte</option><option value="usato">Usato</option><option value="nuovo">Nuovo</option></select></label></div></div>
    {errore && <div className="app-alert" role="alert">{errore}</div>}
    <div className="results-heading"><div><h2>RICAMBI IN MAGAZZINO <span className="result-count">{filtered.length.toString().padStart(2, '0')}</span></h2><p>{caricamento ? 'Aggiornamento archivio…' : onlyAvailable ? 'Visualizzazione dei soli pezzi disponibili' : 'Visualizzazione di tutti i pezzi'}</p></div><span className="sort-button">DATI AGGIORNATI</span></div>
    {caricamento ? <div className="empty-state"><h3>Caricamento ricambi…</h3></div> : filtered.length ? <div className="pieces-grid">{filtered.map(piece => <PezzoCard key={piece.id} piece={piece} onChangeStatus={onChangeStatus} />)}</div> : <div className="empty-state"><span>⌕</span><h3>Nessun ricambio trovato</h3><p>Prova a modificare la ricerca oppure mostra anche i pezzi venduti.</p><button className="button button-dark" onClick={() => { setQuery(''); setBrand(''); setOnlyAvailable(false); setModello(''); setAnno(''); setColore(''); setLato(''); setCondizione('') }}>Azzera i filtri</button></div>}
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
  return <section className="page-content"><Link className="back-link" to="/">← TORNA AI RISULTATI</Link>{errore && <div className="app-alert" role="alert">{errore}</div>}<div className="detail-layout"><div><PartVisual piece={dettaglio} large /><div className="photo-gallery">{immagini.map(immagine => <div className="photo-thumb" key={immagine.id}><a href={immagine.url} target="_blank" rel="noreferrer"><img src={immagine.url} alt={`${dettaglio.tipo} ${dettaglio.codice}`} /></a>{utente.ruolo === 'admin' && <button type="button" onClick={() => eliminaFoto(immagine.id)} aria-label="Elimina foto">×</button>}</div>)}<label className="photo-add">＋ Aggiungi foto<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={caricaFoto} /></label></div></div><div className="detail-info"><div className="eyebrow"><span /> SCHEDA RICAMBIO</div><div className="detail-code">{dettaglio.codice}</div><h1>{dettaglio.tipo}<br /><em>{dettaglio.marca} {dettaglio.modello}</em></h1><BadgeStato stato={dettaglio.stato} /><div className="detail-price">€ {dettaglio.prezzo.toFixed(2)} <small>PREZZO INDICATIVO</small></div><div className="detail-specs">{[['ANNO', dettaglio.anno], ['COLORE', dettaglio.colore], ['POSIZIONE', dettaglio.posizione || '—'], ['LATO', dettaglio.lato], ['CONDIZIONE', dettaglio.condizione]].map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}</div><div className="detail-actions"><button className="button button-yellow" onClick={() => navigate(`/modifica/${dettaglio.id}`)}>✎ Modifica scheda</button><button className="button button-dark" onClick={cambiaStatoScheda}>{dettaglio.stato === 'Disponibile' ? 'Segna come venduto' : 'Rimetti disponibile'}</button>{utente.ruolo === 'admin' && <button className="button button-dark" onClick={eliminaPezzo}>Elimina ricambio</button>}</div></div></div></section>
}

function PieceForm({ pieces, tipologie, marche, modelli, colori, onSave }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const existing = pieces.find(piece => piece.id === Number(id))
  const [form, setForm] = useState(() => existing ? { ...existing } : { tipo: '', marca: '', modello: '', anno: new Date().getFullYear(), colore: '', lato: 'Nessuno', posizione: 'Anteriore', condizione: 'Usato', prezzo: '' })
  const [files, setFiles] = useState([])
  const [anteprime, setAnteprime] = useState([])
  const [errore, setErrore] = useState('')
  const [salvataggio, setSalvataggio] = useState(false)
  useEffect(() => () => anteprime.forEach(URL.revokeObjectURL), [anteprime])
  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }))
  function selezionaFoto(event) {
    const selezionate = Array.from(event.target.files || []).slice(0, 8)
    setFiles(selezionate)
    setAnteprime(selezionate.map(file => URL.createObjectURL(file)))
    if (event.target.files.length > 8) setErrore('Puoi selezionare al massimo otto foto per volta.')
    else setErrore('')
  }
  const modelliMarca = [...new Set([...(modelli[form.marca] || []), ...pieces.filter(piece => piece.marca === form.marca).map(piece => piece.modello)])].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }))
  async function submit(event) {
    event.preventDefault()
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
        note: form.note || '',
      }, files)
      navigate('/')
    } catch (problema) { setErrore(problema.message) } finally { setSalvataggio(false) }
  }
  return <section className="page-content"><Link className="back-link" to="/">← TORNA ALLA RICERCA</Link><div className="form-heading"><div className="eyebrow"><span /> GESTIONE MAGAZZINO</div><h1>{existing ? 'Modifica ricambio.' : <>Nuovo <em>ricambio.</em></>}</h1><p className="company-name">AUTODEMOLIZIONE RICAMBI TORINO S.R.L.</p><p className="page-lead">I dati saranno salvati nell’archivio del magazzino.</p></div>{errore && <div className="app-alert" role="alert">{errore}</div>}
    <form className="piece-form" onSubmit={submit}><div className="form-section-title">01 <span>INFORMAZIONI RICAMBIO</span></div><div className="form-grid">
      <label>TIPOLOGIA<input list="tipologie-lista" name="tipo" required maxLength="120" value={form.tipo} onChange={update} placeholder="Es. Paraurti anteriore" /><datalist id="tipologie-lista">{tipologie.map(tipo => <option key={tipo} value={tipo} />)}</datalist></label>
      <label>MARCA<input list="marche-lista" name="marca" required maxLength="80" value={form.marca} onChange={event => setForm(current => ({ ...current, marca: event.target.value, modello: '' }))} placeholder="Es. Lancia" /><datalist id="marche-lista">{marche.map(marca => <option key={marca} value={marca} />)}</datalist></label>
      <label>MODELLO<input list="modelli-lista" name="modello" required maxLength="100" value={form.modello} onChange={update} placeholder="Es. Ypsilon" /><datalist id="modelli-lista">{modelliMarca.map(modello => <option key={modello} value={modello} />)}</datalist></label>
      <label>ANNO<input name="anno" required type="number" min="1950" max="2100" value={form.anno} onChange={update} /></label>
      <label>COLORE<input list="colori-lista" name="colore" required maxLength="80" value={form.colore} onChange={update} placeholder="Es. Nero metallizzato" /><datalist id="colori-lista">{colori.map(colore => <option key={colore} value={colore} />)}</datalist></label>
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
  const [filtri, setFiltri] = useState({ marche: [], modelli: [], colori: [], tipologie: [] })
  const [query, setQuery] = useState('')
  const [errore, setErrore] = useState('')
  const [caricamento, setCaricamento] = useState(true)
  const [soloDisponibili, setSoloDisponibili] = useState(true)
  const [marca, setMarca] = useState('')
  const [modello, setModello] = useState('')
  const [anno, setAnno] = useState('')
  const [colore, setColore] = useState('')
  const [lato, setLato] = useState('')
  const [condizione, setCondizione] = useState('')

  useEffect(() => {
    let attivo = true
    api('/api/auth/me').then(dati => { if (attivo) setUtente(dati.utente) }).catch(problema => {
      if (attivo && problema.status !== 401) setErroreServer(`Backend non pronto: ${problema.message}`)
    }).finally(() => { if (attivo) setControlloSessione(false) })
    return () => { attivo = false }
  }, [])

  async function aggiorna() {
    const [risultatoPezzi, risultatoFiltri] = await Promise.all([
      api('/api/pezzi?includi_venduti=true'), api('/api/filtri'),
    ])
    setPieces(risultatoPezzi.pezzi.map(normalizzaPezzo))
    setFiltri(risultatoFiltri)
  }

  useEffect(() => {
    if (!utente) return undefined
    let attivo = true
    const timer = window.setTimeout(async () => {
      const parametri = new URLSearchParams()
      parametri.set('includi_venduti', 'true')
      if (query.trim()) parametri.set('q', query.trim())
      if (marca) parametri.set('marca', marca)
      if (modello) parametri.set('modello', modello)
      if (anno) parametri.set('anno', anno)
      if (colore) parametri.set('colore', colore)
      if (lato) parametri.set('lato', lato)
      if (condizione) parametri.set('condizione', condizione)
      if (soloDisponibili) parametri.set('stato', 'disponibile')
      try {
        const [risultatoPezzi, risultatoFiltri] = await Promise.all([
          api(`/api/pezzi?${parametri.toString()}`), api('/api/filtri'),
        ])
        if (attivo) {
          setPieces(risultatoPezzi.pezzi.map(normalizzaPezzo))
          setFiltri(risultatoFiltri)
          setErrore('')
        }
      } catch (problema) { if (attivo) setErrore(problema.message) }
      finally { if (attivo) setCaricamento(false) }
    }, 250)
    return () => { attivo = false; window.clearTimeout(timer) }
  }, [utente, query, marca, modello, anno, colore, lato, condizione, soloDisponibili])

  async function login(username, password) {
    const dati = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) })
    setErroreServer('')
    setCaricamento(true)
    setUtente(dati.utente)
  }

  const cambiaQuery = valore => { setCaricamento(true); setQuery(valore) }
  const cambiaMarca = valore => { setCaricamento(true); setMarca(valore) }
  const cambiaDisponibilita = valore => { setCaricamento(true); setSoloDisponibili(valore) }
  const cambiaModello = valore => { setCaricamento(true); setModello(valore) }
  const cambiaAnno = valore => { setCaricamento(true); setAnno(valore) }
  const cambiaColore = valore => { setCaricamento(true); setColore(valore) }
  const cambiaLato = valore => { setCaricamento(true); setLato(valore) }
  const cambiaCondizione = valore => { setCaricamento(true); setCondizione(valore) }

  async function logout() {
    try { await api('/api/auth/logout', { method: 'POST' }) } finally { setUtente(null); setPieces([]) }
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

  if (controlloSessione) return <div className="login-page"><div className="login-card"><div className="eyebrow"><span /> CONTROLLO SESSIONE</div><h1>Un momento…</h1></div></div>
  if (!utente) return <LoginPage onLogin={login} erroreServer={erroreServer} />

  const modelli = filtri.modelli.reduce((catalogo, elemento) => {
    catalogo[elemento.marca] = [...(catalogo[elemento.marca] || []), elemento.modello]
    return catalogo
  }, {})
  const tipologie = filtri.tipologie.map(elemento => elemento.nome)
  return <BrowserRouter><Shell utente={utente} onLogout={logout}><Routes>
    <Route path="/" element={<SearchPage pieces={pieces} marche={filtri.marche} modelli={filtri.modelli} colori={filtri.colori} onChangeStatus={changeStatus} errore={errore} caricamento={caricamento} query={query} setQuery={cambiaQuery} marca={marca} setMarca={cambiaMarca} soloDisponibili={soloDisponibili} setSoloDisponibili={cambiaDisponibilita} modello={modello} setModello={cambiaModello} anno={anno} setAnno={cambiaAnno} colore={colore} setColore={cambiaColore} lato={lato} setLato={cambiaLato} condizione={condizione} setCondizione={cambiaCondizione} />} />
    <Route path="/pezzo/:id" element={<DetailPage pieces={pieces} onChangeStatus={changeStatus} utente={utente} aggiorna={aggiorna} />} />
    <Route path="/aggiungi" element={<PieceForm pieces={pieces} tipologie={tipologie} marche={filtri.marche} modelli={modelli} colori={filtri.colori} onSave={savePiece} />} />
    <Route path="/modifica/:id" element={<PieceForm pieces={pieces} tipologie={tipologie} marche={filtri.marche} modelli={modelli} colori={filtri.colori} onSave={savePiece} />} />
    <Route path="*" element={<SearchPage pieces={pieces} marche={filtri.marche} modelli={filtri.modelli} colori={filtri.colori} onChangeStatus={changeStatus} errore={errore} caricamento={caricamento} query={query} setQuery={cambiaQuery} marca={marca} setMarca={cambiaMarca} soloDisponibili={soloDisponibili} setSoloDisponibili={cambiaDisponibilita} modello={modello} setModello={cambiaModello} anno={anno} setAnno={cambiaAnno} colore={colore} setColore={cambiaColore} lato={lato} setLato={cambiaLato} condizione={condizione} setCondizione={cambiaCondizione} />} />
  </Routes></Shell></BrowserRouter>
}

export default function AppLive() {
  return <AppContent />
}
