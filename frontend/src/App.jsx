import { useMemo, useState } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import './index.css'
import './form.css'
import './logo.css'

// Dati finti per provare l'interfaccia senza backend o database.
const demoPezzi = [
  { id: 1, tipo: 'Paraurti anteriore', marca: 'Lancia', modello: 'Ypsilon', anno: 2018, colore: 'Nero metallizzato', lato: 'Nessuno', posizione: 'Anteriore', condizione: 'Usato', prezzo: 145, stato: 'Disponibile', codice: 'LY-PA-0184', icona: '🚘', tinta: 'dark' },
  { id: 2, tipo: 'Fanale anteriore', marca: 'Fiat', modello: 'Panda', anno: 2020, colore: 'Trasparente', lato: 'Destro', posizione: 'Anteriore', condizione: 'Usato', prezzo: 78, stato: 'Disponibile', codice: 'FP-FA-0321', icona: '💡', tinta: 'light' },
  { id: 3, tipo: 'Specchietto retrovisore', marca: 'Ford', modello: 'Fiesta', anno: 2017, colore: 'Grigio metallizzato', lato: 'Sinistro', posizione: 'Laterale', condizione: 'Usato', prezzo: 55, stato: 'Disponibile', codice: 'FF-SP-0089', icona: '🪞', tinta: 'silver' },
  { id: 4, tipo: 'Portiera anteriore', marca: 'Renault', modello: 'Clio', anno: 2019, colore: 'Bianco', lato: 'Destro', posizione: 'Laterale', condizione: 'Usato', prezzo: 210, stato: 'Venduto', codice: 'RC-PO-0140', icona: '🚪', tinta: 'light' },
  { id: 5, tipo: 'Cofano', marca: 'Fiat', modello: '500', anno: 2016, colore: 'Rosso', lato: 'Nessuno', posizione: 'Anteriore', condizione: 'Usato', prezzo: 185, stato: 'Disponibile', codice: 'F5-CO-0044', icona: '🚗', tinta: 'red' },
  { id: 6, tipo: 'Paraurti posteriore', marca: 'Lancia', modello: 'Ypsilon', anno: 2015, colore: 'Blu', lato: 'Nessuno', posizione: 'Posteriore', condizione: 'Usato', prezzo: 120, stato: 'Disponibile', codice: 'LY-PP-0037', icona: '🚙', tinta: 'blue' },
]

