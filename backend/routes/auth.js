const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { rateLimit } = require('express-rate-limit')
const { richiediAccesso } = require('../middleware/autenticazione')

const router = express.Router()

const limiteLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { errore: 'Troppi tentativi di accesso. Riprova tra 15 minuti.' },
})

function opzioniCookie() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    // In ufficio si usa HTTP locale; abilitarlo solo dopo aver configurato HTTPS.
    secure: process.env.COOKIE_SECURE === 'true',
    maxAge: 8 * 60 * 60 * 1000,
    path: '/',
  }
}

module.exports = pool => {
  router.post('/login', limiteLogin, async (req, res, next) => {
    try {
      const username = typeof req.body.username === 'string' ? req.body.username.trim() : ''
      const password = typeof req.body.password === 'string' ? req.body.password : ''
      if (!username || !password) return res.status(400).json({ errore: 'Inserisci nome utente e password.' })

      const [righe] = await pool.execute(
        'SELECT id, username, password_hash, nome, ruolo, attivo FROM utenti WHERE username = ? LIMIT 1',
        [username],
      )
      const utente = righe[0]
      const passwordCorretta = utente && await bcrypt.compare(password, utente.password_hash)
      if (!utente || !utente.attivo || !passwordCorretta) {
        return res.status(401).json({ errore: 'Nome utente o password non corretti.' })
      }
      if (!process.env.JWT_SECRET) throw new Error('Configurazione sessione non disponibile.')

      const token = jwt.sign({ id: utente.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_DURATA || '8h',
      })
      res.cookie('sessione', token, opzioniCookie())
      res.json({ utente: { id: utente.id, username: utente.username, nome: utente.nome, ruolo: utente.ruolo } })
    } catch (errore) {
      next(errore)
    }
  })

  router.post('/logout', richiediAccesso(pool), (req, res) => {
    res.clearCookie('sessione', { httpOnly: true, sameSite: 'lax', secure: process.env.COOKIE_SECURE === 'true', path: '/' })
    res.json({ messaggio: 'Sei uscito correttamente.' })
  })

  router.get('/me', richiediAccesso(pool), (req, res) => {
    res.json({ utente: req.utente })
  })

  return router
}
