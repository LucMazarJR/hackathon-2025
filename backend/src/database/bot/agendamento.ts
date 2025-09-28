// Simulação de banco de dados para agendamentos médicos
export interface Medico {
  id: number;
  nome: string;
  especialidade: string;
  cidade: string;
  diasDisponiveis: string[];
  horariosDisponiveis: string[];
}

export interface Agendamento {
  id: string;
  medicoId: number;
  paciente: string;
  data: string;
  horario: string;
  protocolo: string;
  status: 'agendado' | 'cancelado';
}

// Banco de dados simulado de médicos
const medicos: Medico[] = [
  {
    id: 1,
    nome: "Dr. João Silva",
    especialidade: "Cardiologia",
    cidade: "São Paulo",
    diasDisponiveis: ["2025-02-03", "2025-02-05", "2025-02-07", "2025-02-10", "2025-02-12"],
    horariosDisponiveis: ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"]
  },
  {
    id: 2,
    nome: "Dra. Maria Santos",
    especialidade: "Dermatologia",
    cidade: "Rio de Janeiro",
    diasDisponiveis: ["2025-02-04", "2025-02-06", "2025-02-11", "2025-02-13", "2025-02-18"],
    horariosDisponiveis: ["08:30", "09:30", "10:30", "14:30", "15:30"]
  },
  {
    id: 3,
    nome: "Dr. Carlos Oliveira",
    especialidade: "Ortopedia",
    cidade: "São Paulo",
    diasDisponiveis: ["2025-02-05", "2025-02-07", "2025-02-12", "2025-02-14", "2025-02-19"],
    horariosDisponiveis: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00"]
  },
  {
    id: 4,
    nome: "Dra. Ana Costa",
    especialidade: "Ginecologia",
    cidade: "Belo Horizonte",
    diasDisponiveis: ["2025-02-06", "2025-02-08", "2025-02-13", "2025-02-15", "2025-02-20"],
    horariosDisponiveis: ["08:00", "09:00", "14:00", "15:00", "16:00"]
  },
  {
    id: 5,
    nome: "Dr. Pedro Lima",
    especialidade: "Neurologia",
    cidade: "São Paulo",
    diasDisponiveis: ["2025-02-10", "2025-02-12", "2025-02-17", "2025-02-19", "2025-02-24"],
    horariosDisponiveis: ["08:30", "09:30", "10:30", "14:30", "15:30", "16:30"]
  }
];

// Banco de dados simulado de agendamentos
let agendamentos: Agendamento[] = [];

export const buscarMedicosPorEspecialidade = (especialidade: string, cidade?: string): Medico[] => {
  return medicos.filter(medico => 
    medico.especialidade.toLowerCase().includes(especialidade.toLowerCase()) &&
    (!cidade || medico.cidade.toLowerCase().includes(cidade.toLowerCase()))
  );
};

export const buscarMedicosPorCidade = (cidade: string): Medico[] => {
  return medicos.filter(medico => 
    medico.cidade.toLowerCase().includes(cidade.toLowerCase())
  );
};

export const verificarDisponibilidade = (medicoId: number, data: string, horario: string): boolean => {
  const agendamentoExistente = agendamentos.find(ag => 
    ag.medicoId === medicoId && 
    ag.data === data && 
    ag.horario === horario && 
    ag.status === 'agendado'
  );
  return !agendamentoExistente;
};

export const criarAgendamento = (medicoId: number, paciente: string, data: string, horario: string): string => {
  const protocolo = `AGD${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const novoAgendamento: Agendamento = {
    id: `${Date.now()}`,
    medicoId,
    paciente,
    data,
    horario,
    protocolo,
    status: 'agendado'
  };
  
  agendamentos.push(novoAgendamento);
  return protocolo;
};

export const obterMedicoPorId = (id: number): Medico | undefined => {
  return medicos.find(medico => medico.id === id);
};

export const obterAgendamentoPorProtocolo = (protocolo: string): Agendamento | undefined => {
  return agendamentos.find(ag => ag.protocolo === protocolo);
};

export const listarEspecialidades = (): string[] => {
  return [...new Set(medicos.map(medico => medico.especialidade))];
};

export const listarCidades = (): string[] => {
  return [...new Set(medicos.map(medico => medico.cidade))];
};