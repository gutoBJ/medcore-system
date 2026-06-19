const service = require('../service/authService')

const register = async (req, res) => {
  try {
    const dados = await service.register(req.body)
    res.status(201).json(dados)
  } catch (error) {
    res.status(400).json({ erro: error.message })
  }
}

const login = async (req, res) => {
  try {
    const dados = await service.login(req.body)
    res.json(dados)
  } catch (error) {
    res.status(401).json({ erro: error.message })
  }
}

module.exports = { register, login }