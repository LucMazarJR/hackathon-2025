import { buscarMedicosPorEspecialidade, buscarMedicosPorCidade, verificarDisponibilidade, criarAgendamento, obterMedicoPorId, obterAgendamentoPorProtocolo, listarEspecialidades, listarCidades } from '../../database/bot/agendamento.js';
// Controlador para buscar médicos
export const buscarMedicos = async (req, res) => {
    try {
        const { especialidade, cidade } = req.query;
        let medicos;
        if (especialidade && cidade) {
            medicos = buscarMedicosPorEspecialidade(especialidade, cidade);
        }
        else if (especialidade) {
            medicos = buscarMedicosPorEspecialidade(especialidade);
        }
        else if (cidade) {
            medicos = buscarMedicosPorCidade(cidade);
        }
        else {
            return res.status(400).json({ error: 'Informe pelo menos especialidade ou cidade' });
        }
        res.json({ medicos });
    }
    catch (error) {
        console.error('Erro ao buscar médicos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
// Controlador para verificar disponibilidade
export const verificarDisponibilidadeController = async (req, res) => {
    try {
        const { medicoId, data, horario } = req.body;
        if (!medicoId || !data || !horario) {
            return res.status(400).json({ error: 'Informe medicoId, data e horario' });
        }
        const disponivel = verificarDisponibilidade(Number(medicoId), data, horario);
        const medico = obterMedicoPorId(Number(medicoId));
        res.json({
            disponivel,
            medico: medico ? { nome: medico.nome, especialidade: medico.especialidade } : null
        });
    }
    catch (error) {
        console.error('Erro ao verificar disponibilidade:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
// Controlador para realizar agendamento
export const realizarAgendamentoController = async (req, res) => {
    try {
        const { medicoId, paciente, data, horario } = req.body;
        if (!medicoId || !paciente || !data || !horario) {
            return res.status(400).json({ error: 'Informe todos os campos obrigatórios' });
        }
        const medico = obterMedicoPorId(Number(medicoId));
        if (!medico) {
            return res.status(404).json({ error: 'Médico não encontrado' });
        }
        const disponivel = verificarDisponibilidade(Number(medicoId), data, horario);
        if (!disponivel) {
            return res.status(409).json({ error: 'Horário não disponível' });
        }
        const protocolo = criarAgendamento(Number(medicoId), paciente, data, horario);
        res.json({
            success: true,
            protocolo,
            agendamento: {
                medico: medico.nome,
                especialidade: medico.especialidade,
                cidade: medico.cidade,
                data,
                horario,
                paciente
            }
        });
    }
    catch (error) {
        console.error('Erro ao realizar agendamento:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
// Controlador para consultar agendamento por protocolo
export const consultarAgendamento = async (req, res) => {
    try {
        const { protocolo } = req.params;
        const agendamento = obterAgendamentoPorProtocolo(protocolo);
        if (!agendamento) {
            return res.status(404).json({ error: 'Agendamento não encontrado' });
        }
        const medico = obterMedicoPorId(agendamento.medicoId);
        res.json({
            agendamento: {
                protocolo: agendamento.protocolo,
                paciente: agendamento.paciente,
                data: agendamento.data,
                horario: agendamento.horario,
                status: agendamento.status,
                medico: medico ? {
                    nome: medico.nome,
                    especialidade: medico.especialidade,
                    cidade: medico.cidade
                } : null
            }
        });
    }
    catch (error) {
        console.error('Erro ao consultar agendamento:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
// Controlador para listar especialidades
export const listarEspecialidadesController = async (req, res) => {
    try {
        const especialidades = listarEspecialidades();
        res.json({ especialidades });
    }
    catch (error) {
        console.error('Erro ao listar especialidades:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
// Controlador para listar cidades
export const listarCidadesController = async (req, res) => {
    try {
        const cidades = listarCidades();
        res.json({ cidades });
    }
    catch (error) {
        console.error('Erro ao listar cidades:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
