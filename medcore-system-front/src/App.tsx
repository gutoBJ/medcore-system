import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import { Pacientes } from './pages/Pacientes'
import { Especialidades } from './pages/Especialidades'
import { Profissionais } from './pages/Profissionais'
import { Atendimentos } from './pages/Atendimentos'
import Navbar from './components/Navbar'

const RotaProtegida = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <RotaProtegida>
            <Navbar />
            <div className="p-6">
              <Routes>
                <Route path="/pacientes" element={<Pacientes />} />
                <Route path="/profissionais" element={<Profissionais />} />
                <Route path="/especialidades" element={<Especialidades />} />
                <Route path="/atendimentos" element={<Atendimentos />} />
                <Route path="/" element={<Navigate to="/pacientes" />} />
              </Routes>
            </div>
          </RotaProtegida>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App