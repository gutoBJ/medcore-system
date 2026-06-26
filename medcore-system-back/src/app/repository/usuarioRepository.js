const pool = require('../db')

const findByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email])
  return result.rows[0]
}

const create = async ({ nome, email, senha, perfil, profissional_id }) => {
  const result = await pool.query(
    'INSERT INTO usuarios (nome, email, senha, perfil, profissional_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, email, perfil, profissional_id',
    [nome, email, senha, perfil, profissional_id || null]
  )
  return result.rows[0]
}

module.exports = { findByEmail, create }
