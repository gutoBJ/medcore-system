const pool = require('../db')

const findAll = async () => {
  const result = await pool.query('SELECT * FROM especialidades ORDER BY id')
  return result.rows
}

const findById = async (id) => {
  const result = await pool.query('SELECT * FROM especialidades WHERE id = $1', [id])
  return result.rows[0]
}

const create = async ({ nome, descricao, area }) => {
  const result = await pool.query(
    'INSERT INTO especialidades (nome, descricao, area) VALUES ($1, $2, $3) RETURNING *',
    [nome, descricao, area]
  )
  return result.rows[0]
}

const update = async (id, { nome, descricao, area }) => {
  const result = await pool.query(
    'UPDATE especialidades SET nome=$1, descricao=$2, area=$3 WHERE id=$4 RETURNING *',
    [nome, descricao, area, id]
  )
  return result.rows[0]
}

const remove = async (id) => {
  await pool.query('DELETE FROM especialidades WHERE id = $1', [id])
}

module.exports = { findAll, findById, create, update, remove }