import { Navigate, Outlet } from 'react-router-dom'

export default function RotaAdmin() {
  const usuarioSalvo = localStorage.getItem('usuario')
  
  if (!usuarioSalvo) {
    return <Navigate to="/login" replace />
  }

  const dadosUsuario = JSON.parse(usuarioSalvo)
  
  // Ajuste a validação conforme o nome do campo enviado pela sua API
  const eAdmin = dadosUsuario.role === 'admin' || dadosUsuario.tipo === 'admin'

  // Se for admin, renderiza a página interna (Outlet). Se não, joga para o Dashboard.
  return eAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />
}