const express = require('express')
const cors = require('cors')
require('dotenv').config()

const router = require('./routes')
require('./app/db') // inicializa a conexão ao subir o servidor

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api', router)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})