// Catalogo iniziale delle tipologie: una selezione ampia di ricambi comuni.
// L'ordinamento alfabetico facilita la scelta; nuove voci restano aggiungibili dal form.
const catalogoTipologie = [
  'ABS / centralina ABS', 'Airbag conducente', 'Airbag passeggero', 'Airbag laterale', 'Airbag a tendina', 'Albero a camme', 'Albero di trasmissione', 'Alternatore', 'Ammortizzatore anteriore', 'Ammortizzatore posteriore', 'Antenna', 'Antinebbia / fendinebbia', 'Autoradio',
  'Batteria', 'Blocco accensione', 'Bobina di accensione', 'Braccio oscillante', 'Braccetto sospensione', 'Cambio automatico', 'Cambio manuale', 'Candele', 'Canna sterzo', 'Cappelliera', 'Carburatore', 'Catalizzatore', 'Cerchio in lega', 'Cerchio in ferro', 'Cinghia distribuzione', 'Cinghia servizi', 'Cintura di sicurezza', 'Cofano', 'Compressore aria condizionata', 'Condensatore climatizzatore', 'Coppa dell’olio', 'Corpo farfallato', 'Cremagliera sterzo', 'Cristallo / vetro laterale',
  'Devioluci', 'Differenziale', 'Disco freno', 'Disco frizione', 'Display / schermo',
  'ECU / centralina motore', 'Elettroventola', 'Emblema / logo', 'EPS / servosterzo elettrico',
  'Faro anteriore', 'Faro posteriore', 'Fascia paraurti', 'Filtro aria', 'Filtro antiparticolato (DPF)', 'Filtro carburante', 'Filtro olio', 'Finestrino', 'Flangia', 'Flessibile scarico', 'Fondo baule', 'Forcella cambio', 'Frizione completa',
  'Galleggiante carburante', 'Gancio traino', 'Gomma / pneumatico', 'Griglia anteriore', 'Griglia paraurti', 'Gruppo ottico',
  'Impianto GPL', 'Iniettore', 'Intercooler', 'Interruttore alzacristalli', 'Interruttore luci',
  'Kit distribuzione', 'Kit frizione',
  'Lampadina', 'Leva cambio', 'Leva freno a mano', 'Libretto uso e manutenzione', 'Maniglia esterna', 'Maniglia interna', 'Manicotto radiatore', 'Mozzo ruota', 'Motorino alzacristalli', 'Motorino avviamento', 'Motorino tergicristallo', 'Motore completo', 'Muso anteriore',
  'Navigatore', 'Nottolino porta',
  'Olio / tappo coppa',
  'Parafango anteriore', 'Parafango posteriore', 'Paraurti anteriore', 'Paraurti posteriore', 'Paratia motore', 'Parasole', 'Pastiglie freno', 'Pedale acceleratore', 'Pedale freno', 'Pedaliera', 'Piantone sterzo', 'Pistone', 'Pompa acqua', 'Pompa carburante', 'Pompa freni', 'Pompa servosterzo', 'Portellone posteriore', 'Portiera anteriore', 'Portiera posteriore', 'Presa aria', 'Proiettore',
  'Radiatore acqua', 'Radiatore olio', 'Radiatore riscaldamento', 'Ralla / cuscinetto ruota', 'Regolatore alternatore', 'Resistenza ventola', 'Retronebbia', 'Retrovisore interno', 'Rinforzo paraurti', 'Riscaldatore', 'Ruota di scorta',
  'Scatola filtro aria', 'Scatola fusibili', 'Scatola guida', 'Sedile anteriore', 'Sedile posteriore', 'Semiasse', 'Sensore ABS', 'Sensore airbag', 'Sensore albero motore', 'Sensore parcheggio', 'Sensore pressione', 'Serbatoio carburante', 'Serratura cofano', 'Serratura portiera', 'Servofreno', 'Specchietto retrovisore', 'Spoiler', 'Supporto motore',
  'Tappo carburante', 'Tappetino', 'Tergicristallo', 'Terminale scarico', 'Terzo stop', 'Testata motore', 'Tirante sterzo', 'Tromba / clacson', 'Turbina / turbocompressore',
  'Valvola EGR', 'Valvola termostatica', 'Vano batteria', 'Ventola abitacolo', 'Volano', 'Volante',
].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }))

// Marche auto comuni e storiche. Si possono comunque aggiungere marche personalizzate.
const catalogoMarche = [
  'Abarth', 'Acura', 'Aiways', 'Alfa Romeo', 'Alpine', 'Aston Martin', 'Audi', 'Austin',
  'Bentley', 'BMW', 'BYD',
  'Cadillac', 'Chery', 'Chevrolet', 'Chrysler', 'Citroën', 'Cupra',
  'Dacia', 'Daewoo', 'Daihatsu', 'Dodge', 'DS Automobiles',
  'Ferrari', 'Fiat', 'Fisker', 'Ford',
  'Genesis', 'GMC',
  'Honda', 'Hummer', 'Hyundai',
  'Infiniti', 'Isuzu', 'Iveco',
  'Jaguar', 'Jeep',
  'Kia', 'Koenigsegg',
  'Lamborghini', 'Lancia', 'Land Rover', 'Lexus', 'Lincoln', 'Lotus', 'Lucid',
  'Mahindra', 'Maserati', 'Maybach', 'Mazda', 'McLaren', 'Mercedes-Benz', 'MG', 'MINI', 'Mitsubishi', 'Morgan',
  'NIO', 'Nissan',
  'Opel',
  'Pagani', 'Peugeot', 'Polestar', 'Pontiac', 'Porsche', 'Proton',
  'RAM', 'Renault', 'Rivian', 'Rolls-Royce', 'Rover',
  'Saab', 'SEAT', 'Škoda', 'Smart', 'SsangYong', 'Subaru', 'Suzuki',
  'Tata', 'Tesla', 'Toyota',
  'Vauxhall', 'Volkswagen', 'Volvo',
  'Wuling',
  'XPeng',
  'Zastava',
].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }))

