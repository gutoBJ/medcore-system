const repository = require('../repository/profissionalRepository')
const especialidadeRepository = require('../repository/especialidadeRepository')

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
  if (!dados.registro) throw new Error('O campo registro é obrigatório')

  if (dados.especialidade_id) {
    const especialidade = await especialidadeRepository.findById(dados.especialidade_id)
    if (!especialidade) throw new Error('Especialidade não encontrada')
  }

  return await repository.create(dados)
}

const atualizar = async (id, dados) => {
  await buscarPorId(id)
  if (!dados.nome) throw new Error('O campo nome é obrigatório')
  if (!dados.registro) throw new Error('O campo registro é obrigatório')

  if (dados.especialidade_id) {
    const especialidade = await especialidadeRepository.findById(dados.especialidade_id)
    if (!especialidade) throw new Error('Especialidade não encontrada')
  }

  return await repository.update(id, dados)
}

const remover = async (id) => {
  await buscarPorId(id)
  await repository.remove(id)
}

module.exports = { listarTodos, buscarPorId, criar, atualizar, remover }