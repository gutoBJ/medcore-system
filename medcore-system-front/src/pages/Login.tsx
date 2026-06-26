import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const navigate = useNavigate()

  useEffect(() => { document.title = 'MedCore System - Login' }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !senha) {
      toast.error('Email e senha são obrigatórios')
      return
    }

    try {
      const res = await api.post('/auth/login', { email, senha })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario))

      toast.success(`Bem-vindo, ${res.data.usuario.nome}! 👋`, {
        duration: 3000,
        style: {
          fontWeight: '500',
          fontSize: '15px',
        }
      })

      setTimeout(() => navigate('/dashboard'), 1000)
    } catch {
      toast.error('Email ou senha inválidos')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">MedCore System</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            className="border p-2 rounded"
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 cursor-pointer">
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
