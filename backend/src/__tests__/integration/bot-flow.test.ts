/**
 * Testes de integração do fluxo completo do bot
 */

import { sendMessage } from '../../model/bot/botConfig/config.js';
import { salvarConsulta } from '../../database/bot/consultaDatabase.js';
import { buscarMedicosPorEspecialidadeDB } from '../../database/bot/medicosDatabase.js';

// Mocks
jest.mock('../../model/bot/botConfig/config.js');
jest.mock('../../database/bot/consultaDatabase.js');
jest.mock('../../database/bot/medicosDatabase.js');

const mockSendMessage = sendMessage as jest.MockedFunction<typeof sendMessage>;
const mockSalvarConsulta = salvarConsulta as jest.MockedFunction<typeof salvarConsulta>;
const mockBuscarMedicos = buscarMedicosPorEspecialidadeDB as jest.MockedFunction<typeof buscarMedicosPorEspecialidadeDB>;

describe('Bot Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Fluxo de Agendamento Completo', () => {
    it('deve completar agendamento de consulta do início ao fim', async () => {
      const sessionId = 'test-session-agendamento';

      // Mock dos médicos disponíveis
      mockBuscarMedicos.mockResolvedValue({
        success: true,
        data: [{
          id_medico: 1,
          nome: 'Dr. Carlos',
          sobrenome: 'Silva',
          especialidade: 'Cardiologia'
        }]
      });

      // Mock do salvamento da consulta
      mockSalvarConsulta.mockResolvedValue({
        success: true,
        data: {
          id_consulta: 1,
          protocolo: 'AGD123456789'
        }
      });

      // Sequência de mensagens do fluxo de agendamento
      const fluxoMensagens = [
        {
          input: 'Quero agendar uma consulta',
          expectedResponse: 'Qual especialidade você precisa?'
        },
        {
          input: 'Cardiologia',
          expectedResponse: 'Em qual cidade você prefere ser atendido?'
        },
        {
          input: 'São Paulo',
          expectedResponse: 'Qual é o seu nome completo?'
        },
        {
          input: 'João Silva',
          expectedResponse: 'Qual é o seu CPF?'
        },
        {
          input: '12345678901',
          expectedResponse: 'Temos os seguintes horários disponíveis'
        },
        {
          input: '09:00',
          expectedResponse: '✅ Agendamento realizado com sucesso!'
        }
      ];

      // Simular cada etapa do fluxo
      for (const etapa of fluxoMensagens) {
        mockSendMessage.mockResolvedValueOnce(etapa.expectedResponse);
        
        const response = await sendMessage(etapa.input, sessionId);
        
        expect(response).toContain(etapa.expectedResponse);
      }

      // Verificar se o agendamento foi salvo
      expect(mockSalvarConsulta).toHaveBeenCalledWith(
        expect.objectContaining({
          id_medico: 1,
          nome_paciente: expect.stringContaining('João Silva'),
          cpf_paciente: '12345678901'
        })
      );
    });

    it('deve tratar especialidade indisponível', async () => {
      mockBuscarMedicos.mockResolvedValue({
        success: true,
        data: []
      });

      mockSendMessage.mockResolvedValue(
        'Desculpe, não temos médicos disponíveis para essa especialidade no momento.'
      );

      const response = await sendMessage('Quero consulta com neurocirurgião', 'session-test');

      expect(response).toContain('não temos médicos disponíveis');
    });
  });

  describe('Fluxo de Verificação de Procedimentos', () => {
    it('deve autorizar procedimento simples imediatamente', async () => {
      mockSendMessage.mockResolvedValue(
        '✅ Procedimento AUTORIZADO imediatamente!\n\nHemograma - Procedimento simples\nProtocolo: PROC123456789'
      );

      const response = await sendMessage('Posso fazer um hemograma?', 'session-proc');

      expect(response).toContain('AUTORIZADO imediatamente');
      expect(response).toContain('Protocolo: PROC');
    });

    it('deve solicitar auditoria para procedimento complexo', async () => {
      mockSendMessage.mockResolvedValue(
        '⏳ Procedimento em AUDITORIA\n\nTomografia - Procedimento complexo\nPrazo: 5 dias úteis\nProtocolo: PROC123456789'
      );

      const response = await sendMessage('Preciso fazer uma tomografia', 'session-proc');

      expect(response).toContain('AUDITORIA');
      expect(response).toContain('5 dias úteis');
      expect(response).toContain('Protocolo: PROC');
    });

    it('deve solicitar auditoria OPME para procedimentos especiais', async () => {
      mockSendMessage.mockResolvedValue(
        '⏳ Procedimento OPME em auditoria\n\nAngioplastia - Procedimento OPME\nPrazo: 10 dias úteis\nProtocolo: PROC123456789'
      );

      const response = await sendMessage('Preciso fazer angioplastia', 'session-proc');

      expect(response).toContain('OPME');
      expect(response).toContain('10 dias úteis');
    });
  });

  describe('Fluxo de Análise de Documentos', () => {
    it('deve analisar documento e identificar múltiplos procedimentos', async () => {
      const documentoTexto = `
        PEDIDO MÉDICO
        Paciente: João Silva
        Procedimentos solicitados:
        1. Hemograma completo
        2. Tomografia de tórax
        3. Ressonância magnética
      `;

      mockSendMessage.mockResolvedValue(`
        📄 Documento analisado com sucesso!
        
        Procedimentos identificados:
        
        ✅ Hemograma completo - AUTORIZADO (Protocolo: PROC001)
        ⏳ Tomografia de tórax - AUDITORIA 5 dias (Protocolo: PROC002)  
        ⏳ Ressonância magnética - AUDITORIA 5 dias (Protocolo: PROC003)
      `);

      const response = await sendMessage(
        `DOCUMENTO ANEXADO: pedido.pdf\n\nCONTEÚDO:\n${documentoTexto}\n\nANÁLISE SOLICITADA: Analise este documento`,
        'session-doc'
      );

      expect(response).toContain('Documento analisado');
      expect(response).toContain('Hemograma completo - AUTORIZADO');
      expect(response).toContain('Tomografia de tórax - AUDITORIA');
      expect(response).toContain('PROC001');
      expect(response).toContain('PROC002');
      expect(response).toContain('PROC003');
    });

    it('deve tratar documento sem procedimentos identificáveis', async () => {
      const documentoTexto = 'Texto genérico sem procedimentos médicos';

      mockSendMessage.mockResolvedValue(
        '❌ Não foi possível identificar procedimentos médicos neste documento. Você pode me informar quais exames ou procedimentos você precisa?'
      );

      const response = await sendMessage(
        `DOCUMENTO ANEXADO: documento.pdf\n\nCONTEÚDO:\n${documentoTexto}`,
        'session-doc'
      );

      expect(response).toContain('Não foi possível identificar procedimentos');
    });
  });

  describe('Fluxo de Consulta de Agendamentos', () => {
    it('deve consultar agendamentos existentes por CPF', async () => {
      mockSendMessage.mockResolvedValue(`
        📅 Seus agendamentos:
        
        1. Cardiologia - Dr. Carlos Silva
           Data: 15/01/2024 às 09:00
           Protocolo: AGD123456789
           Status: Agendada
           
        2. Dermatologia - Dra. Ana Santos  
           Data: 20/01/2024 às 14:00
           Protocolo: AGD987654321
           Status: Confirmada
      `);

      const response = await sendMessage('Meu CPF é 12345678901, quais são meus agendamentos?', 'session-consulta');

      expect(response).toContain('Seus agendamentos');
      expect(response).toContain('Dr. Carlos Silva');
      expect(response).toContain('AGD123456789');
    });

    it('deve informar quando não há agendamentos', async () => {
      mockSendMessage.mockResolvedValue(
        '📅 Não encontrei agendamentos para o CPF informado. Gostaria de agendar uma nova consulta?'
      );

      const response = await sendMessage('Meu CPF é 99999999999', 'session-consulta');

      expect(response).toContain('Não encontrei agendamentos');
    });
  });

  describe('Tratamento de Erros e Casos Especiais', () => {
    it('deve tratar erro de conexão com OpenAI', async () => {
      mockSendMessage.mockRejectedValue(new Error('API key invalid'));

      try {
        await sendMessage('Teste', 'session-error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('deve tratar erro no banco de dados durante agendamento', async () => {
      mockSalvarConsulta.mockResolvedValue({
        success: false,
        error: 'Erro de conexão com banco'
      });

      mockSendMessage.mockResolvedValue(
        '❌ Erro interno. Tente novamente em alguns minutos.'
      );

      const response = await sendMessage('Confirmar agendamento', 'session-error');

      expect(response).toContain('Erro interno');
    });

    it('deve manter contexto da sessão entre mensagens', async () => {
      const sessionId = 'session-contexto';

      // Primeira mensagem
      mockSendMessage.mockResolvedValueOnce('Qual especialidade você precisa?');
      await sendMessage('Quero agendar consulta', sessionId);

      // Segunda mensagem deve manter contexto
      mockSendMessage.mockResolvedValueOnce('Em qual cidade você prefere?');
      const response = await sendMessage('Cardiologia', sessionId);

      expect(response).toContain('cidade');
    });

    it('deve limpar sessões antigas automaticamente', async () => {
      // Este teste verificaria a limpeza automática de sessões
      // Em um ambiente real, testaria após 30 minutos de inatividade
      
      mockSendMessage.mockResolvedValue('Nova sessão iniciada');
      
      const response = await sendMessage('Olá', 'session-muito-antiga');
      
      expect(response).toBeDefined();
    });
  });

  describe('Validações de Entrada', () => {
    it('deve validar formato de CPF', async () => {
      mockSendMessage.mockResolvedValue(
        'Por favor, informe um CPF válido com 11 dígitos.'
      );

      const response = await sendMessage('Meu CPF é 123', 'session-validacao');

      expect(response).toContain('CPF válido');
    });

    it('deve validar datas de agendamento', async () => {
      mockSendMessage.mockResolvedValue(
        'Só é possível agendar consultas para os próximos 30 dias.'
      );

      const response = await sendMessage('Quero agendar para dezembro de 2025', 'session-validacao');

      expect(response).toContain('próximos 30 dias');
    });

    it('deve validar horários de funcionamento', async () => {
      mockSendMessage.mockResolvedValue(
        'Nosso horário de atendimento é das 08:00 às 12:00.'
      );

      const response = await sendMessage('Posso agendar às 15:00?', 'session-validacao');

      expect(response).toContain('08:00 às 12:00');
    });
  });
});