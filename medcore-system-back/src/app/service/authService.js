const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const repository = require('../repository/usuarioRepository')

const register = async ({ nome, email, senha }) => {
  if (!nome || !email || !senha) throw new Error('Todos os campos são obrigatórios')

  const existe = await repository.findByEmail(email)
  if (existe) throw new Error('Email já cadastrado')

  const senhaHash = await bcrypt.hash(senha, 10)
  return await repository.create({ nome, email, senha: senhaHash })
}

const login = async ({ email, senha }) => {
  if (!email || !senha) throw new Error('Email e senha são obrigatórios')

  const usuario = await repository.findByEmail(email)
  if (!usuario) throw new Error('Credenciais inválidas')

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
  if (!senhaCorreta) throw new Error('Credenciais inválidas')

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  )

  return { token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } }
}

module.exports = { register, login }