// I modelli sono raggruppati per marca così il menu mostra scelte pertinenti.
const catalogoModelli = {
  Abarth: ['124 Spider', '500', '500e', '595', '695', 'Grande Punto'],
  'Alfa Romeo': ['147', '156', '159', '166', '4C', 'Giulia', 'Giulietta', 'MiTo', 'Stelvio', 'Tonale'],
  Audi: ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'TT'],
  BMW: ['Serie 1', 'Serie 2', 'Serie 3', 'Serie 4', 'Serie 5', 'Serie 7', 'X1', 'X3', 'X5', 'X6', 'Z4'],
  Citroën: ['C1', 'C2', 'C3', 'C3 Aircross', 'C4', 'C4 Cactus', 'C5', 'C5 Aircross', 'Berlingo', 'DS3', 'Saxo', 'Xsara'],
  Cupra: ['Ateca', 'Born', 'Formentor', 'Leon', 'Tavascan'],
  Dacia: ['Dokker', 'Duster', 'Jogger', 'Lodgy', 'Logan', 'Sandero', 'Spring'],
  Fiat: ['124 Spider', '500', '500L', '500X', '600', 'Bravo', 'Croma', 'Doblò', 'Fiorino', 'Freemont', 'Grande Punto', 'Panda', 'Punto', 'Qubo', 'Tipo', 'Ulysse'],
  Ford: ['B-Max', 'C-Max', 'EcoSport', 'Edge', 'Fiesta', 'Focus', 'Fusion', 'Galaxy', 'Ka', 'Kuga', 'Mondeo', 'Puma', 'S-Max', 'Transit'],
  Honda: ['Accord', 'Civic', 'CR-V', 'CR-Z', 'FR-V', 'HR-V', 'Jazz'],
  Hyundai: ['i10', 'i20', 'i30', 'i40', 'IONIQ', 'Kona', 'Santa Fe', 'Tucson'],
  Jeep: ['Avenger', 'Cherokee', 'Compass', 'Grand Cherokee', 'Renegade', 'Wrangler'],
  Kia: ['Carens', 'Ceed', 'Niro', 'Picanto', 'Rio', 'Sportage', 'Stonic', 'Venga'],
  Lancia: ['Delta', 'Musa', 'Thema', 'Y', 'Ypsilon'],
  'Land Rover': ['Defender', 'Discovery', 'Discovery Sport', 'Freelander', 'Range Rover', 'Range Rover Evoque', 'Range Rover Sport'],
  Mazda: ['2', '3', '5', '6', 'CX-3', 'CX-30', 'CX-5', 'MX-5'],
  'Mercedes-Benz': ['Classe A', 'Classe B', 'Classe C', 'Classe E', 'Classe S', 'CLA', 'GLA', 'GLB', 'GLC', 'GLE', 'ML', 'Sprinter'],
  MINI: ['Clubman', 'Countryman', 'Mini', 'Paceman'],
  Mitsubishi: ['ASX', 'Colt', 'L200', 'Lancer', 'Outlander', 'Pajero', 'Space Star'],
  Nissan: ['Juke', 'Micra', 'Murano', 'Navara', 'Note', 'Qashqai', 'X-Trail'],
  Opel: ['Adam', 'Agila', 'Astra', 'Combo', 'Corsa', 'Crossland', 'Grandland', 'Insignia', 'Meriva', 'Mokka', 'Zafira'],
  Peugeot: ['107', '108', '2008', '206', '207', '208', '3008', '307', '308', '407', '5008', '508', 'Partner', 'Rifter'],
  Renault: ['Captur', 'Clio', 'Espace', 'Kadjar', 'Kangoo', 'Laguna', 'Master', 'Megane', 'Modus', 'Scenic', 'Twingo', 'Zoe'],
  SEAT: ['Alhambra', 'Arona', 'Ateca', 'Ibiza', 'Leon', 'Mii', 'Tarraco', 'Toledo'],
  Škoda: ['Citigo', 'Fabia', 'Kamiq', 'Karoq', 'Kodiaq', 'Octavia', 'Rapid', 'Superb', 'Yeti'],
  Smart: ['Forfour', 'Fortwo'],
  Subaru: ['Forester', 'Impreza', 'Legacy', 'Outback', 'XV'],
  Suzuki: ['Alto', 'Baleno', 'Ignis', 'Jimny', 'S-Cross', 'Swift', 'Vitara'],
  Tesla: ['Model 3', 'Model S', 'Model X', 'Model Y'],
  Toyota: ['Auris', 'Aygo', 'Avensis', 'C-HR', 'Corolla', 'Prius', 'RAV4', 'Yaris'],
  Volkswagen: ['Arteon', 'Golf', 'ID.3', 'ID.4', 'Passat', 'Polo', 'T-Cross', 'T-Roc', 'Tiguan', 'Touareg', 'Touran', 'Up!'],
  Volvo: ['C30', 'S40', 'S60', 'S80', 'V40', 'V50', 'V60', 'V70', 'XC40', 'XC60', 'XC90'],
}

