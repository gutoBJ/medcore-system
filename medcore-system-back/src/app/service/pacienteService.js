const repository = require('../repository/pacienteRepository')

const listarTodos = async () => {
  return await repository.findAll()
}

const buscarPorId = async (id) => {
  const paciente = await repository.findById(id)
  if (!paciente) throw new Error('Paciente não encontrado')
  return paciente
}

const criar = async (dados) => {
  if (!dados.nome_completo) throw new Error('O campo nome_completo é obrigatório')
  if (!dados.cpf) throw new Error('O campo CPF é obrigatório')

  const existente = await repository.findByCpf(dados.cpf)
  if (existente) throw new Error('Já existe um paciente cadastrado com esse CPF')

  return await repository.create(dados)
}

const atualizar = async (id, dados) => {
  await buscarPorId(id)
  if (!dados.nome_completo) throw new Error('O campo nome_completo é obrigatório')
  if (!dados.cpf) throw new Error('O campo CPF é obrigatório')

  const existente = await repository.findByCpf(dados.cpf)
  if (existente && existente.id !== Number(id)) throw new Error('Já existe um paciente cadastrado com esse CPF')

  return await repository.update(id, dados)
}

const remover = async (id) => {
  await buscarPorId(id)
  await repository.remove(id)
}

module.exports = { listarTodos, buscarPorId, criar, atualizar, remover }