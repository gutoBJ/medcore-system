const repository = require("../repository/atendimentoRepository")

const listarTodos = async () => {
  return await repository.findAll()
}

const buscarPorId = async (id) => {
  const atendimento = await repository.findById(id)
  if (!atendimento) throw new Error('Atendimento não encontrado')
  return atendimento
}

const filtrarPorData = async (data) => {
  if (!data) throw new Error('Data é obrigatória')
  return await repository.findByData(data)
}

const criar = async (dados) => {
  if (!dados.tipo) throw new Error('O campo tipo é obrigatório')
  return await repository.create(dados)
}

const atualizar = async (id, dados) => {
  await buscarPorId(id) // já valida se existe
  if (!dados.tipo) throw new Error('O campo tipo é obrigatório')
  return await repository.update(id, dados)
}

const remover = async (id) => {
  await buscarPorId(id) // já valida se existe
  await repository.remove(id)
}

module.exports = { listarTodos, buscarPorId, filtrarPorData, criar, atualizar, remover }