const express = require('express')
const { richiediAccesso, soloAdmin } = require('../middleware/autenticazione')

const router = express.Router()
const valoriLato = { dx: 'dx', sx: 'sx', nessuno: 'nessuno', destro: 'dx', sinistro: 'sx' }
const valoriCondizione = { nuovo: 'nuovo', usato: 'usato' }
const valoriStato = { disponibile: 'disponibile', venduto: 'venduto' }
const valoriPosizione = {
  anteriore: 'anteriore', posteriore: 'posteriore', laterale: 'laterale',
  'interno abitacolo': 'interno abitacolo', 'vano motore': 'vano motore',
  sottoscocca: 'sottoscocca', altro: 'altro',
}
const etichette = { dx: 'Destro', sx: 'Sinistro', nessuno: 'Nessuno' }

function mappaPezzo(riga) {
  return {
    ...riga,
    prezzo: riga.prezzo === null ? null : Number(riga.prezzo),
    lato: etichette[riga.lato] || riga.lato,
    condizione: riga.condizione ? riga.condizione[0].toUpperCase() + riga.condizione.slice(1) : riga.condizione,
    stato: riga.stato ? riga.stato[0].toUpperCase() + riga.stato.slice(1) : riga.stato,
    foto_principale: riga.foto_principale ? `/uploads/${encodeURIComponent(riga.foto_principale)}` : null,
  }
}

function testo(valore, massimo) {
  return typeof valore === 'string' && valore.trim().length > 0 && valore.trim().length <= massimo
}

function normalizza(valore, mappa) {
  return typeof valore === 'string' ? mappa[valore.trim().toLowerCase()] : undefined
}

function verificaCorpo(body) {
  const errors = []
  if (!testo(body.marca, 80)) errors.push('La marca è obbligatoria (massimo 80 caratteri).')
  if (!testo(body.modello, 100)) errors.push('Il modello è obbligatorio (massimo 100 caratteri).')
  if (!testo(body.tipo, 120)) errors.push('La tipologia è obbligatoria (massimo 120 caratteri).')
  const anno = Number(body.anno)
  if (!Number.isInteger(anno) || anno < 1950 || anno > 2100) errors.push('L’anno deve essere compreso tra 1950 e 2100.')
  if (!testo(body.colore, 80)) errors.push('Il colore è obbligatorio (massimo 80 caratteri).')
  const lato = normalizza(body.lato || 'nessuno', valoriLato)
  if (!lato) errors.push('Il lato deve essere destro, sinistro o nessuno.')
  const condizione = normalizza(body.condizione || 'usato', valoriCondizione)
  if (!condizione) errors.push('La condizione deve essere nuovo o usato.')
  const posizione = normalizza(body.posizione || 'altro', valoriPosizione)
  if (!posizione) errors.push('La posizione del pezzo non è valida.')
  let prezzo = null
  if (body.prezzo !== undefined && body.prezzo !== null && body.prezzo !== '') {
    prezzo = Number(body.prezzo)
    if (!Number.isFinite(prezzo) || prezzo < 0 || prezzo > 99999999.99) errors.push('Il prezzo deve essere un numero positivo.')
  }
  const codice = body.codice === undefined || body.codice === '' ? null : body.codice
  if (codice !== null && !testo(codice, 40)) errors.push('Il codice deve contenere al massimo 40 caratteri.')
  const note = body.note === undefined || body.note === null ? null : body.note
  if (note !== null && (typeof note !== 'string' || note.length > 5000)) errors.push('Le note non possono superare 5000 caratteri.')
  return { errors, valori: { anno, lato, condizione, posizione, prezzo, codice, note } }
}

const SELECT_PEZZI = `
  SELECT p.id, p.codice, p.anno, p.colore, p.lato, p.posizione, p.condizione,
         p.stato, p.prezzo, p.note, p.data_inserimento, p.data_vendita,
         v.id AS veicolo_id, v.marca, v.modello, t.id AS tipologia_id, t.nome AS tipo,
         (SELECT fp.nome_file FROM foto_pezzo fp
          WHERE fp.pezzo_id = p.id ORDER BY fp.principale DESC, fp.id ASC LIMIT 1) AS foto_principale
  FROM pezzi p
  JOIN veicoli v ON v.id = p.veicolo_id
  JOIN tipologie_pezzo t ON t.id = p.tipologia_id
`

