/**
 * @fileoverview APIs de autenticação
 */

const API_BASE_URL = 'http://localhost:3000';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  cpf: string;
  password: string;
  confirmPassword: string;
}

/**
 * Faz login do usuário
 */
export const loginUser = async (data: LoginData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (response.ok) {
      // Salva dados do usuário no localStorage
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('isLoggedIn', 'true');
    }
    
    return {
      success: response.ok,
      data: result,
      status: response.status
    };
  } catch (error) {
    console.error('Erro no login:', error);
    return {
      success: false,
      data: { message: 'Erro de conexão' },
      status: 500
    };
  }
};

/**
 * Registra novo usuário
 */
export const registerUser = async (data: RegisterData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    return {
      success: response.ok,
      data: result,
      status: response.status
    };
  } catch (error) {
    console.error('Erro no registro:', error);
    return {
      success: false,
      data: { message: 'Erro de conexão' },
      status: 500
    };
  }
};

/**
 * Faz logout do usuário
 */
export const logoutUser = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
};