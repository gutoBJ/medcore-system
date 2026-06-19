import { NavLink, useNavigate } from 'react-router-dom'
import { IconLayoutDashboard } from '@tabler/icons-react'

export default function Navbar() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded text-sm font-medium transition-colors no-underline ${isActive
      ? 'bg-white text-blue-600'
      : 'text-white hover:bg-blue-700'
    }`

  return (
    <nav className="bg-blue-600 px-6 py-3 flex gap-2 items-center">
      <span className="font-bold text-lg text-white mr-4">MedCore System</span>
      <NavLink to="/dashboard" className={linkClass}>
        <IconLayoutDashboard size={16} className="inline mr-1" />
        Dashboard
      </NavLink>
      <NavLink to="/pacientes" className={linkClass}>Pacientes</NavLink>
      <NavLink to="/profissionais" className={linkClass}>Profissionais</NavLink>
      <NavLink to="/especialidades" className={linkClass}>Especialidades</NavLink>
      <NavLink to="/atendimentos" className={linkClass}>Atendimentos</NavLink>
      <button onClick={logout} className="ml-auto bg-white text-blue-600 px-3 py-1.5 text-sm font-medium rounded hover:bg-gray-100 cursor-pointer">
        Sair
      </button>
    </nav>
  )
}