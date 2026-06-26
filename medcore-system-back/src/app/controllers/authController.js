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

const listarTodos = async (req, res) => {
  try {
    const usuarios = await service.listarTodos()
    res.json(usuarios)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

const atualizar = async (req, res) => {
  try {
    const dados = await service.atualizar(req.params.id, req.body)
    res.json(dados)
  } catch (error) {
    res.status(400).json({ erro: error.message })
  }
}

const remover = async (req, res) => {
  try {
    const resultado = await service.remover(req.params.id)
    res.json(resultado)
  } catch (error) {
    res.status(400).json({ erro: error.message })
  }
}

module.exports = { register, login, listarTodos, atualizar, remover }
