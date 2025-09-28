import { Router } from 'express';
import { buscarMedicos, verificarDisponibilidadeController, realizarAgendamentoController, consultarAgendamento, listarEspecialidadesController, listarCidadesController } from '../../controller/bot/agendamentoController.js';
const router = Router();
// Rota para buscar médicos por especialidade e/ou cidade
router.get('/medicos', buscarMedicos);
// Rota para verificar disponibilidade de horário
router.post('/verificar-disponibilidade', verificarDisponibilidadeController);
// Rota para realizar agendamento
router.post('/agendar', realizarAgendamentoController);
// Rota para consultar agendamento por protocolo
router.get('/consultar/:protocolo', consultarAgendamento);
// Rota para listar especialidades disponíveis
router.get('/especialidades', listarEspecialidadesController);
// Rota para listar cidades disponíveis
router.get('/cidades', listarCidadesController);
export default router;