const catalogoColori = [
  'Argento', 'Azzurro', 'Beige', 'Bianco', 'Blu', 'Bronzo', 'Bordeaux', 'Champagne',
  'Giallo', 'Grigio', 'Grigio antracite', 'Grigio chiaro', 'Grigio scuro', 'Grigio metallizzato',
  'Marrone', 'Nero', 'Nero opaco', 'Nero metallizzato', 'Oro', 'Arancione', 'Rosa',
  'Rosso', 'Rosso metallizzato', 'Verde', 'Verde scuro', 'Viola', 'Trasparente',
  'Non verniciato', 'Bicolore', 'Altro',
].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }))

function Icon({ children }) {
  return <span aria-hidden="true" className="icon">{children}</span>
}

function Shell({ children }) {
  return <div className="app-shell">
    <aside className="sidebar">
      <Link className="brand" to="/" aria-label="Autodemolizione Ricambi Torino, home">
        <img className="brand-logo" src="/Screenshot%202026-10-24%20alle%2021.25.15.png" alt="Autodemolizione Ricambi Torino" />
      </Link>
      <div className="side-label">GESTIONE MAGAZZINO</div>
      <nav className="side-nav">
        <NavLink end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/"><Icon>⌕</Icon> Cerca ricambio <span className="nav-arrow">›</span></NavLink>
        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/aggiungi"><Icon>＋</Icon> Aggiungi pezzo</NavLink>
      </nav>
      <div className="sidebar-bottom">
        <div className="shop-card"><span className="shop-card-icon">✳</span><strong>Il tuo magazzino,<br />sempre sotto controllo.</strong><small>Ricerca rapida · Dati aggiornati</small></div>
        <div className="user-row"><div className="user-avatar">AT</div><div><strong>Area operatore</strong><small>Postazione magazzino</small></div><span className="online-dot" /></div>
      </div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div className="breadcrumb">TORINO <span>/</span> GESTIONALE RICAMBI</div><div className="topbar-right"><span className="live-dot" /> DEMO LOCALE <span className="topbar-divider" /> <span className="date-label">SISTEMA OPERATIVO</span></div></header>
      {children}
      <footer className="footer"><span>AUTODEMOLIZIONE RICAMBI TORINO SRL</span><span>Corso Orbassano 368/23, Torino <i>·</i> P.IVA 12721980014</span></footer>
    </main>
  </div>
}

function BadgeStato({ stato }) {
  return <span className={`status-badge ${stato === 'Disponibile' ? 'is-available' : 'is-sold'}`}><span />{stato}</span>
}

function PartVisual({ piece, large = false }) {
  return <div className={`part-visual ${piece.tinta} ${large ? 'visual-large' : ''}`}>
    <div className="visual-grid" /><span className="visual-stamp">RICAMBI<br />TORINO</span><span className="part-emoji">{piece.icona}</span>
    <span className="visual-caption">{piece.tipo}</span>
  </div>
}

