const express = require('express')
const fs = require('fs/promises')
const path = require('path')
const { richiediAccesso, soloAdmin } = require('../middleware/autenticazione')

const router = express.Router()
const cartellaUpload = path.resolve(__dirname, '../../', process.env.UPLOAD_DIR || 'backend/uploads')

module.exports = pool => {
  router.use(richiediAccesso(pool), soloAdmin)

  router.delete('/:id', async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      if (!Number.isInteger(id) || id < 1) return res.status(400).json({ errore: 'Identificativo foto non valido.' })
      const [righe] = await pool.execute('SELECT id, nome_file FROM foto_pezzo WHERE id = ? LIMIT 1', [id])
      if (!righe.length) return res.status(404).json({ errore: 'Foto non trovata.' })

      const nomeFile = path.basename(righe[0].nome_file)
      await pool.execute('DELETE FROM foto_pezzo WHERE id = ?', [id])
      await fs.unlink(path.join(cartellaUpload, nomeFile)).catch(errore => {
        if (errore.code !== 'ENOENT') throw errore
      })
      res.json({ messaggio: 'Foto eliminata correttamente.' })
    } catch (errore) { next(errore) }
  })

  return router
}
