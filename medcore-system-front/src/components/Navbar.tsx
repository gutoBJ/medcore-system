import { NavLink, useNavigate } from 'react-router-dom'
import { IconLayoutDashboard, IconUsers, IconBriefcase, IconReportMedical, IconHeartbeat, IconLogout, IconMenu2, IconX, IconUserCircle } from '@tabler/icons-react'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const navigate = useNavigate()
  const [menuAberto, setMenuAberto] = useState(false)
  const [nomeUsuario, setNomeUsuario] = useState('')
  const [isAdmin, setIsAdmin] = useState(false) // Estado adicionado

  // Busca o nome e perfil do usuário salvo no localStorage assim que a Navbar monta
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario')
    if (usuarioSalvo) {
      try {
        const dadosUsuario = JSON.parse(usuarioSalvo)
        setNomeUsuario(dadosUsuario.nome)
        setIsAdmin(dadosUsuario.perfil === 'ADMIN') // Verificação exata baseada no seu backend
      } catch (err) {
        console.error('Erro ao ler usuário do localStorage', err)
      }
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded text-sm font-medium transition-colors no-underline flex items-center gap-1.5 ${
      isActive ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-700'
    }`

  // Links base do menu
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: <IconLayoutDashboard size={16} /> },
    { to: '/pacientes', label: 'Pacientes', icon: <IconUsers size={16} /> },
    { to: '/profissionais', label: 'Profissionais', icon: <IconBriefcase size={16} /> },
    { to: '/especialidades', label: 'Especialidades', icon: <IconReportMedical size={16} /> },
    { to: '/atendimentos', label: 'Atendimentos', icon: <IconHeartbeat size={16} /> },
  ]

  // Injeta a aba de usuários dinamicamente caso seja ADMIN
  if (isAdmin) {
    links.push({ to: '/usuarios', label: 'Usuários', icon: <IconUsers size={16} /> })
  }

  return (
    <nav className="bg-blue-600 px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="font-bold text-lg text-white">MedCore System</span>

        {/* Desktop: Links de navegação e Identificação do Usuário */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.icon} {l.label}
            </NavLink>
          ))}
          
          {/* Identificação do Usuário Logado */}
          {nomeUsuario && (
            <div className="flex items-center gap-1.5 text-white bg-blue-700 px-3 py-1.5 rounded text-sm font-medium ml-4 mr-2">
              <IconUserCircle size={18} />
              <span>Olá, <strong className="font-semibold">{nomeUsuario}</strong></span>
            </div>
          )}

          <button onClick={logout} className="bg-white text-blue-600 px-3 py-1.5 text-sm font-medium rounded hover:bg-gray-100 cursor-pointer flex items-center gap-1.5">
            <IconLogout size={16} /> Sair
          </button>
        </div>

        {/* Mobile: botões hambúrguer e sair */}
        <div className="flex items-center gap-2 md:hidden">
          {nomeUsuario && (
            <span className="text-white text-xs bg-blue-700 px-2 py-1 rounded font-medium max-w-25 truncate">
              {nomeUsuario.split(' ')[0]}
            </span>
          )}
          <button onClick={logout} className="text-white hover:bg-blue-700 p-1.5 rounded cursor-pointer">
            <IconLogout size={20} />
          </button>
          <button onClick={() => setMenuAberto(!menuAberto)} className="text-white hover:bg-blue-700 p-1.5 rounded cursor-pointer">
            {menuAberto ? <IconX size={22} /> : <IconMenu2 size={22} />}
          </button>
        </div>
      </div>

      {/* Menu mobile expandido */}
      {menuAberto && (
        <div className="md:hidden mt-3 flex flex-col gap-1 pb-1">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} className={linkClass} onClick={() => setMenuAberto(false)}>
              {l.icon} {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
