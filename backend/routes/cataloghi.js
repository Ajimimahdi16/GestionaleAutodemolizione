const express = require('express')
const { richiediAccesso } = require('../middleware/autenticazione')

const router = express.Router()

module.exports = pool => {
  router.use(richiediAccesso(pool))

  router.get('/veicoli', async (req, res, next) => {
    try {
      const [veicoli] = await pool.execute('SELECT id, marca, modello, anno_da, anno_a FROM veicoli ORDER BY marca, modello, anno_da')
      res.json({ veicoli })
    } catch (errore) { next(errore) }
  })

  router.post('/veicoli', async (req, res, next) => {
    try {
      const { marca, modello, anno_da: annoDa, anno_a: annoA } = req.body
      const primoAnno = Number(annoDa)
      const ultimoAnno = Number(annoA)
      if (typeof marca !== 'string' || !marca.trim() || marca.trim().length > 80 || typeof modello !== 'string' || !modello.trim() || modello.trim().length > 100) {
        return res.status(400).json({ errore: 'Marca e modello sono obbligatori e devono rispettare la lunghezza consentita.' })
      }
      if (!Number.isInteger(primoAnno) || !Number.isInteger(ultimoAnno) || primoAnno < 1950 || ultimoAnno > 2100 || primoAnno > ultimoAnno) {
        return res.status(400).json({ errore: 'Intervallo anni non valido.' })
      }
      const [risultato] = await pool.execute('INSERT INTO veicoli (marca, modello, anno_da, anno_a) VALUES (?, ?, ?, ?)', [marca.trim(), modello.trim(), primoAnno, ultimoAnno])
      res.status(201).json({ id: risultato.insertId, marca: marca.trim(), modello: modello.trim(), anno_da: primoAnno, anno_a: ultimoAnno })
    } catch (errore) { next(errore) }
  })

  router.get('/tipologie', async (req, res, next) => {
    try {
      const [tipologie] = await pool.execute('SELECT id, nome FROM tipologie_pezzo ORDER BY nome')
      res.json({ tipologie })
    } catch (errore) { next(errore) }
  })

  router.post('/tipologie', async (req, res, next) => {
    try {
      const nome = typeof req.body.nome === 'string' ? req.body.nome.trim() : ''
      if (!nome || nome.length > 120) return res.status(400).json({ errore: 'Il nome della tipologia è obbligatorio (massimo 120 caratteri).' })
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
      res.json({
        marche: marche.map(riga => riga.marca),
        modelli: modelli.map(riga => ({ marca: riga.marca, modello: riga.modello })),
        colori: colori.map(riga => riga.colore),
        tipologie,
      })
    } catch (errore) { next(errore) }
  })

  return router
}