function PezzoCard({ piece, onChangeStatus }) {
  const navigate = useNavigate()
  return <article className="piece-card">
    <button className="card-image-button" onClick={() => navigate(`/pezzo/${piece.id}`)} aria-label={`Apri ${piece.tipo}`}><PartVisual piece={piece} /><span className="photo-count">▧ 1</span></button>
    <div className="card-content">
      <div className="card-topline"><span className="part-code">{piece.codice}</span><BadgeStato stato={piece.stato} /></div>
      <h3>{piece.tipo}</h3><p className="vehicle-name">{piece.marca} <b>{piece.modello}</b><span> · </span>{piece.anno}</p>
      <div className="piece-tags"><span>◉ {piece.colore}</span><span>↔ {piece.lato}</span><span>⌖ {piece.posizione || '—'}</span><span>◇ {piece.condizione}</span></div>
      <div className="card-bottom"><strong className="price">€ {piece.prezzo.toFixed(2)}</strong><button className="text-button" onClick={() => navigate(`/pezzo/${piece.id}`)}>Dettaglio <span>↗</span></button></div>
      {piece.stato === 'Disponibile' && <button className="sold-link" onClick={() => onChangeStatus(piece.id, 'Venduto')}>Segna come venduto</button>}
      {piece.stato === 'Venduto' && <button className="sold-link" onClick={() => onChangeStatus(piece.id, 'Disponibile')}>Rimetti disponibile</button>}
    </div>
  </article>
}

function SearchPage({ pieces, marche, onChangeStatus }) {
  const [query, setQuery] = useState('')
  const [brand, setBrand] = useState('')
  const [onlyAvailable, setOnlyAvailable] = useState(true)
  const filtered = useMemo(() => pieces.filter(piece => {
    const text = `${piece.tipo} ${piece.marca} ${piece.modello} ${piece.colore} ${piece.anno}`.toLowerCase()
    const parole = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
    return parole.every(parola => text.includes(parola)) && (!brand || piece.marca === brand) && (!onlyAvailable || piece.stato === 'Disponibile')
  }), [pieces, query, brand, onlyAvailable])
  const brands = [...new Set([...marche, ...pieces.map(piece => piece.marca)])].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }))
  return <section className="page-content">
    <div className="page-heading"><div><div className="eyebrow"><span /> MAGAZZINO RICAMBI <span className="eyebrow-line" /></div><h1>Trova il tuo <em>ricambio.</em></h1><p className="page-lead">Cerca tra i pezzi disponibili e rispondi al cliente in pochi secondi.</p></div><Link className="button button-yellow" to="/aggiungi"><span>＋</span> Aggiungi pezzo</Link></div>
    <div className="search-panel"><div className="search-main"><span className="search-icon">⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Cerca un pezzo, un veicolo o un colore..." aria-label="Cerca un pezzo"/><kbd>INVIO ↵</kbd></div><div className="filter-row"><label className="filter-control"><span>MARCA</span><select value={brand} onChange={event => setBrand(event.target.value)}><option value="">Tutte le marche</option>{brands.map(item => <option key={item}>{item}</option>)}</select></label><label className="filter-toggle"><input type="checkbox" checked={onlyAvailable} onChange={event => setOnlyAvailable(event.target.checked)} /><span className="toggle-track" /> Solo disponibili</label><span className="filter-help">Filtra i ricambi del magazzino <b>⌄</b></span></div></div>
    <div className="results-heading"><div><h2>RICAMBI IN MAGAZZINO <span className="result-count">{filtered.length.toString().padStart(2, '0')}</span></h2><p>{onlyAvailable ? 'Visualizzazione dei soli pezzi disponibili' : 'Visualizzazione di tutti i pezzi'}</p></div><button className="sort-button">PIÙ RECENTI <span>⌄</span></button></div>
    {filtered.length ? <div className="pieces-grid">{filtered.map(piece => <PezzoCard key={piece.id} piece={piece} onChangeStatus={onChangeStatus} />)}</div> : <div className="empty-state"><span>⌕</span><h3>Nessun ricambio trovato</h3><p>Prova a modificare la ricerca oppure mostra anche i pezzi venduti.</p><button className="button button-dark" onClick={() => { setQuery(''); setBrand(''); setOnlyAvailable(false) }}>Azzera i filtri</button></div>}
    <div className="inventory-note"><span>✳</span><p><strong>Ricerca rapida, servizio migliore.</strong> Tutti i ricambi del tuo magazzino in un unico posto.</p><span className="note-arrow">↗</span></div>
  </section>
}

