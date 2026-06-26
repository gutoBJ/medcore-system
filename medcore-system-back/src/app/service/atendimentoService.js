const repository = require("../repository/atendimentoRepository")
const pacienteRepository = require("../repository/pacienteRepository")
const profissionalRepository = require("../repository/profissionalRepository")

const tiposValidos = ['Consulta', 'Exame', 'Internacao', 'Internação']
const statusValidos = ['Agendado', 'Em andamento', 'Concluido', 'Concluído', 'Cancelado']

const profissionalDoUsuario = (usuario) => {
  if (usuario?.perfil === 'ADMIN') return null
  if (usuario?.perfil === 'DENTISTA' && usuario.profissional_id) return usuario.profissional_id
  return -1
}

const validarAcessoAoAtendimento = (atendimento, usuario) => {
  if (usuario?.perfil === 'ADMIN') return
  if (usuario?.perfil === 'DENTISTA' && Number(atendimento.profissional_id) === Number(usuario.profissional_id)) return
  throw new Error('Voce nao tem permissao para acessar este atendimento')
}

const validarHorario = async (dados, idIgnorado) => {
  if (!dados.data_hora) throw new Error('Data/hora inicial e obrigatoria')
  if (!dados.data_hora_fim) throw new Error('Data/hora final e obrigatoria')

  const inicio = new Date(dados.data_hora)
  const fim = new Date(dados.data_hora_fim)
  const agora = new Date()

  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) {
    throw new Error('Data/hora invalida')
  }

  if (inicio < agora) throw new Error('Nao e permitido agendar em datas passadas')
  if (fim <= inicio) throw new Error('O horario final deve ser apos o horario inicial')

  const conflito = await repository.hasConflitoHorario({
    profissional_id: dados.profissional_id,
    data_hora: dados.data_hora,
    data_hora_fim: dados.data_hora_fim,
    idIgnorado
  })

  if (conflito) throw new Error('Ja existe atendimento para este dentista neste horario')
}

const validarDados = async (dados, idIgnorado) => {
  if (!dados.paciente_id) throw new Error('Paciente e obrigatorio')
  if (!dados.profissional_id) throw new Error('Profissional e obrigatorio')
  if (!dados.tipo) throw new Error('O campo tipo e obrigatorio')
  if (!tiposValidos.includes(dados.tipo)) throw new Error(`Tipo invalido. Use: ${tiposValidos.join(', ')}`)
  if (dados.status && !statusValidos.includes(dados.status)) throw new Error(`Status invalido. Use: ${statusValidos.join(', ')}`)
  if (dados.status === 'Cancelado' && !dados.motivo_cancelamento?.trim()) {
    throw new Error('Motivo do cancelamento e obrigatorio')
  }

  const paciente = await pacienteRepository.findById(dados.paciente_id)
  if (!paciente) throw new Error('Paciente nao encontrado')

  const profissional = await profissionalRepository.findById(dados.profissional_id)
  if (!profissional) throw new Error('Profissional nao encontrado')

  await validarHorario(dados, idIgnorado)
}

const listarTodos = async (usuario) => {
  return await repository.findAll({ profissionalId: profissionalDoUsuario(usuario) })
}

const buscarPorId = async (id, usuario) => {
  const atendimento = await repository.findById(id)
  if (!atendimento) throw new Error('Atendimento nao encontrado')
  validarAcessoAoAtendimento(atendimento, usuario)
  return atendimento
}

const filtrarPorData = async (data, usuario) => {
  if (!data) throw new Error('Data e obrigatoria')
  return await repository.findByData(data, { profissionalId: profissionalDoUsuario(usuario) })
}

const criar = async (dados, usuario) => {
  if (usuario?.perfil === 'DENTISTA') {
    dados.profissional_id = usuario.profissional_id
  }

  await validarDados(dados)
  return await repository.create(dados)
}

const atualizar = async (id, dados, usuario) => {
  const atendimento = await buscarPorId(id, usuario)

  if (usuario?.perfil === 'DENTISTA') {
    dados.profissional_id = atendimento.profissional_id
  }

  await validarDados(dados, id)
  return await repository.update(id, dados)
}

const remover = async (id, usuario) => {
  await buscarPorId(id, usuario)
  await repository.remove(id)
}

module.exports = { listarTodos, buscarPorId, filtrarPorData, criar, atualizar, remover }
