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

// 1. Buscar todos os usuários do sistema
const findAll = async () => {
  const result = await pool.query(
    'SELECT id, nome, email, perfil, profissional_id FROM usuarios ORDER BY nome ASC'
  )
  return result.rows
}

// 2. Buscar um usuário específico pelo ID
const findById = async (id) => {
  const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id])
  return result.rows[0]
}

// 3. Atualizar dados do usuário dinamicamente
const update = async (id, { nome, email, senha, perfil, profissional_id }) => {
  if (senha) {
    const result = await pool.query(
      'UPDATE usuarios SET nome = $1, email = $2, senha = $3, perfil = $4, profissional_id = $5 WHERE id = $6 RETURNING id, nome, email, perfil, profissional_id',
      [nome, email, senha, perfil, profissional_id || null, id]
    )
    return result.rows[0]
  } else {
    const result = await pool.query(
      'UPDATE usuarios SET nome = $1, email = $2, perfil = $3, profissional_id = $4 WHERE id = $5 RETURNING id, nome, email, perfil, profissional_id',
      [nome, email, perfil, profesional_id || null, id]
    )
    return result.rows[0]
  }
}

// 4. Deletar um usuário do sistema
const deleteUser = async (id) => {
  await pool.query('DELETE FROM usuarios WHERE id = $1', [id])
  return true
}

// Mudança no nome de exportação de delete para "delete" funcionar como palavra-chave
module.exports = { findByEmail, create, findAll, findById, update, delete: deleteUser }
