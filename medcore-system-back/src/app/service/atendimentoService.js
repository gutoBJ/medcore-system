const repository = require("../repository/atendimentoRepository")

const listarTodos = async () => {
  return await repository.findAll()
}

const buscarPorId = async (id) => {
  const profissional = await repository.findById(id)
  if (!profissional) throw new Error('Atendimento não encontrado')
  return profissional
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

module.exports = { listarTodos, buscarPorId, criar, atualizar, remover }