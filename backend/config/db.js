// Pool condiviso: consente al server di riutilizzare le connessioni MySQL.
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  decimalNumbers: true,
})

module.exports = pool