function DetailPage({ pieces, onChangeStatus }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const piece = pieces.find(item => item.id === Number(id))
  if (!piece) return <section className="page-content"><div className="empty-state"><h3>Ricambio non trovato</h3><Link to="/">Torna alla ricerca</Link></div></section>
  return <section className="page-content"><Link className="back-link" to="/">← TORNA AI RISULTATI</Link><div className="detail-layout"><PartVisual piece={piece} large /><div className="detail-info"><div className="eyebrow"><span /> SCHEDA RICAMBIO</div><div className="detail-code">{piece.codice}</div><h1>{piece.tipo}<br /><em>{piece.marca} {piece.modello}</em></h1><BadgeStato stato={piece.stato} /><div className="detail-price">€ {piece.prezzo.toFixed(2)} <small>PREZZO INDICATIVO</small></div><div className="detail-specs">{[['ANNO', piece.anno], ['COLORE', piece.colore], ['POSIZIONE', piece.posizione || '—'], ['LATO', piece.lato], ['CONDIZIONE', piece.condizione]].map(([label, value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}</div><div className="detail-actions"><button className="button button-yellow" onClick={() => navigate(`/modifica/${piece.id}`)}>✎ Modifica scheda</button><button className="button button-dark" onClick={() => onChangeStatus(piece.id, piece.stato === 'Disponibile' ? 'Venduto' : 'Disponibile')}>{piece.stato === 'Disponibile' ? 'Segna come venduto' : 'Rimetti disponibile'}</button></div><p className="mock-notice">DEMO · Le modifiche sono temporanee e si azzerano al ricaricamento.</p></div></div></section>
}

function PieceForm({ pieces, tipologie, marche, modelli, colori, onAddTipologia, onAddMarca, onAddModello, onAddColore, onSave }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const existing = pieces.find(piece => piece.id === Number(id))
  const [form, setForm] = useState(() => existing || { tipo: '', marca: '', modello: '', anno: new Date().getFullYear(), colore: '', lato: 'Nessuno', posizione: 'Anteriore', condizione: 'Usato', prezzo: '', stato: 'Disponibile', codice: `DEMO-${String(pieces.length + 1).padStart(4, '0')}`, icona: '🚘', tinta: 'dark' })
  const [aggiungiTipologia, setAggiungiTipologia] = useState(false)
  const [nuovaTipologia, setNuovaTipologia] = useState('')
  const [aggiungiMarca, setAggiungiMarca] = useState(false)
  const [nuovaMarca, setNuovaMarca] = useState('')
  const [aggiungiModello, setAggiungiModello] = useState(false)
  const [nuovoModello, setNuovoModello] = useState('')
  const [aggiungiColore, setAggiungiColore] = useState(false)
  const [nuovoColore, setNuovoColore] = useState('')
  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }))
  const modelliMarca = [...new Set([...(modelli[form.marca] || []), ...pieces.filter(piece => piece.marca === form.marca).map(piece => piece.modello)])].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' }))
  const cambiaMarca = event => setForm(current => ({ ...current, marca: event.target.value, modello: '' }))
  const confermaTipologia = event => {
    event.preventDefault()
    const nome = nuovaTipologia.trim()
    if (!nome) return
    onAddTipologia(nome)
    setForm(current => ({ ...current, tipo: nome }))
    setNuovaTipologia('')
    setAggiungiTipologia(false)
  }
  const confermaMarca = () => {
    const nome = nuovaMarca.trim()
    if (!nome) return
    setForm(current => ({ ...current, marca: onAddMarca(nome), modello: '' }))
    setNuovaMarca('')
    setAggiungiMarca(false)
  }
  const confermaModello = () => {
    const nome = nuovoModello.trim()
    if (!nome || !form.marca) return
    setForm(current => ({ ...current, modello: onAddModello(current.marca, nome) }))
    setNuovoModello('')
    setAggiungiModello(false)
  }
  const confermaColore = () => {
    const nome = nuovoColore.trim()
    if (!nome) return
    setForm(current => ({ ...current, colore: onAddColore(nome) }))
    setNuovoColore('')
    setAggiungiColore(false)
  }
  const submit = event => {
    event.preventDefault()
    onSave({ ...form, id: existing?.id || Date.now(), prezzo: Number(form.prezzo) || 0 })
    navigate('/')
  }

  return <section className="page-content">
    <Link className="back-link" to="/">← TORNA ALLA RICERCA</Link>
    <div className="form-heading"><div className="eyebrow"><span /> GESTIONE MAGAZZINO</div><h1>{existing ? 'Modifica ricambio.' : <>Nuovo <em>ricambio.</em></>}</h1><p className="company-name">AUTODEMOLIZIONE RICAMBI TORINO S.R.L.</p><p className="page-lead">Inserisci i dati del pezzo per aggiungerlo al magazzino demo.</p></div>
    <form className="piece-form" onSubmit={submit}>
      <div className="form-section-title">01 <span>INFORMAZIONI RICAMBIO</span></div>
      <div className="form-grid">
        <label>TIPOLOGIA (A–Z)<div className="type-select-row"><select name="tipo" required value={form.tipo} onChange={update}><option value="">Seleziona una tipologia</option>{tipologie.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}</select><button type="button" className="add-type-button" onClick={() => setAggiungiTipologia(current => !current)} aria-label="Aggiungi nuova tipologia">＋</button></div>{aggiungiTipologia && <div className="new-type-row"><input autoFocus value={nuovaTipologia} onChange={event => setNuovaTipologia(event.target.value)} placeholder="Nome nuova tipologia" aria-label="Nome nuova tipologia"/><button className="new-type-save" type="button" onClick={confermaTipologia}>Aggiungi</button></div>}</label>
        <label>MARCA (A–Z)<div className="type-select-row"><select name="marca" required value={form.marca} onChange={cambiaMarca}><option value="">Seleziona una marca</option>{marche.map(marca => <option key={marca} value={marca}>{marca}</option>)}</select><button type="button" className="add-type-button" onClick={() => setAggiungiMarca(current => !current)} aria-label="Aggiungi nuova marca">＋</button></div>{aggiungiMarca && <div className="new-type-row"><input autoFocus value={nuovaMarca} onChange={event => setNuovaMarca(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); confermaMarca() } }} placeholder="Nome nuova marca" aria-label="Nome nuova marca"/><button className="new-type-save" type="button" onClick={confermaMarca}>Aggiungi</button></div>}</label>
        <label>MODELLO (IN BASE ALLA MARCA)<div className="type-select-row"><select name="modello" required value={form.modello} onChange={update} disabled={!form.marca}><option value="">{form.marca ? 'Seleziona un modello' : 'Seleziona prima la marca'}</option>{modelliMarca.map(modello => <option key={modello} value={modello}>{modello}</option>)}</select><button type="button" className="add-type-button" onClick={() => setAggiungiModello(current => !current)} disabled={!form.marca} aria-label="Aggiungi nuovo modello">＋</button></div>{aggiungiModello && <div className="new-type-row"><input autoFocus value={nuovoModello} onChange={event => setNuovoModello(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); confermaModello() } }} placeholder="Nome nuovo modello" aria-label="Nome nuovo modello"/><button className="new-type-save" type="button" onClick={confermaModello}>Aggiungi</button></div>}</label>
        <label>ANNO<input name="anno" required type="number" min="1950" max="2035" value={form.anno} onChange={update} /></label>
        <label>COLORE<div className="type-select-row"><select name="colore" required value={form.colore} onChange={update}><option value="">Seleziona un colore</option>{colori.map(colore => <option key={colore} value={colore}>{colore}</option>)}</select><button type="button" className="add-type-button" onClick={() => setAggiungiColore(current => !current)} aria-label="Aggiungi nuovo colore">＋</button></div>{aggiungiColore && <div className="new-type-row"><input autoFocus value={nuovoColore} onChange={event => setNuovoColore(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); confermaColore() } }} placeholder="Nome nuovo colore" aria-label="Nome nuovo colore"/><button className="new-type-save" type="button" onClick={confermaColore}>Aggiungi</button></div>}</label>
        <label>POSIZIONE SULL’AUTO<select name="posizione" value={form.posizione || 'Anteriore'} onChange={update}><option>Anteriore</option><option>Posteriore</option><option>Laterale</option><option>Interno abitacolo</option><option>Vano motore</option><option>Sottoscocca</option><option>Altro</option></select></label>
        <label>LATO<select name="lato" value={form.lato} onChange={update}><option>Nessuno</option><option>Destro</option><option>Sinistro</option></select></label>
        <label>CONDIZIONE<select name="condizione" value={form.condizione} onChange={update}><option>Usato</option><option>Nuovo</option></select></label>
        <label>PREZZO (€)<input name="prezzo" type="number" min="0" step="0.01" value={form.prezzo} onChange={update} placeholder="0,00" /></label>
      </div>
      <div className="form-actions"><span>* Campi obbligatori</span><button className="button button-yellow" type="submit">{existing ? 'Salva modifiche' : '＋ Aggiungi ricambio'}</button></div>
    </form>
  </section>
}

