const repository = require('../repository/atendimentoRepository')
const pacienteRepository = require('../repository/pacienteRepository')
const profissionalRepository = require('../repository/profissionalRepository')

const tiposValidos = ['Consulta', 'Exame', 'Internação']
const statusValidos = ['Agendado', 'Em andamento', 'Concluído', 'Cancelado']

const listarTodos = async () => {
  return await repository.findAll()
}

const buscarPorId = async (id) => {
  const atendimento = await repository.findById(id)
  if (!atendimento) throw new Error('Atendimento não encontrado')
  return atendimento
}

const criar = async (dados) => {
  if (!dados.paciente_id) throw new Error('O campo paciente_id é obrigatório')
  if (!dados.profissional_id) throw new Error('O campo profissional_id é obrigatório')
  if (!dados.data_hora) throw new Error('O campo data_hora é obrigatório')
  if (!dados.tipo) throw new Error('O campo tipo é obrigatório')

  if (!tiposValidos.includes(dados.tipo))
    throw new Error(`Tipo inválido. Use: ${tiposValidos.join(', ')}`)

  if (dados.status && !statusValidos.includes(dados.status))
    throw new Error(`Status inválido. Use: ${statusValidos.join(', ')}`)

  const paciente = await pacienteRepository.findById(dados.paciente_id)
  if (!paciente) throw new Error('Paciente não encontrado')

  const profissional = await profissionalRepository.findById(dados.profissional_id)
  if (!profissional) throw new Error('Profissional não encontrado')

  return await repository.create(dados)
}

const atualizar = async (id, dados) => {
  await buscarPorId(id)
  if (!dados.tipo) throw new Error('O campo tipo é obrigatório')

  if (!tiposValidos.includes(dados.tipo))
    throw new Error(`Tipo inválido. Use: ${tiposValidos.join(', ')}`)

  if (dados.status && !statusValidos.includes(dados.status))
    throw new Error(`Status inválido. Use: ${statusValidos.join(', ')}`)

  if (dados.paciente_id) {
    const paciente = await pacienteRepository.findById(dados.paciente_id)
    if (!paciente) throw new Error('Paciente não encontrado')
  }

  if (dados.profissional_id) {
    const profissional = await profissionalRepository.findById(dados.profissional_id)
    if (!profissional) throw new Error('Profissional não encontrado')
  }

  return await repository.update(id, dados)
}

const remover = async (id) => {
  await buscarPorId(id)
  await repository.remove(id)
}

const filtrarPorData = async (data) => {
  if (!data) throw new Error('Data é obrigatória')
  return await repository.findByData(data)
}

module.exports = { listarTodos, buscarPorId, criar, atualizar, remover, filtrarPorData }