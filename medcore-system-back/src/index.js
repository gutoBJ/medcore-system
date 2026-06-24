const express = require('express')
const cors = require('cors')
require('dotenv').config()

const router = require('./routes')
require('./app/db')

const app = express()
const PORT = process.env.PORT || 3000

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

app.use(cors())
app.use(express.json())

app.use('/api', router)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})