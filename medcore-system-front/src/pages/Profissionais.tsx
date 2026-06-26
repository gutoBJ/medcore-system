import { useEffect, useState } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'

interface Especialidade { id: number; nome: string }

interface Profissional {
  id: number
  nome: string
  registro: string
  especialidade_id?: number
  especialidade_ids: number[]
  especialidades_nomes?: string
  cargo: string
  turno: string
  telefone: string
  email: string
  ativo: boolean
}

const inicial: Omit<Profissional, 'id'> = {
  nome: '', registro: '', especialidade_id: 0, especialidade_ids: [],
  cargo: '', turno: '', telefone: '', email: '', ativo: true,
}

export default function Profissionais() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([])
  const [form, setForm] = useState(inicial)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [busca, setBusca] = useState('')
  const { isAdmin } = useAuth()

  const carregar = async () => {
    setLoading(true)
    try {
      const [profRes, espRes] = await Promise.all([api.get('/profissionais'), api.get('/especialidades')])
      setProfissionais(profRes.data); setEspecialidades(espRes.data)
    } catch {
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregar() }, [])
  useEffect(() => { document.title = 'MedCore System - Profissionais' }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nome || !form.registro) { toast.error('Nome e registro são obrigatórios'); return }
    try {
      if (editandoId) {
        await api.put(`/profissionais/${editandoId}`, form)
        toast.success('Profissional atualizado!')
      } else {
        await api.post('/profissionais', form)
        toast.success('Profissional cadastrado!')
      }
      setForm(inicial); setEditandoId(null); setMostrarForm(false); carregar()
    } catch (err: any) {
      toast.error(err.response?.data?.erro || 'Erro ao salvar')
    }
  }

  const handleEditar = (p: Profissional) => {
    const { id, ...dados } = p
    setForm({
      ...dados,
      especialidade_ids: dados.especialidade_ids?.length ? dados.especialidade_ids : (dados.especialidade_id ? [dados.especialidade_id] : []),
    }); setEditandoId(id); setMostrarForm(true)
  }

  const handleDeletar = async (id: number) => {
    if (!confirm('Deseja deletar este profissional?')) return
    try {
      await api.delete(`/profissionais/${id}`)
      toast.success('Profissional deletado!'); carregar()
    } catch {
      toast.error('Erro ao deletar')
    }
  }

  const filtrados = profissionais.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  )

  const nomesEsp = (p: Profissional) => {
    if (p.especialidades_nomes) return p.especialidades_nomes
    return p.especialidade_ids?.map(id => especialidades.find(e => e.id === id)?.nome).filter(Boolean).join(', ') || '—'
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-700">Profissionais</h1>
        {isAdmin && (
        <button onClick={() => { setForm(inicial); setEditandoId(null); setMostrarForm(true) }}
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 text-sm md:text-base">
          + Novo Profissional
        </button>
        )}
      </div>

      {mostrarForm && isAdmin && (
        <div className="bg-white p-4 md:p-6 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">{editandoId ? 'Editar' : 'Novo'} Profissional</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="nome" placeholder="Nome *" value={form.nome} onChange={handleChange} className="border p-2 rounded md:col-span-2" />
            <input name="registro" placeholder="CRM *" value={form.registro} onChange={handleChange} className="border p-2 rounded" />
            {/* Troca o select multiple por checkboxes — muito mais limpo */}
            <select
              name="especialidade_id"
              value={form.especialidade_id || ''}
              onChange={handleChange}
              className="border p-2 rounded cursor-pointer h-10"
            >
              <option value="">Selecione a especialidade</option>
              {especialidades.map(e => (
                <option key={e.id} value={e.id}>{e.nome}</option>
              ))}
            </select>
            <input name="cargo" placeholder="Cargo" value={form.cargo} onChange={handleChange} className="border p-2 rounded" />
            <select name="turno" value={form.turno} onChange={handleChange} className="border p-2 rounded cursor-pointer">
              <option value="">Selecione o turno</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
              <option value="Integral">Integral</option>
            </select>
            <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} className="border p-2 rounded" />
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-2 rounded" />
            <select name="ativo" value={String(form.ativo)} onChange={handleChange} className="border p-2 rounded cursor-pointer">
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
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

      <input type="text" placeholder="Buscar por nome..." value={busca}
        onChange={e => setBusca(e.target.value)} className="border p-2 rounded w-full mb-4" />

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
                  <th className="p-3 text-left">Registro</th>
                  <th className="p-3 text-left">Especialidades</th>
                  <th className="p-3 text-left">Cargo</th>
                  <th className="p-3 text-left">Turno</th>
                  <th className="p-3 text-left">Status</th>
                  {isAdmin && <th className="p-3 text-left">Ações</th>}
                </tr>
              </thead>
              <tbody>
                {filtrados.map(p => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{p.nome}</td>
                    <td className="p-3">{p.registro}</td>
                    <td className="p-3">{nomesEsp(p)}</td>
                    <td className="p-3">{p.cargo || '—'}</td>
                    <td className="p-3">{p.turno || '—'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${p.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    {isAdmin && (<td className="p-3 flex gap-2">
                      <button onClick={() => handleEditar(p)} className="bg-yellow-400 text-white px-3 py-1 rounded cursor-pointer hover:bg-yellow-500">Editar</button>
                      <button onClick={() => handleDeletar(p.id)} className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-red-600">Deletar</button>
                    </td>)}
                  </tr>
                ))}
                {filtrados.length === 0 && (
                  <tr><td colSpan={7} className="p-4 text-center text-gray-400">Nenhum profissional encontrado</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex flex-col gap-3">
            {filtrados.length === 0 && <p className="text-center text-gray-400 py-6">Nenhum profissional encontrado</p>}
            {filtrados.map(p => (
              <div key={p.id} className="bg-white rounded shadow p-4 flex flex-col gap-1.5">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-gray-800">{p.nome}</p>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${p.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {p.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Registro: {p.registro}</p>
                <p className="text-sm text-gray-500">Especialidades: {nomesEsp(p)}</p>
                <p className="text-sm text-gray-500">Cargo: {p.cargo || '—'}</p>
                <p className="text-sm text-gray-500">Turno: {p.turno || '—'}</p>
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
