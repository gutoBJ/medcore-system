import { useEffect, useState } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'

interface Paciente {
  id: number
  nome_completo: string
  cpf: string
  data_nascimento: string
  sexo: string
  telefone: string
  email: string
  endereco: string
  convenio: string
  numero_carteirinha: string
}

const inicial: Omit<Paciente, 'id'> = {
  nome_completo: '',
  cpf: '',
  data_nascimento: '',
  sexo: '',
  telefone: '',
  email: '',
  endereco: '',
  convenio: '',
  numero_carteirinha: '',
}

export default function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [form, setForm] = useState(inicial)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [busca, setBusca] = useState('')
  const { isAdmin } = useAuth()

  const carregarPacientes = async () => {
    setLoading(true)
    try {
      const res = await api.get('/pacientes')
      setPacientes(res.data)
    } catch {
      toast.error('Erro ao carregar pacientes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregarPacientes() }, [])
  useEffect(() => { document.title = 'MedCore System - Pacientes' }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nome_completo || !form.cpf) {
      toast.error('Nome e CPF são obrigatórios')
      return
    }
    try {
      if (editandoId) {
        await api.put(`/pacientes/${editandoId}`, form)
        toast.success('Paciente atualizado!')
      } else {
        await api.post('/pacientes', form)
        toast.success('Paciente cadastrado!')
      }
      setForm(inicial)
      setEditandoId(null)
      setMostrarForm(false)
      carregarPacientes()
    } catch (err: any) {
      toast.error(err.response?.data?.erro || 'Erro ao salvar')
    }
  }

  const handleEditar = (paciente: Paciente) => {
    const { id, ...dados } = paciente
    setForm({ ...dados, data_nascimento: dados.data_nascimento?.slice(0, 10) })
    setEditandoId(id)
    setMostrarForm(true)
  }

  const handleDeletar = async (id: number) => {
    if (!confirm('Deseja deletar este paciente?')) return
    try {
      await api.delete(`/pacientes/${id}`)
      toast.success('Paciente deletado!')
      carregarPacientes()
    } catch {
      toast.error('Erro ao deletar')
    }
  }

  const pacientesFiltrados = pacientes.filter(p =>
    p.nome_completo.toLowerCase().includes(busca.toLowerCase()) ||
    p.cpf.includes(busca)
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-700">Pacientes</h1>
        {isAdmin && (
          <button onClick={() => { setForm(inicial); setEditandoId(null); setMostrarForm(true) }}
            className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 text-sm md:text-base">
            + Novo Paciente
          </button>
        )}
      </div>

      {mostrarForm && isAdmin && (
        <div className="bg-white p-4 md:p-6 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">{editandoId ? 'Editar' : 'Novo'} Paciente</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="nome_completo" placeholder="Nome completo *" value={form.nome_completo} onChange={handleChange} className="border p-2 rounded md:col-span-2" />
            <input name="cpf" placeholder="CPF *" value={form.cpf} onChange={handleChange} className="border p-2 rounded" />
            <input name="data_nascimento" type="date" value={form.data_nascimento} onChange={handleChange} className="border p-2 rounded" />
            <select name="sexo" value={form.sexo} onChange={handleChange} className="border p-2 rounded">
              <option value="">Sexo</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
            <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} className="border p-2 rounded" />
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 rounded md:col-span-2" />
            <input name="endereco" placeholder="Endereço" value={form.endereco} onChange={handleChange} className="border p-2 rounded md:col-span-2" />
            <input name="convenio" placeholder="Convênio" value={form.convenio} onChange={handleChange} className="border p-2 rounded" />
            <input name="numero_carteirinha" placeholder="Número da carteirinha" value={form.numero_carteirinha} onChange={handleChange} className="border p-2 rounded" />
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
        placeholder="Buscar por nome ou CPF..."
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
          {/* Desktop: tabela */}
          <div className="hidden md:block bg-white rounded shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="p-3 text-left">Nome</th>
                  <th className="p-3 text-left">CPF</th>
                  <th className="p-3 text-left">Telefone</th>
                  <th className="p-3 text-left">Convênio</th>
                  {isAdmin && <th className="p-3 text-left">Ações</th>}
                </tr>
              </thead>
              <tbody>
                {pacientesFiltrados.map(p => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{p.nome_completo}</td>
                    <td className="p-3">{p.cpf}</td>
                    <td className="p-3">{p.telefone}</td>
                    <td className="p-3">{p.convenio || '—'}</td>
                    {isAdmin && (<td className="p-3 flex gap-2">
                      <button onClick={() => handleEditar(p)} className="bg-yellow-400 text-white px-3 py-1 rounded cursor-pointer hover:bg-yellow-500">Editar</button>
                      <button onClick={() => handleDeletar(p.id)} className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-red-600">Deletar</button>
                    </td>)}
                  </tr>
                ))}
                {pacientesFiltrados.length === 0 && (
                  <tr><td colSpan={5} className="p-4 text-center text-gray-400">Nenhum paciente encontrado</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards */}
          <div className="md:hidden flex flex-col gap-3">
            {pacientesFiltrados.length === 0 && (
              <p className="text-center text-gray-400 py-6">Nenhum paciente encontrado</p>
            )}
            {pacientesFiltrados.map(p => (
              <div key={p.id} className="bg-white rounded shadow p-4 flex flex-col gap-1.5">
                <p className="font-medium text-gray-800">{p.nome_completo}</p>
                <p className="text-sm text-gray-500">CPF: {p.cpf}</p>
                <p className="text-sm text-gray-500">Telefone: {p.telefone || '—'}</p>
                <p className="text-sm text-gray-500">Convênio: {p.convenio || '—'}</p>
                {isAdmin && (<div className="flex gap-2 mt-2">
                  <button onClick={() => handleEditar(p)} className="flex-1 bg-yellow-400 text-white py-1.5 rounded cursor-pointer hover:bg-yellow-500 text-sm">Editar</button>
                  <button onClick={() => handleDeletar(p.id)} className="flex-1 bg-red-500 text-white py-1.5 rounded cursor-pointer hover:bg-red-600 text-sm">Deletar</button>
                </div>)}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}