const pool = require("../db")

const findAll = async () => {
  const result = await pool.query(`
    SELECT atendimentos.*, 
           pacientes.nome_completo AS paciente_nome,
           profissionais.nome AS profissional_nome
    FROM atendimentos
    INNER JOIN pacientes ON pacientes.id = atendimentos.paciente_id
    INNER JOIN profissionais ON profissionais.id = atendimentos.profissional_id
    ORDER BY atendimentos.id
  `)
  return result.rows
}

const findById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM atendimentos WHERE id = $1", [id]
  )
  return result.rows[0]
}

const findByData = async (data) => {
  const result = await pool.query(
    `SELECT atendimentos.*, 
            pacientes.nome_completo AS paciente_nome,
            profissionais.nome AS profissional_nome
     FROM atendimentos
     INNER JOIN pacientes ON pacientes.id = atendimentos.paciente_id
     INNER JOIN profissionais ON profissionais.id = atendimentos.profissional_id
     WHERE DATE(atendimentos.data_hora) = $1
     ORDER BY atendimentos.data_hora`,
    [data]
  )
  return result.rows
}

const create = async ({ paciente_id, profissional_id, data_hora, tipo, status, diagnostico, observacoes, valor }) => {
  const result = await pool.query(
    `INSERT INTO atendimentos 
      (paciente_id, profissional_id, data_hora, tipo, status, diagnostico, observacoes, valor) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
     RETURNING *`,
    [paciente_id, profissional_id, data_hora, tipo, status, diagnostico, observacoes, valor]
  )
  return result.rows[0]
}

const update = async (id, { paciente_id, profissional_id, data_hora, tipo, status, diagnostico, observacoes, valor }) => {
  const result = await pool.query(
    `UPDATE atendimentos 
     SET paciente_id=$1, profissional_id=$2, data_hora=$3, tipo=$4, 
         status=$5, diagnostico=$6, observacoes=$7, valor=$8 
     WHERE id=$9 
     RETURNING *`,
    [paciente_id, profissional_id, data_hora, tipo, status, diagnostico, observacoes, valor, id]
  )
  return result.rows[0]
}

const remove = async (id) => {
  await pool.query("DELETE FROM atendimentos WHERE id = $1", [id])
}

module.exports = { findAll, findById, findByData, create, update, remove }