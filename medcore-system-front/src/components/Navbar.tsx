import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex gap-6 items-center">
      <span className="font-bold text-lg mr-4">MedCore System</span>
      <Link to="/pacientes" className="hover:underline">Pacientes</Link>
      <Link to="/profissionais" className="hover:underline">Profissionais</Link>
      <Link to="/especialidades" className="hover:underline">Especialidades</Link>
      <Link to="/atendimentos" className="hover:underline">Atendimentos</Link>
      <button onClick={logout} className="ml-auto bg-white text-blue-600 px-3 py-1 rounded cursor-pointer hover:bg-gray-100">
        Sair
      </button>
    </nav>
  )
}