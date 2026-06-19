const repository = require("../repository/paciente.Repository")

const listarTodos = async () => {
  return await repository.findAll()
}

const buscarPorId = async (id) => {
  const paciente = await repository.findById(id)
  if (!paciente) throw new Error('Paciente não encontrado')
  return paciente
}

const criar = async (dados) => {
  if (!dados.nome_completo) throw new Error('O campo nome é obrigatório')
  return await repository.create(dados)
}

const atualizar = async (id, dados) => {
  await buscarPorId(id) // já valida se existe
  if (!dados.nome_completo) throw new Error('O campo nome é obrigatório')
  return await repository.update(id, dados)
}

const remover = async (id) => {
  await buscarPorId(id) // já valida se existe
  await repository.remove(id)
}

module.exports = { listarTodos, buscarPorId, criar, atualizar, remover }