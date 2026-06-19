import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', { email, senha })
      localStorage.setItem('token', res.data.token)
      navigate('/pacientes')
    } catch {
      setErro('Email ou senha inválidos')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">MedCore System</h1>
        {erro && <p className="text-red-500 text-sm mb-4">{erro}</p>}
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
          <button type="submit" className="bg-blue-600 text-white p-2 rounded cursor-pointer hover:bg-blue-700">
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}