/**
 * Mocks para banco de dados
 */

export const mockPool = {
  query: jest.fn(),
  connect: jest.fn(),
  end: jest.fn(),
  on: jest.fn()
};

export const mockUser = {
  id: 1,
  name: 'João Silva',
  email: 'joao@test.com',
  cpf: '12345678901',
  user_type: 'patient',
  created_at: new Date()
};

export const mockDoctor = {
  id_medico: 1,
  nome: 'Dr. Carlos',
  sobrenome: 'Silva',
  crm: '12345',
  id_especializacao: 1,
  telefone: '11999999999',
  email: 'carlos@test.com'
};

export const mockConsulta = {
  id_consulta: 1,
  id_medico: 1,
  nome_paciente: 'João Silva',
  cpf_paciente: '12345678901',
  data_consulta: '2024-01-15',
  hora_consulta: '09:00',
  protocolo: 'AGD123456789',
  status: 'agendada',
  observacoes: 'Consulta de rotina'
};