const repository = require('../repository/especialidadeRepository')

const listarTodas = async () => {
  return await repository.findAll()
}

const buscarPorId = async (id) => {
  const especialidade = await repository.findById(id)
  if (!especialidade) throw new Error('Especialidade não encontrada')
  return especialidade
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

module.exports = { listarTodas, buscarPorId, criar, atualizar, remover }