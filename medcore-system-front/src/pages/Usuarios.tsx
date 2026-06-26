import { useEffect, useState } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

interface Usuario {
  id: number
  nome: string
  email: string
  senha?: string
  perfil: 'ADMIN' | 'MEDICO'
  status: 'ativo' | 'inativo'
  profissional_id?: number | null
}

interface Profissional {
  id: number
  nome: string
}

const inicial: Omit<Usuario, 'id'> = {
  nome: '',
  email: '',
  senha: '',
  perfil: 'MEDICO',
  status: 'ativo',
  profissional_id: null,
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [form, setForm] = useState(inicial)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [busca, setBusca] = useState('')

  const carregarDados = async () => {
    setLoading(true)
    try {
      const [usRes, profRes] = await Promise.all([
        api.get('/usuarios'),
        api.get('/profissionais')
      ])
      setUsuarios(usRes.data)
      setProfissionais(profRes.data)
    } catch {
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregarDados() }, [])
  useEffect(() => { document.title = 'MedCore System - Usuários' }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.nome || !form.email) {
      toast.error('Nome e Email são obrigatórios')
      return
    }

    if (!editandoId && !form.senha) {
      toast.error('A senha é obrigatória para novos usuários')
      return
    }

    try {
      if (editandoId) {
        const dadosEnvio = { ...form }
        if (!dadosEnvio.senha) delete dadosEnvio.senha
        await api.put(`/usuarios/${editandoId}`, dadosEnvio)
        toast.success('Usuário atualizado!')
      } else {
        await api.post('/usuarios', form)
        toast.success('Usuário cadastrado!')
      }
      setForm(inicial)
      setEditandoId(null)
      setMostrarForm(false)
      carregarDados()
    } catch (err: any) {
      toast.error(err.response?.data?.erro || 'Erro ao salvar')
    }
  }

  const handleEditar = (usuario: Usuario) => {
    const { id, ...dados } = usuario
    setForm({ ...dados, senha: '' })
    setEditandoId(id)
    setMostrarForm(true)
  }

  const handleDeletar = async (id: number) => {
    if (!confirm('Deseja deletar este usuário?')) return
    try {
      await api.delete(`/usuarios/${id}`)
      toast.success('Usuário deletado!')
      carregarDados()
    } catch {
      toast.error('Erro ao deletar')
    }
  }

  const nomeProfissional = (id?: number | null) =>
    profissionais.find(p => p.id === id)?.nome || '—'

  const usuariosFiltrados = usuarios.filter(u =>
    u.nome.toLowerCase().includes(busca.toLowerCase()) ||
    u.email.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-700">Usuários do Sistema</h1>
        <button
          onClick={() => { setForm(inicial); setEditandoId(null); setMostrarForm(true) }}
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 text-sm md:text-base"
        >
          + Novo Usuário
        </button>
      </div>

      {mostrarForm && (
        <div className="bg-white p-4 md:p-6 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">{editandoId ? 'Editar' : 'Novo'} Usuário</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="nome" placeholder="Nome completo *" value={form.nome} onChange={handleChange} className="border p-2 rounded md:col-span-2" />
            <input name="email" type="email" placeholder="Email de acesso *" value={form.email} onChange={handleChange} className="border p-2 rounded md:col-span-2" />
            <input
              name="senha"
              type="password"
              placeholder={editandoId ? 'Nova senha (deixe em branco para não alterar)' : 'Senha de acesso *'}
              value={form.senha}
              onChange={handleChange}
              className="border p-2 rounded md:col-span-2"
            />
            <select name="perfil" value={form.perfil} onChange={handleChange} className="border p-2 rounded cursor-pointer">
              <option value="MEDICO">Médico</option>
              <option value="ADMIN">Administrador</option>
            </select>
            <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded cursor-pointer">
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>

            {form.perfil === 'MEDICO' && (
              <select
                name="profissional_id"
                value={form.profissional_id || ''}
                onChange={handleChange}
                className="border p-2 rounded cursor-pointer md:col-span-2"
              >
                <option value="">Vincular a um profissional (opcional)</option>
                {profissionais.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            )}

            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
                {editandoId ? 'Salvar alterações' : 'Cadastrar'}
              </button>
              <button type="button" onClick={() => setMostrarForm(false)} className="bg-gray-300 px-4 py-2 rounded cursor-pointer hover:bg-gray-400">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <input
        type="text"
        placeholder="Buscar por nome ou email..."
        value={busca}
        onChange={e => setBusca(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block bg-white rounded shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="p-3 text-left">Nome</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Perfil</th>
                  <th className="p-3 text-left">Profissional vinculado</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map(u => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">{u.nome}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        u.perfil === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {u.perfil === 'ADMIN' ? 'Admin' : 'Médico'}
                      </span>
                    </td>
                    <td className="p-3">{u.perfil === 'MEDICO' ? nomeProfissional(u.profissional_id) : '—'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        u.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {u.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => handleEditar(u)} className="bg-yellow-400 text-white px-3 py-1 rounded cursor-pointer hover:bg-yellow-500">Editar</button>
                      <button onClick={() => handleDeletar(u.id)} className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-red-600">Deletar</button>
                    </td>
                  </tr>
                ))}
                {usuariosFiltrados.length === 0 && (
                  <tr><td colSpan={6} className="p-4 text-center text-gray-400">Nenhum usuário encontrado</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex flex-col gap-3">
            {usuariosFiltrados.length === 0 && (
              <p className="text-center text-gray-400 py-6">Nenhum usuário encontrado</p>
            )}
            {usuariosFiltrados.map(u => (
              <div key={u.id} className="bg-white rounded shadow p-4 flex flex-col gap-1.5">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-gray-800">{u.nome}</p>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    u.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {u.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Email: {u.email}</p>
                <p className="text-sm text-gray-500">
                  Perfil: <span className={`font-semibold ${u.perfil === 'ADMIN' ? 'text-purple-700' : 'text-blue-700'}`}>
                    {u.perfil === 'ADMIN' ? 'Admin' : 'Médico'}
                  </span>
                </p>
                {u.perfil === 'MEDICO' && (
                  <p className="text-sm text-gray-500">Profissional: {nomeProfissional(u.profissional_id)}</p>
                )}
                <div className="flex gap-2 mt-2 justify-end">
                  <button onClick={() => handleEditar(u)} className="bg-yellow-400 text-white px-3 py-1 rounded text-xs cursor-pointer hover:bg-yellow-500">Editar</button>
                  <button onClick={() => handleDeletar(u.id)} className="bg-red-500 text-white px-3 py-1 rounded text-xs cursor-pointer hover:bg-red-600">Deletar</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}