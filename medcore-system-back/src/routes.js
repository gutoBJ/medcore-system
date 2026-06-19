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
const pacienteController = require("./app/controllers/paciente.Controller")

router.get('/pacientes', pacienteController.listarTodos)
router.get('/pacientes/:id', pacienteController.buscarPorId)
router.post('/pacientes', pacienteController.criar)
router.put('/pacientes/:id', pacienteController.atualizar)
router.delete('/pacientes/:id', pacienteController.remover)

module.exports = router