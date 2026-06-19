const pool = require("../db")

const findAll = async () => {
    const result = await pool.query("select * from profissionais order by id")
    return result.rows
}

const findById = async (id) => {
    const result = await pool.query("select * from profissionais where id = $1", [id])
    return result.rows[0]
}

const create =  async ({nome, registro, especialidade_id, cargo, turno, telefone, email, ativo}) => {
    const result = await pool.query("insert into profissionais (nome, registro, especialidade_id, cargo, turno, telefone, email, ativo) values ($1, $2, $3, $4, $5, $6, $7, $8) returning *", [nome, registro, especialidade_id, cargo, turno, telefone, email, ativo])

    return result.rows[0]
}

const update = async (id, {nome, registro, especialidade_id, cargo, turno, telefone, email, ativo}) => {
    const result = await pool.query("update profissionais set nome=$1, registro=$2, especialidade_id=$3, cargo=$4, turno=$5, telefone=$6, email=$7, ativo=$8 where id = $9 returning *", [nome, registro, especialidade_id, cargo, turno, telefone, email, ativo, id])

    return result.rows[0]
}

const remove = async (id) => {
    await pool.query("delete from profissionais where id = $1", [id])
}

module.exports = { findAll, findById, create, update, remove }