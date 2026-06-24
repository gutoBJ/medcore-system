const express = require('express')
const cors = require('cors')
require('dotenv').config()

const router = require('./routes')
require('./app/db')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: '*' // permite qualquer origem — ok para trabalho acadêmico
}))
app.use(express.json())

app.use('/api', router)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})