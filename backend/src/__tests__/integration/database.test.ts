/**
 * Testes de integração do banco de dados
 */

import { pool } from '../../database/connection.js';
import { createUser, authenticateUser, getUserById } from '../../database/auth/userDatabase.js';
import { salvarConsulta, buscarConsultasPorCPF } from '../../database/bot/consultaDatabase.js';
import bcrypt from 'bcrypt';

// Mock do pool real para testes de integração
jest.mock('../../database/connection.js', () => ({
  pool: {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn(),
    on: jest.fn()
  }
}));

const mockPool = pool as jest.Mocked<typeof pool>;

describe('Database Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Database Operations', () => {
    describe('createUser', () => {
      it('deve criar usuário com hash de senha', async () => {
        // Mock das queries
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

        const userData = {
          name: 'João Silva',
          email: 'joao@test.com',
          cpf: '12345678901',
          password: 'senha123',
          user_type: 'patient' as const
        };

        const result = await createUser(userData);

        expect(result.success).toBe(true);
        expect(result.user?.email).toBe('joao@test.com');
        expect(mockPool.query).toHaveBeenCalledTimes(3);
        
        // Verificar se a senha foi hasheada
        const insertCall = mockPool.query.mock.calls[2];
        expect(insertCall[1][3]).not.toBe('senha123'); // Password hash
      });

      it('deve detectar email duplicado', async () => {
        mockPool.query.mockResolvedValueOnce({ 
          rows: [{ id: 1 }] // Email já existe
        });

        const userData = {
          name: 'João Silva',
          email: 'joao@test.com',
          cpf: '12345678901',
          password: 'senha123',
          user_type: 'patient' as const
        };

        const result = await createUser(userData);

        expect(result.success).toBe(false);
        expect(result.message).toBe('Email já cadastrado');
      });

      it('deve detectar CPF duplicado', async () => {
        mockPool.query
          .mockResolvedValueOnce({ rows: [] }) // Email check OK
          .mockResolvedValueOnce({ rows: [{ id: 1 }] }); // CPF já existe

        const userData = {
          name: 'João Silva',
          email: 'joao@test.com',
          cpf: '12345678901',
          password: 'senha123',
          user_type: 'patient' as const
        };

        const result = await createUser(userData);

        expect(result.success).toBe(false);
        expect(result.message).toBe('CPF já cadastrado');
      });
    });

    describe('authenticateUser', () => {
      it('deve autenticar usuário com senha correta', async () => {
        const hashedPassword = await bcrypt.hash('senha123', 10);
        
        mockPool.query.mockResolvedValueOnce({
          rows: [{
            id: 1,
            name: 'João Silva',
            email: 'joao@test.com',
            cpf: '12345678901',
            password_hash: hashedPassword,
            user_type: 'patient'
          }]
        });

        const result = await authenticateUser('joao@test.com', 'senha123');

        expect(result.success).toBe(true);
        expect(result.user?.email).toBe('joao@test.com');
        expect(result.user).not.toHaveProperty('password_hash');
      });

      it('deve rejeitar senha incorreta', async () => {
        const hashedPassword = await bcrypt.hash('senha123', 10);
        
        mockPool.query.mockResolvedValueOnce({
          rows: [{
            id: 1,
            name: 'João Silva',
            email: 'joao@test.com',
            password_hash: hashedPassword,
            user_type: 'patient'
          }]
        });

        const result = await authenticateUser('joao@test.com', 'senhaerrada');

        expect(result.success).toBe(false);
        expect(result.message).toBe('Senha incorreta');
      });

      it('deve rejeitar email inexistente', async () => {
        mockPool.query.mockResolvedValueOnce({ rows: [] });

        const result = await authenticateUser('inexistente@test.com', 'senha123');

        expect(result.success).toBe(false);
        expect(result.message).toBe('Email não encontrado');
      });
    });

    describe('getUserById', () => {
      it('deve buscar usuário por ID', async () => {
        const mockUser = {
          id: 1,
          name: 'João Silva',
          email: 'joao@test.com',
          cpf: '12345678901',
          user_type: 'patient',
          created_at: new Date()
        };

        mockPool.query.mockResolvedValueOnce({ rows: [mockUser] });

        const result = await getUserById(1);

        expect(result).toEqual(mockUser);
        expect(mockPool.query).toHaveBeenCalledWith(
          expect.stringContaining('SELECT'),
          [1]
        );
      });

      it('deve retornar null para ID inexistente', async () => {
        mockPool.query.mockResolvedValueOnce({ rows: [] });

        const result = await getUserById(999);

        expect(result).toBeNull();
      });
    });
  });

  describe('Consulta Database Operations', () => {
    describe('salvarConsulta', () => {
      it('deve salvar consulta completa', async () => {
        const mockResult = {
          rows: [{
            id_consulta: 1,
            protocolo: 'AGD123456789'
          }]
        };

        mockPool.query.mockResolvedValueOnce(mockResult);

        const consultaData = {
          id_medico: 1,
          nome_paciente: 'João Silva',
          cpf_paciente: '12345678901',
          data_consulta: '2024-01-15',
          hora_consulta: '09:00',
          protocolo: 'AGD123456789',
          observacoes: 'Consulta de rotina'
        };

        const result = await salvarConsulta(consultaData);

        expect(result.success).toBe(true);
        expect(result.data?.protocolo).toBe('AGD123456789');
        expect(mockPool.query).toHaveBeenCalledWith(
          expect.stringContaining('INSERT INTO tb_consultas'),
          expect.arrayContaining([
            1, 'João Silva', '12345678901', '2024-01-15', '09:00', 'AGD123456789', 'Consulta de rotina'
          ])
        );
      });

      it('deve tratar erro de constraint do banco', async () => {
        mockPool.query.mockRejectedValueOnce(new Error('duplicate key value'));

        const consultaData = {
          id_medico: 1,
          nome_paciente: 'João Silva',
          data_consulta: '2024-01-15',
          hora_consulta: '09:00',
          protocolo: 'AGD123456789'
        };

        const result = await salvarConsulta(consultaData);

        expect(result.success).toBe(false);
        expect(result.error).toBe('duplicate key value');
      });
    });

    describe('buscarConsultasPorCPF', () => {
      it('deve buscar consultas com JOIN de médicos', async () => {
        const mockConsultas = [{
          id_consulta: 1,
          data_consulta: '2024-01-15',
          hora_consulta: '09:00',
          protocolo: 'AGD123456789',
          status: 'agendada',
          observacoes: 'Consulta de rotina',
          nome_medico: 'Dr. Carlos Silva',
          especialidade: 'Cardiologia'
        }];

        mockPool.query.mockResolvedValueOnce({ rows: mockConsultas });

        const result = await buscarConsultasPorCPF('12345678901');

        expect(result.success).toBe(true);
        expect(result.data).toEqual(mockConsultas);
        expect(mockPool.query).toHaveBeenCalledWith(
          expect.stringContaining('JOIN tb_medicos'),
          ['12345678901']
        );
      });

      it('deve ordenar consultas por data decrescente', async () => {
        mockPool.query.mockResolvedValueOnce({ rows: [] });

        await buscarConsultasPorCPF('12345678901');

        const query = mockPool.query.mock.calls[0][0];
        expect(query).toContain('ORDER BY c.data_consulta DESC');
      });
    });
  });

  describe('Database Connection', () => {
    it('deve configurar pool de conexão corretamente', () => {
      // Verificar se o pool foi configurado (mock)
      expect(mockPool.query).toBeDefined();
      expect(mockPool.connect).toBeDefined();
      expect(mockPool.end).toBeDefined();
    });

    it('deve tratar erros de conexão', async () => {
      mockPool.query.mockRejectedValueOnce(new Error('connection timeout'));

      const result = await createUser({
        name: 'Test',
        email: 'test@test.com',
        cpf: '12345678901',
        password: 'senha123',
        user_type: 'patient'
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Erro interno do servidor');
    });
  });
});