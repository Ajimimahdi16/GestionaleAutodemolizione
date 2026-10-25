// Server API per la demo gestionale ricambi.
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const express = require('express')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const cors = require('cors')
const pool = require('./config/db')

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
app.use('/api/auth', require('./routes/auth')(pool))
app.use('/api/pezzi', require('./routes/pezzi')(pool))
app.use('/api', require('./routes/cataloghi')(pool))

// Foto statiche: il caricamento e la gestione verranno aggiunti nella fase dedicata.
const cartellaFoto = path.resolve(__dirname, '../', process.env.UPLOAD_DIR || 'uploads')
app.use('/uploads', express.static(cartellaFoto, { fallthrough: false, index: false }))

app.use('/api', (req, res) => res.status(404).json({ errore: 'Percorso API non trovato.' }))
app.use((errore, req, res, next) => {
  if (res.headersSent) return next(errore)
  if (errore.code === 'ER_DUP_ENTRY') return res.status(409).json({ errore: 'Esiste già un elemento con gli stessi dati univoci.' })
  if (errore.code === 'ENOENT') return res.status(404).json({ errore: 'File non trovato.' })
  // I dettagli tecnici vengono registrati nel terminale ma non esposti al browser.
  console.error('Errore interno API:', errore.message)
  res.status(500).json({ errore: 'Si è verificato un errore interno. Riprova o controlla la connessione al database.' })
})

const porta = Number(process.env.APP_PORT) || 5000
const host = process.env.APP_HOST || '0.0.0.0'
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
