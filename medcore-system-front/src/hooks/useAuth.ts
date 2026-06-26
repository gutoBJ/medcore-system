export const useAuth = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  const isAdmin = usuario?.perfil === 'ADMIN'
  const isMedico = usuario?.perfil === 'MEDICO'
  const profissionalId = usuario?.profissional_id

  return { usuario, isAdmin, isMedico, profissionalId }
}