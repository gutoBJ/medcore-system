const service = require("../service/atendimentoService")

const listarTodos = async (req, res) => {
  try {
    const dados = await service.listarTodos()
    res.json(dados)
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
}

const buscarPorId = async (req, res) => {
  try {
    const dados = await service.buscarPorId(req.params.id)
    res.json(dados)
  } catch (error) {
    res.status(404).json({ erro: error.message })
  }
}

const filtrarPorData = async (req, res) => {
  try {
    const dados = await service.filtrarPorData(req.query.data)
    res.json(dados)
  } catch (error) {
    res.status(400).json({ erro: error.message })
  }
}

const criar = async (req, res) => {
  try {
    const dados = await service.criar(req.body)
    res.status(201).json(dados)
  } catch (error) {
    res.status(400).json({ erro: error.message })
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
    await service.remover(req.params.id)
    res.status(204).send()
  } catch (error) {
    res.status(404).json({ erro: error.message })
  }
}

module.exports = { listarTodos, buscarPorId, filtrarPorData, criar, atualizar, remover }