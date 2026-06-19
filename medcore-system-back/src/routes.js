const express = require('express')
const router = express.Router()

// Rotas Especialidades
const especialidadeController = require('./app/controllers/especialidadeController')

router.get('/especialidades', especialidadeController.listarTodas)
router.get('/especialidades/:id', especialidadeController.buscarPorId)
router.post('/especialidades', especialidadeController.criar)
router.put('/especialidades/:id', especialidadeController.atualizar)
router.delete('/especialidades/:id', especialidadeController.remover)

// Rotas Pacientes
const pacienteController = require("./app/controllers/pacienteController")

router.get('/pacientes', pacienteController.listarTodos)
router.get('/pacientes/:id', pacienteController.buscarPorId)
router.post('/pacientes', pacienteController.criar)
router.put('/pacientes/:id', pacienteController.atualizar)
router.delete('/pacientes/:id', pacienteController.remover)

// Rotas Profissionais
const profissionalController = require("./app/controllers/profissionalController")

router.get('/profissionais', profissionalController.listarTodos)
router.get('/profissionais/:id', profissionalController.buscarPorId)
router.post('/profissionais', profissionalController.criar)
router.put('/profissionais/:id', profissionalController.atualizar)
router.delete('/profissionais/:id', profissionalController.remover)

// Rotas Atendimentos
const atendimentoController = require("./app/controllers/atendimentoController")

router.get('/atendimentos', atendimentoController.listarTodos)
router.get('/atendimentos/:id', atendimentoController.buscarPorId)
router.post('/atendimentos', atendimentoController.criar)
router.put('/atendimentos/:id', atendimentoController.atualizar)
router.delete('/atendimentos/:id', atendimentoController.remover)

module.exports = router