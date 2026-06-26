const jwt = require('jsonwebtoken')

const autenticar = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // "Bearer TOKEN"

  if (!token) return res.status(401).json({ erro: 'Token não fornecido' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = decoded
    next()
  } catch (error) {
    res.status(403).json({ erro: 'Token inválido ou expirado' })
  }
}

const somenteAdmin = (req, res, next) => {
  if (req.usuario?.perfil !== 'ADMIN') {
    return res.status(403).json({ erro: 'Apenas usuarios ADMIN podem acessar este recurso' })
  }

  next()
}

module.exports = autenticar
module.exports.somenteAdmin = somenteAdmin
