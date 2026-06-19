const repository = require("../repository/profissionalRepository")

const listarTodos = async () => {
  return await repository.findAll()
}

const buscarPorId = async (id) => {
  const profissional = await repository.findById(id)
  if (!profissional) throw new Error('Profissional não encontrado')
  return profissional
}

const criar = async (dados) => {
  if (!dados.nome) throw new Error('O campo nome é obrigatório')
  return await repository.create(dados)
}

const atualizar = async (id, dados) => {
  await buscarPorId(id) // já valida se existe
  if (!dados.nome) throw new Error('O campo nome é obrigatório')
  return await repository.update(id, dados)
}

const remover = async (id) => {
  await buscarPorId(id) // já valida se existe
  await repository.remove(id)
}

module.exports = { listarTodos, buscarPorId, criar, atualizar, remover }