module.exports = pool => {
  router.use(richiediAccesso(pool))

  // Ricerca filtrata. Ogni termine del testo libero deve trovare corrispondenza.
  router.get('/', async (req, res, next) => {
    try {
      const where = []
      const params = []
      const q = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 200) : ''
      for (const parola of q.split(/\s+/).filter(Boolean)) {
        const like = `%${parola}%`
        where.push('(v.marca LIKE ? OR v.modello LIKE ? OR t.nome LIKE ? OR p.colore LIKE ? OR p.codice LIKE ?)')
        params.push(like, like, like, like, like)
      }
      const filtriTestuali = [
        ['marca', 'v.marca', 80], ['modello', 'v.modello', 100], ['colore', 'p.colore', 80],
      ]
      for (const [chiave, colonna, limite] of filtriTestuali) {
        if (req.query[chiave] !== undefined) {
          if (!testo(req.query[chiave], limite)) return res.status(400).json({ errore: `Filtro ${chiave} non valido.` })
          where.push(`${colonna} = ?`)
          params.push(req.query[chiave].trim())
        }
      }
      if (req.query.anno !== undefined) {
        const anno = Number(req.query.anno)
        if (!Number.isInteger(anno) || anno < 1950 || anno > 2100) return res.status(400).json({ errore: 'Filtro anno non valido.' })
        where.push('p.anno = ?'); params.push(anno)
      }
      if (req.query.tipologia_id !== undefined) {
        const idTipologia = Number(req.query.tipologia_id)
        if (!Number.isInteger(idTipologia) || idTipologia < 1) return res.status(400).json({ errore: 'Filtro tipologia non valido.' })
        where.push('p.tipologia_id = ?'); params.push(idTipologia)
      }
      for (const [chiave, colonna, mappa] of [
        ['lato', 'p.lato', valoriLato], ['condizione', 'p.condizione', valoriCondizione], ['stato', 'p.stato', valoriStato],
      ]) {
        if (req.query[chiave] !== undefined) {
          const valore = normalizza(req.query[chiave], mappa)
          if (!valore) return res.status(400).json({ errore: `Filtro ${chiave} non valido.` })
          where.push(`${colonna} = ?`); params.push(valore)
        }
      }
      const includiVenduti = ['true', '1', 'si'].includes(String(req.query.includi_venduti || '').toLowerCase())
      if (!includiVenduti && req.query.stato === undefined) {
        where.push('p.stato = ?')
        params.push('disponibile')
      }
      for (const [chiave, operatore] of [['prezzo_min', '>='], ['prezzo_max', '<=']]) {
        if (req.query[chiave] !== undefined) {
          const prezzo = Number(req.query[chiave])
          if (!Number.isFinite(prezzo) || prezzo < 0) return res.status(400).json({ errore: `Filtro ${chiave} non valido.` })
          where.push(`p.prezzo ${operatore} ?`); params.push(prezzo)
        }
      }
      const sql = `${SELECT_PEZZI}${where.length ? ` WHERE ${where.join(' AND ')}` : ''} ORDER BY p.data_inserimento DESC, p.id DESC`
      const [righe] = await pool.execute(sql, params)
      res.json({ pezzi: righe.map(mappaPezzo) })
    } catch (errore) { next(errore) }
  })

  router.get('/:id', async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      if (!Number.isInteger(id) || id < 1) return res.status(400).json({ errore: 'Identificativo ricambio non valido.' })
      const [righe] = await pool.execute(`${SELECT_PEZZI} WHERE p.id = ? LIMIT 1`, [id])
      if (!righe.length) return res.status(404).json({ errore: 'Ricambio non trovato.' })
      const [foto] = await pool.execute('SELECT id, nome_file, principale FROM foto_pezzo WHERE pezzo_id = ? ORDER BY principale DESC, id ASC', [id])
      res.json({ pezzo: { ...mappaPezzo(righe[0]), foto: foto.map(elemento => ({ ...elemento, url: `/uploads/${encodeURIComponent(elemento.nome_file)}` })) } })
    } catch (errore) { next(errore) }
  })

  router.post('/', async (req, res, next) => {
    const validazione = verificaCorpo(req.body)
    if (validazione.errors.length) return res.status(400).json({ errore: validazione.errors.join(' ') })
    let connessione
    try {
      connessione = await pool.getConnection()
      await connessione.beginTransaction()
      const { anno, lato, condizione, posizione, prezzo, codice, note } = validazione.valori
      const marca = req.body.marca.trim()
      const modello = req.body.modello.trim()
      let [veicoli] = await connessione.execute('SELECT id FROM veicoli WHERE marca = ? AND modello = ? ORDER BY id LIMIT 1', [marca, modello])
      let veicoloId
      if (veicoli.length) veicoloId = veicoli[0].id
      else {
        const [nuovoVeicolo] = await connessione.execute('INSERT INTO veicoli (marca, modello, anno_da, anno_a) VALUES (?, ?, ?, ?)', [marca, modello, anno, anno])
        veicoloId = nuovoVeicolo.insertId
      }
      let [tipologie] = await connessione.execute('SELECT id FROM tipologie_pezzo WHERE nome = ? LIMIT 1', [req.body.tipo.trim()])
      let tipologiaId
      if (tipologie.length) tipologiaId = tipologie[0].id
      else {
        const [nuovaTipologia] = await connessione.execute('INSERT INTO tipologie_pezzo (nome) VALUES (?)', [req.body.tipo.trim()])
        tipologiaId = nuovaTipologia.insertId
      }
      const codiceFinale = codice || `RT-${Date.now().toString(36).toUpperCase()}`
      const [inserimento] = await connessione.execute(
        `INSERT INTO pezzi (codice, veicolo_id, tipologia_id, anno, colore, lato, posizione, condizione, stato, prezzo, note, inserito_da)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [codiceFinale, veicoloId, tipologiaId, anno, req.body.colore.trim(), lato, posizione, condizione, 'disponibile', prezzo, note, req.utente.id],
      )
      await connessione.commit()
      res.status(201).json({ messaggio: 'Ricambio aggiunto correttamente.', id: inserimento.insertId, codice: codiceFinale })
    } catch (errore) {
      if (connessione) await connessione.rollback().catch(() => {})
      next(errore)
    } finally { if (connessione) connessione.release() }
  })

  router.put('/:id', async (req, res, next) => {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ errore: 'Identificativo ricambio non valido.' })
    const validazione = verificaCorpo(req.body)
    if (validazione.errors.length) return res.status(400).json({ errore: validazione.errors.join(' ') })
    let connessione
    try {
      connessione = await pool.getConnection()
      await connessione.beginTransaction()
      const { anno, lato, condizione, posizione, prezzo, codice, note } = validazione.valori
      const marca = req.body.marca.trim()
      const modello = req.body.modello.trim()
      let [veicoli] = await connessione.execute('SELECT id FROM veicoli WHERE marca = ? AND modello = ? ORDER BY id LIMIT 1', [marca, modello])
      let veicoloId
      if (veicoli.length) veicoloId = veicoli[0].id
      else {
        const [nuovoVeicolo] = await connessione.execute('INSERT INTO veicoli (marca, modello, anno_da, anno_a) VALUES (?, ?, ?, ?)', [marca, modello, anno, anno])
        veicoloId = nuovoVeicolo.insertId
      }
      let [tipologie] = await connessione.execute('SELECT id FROM tipologie_pezzo WHERE nome = ? LIMIT 1', [req.body.tipo.trim()])
      let tipologiaId
      if (tipologie.length) tipologiaId = tipologie[0].id
      else {
        const [nuovaTipologia] = await connessione.execute('INSERT INTO tipologie_pezzo (nome) VALUES (?)', [req.body.tipo.trim()])
        tipologiaId = nuovaTipologia.insertId
      }
      const [aggiornamento] = await connessione.execute(
        `UPDATE pezzi SET codice = COALESCE(?, codice), veicolo_id = ?, tipologia_id = ?, anno = ?, colore = ?, lato = ?, posizione = ?, condizione = ?, prezzo = ?, note = ? WHERE id = ?`,
        [codice, veicoloId, tipologiaId, anno, req.body.colore.trim(), lato, posizione, condizione, prezzo, note, id],
      )
      if (!aggiornamento.affectedRows) {
        const [esistente] = await connessione.execute('SELECT id FROM pezzi WHERE id = ?', [id])
        if (!esistente.length) {
          await connessione.rollback()
          return res.status(404).json({ errore: 'Ricambio non trovato.' })
        }
      }
      await connessione.commit()
      res.json({ messaggio: 'Ricambio aggiornato correttamente.' })
    } catch (errore) {
      if (connessione) await connessione.rollback().catch(() => {})
      next(errore)
    } finally { if (connessione) connessione.release() }
  })

  router.patch('/:id/venduto', async (req, res, next) => cambiaStato(pool, req, res, next, 'venduto'))
  router.patch('/:id/disponibile', async (req, res, next) => cambiaStato(pool, req, res, next, 'disponibile'))

  router.delete('/:id', soloAdmin, async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      if (!Number.isInteger(id) || id < 1) return res.status(400).json({ errore: 'Identificativo ricambio non valido.' })
      const [risultato] = await pool.execute('DELETE FROM pezzi WHERE id = ?', [id])
      if (!risultato.affectedRows) return res.status(404).json({ errore: 'Ricambio non trovato.' })
      res.json({ messaggio: 'Ricambio eliminato definitivamente.' })
    } catch (errore) { next(errore) }
  })

  return router
}

async function cambiaStato(pool, req, res, next, stato) {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ errore: 'Identificativo ricambio non valido.' })
    const dataVendita = stato === 'venduto' ? new Date() : null
    const [risultato] = await pool.execute('UPDATE pezzi SET stato = ?, data_vendita = ? WHERE id = ?', [stato, dataVendita, id])
    if (!risultato.affectedRows) {
      const [righe] = await pool.execute('SELECT id FROM pezzi WHERE id = ?', [id])
      if (!righe.length) return res.status(404).json({ errore: 'Ricambio non trovato.' })
    }
    res.json({ messaggio: stato === 'venduto' ? 'Ricambio segnato come venduto.' : 'Ricambio rimesso disponibile.' })
  } catch (errore) { next(errore) }
}
