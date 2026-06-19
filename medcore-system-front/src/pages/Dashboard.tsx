import { useEffect, useState } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import {
  IconUsers,
  IconStethoscope,
  IconCircleCheck,
  IconClipboardList,
  IconCalendarStats
} from '@tabler/icons-react'

interface Totais {
  pacientes: number
  profissionais: number
  especialidades: number
  atendimentosHoje: number
  profissionaisAtivos: number
}

export default function Dashboard() {
  const [totais, setTotais] = useState<Totais>({
    pacientes: 0,
    profissionais: 0,
    especialidades: 0,
    atendimentosHoje: 0,
    profissionaisAtivos: 0,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => { document.title = 'MedCore System - Dashboard' }, [])

  const carregar = async () => {
    setLoading(true)
    try {
      const hoje = new Date().toISOString().slice(0, 10)
      const [pacRes, profRes, espRes, atHojeRes] = await Promise.all([
        api.get('/pacientes'),
        api.get('/profissionais'),
        api.get('/especialidades'),
        api.get(`/atendimentos/filtrar?data=${hoje}`),
      ])

      const profissionaisAtivos = profRes.data.filter((p: any) => p.ativo).length

      setTotais({
        pacientes: pacRes.data.length,
        profissionais: profRes.data.length,
        especialidades: espRes.data.length,
        atendimentosHoje: atHojeRes.data.length,
        profissionaisAtivos,
      })
    } catch {
      toast.error('Erro ao carregar dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregar() }, [])

  const cards = [
    { titulo: 'Pacientes', valor: totais.pacientes, cor: 'bg-blue-500', icone: <IconUsers size={40} stroke={1.5} /> },
    { titulo: 'Profissionais', valor: totais.profissionais, cor: 'bg-purple-500', icone: <IconStethoscope size={40} stroke={1.5} /> },
    { titulo: 'Profissionais Ativos', valor: totais.profissionaisAtivos, cor: 'bg-green-500', icone: <IconCircleCheck size={40} stroke={1.5} /> },
    { titulo: 'Especialidades', valor: totais.especialidades, cor: 'bg-yellow-500', icone: <IconClipboardList size={40} stroke={1.5} /> },
    { titulo: 'Atendimentos Hoje', valor: totais.atendimentosHoje, cor: 'bg-red-500', icone: <IconCalendarStats size={40} stroke={1.5} /> },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Dashboard</h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(card => (
            <div key={card.titulo} className={`${card.cor} text-white rounded-xl shadow p-6 flex items-center gap-4`}>
              <span className="text-4xl">{card.icone}</span>
              <div>
                <p className="text-sm opacity-80">{card.titulo}</p>
                <p className="text-3xl font-bold">{card.valor}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}