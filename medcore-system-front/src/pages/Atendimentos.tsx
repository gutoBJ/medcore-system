import { useEffect, useState } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

interface Paciente { id: number; nome_completo: string }
interface Profissional { id: number; nome: string }

interface Atendimento {
  id: number
  paciente_id: number
  profissional_id: number
  paciente_nome: string
  profissional_nome: string
  data_hora: string
  data_hora_fim: string
  tipo: string
  status: string
  motivo_cancelamento: string
  diagnostico: string
  observacoes: string
  valor: number
}

const inicial: Omit<Atendimento, 'id' | 'paciente_nome' | 'profissional_nome'> = {
  paciente_id: 0,
  profissional_id: 0,
  data_hora: '',
  data_hora_fim: '',
  tipo: '',
  status: '',
  motivo_cancelamento: '',
  diagnostico: '',
  observacoes: '',
  valor: 0,
}

const statusCor = (status: string) => {
  if (status === 'Concluido') return 'bg-green-100 text-green-700'
  if (status === 'Cancelado') return 'bg-red-100 text-red-700'
  if (status === 'Em andamento') return 'bg-yellow-100 text-yellow-700'
  return 'bg-blue-100 text-blue-700'
}

export default function Atendimentos() {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  const isDentista = usuario.perfil === 'DENTISTA'
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([])
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [form, setForm] = useState(inicial)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filtroData, setFiltroData] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')

  const carregar = async () => {
    setLoading(true)
    try {
      const [atRes, pacRes, profRes] = await Promise.all([
        api.get('/atendimentos'),
        api.get('/pacientes'),
        api.get('/profissionais'),
      ])
      setAtendimentos(atRes.data)
      setPacientes(pacRes.data)
      setProfissionais(profRes.data)
    } catch {
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const filtrarPorData = async (data: string) => {
    setFiltroData(data)
    if (!data) return carregar()
    setLoading(true)
    try {
      const res = await api.get(`/atendimentos/filtrar?data=${data}`)
      setAtendimentos(res.data)
    } catch {
      toast.error('Erro ao filtrar por data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregar() }, [])
  useEffect(() => { document.title = 'MedCore System - Atendimentos' }, [])

  const abrirNovo = () => {
    setForm({
      ...inicial,
      profissional_id: isDentista ? Number(usuario.profissional_id) : 0,
    })
    setEditandoId(null)
    setMostrarForm(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validarForm = () => {
    if (!form.paciente_id || !form.profissional_id || !form.data_hora || !form.data_hora_fim || !form.tipo) {
      toast.error('Paciente, profissional, horarios e tipo sao obrigatorios')
      return false
    }

    if (new Date(form.data_hora) < new Date()) {
      toast.error('Nao e permitido agendar em datas passadas')
      return false
    }

    if (new Date(form.data_hora_fim) <= new Date(form.data_hora)) {
      toast.error('O horario final deve ser apos o horario inicial')
      return false
    }

    if (form.status === 'Cancelado' && !form.motivo_cancelamento.trim()) {
      toast.error('Informe o motivo do cancelamento')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validarForm()) return

    try {
      if (editandoId) {
        await api.put(`/atendimentos/${editandoId}`, form)
        toast.success('Atendimento atualizado!')
      } else {
        await api.post('/atendimentos', form)
        toast.success('Atendimento cadastrado!')
      }
      setForm(inicial)
      setEditandoId(null)
      setMostrarForm(false)
      carregar()
    } catch (err: any) {
      toast.error(err.response?.data?.erro || 'Erro ao salvar')
    }
  }

  const handleEditar = (a: Atendimento) => {
    const { id, paciente_nome, profissional_nome, ...dados } = a
    setForm({
      ...dados,
      data_hora: dados.data_hora?.slice(0, 16),
      data_hora_fim: dados.data_hora_fim?.slice(0, 16),
      motivo_cancelamento: dados.motivo_cancelamento || '',
    })
    setEditandoId(id)
    setMostrarForm(true)
  }

  const handleDeletar = async (id: number) => {
    if (!confirm('Deseja deletar este atendimento?')) return
    try {
      await api.delete(`/atendimentos/${id}`)
      toast.success('Atendimento deletado!')
      carregar()
    } catch {
      toast.error('Erro ao deletar')
    }
  }

  const filtrados = atendimentos.filter(a => filtroStatus ? a.status === filtroStatus : true)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-700">Atendimentos</h1>
        <button onClick={abrirNovo}
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 text-sm md:text-base">
          + Novo Atendimento
        </button>
      </div>

      {mostrarForm && (
        <div className="bg-white p-4 md:p-6 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">{editandoId ? 'Editar' : 'Novo'} Atendimento</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="paciente_id" value={form.paciente_id} onChange={handleChange} className="border p-2 rounded cursor-pointer">
              <option value="">Selecione o paciente *</option>
              {pacientes.map(p => <option key={p.id} value={p.id}>{p.nome_completo}</option>)}
            </select>
            <select name="profissional_id" value={form.profissional_id} onChange={handleChange} disabled={isDentista} className="border p-2 rounded cursor-pointer disabled:bg-gray-100">
              <option value="">Selecione o profissional *</option>
              {profissionais.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
            <input name="data_hora" type="datetime-local" value={form.data_hora} onChange={handleChange} className="border p-2 rounded" />
            <input name="data_hora_fim" type="datetime-local" value={form.data_hora_fim} onChange={handleChange} className="border p-2 rounded" />
            <select name="tipo" value={form.tipo} onChange={handleChange} className="border p-2 rounded cursor-pointer">
              <option value="">Tipo *</option>
              <option value="Consulta">Consulta</option>
              <option value="Exame">Exame</option>
              <option value="Internacao">Internacao</option>
            </select>
            <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded cursor-pointer">
              <option value="">Status</option>
              <option value="Agendado">Agendado</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Concluido">Concluido</option>
              <option value="Cancelado">Cancelado</option>
            </select>
            <input name="valor" type="number" placeholder="Valor (R$)" value={form.valor} onChange={handleChange} className="border p-2 rounded" />
            {form.status === 'Cancelado' && (
              <textarea name="motivo_cancelamento" placeholder="Motivo do cancelamento *" value={form.motivo_cancelamento} onChange={handleChange} className="border p-2 rounded md:col-span-2 resize-none h-20" />
            )}
            <textarea name="diagnostico" placeholder="Diagnostico" value={form.diagnostico} onChange={handleChange} className="border p-2 rounded md:col-span-2 resize-none h-20" />
            <textarea name="observacoes" placeholder="Observacoes" value={form.observacoes} onChange={handleChange} className="border p-2 rounded md:col-span-2 resize-none h-20" />
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
                {editandoId ? 'Salvar alteracoes' : 'Cadastrar'}
              </button>
              <button type="button" onClick={() => setMostrarForm(false)} className="bg-gray-300 px-4 py-2 rounded cursor-pointer hover:bg-gray-400">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input type="date" value={filtroData} onChange={e => filtrarPorData(e.target.value)} className="border p-2 rounded cursor-pointer" />
        <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} className="border p-2 rounded cursor-pointer">
          <option value="">Todos os status</option>
          <option value="Agendado">Agendado</option>
          <option value="Em andamento">Em andamento</option>
          <option value="Concluido">Concluido</option>
          <option value="Cancelado">Cancelado</option>
        </select>
        {(filtroData || filtroStatus) && (
          <button onClick={() => { setFiltroData(''); setFiltroStatus(''); carregar() }}
            className="text-sm text-red-500 hover:underline cursor-pointer">
            Limpar filtros
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="p-3 text-left">Paciente</th>
                  <th className="p-3 text-left">Profissional</th>
                  <th className="p-3 text-left">Inicio</th>
                  <th className="p-3 text-left">Fim</th>
                  <th className="p-3 text-left">Tipo</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Valor</th>
                  <th className="p-3 text-left">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(a => (
                  <tr key={a.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{a.paciente_nome}</td>
                    <td className="p-3">{a.profissional_nome}</td>
                    <td className="p-3">{new Date(a.data_hora).toLocaleString('pt-BR')}</td>
                    <td className="p-3">{new Date(a.data_hora_fim).toLocaleString('pt-BR')}</td>
                    <td className="p-3">{a.tipo}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusCor(a.status)}`}>{a.status}</span>
                    </td>
                    <td className="p-3">{a.valor ? `R$ ${Number(a.valor).toFixed(2)}` : '-'}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => handleEditar(a)} className="bg-yellow-400 text-white px-3 py-1 rounded cursor-pointer hover:bg-yellow-500">Editar</button>
                      <button onClick={() => handleDeletar(a.id)} className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-red-600">Deletar</button>
                    </td>
                  </tr>
                ))}
                {filtrados.length === 0 && (
                  <tr><td colSpan={8} className="p-4 text-center text-gray-400">Nenhum atendimento encontrado</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col gap-3">
            {filtrados.length === 0 && <p className="text-center text-gray-400 py-6">Nenhum atendimento encontrado</p>}
            {filtrados.map(a => (
              <div key={a.id} className="bg-white rounded shadow p-4 flex flex-col gap-1.5">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-gray-800">{a.paciente_nome}</p>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusCor(a.status)}`}>{a.status}</span>
                </div>
                <p className="text-sm text-gray-500">Profissional: {a.profissional_nome}</p>
                <p className="text-sm text-gray-500">Inicio: {new Date(a.data_hora).toLocaleString('pt-BR')}</p>
                <p className="text-sm text-gray-500">Fim: {new Date(a.data_hora_fim).toLocaleString('pt-BR')}</p>
                <p className="text-sm text-gray-500">Tipo: {a.tipo}</p>
                <p className="text-sm text-gray-500">Valor: {a.valor ? `R$ ${Number(a.valor).toFixed(2)}` : '-'}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleEditar(a)} className="flex-1 bg-yellow-400 text-white py-1.5 rounded cursor-pointer hover:bg-yellow-500 text-sm">Editar</button>
                  <button onClick={() => handleDeletar(a.id)} className="flex-1 bg-red-500 text-white py-1.5 rounded cursor-pointer hover:bg-red-600 text-sm">Deletar</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
