const express = require('express')
const { richiediAccesso } = require('../middleware/autenticazione')

const router = express.Router()

function testoValido(valore, limite) {
  return typeof valore === 'string' && valore.trim().length > 0 && valore.trim().length <= limite
}

module.exports = pool => {
  router.use(richiediAccesso(pool))

  // Elenco delle marche, comprese quelle ancora senza modelli inseriti.
  router.get('/marche', async (req, res, next) => {
    try {
      const [righe] = await pool.execute('SELECT nome FROM marche ORDER BY nome')
      res.json({ marche: righe.map(riga => riga.nome) })
    } catch (errore) { next(errore) }
  })

  router.post('/marche', async (req, res, next) => {
    try {
      const nome = typeof req.body.nome === 'string' ? req.body.nome.trim() : ''
      if (!testoValido(nome, 80)) return res.status(400).json({ errore: 'La marca è obbligatoria (massimo 80 caratteri).' })
      const [esistenti] = await pool.execute('SELECT id, nome FROM marche WHERE LOWER(nome) = LOWER(?) LIMIT 1', [nome])
      if (esistenti.length) return res.status(409).json({ errore: 'Questa marca è già presente.', marca: esistenti[0].nome })
      const [risultato] = await pool.execute('INSERT INTO marche (nome) VALUES (?)', [nome])
      res.status(201).json({ marca: { id: risultato.insertId, nome } })
    } catch (errore) { next(errore) }
  })

  // Modelli filtrati per marca; i nomi arrivano sempre come parametri SQL.
  router.get('/modelli', async (req, res, next) => {
    try {
      const marca = typeof req.query.marca === 'string' ? req.query.marca.trim() : ''
      if (!testoValido(marca, 80)) return res.status(400).json({ errore: 'Seleziona una marca valida.' })
      const [righe] = await pool.execute('SELECT id, marca, modello, anno_da, anno_a FROM veicoli WHERE LOWER(marca) = LOWER(?) ORDER BY modello', [marca])
      res.json({ modelli: righe })
    } catch (errore) { next(errore) }
  })

  router.post('/modelli', async (req, res, next) => {
    try {
      const marca = typeof req.body.marca === 'string' ? req.body.marca.trim() : ''
      const modello = typeof req.body.modello === 'string' ? req.body.modello.trim() : ''
      if (!testoValido(marca, 80) || !testoValido(modello, 100)) {
        return res.status(400).json({ errore: 'Marca e modello sono obbligatori e devono rispettare la lunghezza consentita.' })
      }
      const [marcheEsistenti] = await pool.execute('SELECT id, nome FROM marche WHERE LOWER(nome) = LOWER(?) LIMIT 1', [marca])
      let nomeMarca = marca
      if (marcheEsistenti.length) nomeMarca = marcheEsistenti[0].nome
      else await pool.execute('INSERT INTO marche (nome) VALUES (?)', [marca])

      const [modelliEsistenti] = await pool.execute(
        'SELECT id, marca, modello, anno_da, anno_a FROM veicoli WHERE LOWER(marca) = LOWER(?) AND LOWER(modello) = LOWER(?) LIMIT 1',
        [nomeMarca, modello],
      )
      if (modelliEsistenti.length) return res.status(409).json({ errore: 'Questo modello è già presente per la marca selezionata.', modello: modelliEsistenti[0] })

      const [risultato] = await pool.execute('INSERT INTO veicoli (marca, modello, anno_da, anno_a) VALUES (?, ?, NULL, NULL)', [nomeMarca, modello])
      res.status(201).json({ modello: { id: risultato.insertId, marca: nomeMarca, modello, anno_da: null, anno_a: null } })
    } catch (errore) { next(errore) }
  })

  router.get('/colori', async (req, res, next) => {
    try {
      const [righe] = await pool.execute('SELECT id, nome FROM colori ORDER BY nome')
      res.json({ colori: righe })
    } catch (errore) { next(errore) }
  })

  router.post('/colori', async (req, res, next) => {
    try {
      const nome = typeof req.body.nome === 'string' ? req.body.nome.trim() : ''
      if (!testoValido(nome, 80)) return res.status(400).json({ errore: 'Il colore è obbligatorio (massimo 80 caratteri).' })
      const [esistenti] = await pool.execute('SELECT id, nome FROM colori WHERE LOWER(nome) = LOWER(?) LIMIT 1', [nome])
      if (esistenti.length) return res.status(409).json({ errore: 'Questo colore è già presente.', colore: esistenti[0] })
      const [risultato] = await pool.execute('INSERT INTO colori (nome) VALUES (?)', [nome])
      res.status(201).json({ colore: { id: risultato.insertId, nome } })
    } catch (errore) { next(errore) }
  })

  router.get('/veicoli', async (req, res, next) => {
    try {
      const [veicoli] = await pool.execute('SELECT id, marca, modello, anno_da, anno_a FROM veicoli ORDER BY marca, modello, anno_da')
      res.json({ veicoli })
    } catch (errore) { next(errore) }
  })

  router.post('/veicoli', async (req, res, next) => {
    try {
      const { marca, modello, anno_da: annoDa, anno_a: annoA } = req.body
      const nomeMarca = typeof marca === 'string' ? marca.trim() : ''
      const nomeModello = typeof modello === 'string' ? modello.trim() : ''
      if (!testoValido(nomeMarca, 80) || !testoValido(nomeModello, 100)) {
        return res.status(400).json({ errore: 'Marca e modello sono obbligatori e devono rispettare la lunghezza consentita.' })
      }
      const primoAnno = annoDa === undefined || annoDa === null || annoDa === '' ? null : Number(annoDa)
      const ultimoAnno = annoA === undefined || annoA === null || annoA === '' ? null : Number(annoA)
      if ((primoAnno !== null && (!Number.isInteger(primoAnno) || primoAnno < 1950 || primoAnno > 2100)) ||
          (ultimoAnno !== null && (!Number.isInteger(ultimoAnno) || ultimoAnno < 1950 || ultimoAnno > 2100)) ||
          (primoAnno !== null && ultimoAnno !== null && primoAnno > ultimoAnno)) {
        return res.status(400).json({ errore: 'Intervallo anni non valido.' })
      }
      const [doppioni] = await pool.execute('SELECT id FROM veicoli WHERE LOWER(marca) = LOWER(?) AND LOWER(modello) = LOWER(?) LIMIT 1', [nomeMarca, nomeModello])
      if (doppioni.length) return res.status(409).json({ errore: 'Questo modello è già presente per la marca selezionata.' })
      const [marcheEsistenti] = await pool.execute('SELECT nome FROM marche WHERE LOWER(nome) = LOWER(?) LIMIT 1', [nomeMarca])
      const marcaFinale = marcheEsistenti[0]?.nome || nomeMarca
      if (!marcheEsistenti.length) await pool.execute('INSERT INTO marche (nome) VALUES (?)', [marcaFinale])
      const [risultato] = await pool.execute('INSERT INTO veicoli (marca, modello, anno_da, anno_a) VALUES (?, ?, ?, ?)', [marcaFinale, nomeModello, primoAnno, ultimoAnno])
      res.status(201).json({ id: risultato.insertId, marca: marcaFinale, modello: nomeModello, anno_da: primoAnno, anno_a: ultimoAnno })
    } catch (errore) { next(errore) }
  })

  router.get('/tipologie', async (req, res, next) => {
    try {
      const [tipologie] = await pool.execute('SELECT id, nome, tipo_codice FROM tipologie_pezzo ORDER BY nome')
      res.json({ tipologie })
    } catch (errore) { next(errore) }
  })

  router.post('/tipologie', async (req, res, next) => {
    try {
      const nome = typeof req.body.nome === 'string' ? req.body.nome.trim() : ''
      if (!nome || nome.length > 120) return res.status(400).json({ errore: 'Il nome della tipologia è obbligatorio (massimo 120 caratteri).' })
      const [esistenti] = await pool.execute('SELECT id, nome FROM tipologie_pezzo WHERE LOWER(nome) = LOWER(?) LIMIT 1', [nome])
      if (esistenti.length) return res.status(409).json({ errore: 'Questa tipologia è già presente.', tipologia: esistenti[0] })
      const [risultato] = await pool.execute('INSERT INTO tipologie_pezzo (nome) VALUES (?)', [nome])
      res.status(201).json({ id: risultato.insertId, nome })
    } catch (errore) { next(errore) }
  })

  router.get('/filtri', async (req, res, next) => {
    try {
      const [marche] = await pool.execute('SELECT DISTINCT marca FROM veicoli ORDER BY marca')
      const [modelli] = await pool.execute('SELECT DISTINCT marca, modello FROM veicoli ORDER BY marca, modello')
      const [colori] = await pool.execute('SELECT DISTINCT colore FROM pezzi ORDER BY colore')
      const [tipologie] = await pool.execute('SELECT id, nome FROM tipologie_pezzo ORDER BY nome')
      const [codiciOem] = await pool.execute('SELECT DISTINCT codice_oem FROM pezzi WHERE codice_oem IS NOT NULL AND codice_oem <> \'\' ORDER BY codice_oem')
      const [sigleMotore] = await pool.execute('SELECT DISTINCT sigla_motore FROM pezzi WHERE sigla_motore IS NOT NULL AND sigla_motore <> \'\' ORDER BY sigla_motore')
      const [matricoleMotore] = await pool.execute('SELECT DISTINCT matricola_motore FROM pezzi WHERE matricola_motore IS NOT NULL AND matricola_motore <> \'\' ORDER BY matricola_motore')
      res.json({
        marche: marche.map(riga => riga.marca),
        modelli: modelli.map(riga => ({ marca: riga.marca, modello: riga.modello })),
        colori: colori.map(riga => riga.colore),
        tipologie,
        codici_oem: codiciOem.map(riga => riga.codice_oem),
        sigle_motore: sigleMotore.map(riga => riga.sigla_motore),
        matricole_motore: matricoleMotore.map(riga => riga.matricola_motore),
      })
    } catch (errore) { next(errore) }
  })

  return router
}
