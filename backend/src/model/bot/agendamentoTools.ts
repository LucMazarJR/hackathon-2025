import { tool } from "@openai/agents";
import { 
  buscarMedicosPorEspecialidade, 
  buscarMedicosPorCidade,
  verificarDisponibilidade,
  criarAgendamento,
  obterMedicoPorId,
  listarEspecialidades,
  listarCidades,
  buscarConsultasMedico,
  buscarConsultasPaciente,
  buscarProcedimento,
  Medico
} from "../../database/bot/agendamento.js";

// Função para verificar se uma data está dentro do próximo mês
const isWithinNextMonth = (dateString: string): boolean => {
  const today = new Date();
  const oneMonthFromNow = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const checkDate = new Date(dateString);
  return checkDate >= today && checkDate <= oneMonthFromNow;
};

// Tool para buscar médicos disponíveis
export const buscarMedicosDisponiveis = tool({
  name: "buscar_medicos_disponiveis",
  description: "Busca médicos disponíveis por especialidade e/ou cidade",
  parameters: {
    type: "object",
    properties: {
      especialidade: {
        type: "string",
        description: "Especialidade médica desejada"
      },
      cidade: {
        type: "string",
        description: "Cidade onde deseja a consulta"
      }
    },
    required: ["especialidade"],
    additionalProperties: false
  },
  execute: async ({ especialidade, cidade }: any) => {
    let medicos: Medico[] = [];
    
    if (cidade) {
      medicos = buscarMedicosPorEspecialidade(especialidade, cidade);
    } else {
      medicos = buscarMedicosPorEspecialidade(especialidade);
    }

    if (medicos.length === 0) {
      return "Não foram encontrados médicos disponíveis com os critérios informados.";
    }

    // Filtrar apenas datas dentro do próximo mês
    const medicosComDisponibilidade = medicos.map(medico => ({
      ...medico,
      diasDisponiveis: medico.diasDisponiveis.filter(dia => isWithinNextMonth(dia))
    })).filter(medico => medico.diasDisponiveis.length > 0);

    if (medicosComDisponibilidade.length === 0) {
      return "Não há vagas disponíveis no período de 1 mês para os critérios informados.";
    }

    return medicosComDisponibilidade.map(medico => 
      `ID: ${medico.id} - ${medico.nome} (${medico.especialidade}) - ${medico.cidade}\n` +
      `Dias disponíveis: ${medico.diasDisponiveis.join(", ")}\n` +
      `Horários: ${medico.horariosDisponiveis.join(", ")}\n`
    ).join("\n");
  }
});

// Tool para verificar disponibilidade específica
export const verificarDisponibilidadeEspecifica = tool({
  name: "verificar_disponibilidade",
  description: "Verifica se um horário específico está disponível para um médico",
  parameters: {
    type: "object",
    properties: {
      medicoId: {
        type: "number",
        description: "ID do médico"
      },
      data: {
        type: "string",
        description: "Data desejada no formato YYYY-MM-DD"
      },
      horario: {
        type: "string",
        description: "Horário desejado no formato HH:MM"
      }
    },
    required: ["medicoId", "data", "horario"],
    additionalProperties: false
  },
  execute: async ({ medicoId, data, horario }: any) => {
    const medico = obterMedicoPorId(medicoId);
    
    if (!medico) {
      return "Médico não encontrado.";
    }

    if (!isWithinNextMonth(data)) {
      return "Data fora do período de agendamento (próximo mês).";
    }

    if (!medico.diasDisponiveis.includes(data)) {
      return `O médico ${medico.nome} não atende na data ${data}.`;
    }

    if (!medico.horariosDisponiveis.includes(horario)) {
      return `O horário ${horario} não está disponível para o médico ${medico.nome}.`;
    }

    const disponivel = verificarDisponibilidade(medicoId, data, horario);
    
    if (disponivel) {
      return `Horário disponível: ${medico.nome} - ${data} às ${horario}`;
    } else {
      return `Horário já ocupado: ${medico.nome} - ${data} às ${horario}`;
    }
  }
});

