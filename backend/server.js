// Server API per la demo gestionale ricambi.
const path = require('path')
const fs = require('fs')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const express = require('express')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const cors = require('cors')
const pool = require('./config/db')
const { richiediAccesso } = require('./middleware/autenticazione')

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('Configurazione non valida: imposta un JWT_SECRET casuale di almeno 32 caratteri nel file .env.')
  process.exit(1)
}
if (!process.env.DB_PASSWORD) {
  console.warn('DB_PASSWORD non impostata: le richieste che usano MySQL non funzioneranno finché non configuri .env.')
}

const app = express()
app.disable('x-powered-by')
app.use(helmet())
app.use(express.json({ limit: '1mb' }))
app.use((req, res, next) => {
  if (!req.body || Array.isArray(req.body)) req.body = {}
  next()
})
app.use(cookieParser())

// In sviluppo il frontend Vite gira su 5173; in produzione le API saranno same-origin.
if (process.env.NODE_ENV !== 'production') {
  const origine = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
  app.use(cors({ origin: origine, credentials: true }))
}

app.get('/health', (req, res) => res.json({ stato: 'ok', messaggio: 'Server ricambi attivo.' }))
app.get('/health/database', async (req, res) => {
  try {
    await pool.execute('SELECT 1')
    res.json({ stato: 'ok', database: 'connesso' })
  } catch {
    res.status(503).json({ stato: 'errore', database: 'non disponibile' })
  }
})
app.use('/api/auth', require('./routes/auth')(pool))
app.use('/api/pezzi', require('./routes/pezzi')(pool))
app.use('/api/foto', require('./routes/foto')(pool))
app.use('/api', require('./routes/cataloghi')(pool))

// Foto statiche: il caricamento e la gestione verranno aggiunti nella fase dedicata.
const cartellaFoto = path.resolve(__dirname, '../', process.env.UPLOAD_DIR || 'backend/uploads')
// Le foto sono visibili solo a chi ha effettuato l'accesso (il browser invia il cookie di sessione).
app.use('/uploads', richiediAccesso(pool), express.static(cartellaFoto, { fallthrough: false, index: false }))

app.use('/api', (req, res) => res.status(404).json({ errore: 'Percorso API non trovato.' }))
app.use((errore, req, res, next) => {
  if (res.headersSent) return next(errore)
  if (errore.code === 'ER_DUP_ENTRY') return res.status(409).json({ errore: 'Esiste già un elemento con gli stessi dati univoci.' })
  if (errore.code === 'ENOENT') return res.status(404).json({ errore: 'File non trovato.' })
  if (errore.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ errore: 'Ogni foto deve pesare al massimo 10 MB.' })
  if (errore.code === 'LIMIT_FILE_COUNT' || errore.code === 'LIMIT_UNEXPECTED_FILE') return res.status(400).json({ errore: 'Puoi caricare al massimo 8 foto per volta.' })
  if (errore.type === 'entity.parse.failed') return res.status(400).json({ errore: 'I dati inviati non sono in un formato valido.' })
  if (errore.type === 'entity.too.large') return res.status(413).json({ errore: 'I dati inviati sono troppo grandi.' })
  if (errore.message && errore.message.startsWith('Formato foto non supportato')) return res.status(400).json({ errore: errore.message })
  // I dettagli tecnici vengono registrati nel terminale ma non esposti al browser.
  console.error('Errore interno API:', errore.message)
  res.status(500).json({ errore: 'Si è verificato un errore interno. Riprova o controlla la connessione al database.' })
})

// Dopo una build, Express serve anche l'interfaccia React sulla stessa porta delle API.
const cartellaFrontend = path.resolve(__dirname, '../frontend/dist')
if (fs.existsSync(path.join(cartellaFrontend, 'index.html'))) {
  app.use(express.static(cartellaFrontend, { index: false }))
  app.get('*', (req, res) => res.sendFile(path.join(cartellaFrontend, 'index.html')))
}

const porta = Number(process.env.APP_PORT) || 3000
const host = process.env.APP_HOST || '127.0.0.1'
const server = app.listen(porta, host, () => {
  console.log(`Server ricambi attivo su http://${host}:${porta}`)
})

async function chiudiServer() {
  server.close()
  await pool.end()
}
process.on('SIGINT', chiudiServer)
process.on('SIGTERM', chiudiServer)

module.exports = app
