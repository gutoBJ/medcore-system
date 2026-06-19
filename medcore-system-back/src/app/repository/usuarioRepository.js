const pool = require('../db')

const findByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email])
  return result.rows[0]
}

const create = async ({ nome, email, senha }) => {
  const result = await pool.query(
    'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email',
    [nome, email, senha]
  )
  return result.rows[0]
}

module.exports = { findByEmail, create }