// Tool para realizar agendamento
export const realizarAgendamento = tool({
  name: "realizar_agendamento",
  description: "Realiza o agendamento de uma consulta médica",
  parameters: {
    type: "object",
    properties: {
      medicoId: {
        type: "number",
        description: "ID do médico"
      },
      paciente: {
        type: "string",
        description: "Nome do paciente"
      },
      data: {
        type: "string",
        description: "Data da consulta no formato YYYY-MM-DD"
      },
      horario: {
        type: "string",
        description: "Horário da consulta no formato HH:MM"
      }
    },
    required: ["medicoId", "paciente", "data", "horario"],
    additionalProperties: false
  },
  execute: async ({ medicoId, paciente, data, horario }: any) => {
    const medico = obterMedicoPorId(medicoId);
    
    if (!medico) {
      return "Erro: Médico não encontrado.";
    }

    if (!isWithinNextMonth(data)) {
      return "Erro: Data fora do período de agendamento (próximo mês).";
    }

    if (!medico.diasDisponiveis.includes(data)) {
      return `Erro: O médico ${medico.nome} não atende na data ${data}.`;
    }

    if (!medico.horariosDisponiveis.includes(horario)) {
      return `Erro: O horário ${horario} não está disponível para o médico ${medico.nome}.`;
    }

    const disponivel = verificarDisponibilidade(medicoId, data, horario);
    
    if (!disponivel) {
      return `Erro: Horário já ocupado para ${medico.nome} - ${data} às ${horario}`;
    }

    const protocolo = criarAgendamento(medicoId, paciente, data, horario);
    
    return `✅ Agendamento realizado com sucesso!\n\n` +
           `📋 PROTOCOLO: ${protocolo}\n` +
           `👨‍⚕️ Médico: ${medico.nome}\n` +
           `🏥 Especialidade: ${medico.especialidade}\n` +
           `📍 Cidade: ${medico.cidade}\n` +
           `📅 Data: ${data}\n` +
           `🕐 Horário: ${horario}\n` +
           `👤 Paciente: ${paciente}\n\n` +
           `⚠️ Importante: Guarde o protocolo ${protocolo} para futuras consultas sobre este agendamento.`;
  }
});

// Tool para listar especialidades disponíveis
export const listarEspecialidadesDisponiveis = tool({
  name: "listar_especialidades",
  description: "Lista todas as especialidades médicas disponíveis",
  parameters: {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: false
  },
  execute: async () => {
    const especialidades = listarEspecialidades();
    return `Especialidades disponíveis:\n${especialidades.map(esp => `• ${esp}`).join("\n")}`;
  }
});

// Tool para listar cidades disponíveis
export const listarCidadesDisponiveis = tool({
  name: "listar_cidades",
  description: "Lista todas as cidades onde há médicos disponíveis",
  parameters: {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: false
  },
  execute: async () => {
    const cidades = listarCidades();
    return `Cidades disponíveis:\n${cidades.map(cidade => `• ${cidade}`).join("\n")}`;
  }
});

// Tool para consultar agendamentos do médico
export const consultarAgendamentosMedico = tool({
  name: "consultar_agendamentos_medico",
  description: "Consulta os agendamentos de um médico (próximas consultas e todas agendadas)",
  parameters: {
    type: "object",
    properties: {
      medicoId: {
        type: "number",
        description: "ID do médico"
      },
      periodo: {
        type: "string",
        enum: ["proximas", "todas"],
        description: "Período das consultas: 'proximas' (próximos 7 dias) ou 'todas' (todas agendadas)"
      }
    },
    required: ["medicoId"],
    additionalProperties: false
  },
  execute: async ({ medicoId, periodo = "proximas" }: any) => {
    const consultas = buscarConsultasMedico(medicoId, periodo);
    
    if (consultas.length === 0) {
      return periodo === "proximas" 
        ? "Você não tem consultas agendadas para os próximos 7 dias."
        : "Você não tem consultas agendadas.";
    }

    const titulo = periodo === "proximas" 
      ? "📅 Suas próximas consultas (7 dias):"
      : "📋 Todas suas consultas agendadas:";

    return titulo + "\n\n" + consultas.map(consulta => 
      `🗓️ ${consulta.data} às ${consulta.horario}\n` +
      `👤 Paciente: ${consulta.paciente}\n` +
      `📋 Protocolo: ${consulta.protocolo}\n` +
      `📍 Status: ${consulta.status}\n`
    ).join("\n") + "\n\n💡 Acesse o calendário do sistema para mais detalhes.";
  }
});