function AppContent() {
  const [pieces, setPieces] = useState(demoPezzi)
  const [tipologie, setTipologie] = useState(() => [...new Set([...catalogoTipologie, ...demoPezzi.map(piece => piece.tipo)])].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' })))
  const [marche, setMarche] = useState(() => [...new Set([...catalogoMarche, ...demoPezzi.map(piece => piece.marca)])].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' })))
  const [modelli, setModelli] = useState(catalogoModelli)
  const [colori, setColori] = useState(() => [...new Set([...catalogoColori, ...demoPezzi.map(piece => piece.colore)])].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' })))
  const addTipologia = nome => setTipologie(current => current.some(tipo => tipo.toLowerCase() === nome.toLowerCase()) ? current : [...current, nome].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' })))
  const addMarca = nome => {
    const esistente = marche.find(marca => marca.toLowerCase() === nome.toLowerCase())
    if (esistente) return esistente
    setMarche(current => [...current, nome].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' })))
    return nome
  }
  const addModello = (marca, nome) => {
    const esistente = (modelli[marca] || []).find(modello => modello.toLowerCase() === nome.toLowerCase())
    if (esistente) return esistente
    setModelli(current => ({ ...current, [marca]: [...(current[marca] || []), nome].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' })) }))
    return nome
  }
  const addColore = nome => {
    const esistente = colori.find(colore => colore.toLowerCase() === nome.toLowerCase())
    if (esistente) return esistente
    setColori(current => [...current, nome].sort((a, b) => a.localeCompare(b, 'it', { sensitivity: 'base' })))
    return nome
  }
  const changeStatus = (id, stato) => {
    if (stato === 'Venduto' && !window.confirm('Confermi di segnare questo ricambio come venduto?')) return
    setPieces(current => current.map(piece => piece.id === id ? { ...piece, stato } : piece))
  }
  const savePiece = piece => setPieces(current => current.some(item => item.id === piece.id) ? current.map(item => item.id === piece.id ? piece : item) : [piece, ...current])
  return <Shell><Routes><Route path="/" element={<SearchPage pieces={pieces} marche={marche} onChangeStatus={changeStatus} />} /><Route path="/pezzo/:id" element={<DetailPage pieces={pieces} onChangeStatus={changeStatus} />} /><Route path="/aggiungi" element={<PieceForm pieces={pieces} tipologie={tipologie} marche={marche} modelli={modelli} colori={colori} onAddTipologia={addTipologia} onAddMarca={addMarca} onAddModello={addModello} onAddColore={addColore} onSave={savePiece} />} /><Route path="/modifica/:id" element={<PieceForm pieces={pieces} tipologie={tipologie} marche={marche} modelli={modelli} colori={colori} onAddTipologia={addTipologia} onAddMarca={addMarca} onAddModello={addModello} onAddColore={addColore} onSave={savePiece} />} /><Route path="*" element={<SearchPage pieces={pieces} marche={marche} onChangeStatus={changeStatus} />} /></Routes></Shell>
}

export default function App() {
  return <BrowserRouter><AppContent /></BrowserRouter>
}
