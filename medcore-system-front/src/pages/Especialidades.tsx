import { useEffect, useState } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

interface Especialidade {
  id: number
  nome: string
  descricao: string
  area: string
}

const inicial: Omit<Especialidade, 'id'> = {
  nome: '',
  descricao: '',
  area: '',
}
                 
export default function Especialidades() {
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([])
  const [form, setForm] = useState(inicial)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const carregar = async () => {
    setLoading(true)
    try {
      const res = await api.get('/especialidades')
      setEspecialidades(res.data)
    } catch {
      toast.error('Erro ao carregar especialidades')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregar() }, [])

  useEffect(() => { document.title = 'MedCore System - Especialidades' }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nome) {
      toast.error('Nome é obrigatório')
      return
    }
    try {
      if (editandoId) {
        await api.put(`/especialidades/${editandoId}`, form)
        toast.success('Especialidade atualizada!')
      } else {
        await api.post('/especialidades', form)
        toast.success('Especialidade cadastrada!')
      }
      setForm(inicial)
      setEditandoId(null)
      setMostrarForm(false)
      carregar()
    } catch (err: any) {
      toast.error(err.response?.data?.erro || 'Erro ao salvar')
    }
  }

  const handleEditar = (e: Especialidade) => {
    const { id, ...dados } = e
    setForm(dados)
    setEditandoId(id)
    setMostrarForm(true)
  }

  const handleDeletar = async (id: number) => {
    if (!confirm('Deseja deletar esta especialidade?')) return
    try {
      await api.delete(`/especialidades/${id}`)
      toast.success('Especialidade deletada!')
      carregar()
    } catch {
      toast.error('Erro ao deletar')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-700">Especialidades</h1>
        <button onClick={() => { setForm(inicial); setEditandoId(null); setMostrarForm(true) }}
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
          + Nova Especialidade
        </button>
      </div>

      {mostrarForm && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">{editandoId ? 'Editar' : 'Nova'} Especialidade</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input name="nome" placeholder="Nome *" value={form.nome} onChange={handleChange} className="border p-2 rounded col-span-2" />
            <input name="area" placeholder="Área (ex: Cardiologia)" value={form.area} onChange={handleChange} className="border p-2 rounded" />
            <input name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} className="border p-2 rounded" />
            <div className="col-span-2 flex gap-3">
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

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">Área</th>
                <th className="p-3 text-left">Descrição</th>
                <th className="p-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {especialidades.map(e => (
                <tr key={e.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{e.nome}</td>
                  <td className="p-3">{e.area}</td>
                  <td className="p-3">{e.descricao}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => handleEditar(e)} className="bg-yellow-400 text-white px-3 py-1 rounded cursor-pointer hover:bg-yellow-500">Editar</button>
                    <button onClick={() => handleDeletar(e.id)} className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-red-600">Deletar</button>
                  </td>
                </tr>
              ))}
              {especialidades.length === 0 && (
                <tr><td colSpan={4} className="p-4 text-center text-gray-400">Nenhuma especialidade cadastrada</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}