import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Pacientes from './pages/Pacientes'
import Especialidades from './pages/Especialidades'
import Profissionais from './pages/Profissionais'
import Atendimentos from './pages/Atendimentos'
import Usuarios from './pages/Usuarios'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Footer from './components/Footer'

// Valida se o usuário está logado
const RotaProtegida = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

// Valida se o usuário logado é administrador
const RotaAdmin = ({ children }: { children: React.ReactNode }) => {
  const usuarioSalvo = localStorage.getItem('usuario')
  
  if (!usuarioSalvo) return <Navigate to="/login" />

  try {
    const dadosUsuario = JSON.parse(usuarioSalvo)
    // Altere 'role' ou 'tipo' para a propriedade exata que o seu backend retorna
    const eAdmin = dadosUsuario.perfil === 'ADMIN' || dadosUsuario.tipo === 'ADMIN'
    
    return eAdmin ? children : <Navigate to="/dashboard" />
  } catch {
    return <Navigate to="/dashboard" />
  }
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <RotaProtegida>
            <Navbar />
            <div className="p-3 pb-20 md:p-6">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pacientes" element={<Pacientes />} />
                <Route path="/profissionais" element={<Profissionais />} />
                <Route path="/especialidades" element={<Especialidades />} />
                <Route path="/atendimentos" element={<Atendimentos />} />
                
                {/* Rota de Usuários protegida especificamente para Administradores */}
                <Route path="/usuarios" element={
                  <RotaAdmin>
                    <Usuarios />
                  </RotaAdmin>
                } />
              </Routes>
            </div>
            <Footer />
          </RotaProtegida>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App