const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const repository = require('../repository/usuarioRepository')

const PERFIS = ['ADMIN', 'DENTISTA', 'ATENDENTE']

const register = async ({ nome, email, senha, perfil = 'ATENDENTE', profissional_id }) => {
  if (!nome || !email || !senha) throw new Error('Todos os campos sao obrigatorios')
  if (!PERFIS.includes(perfil)) throw new Error('Perfil invalido')
  if (perfil === 'DENTISTA' && !profissional_id) {
    throw new Error('Dentista precisa estar vinculado a um profissional')
  }

  const existe = await repository.findByEmail(email)
  if (existe) throw new Error('Email ja cadastrado')

  const senhaHash = await bcrypt.hash(senha, 10)
  return await repository.create({ nome, email, senha: senhaHash, perfil, profissional_id })
}

const login = async ({ email, senha }) => {
  if (!email || !senha) throw new Error('Email e senha sao obrigatorios')

  const usuario = await repository.findByEmail(email)
  if (!usuario) throw new Error('Credenciais invalidas')

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
  if (!senhaCorreta) throw new Error('Credenciais invalidas')

  const token = jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      perfil: usuario.perfil,
      profissional_id: usuario.profissional_id
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  )

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
      profissional_id: usuario.profissional_id
    }
  }
}

module.exports = { register, login }
