const express = require('express')
const path = require('path')
const { rateLimit } = require('express-rate-limit')

const router = express.Router()
const cartellaUpload = path.resolve(__dirname, '../../', process.env.UPLOAD_DIR || 'backend/uploads')
const nomeFotoValido = /^\d+-[0-9a-f-]{36}\.jpg$/i
const MASSIMO_RISULTATI = 48

const limite = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { errore: 'Troppe richieste. Riprova tra qualche istante.' },
})

const etichetteLato = { dx: 'Destro', sx: 'Sinistro', nessuno: '' }
const maiuscola = testo => (testo ? testo[0].toUpperCase() + testo.slice(1) : '')

// Solo i dati utili al cliente: niente prezzo, codici interni, note né dati di inserimento.
function mappaPezzoPubblico(riga) {
  return {
    id: riga.id,
    tipo: riga.tipo,
    marca: riga.marca,
    modello: riga.modello,
    anno: riga.anno,
    colore: riga.colore,
    lato: Object.hasOwn(etichetteLato, riga.lato) ? etichetteLato[riga.lato] : maiuscola(riga.lato),
    posizione: riga.posizione === 'altro' ? '' : maiuscola(riga.posizione),
    condizione: maiuscola(riga.condizione),
    foto: riga.foto ? `/api/pubblico/foto/${encodeURIComponent(riga.foto)}` : null,
  }
}

const SELECT_DISPONIBILI = `
  SELECT p.id, t.nome AS tipo, v.marca, v.modello, p.anno, p.colore, p.lato, p.posizione, p.condizione,
         (SELECT fp.nome_file FROM foto_pezzo fp
          WHERE fp.pezzo_id = p.id ORDER BY fp.principale DESC, fp.id ASC LIMIT 1) AS foto
  FROM pezzi p
  JOIN veicoli v ON v.id = p.veicolo_id
  JOIN tipologie_pezzo t ON t.id = p.tipologia_id
  WHERE p.stato = 'disponibile'
`

function testoValido(valore, massimo) {
  return typeof valore === 'string' && valore.trim().length > 0 && valore.trim().length <= massimo
}

// Recensioni di Google Maps (Places API). Si attivano solo se nel file .env ci sono la chiave e l'ID del luogo;
// la chiave resta sul server e non arriva mai al browser. Il risultato è tenuto in memoria per qualche ora,
// così il sito non fa una chiamata a Google per ogni visitatore.
const DURATA_CACHE_RECENSIONI = 6 * 60 * 60 * 1000
let cacheRecensioni = { scadenza: 0, dati: null }

