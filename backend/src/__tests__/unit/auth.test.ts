/**
 * Testes unitários para autenticação
 */

import { registerController, loginController } from '../../controller/auth/authController.js';
import { createUser, authenticateUser } from '../../database/auth/userDatabase.js';

// Mock das funções do banco
jest.mock('../../database/auth/userDatabase.js', () => ({
  createUser: jest.fn(),
  authenticateUser: jest.fn()
}));

const mockCreateUser = createUser as jest.MockedFunction<typeof createUser>;
const mockAuthenticateUser = authenticateUser as jest.MockedFunction<typeof authenticateUser>;

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerController', () => {
    it('deve registrar usuário com dados válidos', async () => {
      const mockUser = {
        id: 1,
        name: 'João Silva',
        email: 'joao@test.com',
        cpf: '12345678901',
        user_type: 'patient' as const
      };

      mockCreateUser.mockResolvedValue({
        success: true,
        user: mockUser,
        message: 'Usuário cadastrado com sucesso'
      });

      const [status, response] = await registerController(
        'João Silva',
        'joao@test.com',
        '12345678901',
        'senha123',
        'senha123'
      );

      expect(status).toBe(201);
      expect(response.message).toBe('Usuário cadastrado com sucesso');
      expect(response.user).toEqual(mockUser);
    });

    it('deve rejeitar senhas que não coincidem', async () => {
      const [status, response] = await registerController(
        'João Silva',
        'joao@test.com',
        '12345678901',
        'senha123',
        'senha456'
      );

      expect(status).toBe(400);
      expect(response.message).toBe('Senhas não coincidem');
    });

    it('deve rejeitar senha muito curta', async () => {
      const [status, response] = await registerController(
        'João Silva',
        'joao@test.com',
        '12345678901',
        '123',
        '123'
      );

      expect(status).toBe(400);
      expect(response.message).toBe('Senha deve ter pelo menos 6 caracteres');
    });

    it('deve rejeitar CPF inválido', async () => {
      const [status, response] = await registerController(
        'João Silva',
        'joao@test.com',
        '123',
        'senha123',
        'senha123'
      );

      expect(status).toBe(400);
      expect(response.message).toBe('CPF inválido');
    });

    it('deve rejeitar email inválido', async () => {
      const [status, response] = await registerController(
        'João Silva',
        'email-invalido',
        '12345678901',
        'senha123',
        'senha123'
      );

      expect(status).toBe(400);
      expect(response.message).toBe('Email inválido');
    });

    it('deve rejeitar campos obrigatórios vazios', async () => {
      const [status, response] = await registerController(
        '',
        'joao@test.com',
        '12345678901',
        'senha123',
        'senha123'
      );

      expect(status).toBe(400);
      expect(response.message).toBe('Todos os campos são obrigatórios');
    });
  });

  describe('loginController', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const mockUser = {
        id: 1,
        name: 'João Silva',
        email: 'joao@test.com',
        cpf: '12345678901',
        user_type: 'patient' as const
      };

      mockAuthenticateUser.mockResolvedValue({
        success: true,
        user: mockUser,
        message: 'Login realizado com sucesso'
      });

      const [status, response] = await loginController(
        'joao@test.com',
        'senha123'
      );

      expect(status).toBe(200);
      expect(response.message).toBe('Login realizado com sucesso');
      expect(response.user).toEqual(mockUser);
    });

    it('deve rejeitar credenciais inválidas', async () => {
      mockAuthenticateUser.mockResolvedValue({
        success: false,
        message: 'Email não encontrado'
      });

      const [status, response] = await loginController(
        'inexistente@test.com',
        'senha123'
      );

      expect(status).toBe(401);
      expect(response.message).toBe('Email não encontrado');
    });

    it('deve rejeitar campos vazios', async () => {
      const [status, response] = await loginController('', 'senha123');

      expect(status).toBe(400);
      expect(response.message).toBe('Email e senha são obrigatórios');
    });
  });
});