const jwt = require('jsonwebtoken')

// Verifica cookie firmato e ricarica ruolo/attivazione dal database.
function richiediAccesso(pool) {
  return async (req, res, next) => {
    const token = req.cookies && req.cookies.sessione
    if (!token) return res.status(401).json({ errore: 'Accedi per continuare.' })

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      const [utenti] = await pool.execute(
        'SELECT id, username, nome, ruolo, attivo FROM utenti WHERE id = ? LIMIT 1',
        [payload.id],
      )
      const utente = utenti[0]
      if (!utente || !utente.attivo) return res.status(401).json({ errore: 'Sessione non valida. Accedi di nuovo.' })
      req.utente = utente
      next()
    } catch (errore) {
      if (errore.name === 'JsonWebTokenError' || errore.name === 'TokenExpiredError') {
        return res.status(401).json({ errore: 'Sessione scaduta o non valida. Accedi di nuovo.' })
      }
      next(errore)
    }
  }
}

function soloAdmin(req, res, next) {
  if (req.utente.ruolo !== 'admin') return res.status(403).json({ errore: 'Questa operazione è riservata all’amministratore.' })
  next()
}

module.exports = { richiediAccesso, soloAdmin }
