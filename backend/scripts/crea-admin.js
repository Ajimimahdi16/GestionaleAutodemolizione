// Crea il primo account amministratore senza scrivere password nel codice.
// Richiede le dipendenze dotenv, mysql2 e bcrypt e il file .env nella cartella principale.
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

const mysql = require('mysql2/promise')
const bcrypt = require('bcrypt')
const readline = require('readline')

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 2,
  charset: 'utf8mb4',
})

function chiedi(testo) {
  const interfaccia = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => interfaccia.question(testo, risposta => {
    interfaccia.close()
    resolve(risposta.trim())
  }))
}

// Legge la password senza mostrarla a schermo; gli asterischi indicano i caratteri digitati.
function chiediPasswordNascosta(testo) {
  const ingresso = process.stdin
  if (!ingresso.isTTY || typeof ingresso.setRawMode !== 'function') {
    return Promise.reject(new Error('Avvia lo script da un terminale interattivo per inserire la password in modo sicuro.'))
  }

  return new Promise((resolve, reject) => {
    let password = ''
    process.stdout.write(testo)
    readline.emitKeypressEvents(ingresso)
    ingresso.setRawMode(true)
    ingresso.resume()

    const ripristina = () => {
      ingresso.removeListener('keypress', leggiTasto)
      ingresso.setRawMode(false)
      process.stdout.write('\n')
    }

    const leggiTasto = (carattere, tasto) => {
      if (tasto && tasto.ctrl && tasto.name === 'c') {
        ripristina()
        reject(new Error('Operazione annullata.'))
        return
      }
      if (tasto && (tasto.name === 'return' || tasto.name === 'enter')) {
        ripristina()
        resolve(password)
        return
      }
      if (tasto && tasto.name === 'backspace') {
        if (password.length > 0) {
          password = password.slice(0, -1)
          process.stdout.write('\b \b')
        }
        return
      }
      if (carattere && !tasto.ctrl && !tasto.meta && carattere >= ' ') {
        password += carattere
        process.stdout.write('*')
      }
    }

    ingresso.on('keypress', leggiTasto)
  })
}

async function creaAmministratore() {
  if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
    throw new Error('Configurazione database incompleta: controlla il file .env nella cartella principale.')
  }

  const username = await chiedi('Nome utente amministratore: ')
  const nome = await chiedi('Nome e cognome: ')
  const password = await chiediPasswordNascosta('Scegli una password (almeno 10 caratteri): ')
  const conferma = await chiediPasswordNascosta('Ripeti la password: ')

  if (!username || !nome) throw new Error('Nome utente e nome e cognome sono obbligatori.')
  if (password.length < 10) throw new Error('La password deve contenere almeno 10 caratteri.')
  if (password !== conferma) throw new Error('Le due password non coincidono.')

  const passwordHash = await bcrypt.hash(password, 12)
  await pool.execute(
    'INSERT INTO utenti (username, password_hash, nome, ruolo, attivo) VALUES (?, ?, ?, ?, ?)',
    [username, passwordHash, nome, 'admin', true],
  )
  console.log(`Account amministratore "${username}" creato correttamente.`)
}

creaAmministratore()
  .catch(errore => {
    // Non mostriamo dettagli di connessione o informazioni sensibili.
    console.error(`Impossibile creare l'amministratore: ${errore.message}`)
    process.exitCode = 1
  })
  .finally(async () => {
    await pool.end()
  })