// Tool para consultar agendamentos do paciente
export const consultarAgendamentosPaciente = tool({
  name: "consultar_agendamentos_paciente",
  description: "Consulta os agendamentos de um paciente (próximas consultas e histórico)",
  parameters: {
    type: "object",
    properties: {
      cpfPaciente: {
        type: "string",
        description: "CPF do paciente"
      },
      periodo: {
        type: "string",
        enum: ["proximas", "todas"],
        description: "Período das consultas: 'proximas' (próximos 7 dias) ou 'todas' (histórico completo)"
      }
    },
    required: ["cpfPaciente"],
    additionalProperties: false
  },
  execute: async ({ cpfPaciente, periodo = "proximas" }: any) => {
    const consultas = buscarConsultasPaciente(cpfPaciente, periodo);
    
    if (consultas.length === 0) {
      return periodo === "proximas" 
        ? "Você não tem consultas agendadas para os próximos 7 dias."
        : "Você não tem consultas no histórico.";
    }

    const titulo = periodo === "proximas" 
      ? "📅 Suas próximas consultas (7 dias):"
      : "📋 Seu histórico de consultas:";

    return titulo + "\n\n" + consultas.map(consulta => 
      `🗓️ ${consulta.data} às ${consulta.horario}\n` +
      `👨⚕️ Médico: ${consulta.medico}\n` +
      `🏥 Especialidade: ${consulta.especialidade}\n` +
      `📋 Protocolo: ${consulta.protocolo}\n` +
      `📍 Status: ${consulta.status}\n`
    ).join("\n") + "\n\n💡 Acesse o calendário do sistema para visualização completa.";
  }
});

// Tool para verificar procedimentos médicos
export const verificarProcedimento = tool({
  name: "verificar_procedimento",
  description: "Verifica se um procedimento/exame é coberto pelo plano e qual tipo de auditoria precisa",
  parameters: {
    type: "object",
    properties: {
      nomeProcedimento: {
        type: "string",
        description: "Nome do procedimento ou exame solicitado"
      }
    },
    required: ["nomeProcedimento"],
    additionalProperties: false
  },
  execute: async ({ nomeProcedimento }: any) => {
    const procedimento = buscarProcedimento(nomeProcedimento);
    
    if (!procedimento) {
      const protocolo = `PROC${Date.now()}${Math.floor(Math.random() * 1000)}`;
      return `❌ Procedimento "${nomeProcedimento}": Não coberto pelo plano\n📋 Protocolo: ${protocolo}`;
    }

    const protocolo = `PROC${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    switch (procedimento.tipo) {
      case "Sem Auditoria":
        return `✅ Procedimento "${nomeProcedimento}": Autorizado imediatamente\n📋 Protocolo: ${protocolo}`;
      
      case "Auditoria":
        return `🔍 Procedimento "${nomeProcedimento}": Precisa de auditoria, prazo 5 dias úteis\n📋 Protocolo: ${protocolo}\n📱 Acompanhe pelo app/WhatsApp`;
      
      case "OPME":
        return `🏥 Procedimento "${nomeProcedimento}": Precisa de auditoria OPME, prazo 10 dias úteis\n📋 Protocolo: ${protocolo}\n📱 Acompanhe pelo app/WhatsApp`;
      
      default:
        return `❌ Procedimento "${nomeProcedimento}": Tipo de auditoria não reconhecido\n📋 Protocolo: ${protocolo}`;
    }
  }
});