/**
 * @fileoverview Controller para autenticação de usuários
 */

import { createUser, authenticateUser, type User } from "../../database/auth/userDatabase.js";

/**
 * Controller para registro de usuário
 */
export const registerController = async (
  name: string,
  email: string,
  cpf: string,
  password: string,
  confirmPassword: string
): Promise<[number, any]> => {
  try {
    // Validações básicas
    if (!name || !email || !cpf || !password) {
      return [400, { message: "Todos os campos são obrigatórios" }];
    }

    if (password !== confirmPassword) {
      return [400, { message: "Senhas não coincidem" }];
    }

    if (password.length < 6) {
      return [400, { message: "Senha deve ter pelo menos 6 caracteres" }];
    }

    // Validação básica de CPF (11 dígitos)
    const cpfNumbers = cpf.replace(/\D/g, '');
    if (cpfNumbers.length !== 11) {
      return [400, { message: "CPF inválido" }];
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return [400, { message: "Email inválido" }];
    }

    const userData: User = {
      name,
      email,
      cpf: cpfNumbers,
      password,
      user_type: 'patient' // Padrão é paciente
    };

    const result = await createUser(userData);

    if (result.success) {
      return [201, { 
        message: result.message, 
        user: result.user 
      }];
    } else {
      return [400, { message: result.message }];
    }

  } catch (error) {
    console.error("Erro no registerController:", error);
    return [500, { message: "Erro interno do servidor" }];
  }
};

/**
 * Controller para login de usuário
 */
export const loginController = async (
  email: string,
  password: string
): Promise<[number, any]> => {
  try {
    // Validações básicas
    if (!email || !password) {
      return [400, { message: "Email e senha são obrigatórios" }];
    }

    const result = await authenticateUser(email, password);

    if (result.success) {
      return [200, { 
        message: result.message, 
        user: result.user 
      }];
    } else {
      return [401, { message: result.message }];
    }

  } catch (error) {
    console.error("Erro no loginController:", error);
    return [500, { message: "Erro interno do servidor" }];
  }
};