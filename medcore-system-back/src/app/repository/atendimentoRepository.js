const pool = require("../db")

const baseSelect = `
  SELECT atendimentos.*,
         pacientes.nome_completo AS paciente_nome,
         profissionais.nome AS profissional_nome
  FROM atendimentos
  INNER JOIN pacientes ON pacientes.id = atendimentos.paciente_id
  INNER JOIN profissionais ON profissionais.id = atendimentos.profissional_id
`

const findAll = async ({ profissionalId } = {}) => {
  const params = []
  let where = ''

  if (profissionalId) {
    params.push(profissionalId)
    where = 'WHERE atendimentos.profissional_id = $1'
  }

  const result = await pool.query(`
    ${baseSelect}
    ${where}
    ORDER BY atendimentos.data_hora
  `, params)

  return result.rows
}

const findById = async (id) => {
  const result = await pool.query(
    `${baseSelect} WHERE atendimentos.id = $1`,
    [id]
  )
  return result.rows[0]
}

const findByData = async (data, { profissionalId } = {}) => {
  const params = [data]
  let filtroProfissional = ''

  if (profissionalId) {
    params.push(profissionalId)
    filtroProfissional = 'AND atendimentos.profissional_id = $2'
  }

  const result = await pool.query(
    `${baseSelect}
     WHERE DATE(atendimentos.data_hora) = $1
       ${filtroProfissional}
     ORDER BY atendimentos.data_hora`,
    params
  )
  return result.rows
}

const hasConflitoHorario = async ({ profissional_id, data_hora, data_hora_fim, idIgnorado }) => {
  const params = [profissional_id, data_hora, data_hora_fim]
  let filtroId = ''

  if (idIgnorado) {
    params.push(idIgnorado)
    filtroId = `AND id <> $${params.length}`
  }

  const result = await pool.query(
    `SELECT 1
       FROM atendimentos
      WHERE profissional_id = $1
        AND COALESCE(status, '') <> 'Cancelado'
        AND data_hora < $3
        AND data_hora_fim > $2
        ${filtroId}
      LIMIT 1`,
    params
  )

  return result.rowCount > 0
}

const create = async ({
  paciente_id,
  profissional_id,
  data_hora,
  data_hora_fim,
  tipo,
  status,
  motivo_cancelamento,
  diagnostico,
  observacoes,
  valor
}) => {
  const result = await pool.query(
    `INSERT INTO atendimentos
      (paciente_id, profissional_id, data_hora, data_hora_fim, tipo, status, motivo_cancelamento, diagnostico, observacoes, valor)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [paciente_id, profissional_id, data_hora, data_hora_fim, tipo, status, motivo_cancelamento, diagnostico, observacoes, valor]
  )
  return result.rows[0]
}

const update = async (id, {
  paciente_id,
  profissional_id,
  data_hora,
  data_hora_fim,
  tipo,
  status,
  motivo_cancelamento,
  diagnostico,
  observacoes,
  valor
}) => {
  const result = await pool.query(
    `UPDATE atendimentos
     SET paciente_id=$1, profissional_id=$2, data_hora=$3, data_hora_fim=$4, tipo=$5,
         status=$6, motivo_cancelamento=$7, diagnostico=$8, observacoes=$9, valor=$10
     WHERE id=$11
     RETURNING *`,
    [paciente_id, profissional_id, data_hora, data_hora_fim, tipo, status, motivo_cancelamento, diagnostico, observacoes, valor, id]
  )
  return result.rows[0]
}

const remove = async (id) => {
  await pool.query("DELETE FROM atendimentos WHERE id = $1", [id])
}

module.exports = { findAll, findById, findByData, hasConflitoHorario, create, update, remove }
