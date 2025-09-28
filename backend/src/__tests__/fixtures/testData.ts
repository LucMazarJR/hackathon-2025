/**
 * Dados de teste para os testes
 */

export const testUsers = {
  validUser: {
    name: 'João Silva',
    email: 'joao@test.com',
    cpf: '12345678901',
    password: 'senha123',
    user_type: 'patient' as const
  },
  
  adminUser: {
    name: 'Admin Sistema',
    email: 'admin@test.com',
    cpf: '98765432100',
    password: 'admin123',
    user_type: 'admin' as const
  },
  
  doctorUser: {
    name: 'Dr. Carlos Silva',
    email: 'carlos@test.com',
    cpf: '11122233344',
    password: 'doctor123',
    user_type: 'doctor' as const
  }
};

export const testDoctors = {
  cardiologista: {
    id_medico: 1,
    nome: 'Dr. Carlos',
    sobrenome: 'Silva',
    crm: '12345',
    id_especializacao: 1,
    telefone: '11999999999',
    email: 'carlos@test.com',
    especialidade: 'Cardiologia'
  },
  
  dermatologista: {
    id_medico: 2,
    nome: 'Dra. Ana',
    sobrenome: 'Santos',
    crm: '67890',
    id_especializacao: 2,
    telefone: '11888888888',
    email: 'ana@test.com',
    especialidade: 'Dermatologia'
  }
};

export const testConsultas = {
  agendada: {
    id_consulta: 1,
    id_medico: 1,
    nome_paciente: 'João Silva',
    cpf_paciente: '12345678901',
    data_consulta: '2024-01-15',
    hora_consulta: '09:00',
    protocolo: 'AGD123456789',
    status: 'agendada',
    observacoes: 'Consulta de rotina'
  },
  
  confirmada: {
    id_consulta: 2,
    id_medico: 2,
    nome_paciente: 'Maria Santos',
    cpf_paciente: '98765432100',
    data_consulta: '2024-01-20',
    hora_consulta: '14:00',
    protocolo: 'AGD987654321',
    status: 'confirmada',
    observacoes: 'Consulta dermatológica'
  }
};

export const testProcedimentos = {
  simples: [
    { nome: 'Hemograma completo', tipo: 'simples' },
    { nome: 'Eletrocardiograma', tipo: 'simples' },
    { nome: 'Raio-X tórax', tipo: 'simples' },
    { nome: 'Consulta médica', tipo: 'simples' }
  ],
  
  complexos: [
    { nome: 'Tomografia computadorizada', tipo: 'complexo' },
    { nome: 'Ressonância magnética', tipo: 'complexo' },
    { nome: 'Ultrassom doppler', tipo: 'complexo' },
    { nome: 'Endoscopia digestiva', tipo: 'complexo' }
  ],
  
  opme: [
    { nome: 'Angioplastia', tipo: 'opme' },
    { nome: 'Implante de marca-passo', tipo: 'opme' },
    { nome: 'Prótese de quadril', tipo: 'opme' },
    { nome: 'Stent coronário', tipo: 'opme' }
  ]
};

export const testDocuments = {
  pedidoMedico: `
    HOSPITAL TESTE
    PEDIDO MÉDICO
    
    Paciente: João Silva
    CPF: 123.456.789-01
    Data: 15/01/2024
    
    Procedimentos solicitados:
    1. Hemograma completo
    2. Tomografia de tórax
    3. Eletrocardiograma
    
    Médico: Dr. Carlos Silva
    CRM: 12345
  `,
  
  pedidoComplexo: `
    CLÍNICA ESPECIALIZADA
    SOLICITAÇÃO DE EXAMES
    
    Paciente: Maria Santos
    Idade: 45 anos
    
    Exames solicitados:
    - Ressonância magnética de crânio
    - Angioplastia coronária
    - Ultrassom doppler de carótidas
    - Hemograma + bioquímica
    
    Justificativa: Investigação de cefaleia persistente
    Urgência: Não
  `,
  
  documentoVazio: '',
  
  documentoSemProcedimentos: `
    RELATÓRIO MÉDICO
    
    Paciente compareceu à consulta apresentando bom estado geral.
    Exame físico normal.
    Orientações gerais fornecidas.
    Retorno em 6 meses.
  `
};

export const testMessages = {
  agendamento: [
    'Quero agendar uma consulta',
    'Preciso marcar com cardiologista',
    'Tem vaga para dermatologista?',
    'Quando posso consultar?'
  ],
  
  procedimentos: [
    'Posso fazer tomografia?',
    'Meu médico pediu ressonância',
    'Preciso de autorização para cirurgia',
    'Hemograma é coberto?'
  ],
  
  consultas: [
    'Quais são meus agendamentos?',
    'Meu CPF é 12345678901',
    'Consultar minhas consultas',
    'Ver agenda'
  ],
  
  saudacoes: [
    'Olá',
    'Oi',
    'Bom dia',
    'Boa tarde',
    'Preciso de ajuda'
  ]
};

export const testSessions = {
  agendamento: 'session-agendamento-test',
  procedimento: 'session-procedimento-test',
  documento: 'session-documento-test',
  consulta: 'session-consulta-test',
  default: 'default-test-session'
};

export const testFiles = {
  pdf: {
    originalname: 'pedido_medico.pdf',
    mimetype: 'application/pdf',
    size: 1024,
    path: '/tmp/test.pdf'
  },
  
  image: {
    originalname: 'exame.jpg',
    mimetype: 'image/jpeg',
    size: 2048,
    path: '/tmp/test.jpg'
  },
  
  invalidFile: {
    originalname: 'documento.txt',
    mimetype: 'text/plain',
    size: 512,
    path: '/tmp/test.txt'
  }
};

export const testResponses = {
  botSuccess: 'Olá! Como posso ajudá-lo hoje?',
  
  agendamentoSuccess: `
    ✅ Agendamento realizado com sucesso!
    
    Detalhes:
    - Especialidade: Cardiologia
    - Médico: Dr. Carlos Silva
    - Data: 15/01/2024
    - Horário: 09:00
    - Protocolo: AGD123456789
  `,
  
  procedimentoAutorizado: `
    ✅ Procedimento AUTORIZADO imediatamente!
    
    Hemograma completo - Procedimento simples
    Protocolo: PROC123456789
  `,
  
  procedimentoAuditoria: `
    ⏳ Procedimento em AUDITORIA
    
    Tomografia - Procedimento complexo
    Prazo: 5 dias úteis
    Protocolo: PROC123456789
  `,
  
  documentoAnalisado: `
    📄 Documento analisado com sucesso!
    
    Procedimentos identificados:
    ✅ Hemograma - AUTORIZADO (PROC001)
    ⏳ Tomografia - AUDITORIA 5 dias (PROC002)
  `,
  
  errorResponse: 'Erro interno do servidor',
  
  validationError: 'Por favor, informe um CPF válido'
};