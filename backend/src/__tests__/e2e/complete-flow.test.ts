/**
 * Testes End-to-End do fluxo completo
 */

import request from 'supertest';
import { pool } from '../../database/connection.js';

// Mock completo do sistema
jest.mock('../../database/connection.js');
jest.mock('../../model/bot/botConfig/config.js');

const mockPool = pool as jest.Mocked<typeof pool>;

describe('E2E Complete Flow Tests', () => {
  let app: any;

  beforeAll(async () => {
    // Configurar app de teste
    const { createApp } = await import('../../utils/logger.js');
    app = createApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Fluxo Completo: Registro → Login → Agendamento', () => {
    it('deve completar todo o fluxo do usuário', async () => {
      // 1. REGISTRO
      mockPool.query
        .mockResolvedValueOnce({ rows: [] }) // Email check
        .mockResolvedValueOnce({ rows: [] }) // CPF check
        .mockResolvedValueOnce({ // Insert user
          rows: [{
            id: 1,
            name: 'João Silva',
            email: 'joao@e2e.com',
            cpf: '12345678901',
            user_type: 'patient'
          }]
        });

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'João Silva',
          email: 'joao@e2e.com',
          cpf: '12345678901',
          password: 'senha123',
          confirmPassword: 'senha123'
        });

      expect(registerResponse.status).toBe(201);

      // 2. LOGIN
      const bcrypt = await import('bcrypt');
      const hashedPassword = await bcrypt.hash('senha123', 10);
      
      mockPool.query.mockResolvedValueOnce({
        rows: [{
          id: 1,
          name: 'João Silva',
          email: 'joao@e2e.com',
          password_hash: hashedPassword,
          user_type: 'patient'
        }]
      });

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'joao@e2e.com',
          password: 'senha123'
        });

      expect(loginResponse.status).toBe(200);

      // 3. CHAT - AGENDAMENTO
      const { sendMessage } = await import('../../model/bot/botConfig/config.js');
      const mockSendMessage = sendMessage as jest.MockedFunction<typeof sendMessage>;
      
      mockSendMessage.mockResolvedValue('✅ Agendamento realizado com sucesso!');

      const chatResponse = await request(app)
        .post('/api/bot/message')
        .send({
          message: 'Quero agendar consulta',
          sessionId: 'e2e-session'
        });

      expect(chatResponse.status).toBe(200);
      expect(chatResponse.body.response).toContain('Agendamento realizado');
    });
  });
});