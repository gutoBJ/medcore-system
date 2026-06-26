const pool = require("../db")

const selectProfissionais = `
  SELECT p.*,
         COALESCE(
           array_remove(array_agg(e.id ORDER BY e.nome), NULL),
           ARRAY[]::integer[]
         ) AS especialidade_ids,
         COALESCE(
           string_agg(e.nome, ', ' ORDER BY e.nome),
           ''
         ) AS especialidades_nomes
    FROM profissionais p
    LEFT JOIN profissional_especialidades pe ON pe.profissional_id = p.id
    LEFT JOIN especialidades e ON e.id = pe.especialidade_id
`

const normalizarEspecialidades = ({ especialidade_ids, especialidade_id }) => {
  if (Array.isArray(especialidade_ids)) return especialidade_ids.filter(Boolean)
  if (especialidade_id) return [especialidade_id]
  return []
}

const salvarEspecialidades = async (client, profissionalId, especialidadeIds) => {
  await client.query('DELETE FROM profissional_especialidades WHERE profissional_id = $1', [profissionalId])

  for (const especialidadeId of especialidadeIds) {
    await client.query(
      'INSERT INTO profissional_especialidades (profissional_id, especialidade_id) VALUES ($1, $2)',
      [profissionalId, especialidadeId]
    )
  }
}

const findAll = async () => {
  const result = await pool.query(`
    ${selectProfissionais}
    GROUP BY p.id
    ORDER BY p.id
  `)
  return result.rows
}

const findById = async (id) => {
  const result = await pool.query(`
    ${selectProfissionais}
    WHERE p.id = $1
    GROUP BY p.id
  `, [id])
  return result.rows[0]
}

const create = async (dados) => {
  const { nome, registro, cargo, turno, telefone, email, ativo } = dados
  const especialidadeIds = normalizarEspecialidades(dados)
  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    const result = await client.query(
      `INSERT INTO profissionais (nome, registro, cargo, turno, telefone, email, ativo)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [nome, registro, cargo, turno, telefone, email, ativo]
    )

    await salvarEspecialidades(client, result.rows[0].id, especialidadeIds)
    await client.query('COMMIT')
    return await findById(result.rows[0].id)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const update = async (id, dados) => {
  const { nome, registro, cargo, turno, telefone, email, ativo } = dados
  const especialidadeIds = normalizarEspecialidades(dados)
  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    await client.query(
      `UPDATE profissionais
          SET nome=$1, registro=$2, cargo=$3, turno=$4, telefone=$5, email=$6, ativo=$7
        WHERE id = $8`,
      [nome, registro, cargo, turno, telefone, email, ativo, id]
    )

    await salvarEspecialidades(client, id, especialidadeIds)
    await client.query('COMMIT')
    return await findById(id)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const remove = async (id) => {
  await pool.query("delete from profissionais where id = $1", [id])
}

module.exports = { findAll, findById, create, update, remove }
