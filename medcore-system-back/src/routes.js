const express = require('express')
const router = express.Router()
const autenticar = require('./app/middlewares/auth')

// Rotas públicas (não exigem token)
const authController = require('./app/controllers/authController')
router.post('/auth/register', authController.register)
router.post('/auth/login', authController.login)


// Rotas protegidas (exigem token)

// Rotas Especialidades
const especialidadeController = require('./app/controllers/especialidadeController')

router.get('/especialidades', autenticar, especialidadeController.listarTodas)
router.get('/especialidades/:id', autenticar, especialidadeController.buscarPorId)
router.post('/especialidades', autenticar, especialidadeController.criar)
router.put('/especialidades/:id', autenticar, especialidadeController.atualizar)
router.delete('/especialidades/:id', autenticar, especialidadeController.remover)

// Rotas Pacientes
const pacienteController = require("./app/controllers/pacienteController")

router.get('/pacientes', autenticar, pacienteController.listarTodos)
router.get('/pacientes/:id', autenticar, pacienteController.buscarPorId)
router.post('/pacientes', autenticar, pacienteController.criar)
router.put('/pacientes/:id', autenticar, pacienteController.atualizar)
router.delete('/pacientes/:id', autenticar, pacienteController.remover)

// Rotas Profissionais
const profissionalController = require("./app/controllers/profissionalController")

router.get('/profissionais', autenticar, profissionalController.listarTodos)
router.get('/profissionais/:id', autenticar, profissionalController.buscarPorId)
router.post('/profissionais', autenticar, profissionalController.criar)
router.put('/profissionais/:id', autenticar, profissionalController.atualizar)
router.delete('/profissionais/:id', autenticar, profissionalController.remover)

// Rotas Atendimentos
const atendimentoController = require("./app/controllers/atendimentoController")

router.get('/atendimentos', autenticar, atendimentoController.listarTodos)
router.get('/atendimentos/filtrar', autenticar, atendimentoController.filtrarPorData)
router.get('/atendimentos/:id', autenticar, atendimentoController.buscarPorId)
router.post('/atendimentos', autenticar, atendimentoController.criar)
router.put('/atendimentos/:id', autenticar, atendimentoController.atualizar)
router.delete('/atendimentos/:id', autenticar, atendimentoController.remover)

module.exports = router