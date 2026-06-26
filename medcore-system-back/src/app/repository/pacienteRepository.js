const pool = require("../db")

const findAll = async () => {
    const result = await pool.query("select * from pacientes order by id")
    return result.rows
}

const findById = async (id) => {
    const result = await pool.query("select * from pacientes where id = $1", [id])
    return result.rows[0]
}

const findByCpf = async (cpf) => {
  const result = await pool.query('SELECT * FROM pacientes WHERE cpf = $1', [cpf])
  return result.rows[0]
}

const create =  async ({nome_completo, cpf, data_nascimento, sexo, telefone, email, endereco, convenio, numero_carteirinha}) => {
    const result = await pool.query("insert into pacientes (nome_completo, cpf, data_nascimento, sexo, telefone, email, endereco, convenio, numero_carteirinha) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *", [nome_completo, cpf, data_nascimento, sexo, telefone, email, endereco, convenio, numero_carteirinha])

    return result.rows[0]
}

const update = async (id, {nome_completo, cpf, data_nascimento, sexo, telefone, email, endereco, convenio, numero_carteirinha}) => {
    const result = await pool.query("update pacientes set nome_completo=$1, cpf=$2, data_nascimento=$3, sexo=$4, telefone=$5, email=$6, endereco=$7, convenio=$8, numero_carteirinha=$9 where id = $10 returning *", [nome_completo, cpf, data_nascimento, sexo, telefone, email, endereco, convenio, numero_carteirinha, id])

    return result.rows[0]
}

const remove = async (id) => {
    await pool.query("delete from pacientes where id = $1", [id])
}

module.exports = { findAll, findById, findByCpf, create, update, remove }
