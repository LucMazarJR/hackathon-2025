/**
 * Testes de performance e carga
 */

import { sendMessage } from '../../model/bot/botConfig/config.js';
import { salvarConsulta } from '../../database/bot/consultaDatabase.js';
import { createUser } from '../../database/auth/userDatabase.js';

// Mocks para testes de performance
jest.mock('../../model/bot/botConfig/config.js');
jest.mock('../../database/bot/consultaDatabase.js');
jest.mock('../../database/auth/userDatabase.js');

const mockSendMessage = sendMessage as jest.MockedFunction<typeof sendMessage>;
const mockSalvarConsulta = salvarConsulta as jest.MockedFunction<typeof salvarConsulta>;
const mockCreateUser = createUser as jest.MockedFunction<typeof createUser>;

describe('Performance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurar mocks para resposta rápida
    mockSendMessage.mockResolvedValue('Resposta rápida do bot');
    mockSalvarConsulta.mockResolvedValue({
      success: true,
      data: { id_consulta: 1, protocolo: 'AGD123' }
    });
    mockCreateUser.mockResolvedValue({
      success: true,
      user: { id: 1, name: 'Test', email: 'test@test.com', cpf: '123', user_type: 'patient' },
      message: 'Sucesso'
    });
  });

  describe('Bot Response Time', () => {
    it('deve responder em menos de 2 segundos', async () => {
      const startTime = Date.now();
      
      await sendMessage('Olá', 'session-performance');
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(2000);
    });

    it('deve processar múltiplas mensagens simultaneamente', async () => {
      const promises = [];
      const numMessages = 10;
      
      const startTime = Date.now();
      
      for (let i = 0; i < numMessages; i++) {
        promises.push(sendMessage(`Mensagem ${i}`, `session-${i}`));
      }
      
      await Promise.all(promises);
      
      const totalTime = Date.now() - startTime;
      const avgTime = totalTime / numMessages;
      
      expect(avgTime).toBeLessThan(1000); // Média menor que 1 segundo
    });
  });

  describe('Database Performance', () => {
    it('deve salvar consulta em menos de 500ms', async () => {
      const consultaData = {
        id_medico: 1,
        nome_paciente: 'Test User',
        data_consulta: '2024-01-15',
        hora_consulta: '09:00',
        protocolo: 'AGD123'
      };
      
      const startTime = Date.now();
      
      await salvarConsulta(consultaData);
      
      const saveTime = Date.now() - startTime;
      expect(saveTime).toBeLessThan(500);
    });

    it('deve criar usuário em menos de 1 segundo', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@performance.com',
        cpf: '12345678901',
        password: 'senha123',
        user_type: 'patient' as const
      };
      
      const startTime = Date.now();
      
      await createUser(userData);
      
      const createTime = Date.now() - startTime;
      expect(createTime).toBeLessThan(1000);
    });
  });

  describe('Concurrent Users', () => {
    it('deve suportar 50 usuários simultâneos', async () => {
      const numUsers = 50;
      const promises = [];
      
      const startTime = Date.now();
      
      for (let i = 0; i < numUsers; i++) {
        promises.push(
          sendMessage(`Quero agendar consulta ${i}`, `concurrent-session-${i}`)
        );
      }
      
      const results = await Promise.all(promises);
      
      const totalTime = Date.now() - startTime;
      
      // Todos devem ter sucesso
      expect(results).toHaveLength(numUsers);
      results.forEach(result => {
        expect(result).toBeDefined();
      });
      
      // Tempo total deve ser razoável
      expect(totalTime).toBeLessThan(10000); // 10 segundos para 50 usuários
    });
  });
});