async function leggiRecensioniGoogle() {
  const chiave = process.env.GOOGLE_PLACES_API_KEY
  const idLuogo = process.env.GOOGLE_PLACE_ID
  if (!chiave || !idLuogo) return { attive: false }
  if (cacheRecensioni.dati && Date.now() < cacheRecensioni.scadenza) return cacheRecensioni.dati

  const controllo = new AbortController()
  const timer = setTimeout(() => controllo.abort(), 6000)
  try {
    const risposta = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(idLuogo)}?languageCode=it`,
      {
        signal: controllo.signal,
        headers: { 'X-Goog-Api-Key': chiave, 'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews' },
      },
    )
    if (!risposta.ok) throw new Error(`Google ha risposto ${risposta.status}`)
    const luogo = await risposta.json()
    const dati = {
      attive: true,
      valutazione: typeof luogo.rating === 'number' ? luogo.rating : null,
      totale: Number(luogo.userRatingCount) || 0,
      mappa: luogo.googleMapsUri || null,
      recensioni: (luogo.reviews || []).slice(0, 5).map(recensione => ({
        autore: recensione.authorAttribution?.displayName || 'Utente Google',
        stelle: Math.max(0, Math.min(5, Math.round(Number(recensione.rating) || 0))),
        testo: (recensione.text?.text || recensione.originalText?.text || '').slice(0, 600),
        quando: recensione.relativePublishTimeDescription || '',
      })).filter(recensione => recensione.testo),
    }
    cacheRecensioni = { scadenza: Date.now() + DURATA_CACHE_RECENSIONI, dati }
    return dati
  } catch (errore) {
    console.error('Recensioni Google non disponibili:', errore.message)
    // In caso di errore si riprova tra poco; intanto il sito mostra l'invito a leggere le recensioni su Google.
    cacheRecensioni = { scadenza: Date.now() + 5 * 60 * 1000, dati: { attive: false } }
    return cacheRecensioni.dati
  } finally {
    clearTimeout(timer)
  }
}

module.exports = pool => {
  router.use(limite)

  router.get('/recensioni', async (req, res, next) => {
    try {
      res.set('Cache-Control', 'public, max-age=600')
      res.json(await leggiRecensioniGoogle())
    } catch (errore) { next(errore) }
  })

  // Elenchi per i menu a tendina: tutto il catalogo, anche i pezzi oggi non disponibili.
  router.get('/filtri', async (req, res, next) => {
    try {
      const [tipologie] = await pool.execute('SELECT id, nome FROM tipologie_pezzo ORDER BY nome')
      const [marche] = await pool.execute('SELECT DISTINCT marca FROM veicoli ORDER BY marca')
      const [modelli] = await pool.execute('SELECT DISTINCT marca, modello FROM veicoli ORDER BY marca, modello')
      res.set('Cache-Control', 'public, max-age=300')
      res.json({
        tipologie,
        marche: marche.map(riga => riga.marca),
        modelli: modelli.map(riga => ({ marca: riga.marca, modello: riga.modello })),
      })
    } catch (errore) { next(errore) }
  })

  // Ricerca: restituisce solo i pezzi disponibili e se ce n'è almeno uno.
  router.get('/pezzi', async (req, res, next) => {
    try {
      const where = []
      const params = []
      if (req.query.tipologia_id !== undefined) {
        // Accetta uno o più identificativi separati da virgola (es. "2,81"), fino a 6.
        const ids = typeof req.query.tipologia_id === 'string' ? req.query.tipologia_id.split(',').map(Number) : []
        if (!ids.length || ids.length > 6 || ids.some(id => !Number.isInteger(id) || id < 1)) {
          return res.status(400).json({ errore: 'Pezzo non valido.' })
        }
        where.push(`p.tipologia_id IN (${ids.map(() => '?').join(', ')})`); params.push(...ids)
      }
      if (req.query.marca !== undefined) {
        if (!testoValido(req.query.marca, 80)) return res.status(400).json({ errore: 'Marca non valida.' })
        where.push('v.marca = ?'); params.push(req.query.marca.trim())
      }
      if (req.query.modello !== undefined) {
        if (!testoValido(req.query.modello, 100)) return res.status(400).json({ errore: 'Modello non valido.' })
        where.push('v.modello = ?'); params.push(req.query.modello.trim())
      }
      if (!where.length) return res.status(400).json({ errore: 'Scegli almeno il pezzo o la marca.' })

      const sql = `${SELECT_DISPONIBILI} AND ${where.join(' AND ')} ORDER BY p.data_inserimento DESC, p.id DESC LIMIT ${MASSIMO_RISULTATI}`
      const [righe] = await pool.execute(sql, params)
      res.set('Cache-Control', 'no-store')
      res.json({ disponibile: righe.length > 0, totale: righe.length, pezzi: righe.map(mappaPezzoPubblico) })
    } catch (errore) { next(errore) }
  })

  // Quanti pezzi disponibili ci sono per ogni tipo di pezzo (per i punti sull'auto interattiva).
  router.get('/disponibilita', async (req, res, next) => {
    try {
      const [righe] = await pool.execute(
        "SELECT tipologia_id, COUNT(*) AS totale FROM pezzi WHERE stato = 'disponibile' GROUP BY tipologia_id",
      )
      res.set('Cache-Control', 'public, max-age=30')
      res.json({ per_tipologia: Object.fromEntries(righe.map(riga => [riga.tipologia_id, Number(riga.totale)])) })
    } catch (errore) { next(errore) }
  })

  // Ultimi pezzi arrivati con foto, per la vetrina.
  router.get('/novita', async (req, res, next) => {
    try {
      const [righe] = await pool.execute(`
        SELECT * FROM (${SELECT_DISPONIBILI}) AS d
        WHERE d.foto IS NOT NULL
        ORDER BY d.id DESC LIMIT 8`)
      res.set('Cache-Control', 'public, max-age=60')
      res.json({ pezzi: righe.map(mappaPezzoPubblico) })
    } catch (errore) { next(errore) }
  })

  // Foto pubbliche: solo quelle di pezzi oggi disponibili, mai altri file della cartella.
  router.get('/foto/:nome', async (req, res, next) => {
    try {
      const nome = req.params.nome
      if (!nomeFotoValido.test(nome)) return res.status(404).json({ errore: 'Foto non trovata.' })
      const [righe] = await pool.execute(
        `SELECT 1 FROM foto_pezzo fp JOIN pezzi p ON p.id = fp.pezzo_id
         WHERE fp.nome_file = ? AND p.stato = 'disponibile' LIMIT 1`,
        [nome],
      )
      if (!righe.length) return res.status(404).json({ errore: 'Foto non trovata.' })
      res.sendFile(nome, { root: cartellaUpload, maxAge: '1h', dotfiles: 'deny' }, errore => {
        if (errore && !res.headersSent) res.status(404).json({ errore: 'Foto non trovata.' })
      })
    } catch (errore) { next(errore) }
  })

  return router
}
