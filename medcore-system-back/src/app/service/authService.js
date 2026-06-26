const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const repository = require('../repository/usuarioRepository')

const PERFIS = ['ADMIN', 'MEDICO']

const register = async ({ nome, email, senha, perfil = 'ADMIN', profissional_id }) => {
  if (!nome || !email || !senha) throw new Error('Todos os campos sao obrigatorios')
  if (!PERFIS.includes(perfil)) throw new Error('Perfil invalido')
  if (perfil === 'MEDICO' && !profissional_id) {
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

// 1. Listar todos os usuários
const listarTodos = async () => {
  const usuarios = await repository.findAll()
  
  // Remove o campo de senha da listagem retornada por segurança
  return usuarios.map(u => ({
    id: u.id,
    nome: u.nome,
    email: u.email,
    perfil: u.perfil,
    profissional_id: u.profissional_id
  }))
}

// 2. Atualizar usuário existente
const atualizar = async (id, dados) => {
  const { nome, email, senha, perfil, profissional_id } = dados

  const usuario = await repository.findById(id)
  if (!usuario) throw new Error('Usuario nao encontrado')

  // Se o email mudou, valida se o novo email já está em uso por outro usuário
  if (email && email !== usuario.email) {
    const existeEmail = await repository.findByEmail(email)
    if (existeEmail) throw new Error('Email ja cadastrado por outro usuario')
  }

  if (perfil && !PERFIS.includes(perfil)) throw new Error('Perfil invalido')
  if (perfil === 'DENTISTA' && !profissional_id && !usuario.profissional_id) {
    throw new Error('Dentista precisa estar vinculado a um profissional')
  }

  // Prepara os dados de atualização
  const dadosAtualizados = { nome, email, perfil, profissional_id }

  // Gera o hash da nova senha apenas se o usuário digitou uma no formulário
  if (senha && senha.trim() !== '') {
    dadosAtualizados.senha = await bcrypt.hash(senha, 10)
  }

  return await repository.update(id, dadosAtualizados)
}

// 3. Remover usuário do sistema
const remover = async (id) => {
  const usuario = await repository.findById(id)
  if (!usuario) throw new Error('Usuario nao encontrado')

  await repository.delete(id)
  return { mensagem: 'Usuario removido com sucesso' }
}

module.exports = { register, login, listarTodos, atualizar, remover }
