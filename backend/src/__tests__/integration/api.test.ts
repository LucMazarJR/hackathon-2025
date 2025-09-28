/**
 * Testes de integração da API
 */

import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { pool } from '../../database/connection.js';

// Mock do banco de dados
jest.mock('../../database/connection.js', () => ({
  pool: {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn(),
    on: jest.fn()
  }
}));

// Mock do OpenAI
jest.mock('../../model/bot/botConfig/config.js', () => ({
  sendMessage: jest.fn().mockResolvedValue('Resposta do bot de teste')
}));

const mockPool = pool as jest.Mocked<typeof pool>;

// Criar app de teste
const createTestApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  
  // Importar rotas após os mocks
  return import('../../utils/logger.js').then(({ createApp }) => {
    return createApp();
  });
};

describe('API Integration Tests', () => {
  let app: express.Application;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Auth Endpoints', () => {
    describe('POST /api/auth/register', () => {
      it('deve registrar usuário com sucesso', async () => {
        mockPool.query
          .mockResolvedValueOnce({ rows: [] }) // Email check
          .mockResolvedValueOnce({ rows: [] }) // CPF check
          .mockResolvedValueOnce({ // Insert user
            rows: [{
              id: 1,
              name: 'João Silva',
              email: 'joao@test.com',
              cpf: '12345678901',
              user_type: 'patient',
              created_at: new Date()
            }]
          });

        const response = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'João Silva',
            email: 'joao@test.com',
            cpf: '12345678901',
            password: 'senha123',
            confirmPassword: 'senha123'
          });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Usuário cadastrado com sucesso');
        expect(response.body.user.email).toBe('joao@test.com');
      });

      it('deve rejeitar email duplicado', async () => {
        mockPool.query.mockResolvedValueOnce({ 
          rows: [{ id: 1 }] // Email já existe
        });

        const response = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'João Silva',
            email: 'joao@test.com',
            cpf: '12345678901',
            password: 'senha123',
            confirmPassword: 'senha123'
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Email já cadastrado');
      });
    });

    describe('POST /api/auth/login', () => {
      it('deve fazer login com credenciais válidas', async () => {
        const mockUser = {
          id: 1,
          name: 'João Silva',
          email: 'joao@test.com',
          cpf: '12345678901',
          password_hash: '$2b$10$hashedpassword',
          user_type: 'patient'
        };

        mockPool.query.mockResolvedValueOnce({ rows: [mockUser] });

        // Mock do bcrypt
        const bcrypt = await import('bcrypt');
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'joao@test.com',
            password: 'senha123'
          });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login realizado com sucesso');
        expect(response.body.user.email).toBe('joao@test.com');
      });

      it('deve rejeitar credenciais inválidas', async () => {
        mockPool.query.mockResolvedValueOnce({ rows: [] });

        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'inexistente@test.com',
            password: 'senha123'
          });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Email não encontrado');
      });
    });
  });

  describe('Bot Endpoints', () => {
    describe('POST /api/bot/message', () => {
      it('deve processar mensagem do bot', async () => {
        const response = await request(app)
          .post('/api/bot/message')
          .send({
            message: 'Olá, preciso agendar uma consulta',
            sessionId: 'test-session'
          });

        expect(response.status).toBe(200);
        expect(response.body.response).toBe('Resposta do bot de teste');
      });

      it('deve rejeitar mensagem vazia', async () => {
        const response = await request(app)
          .post('/api/bot/message')
          .send({
            message: '',
            sessionId: 'test-session'
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Mensagem é obrigatória');
      });
    });

    describe('POST /api/bot/document', () => {
      it('deve processar upload de documento', async () => {
        const response = await request(app)
          .post('/api/bot/document')
          .attach('document', Buffer.from('PDF content'), 'test.pdf')
          .field('message', 'Analise este documento')
          .field('sessionId', 'test-session');

        expect(response.status).toBe(200);
        expect(response.body.response).toBeDefined();
      });
    });
  });

  describe('Agendamentos Endpoints', () => {
    describe('GET /api/agendamentos', () => {
      it('deve listar agendamentos por CPF', async () => {
        const mockConsultas = [{
          id_consulta: 1,
          data_consulta: '2024-01-15',
          hora_consulta: '09:00',
          protocolo: 'AGD123456789',
          nome_medico: 'Dr. Carlos Silva',
          especialidade: 'Cardiologia'
        }];

        mockPool.query.mockResolvedValueOnce({ rows: mockConsultas });

        const response = await request(app)
          .get('/api/agendamentos')
          .query({ cpf: '12345678901' });

        expect(response.status).toBe(200);
        expect(response.body.consultas).toEqual(mockConsultas);
      });

      it('deve rejeitar CPF inválido', async () => {
        const response = await request(app)
          .get('/api/agendamentos')
          .query({ cpf: '123' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('CPF inválido');
      });
    });

    describe('POST /api/agendamentos', () => {
      it('deve criar novo agendamento', async () => {
        const mockResult = {
          rows: [{
            id_consulta: 1,
            protocolo: 'AGD123456789'
          }]
        };

        mockPool.query.mockResolvedValueOnce(mockResult);

        const response = await request(app)
          .post('/api/agendamentos')
          .send({
            id_medico: 1,
            nome_paciente: 'João Silva',
            cpf_paciente: '12345678901',
            data_consulta: '2024-01-15',
            hora_consulta: '09:00',
            observacoes: 'Consulta de rotina'
          });

        expect(response.status).toBe(201);
        expect(response.body.protocolo).toBe('AGD123456789');
      });
    });
  });

  describe('Admin Endpoints', () => {
    describe('GET /api/admin/doctors', () => {
      it('deve listar médicos', async () => {
        const mockDoctors = [{
          id_medico: 1,
          nome: 'Dr. Carlos',
          sobrenome: 'Silva',
          especialidade: 'Cardiologia'
        }];

        mockPool.query.mockResolvedValueOnce({ rows: mockDoctors });

        const response = await request(app)
          .get('/api/admin/doctors');

        expect(response.status).toBe(200);
        expect(response.body.doctors).toEqual(mockDoctors);
      });
    });

    describe('POST /api/admin/doctors', () => {
      it('deve criar novo médico', async () => {
        const mockResult = {
          rows: [{
            id_medico: 1,
            nome: 'Dr. Carlos',
            sobrenome: 'Silva'
          }]
        };

        mockPool.query.mockResolvedValueOnce(mockResult);

        const response = await request(app)
          .post('/api/admin/doctors')
          .send({
            nome: 'Dr. Carlos',
            sobrenome: 'Silva',
            crm: '12345',
            id_especializacao: 1,
            telefone: '11999999999',
            email: 'carlos@test.com'
          });

        expect(response.status).toBe(201);
        expect(response.body.doctor.nome).toBe('Dr. Carlos');
      });
    });
  });
});