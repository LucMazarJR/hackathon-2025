/**
 * @fileoverview Funções para gerenciar usuários no banco de dados
 */

import { pool } from "../../config/poll.js";
import bcrypt from "bcrypt";

export interface User {
  id?: number;
  name: string;
  email: string;
  cpf: string;
  password?: string;
  password_hash?: string;
  user_type: 'patient' | 'doctor' | 'admin';
  created_at?: Date;
}

/**
 * Cria um novo usuário
 */
export const createUser = async (userData: User): Promise<{ success: boolean; user?: User; message: string }> => {
  try {
    // Verifica se email já existe
    const emailCheck = await pool.query("SELECT id FROM tb_usuarios WHERE email = $1", [userData.email]);
    if (emailCheck.rows.length > 0) {
      return { success: false, message: "Email já cadastrado" };
    }

    // Verifica se CPF já existe
    const cpfCheck = await pool.query("SELECT id FROM tb_usuarios WHERE cpf = $1", [userData.cpf]);
    if (cpfCheck.rows.length > 0) {
      return { success: false, message: "CPF já cadastrado" };
    }

    // Hash da senha
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(userData.password!, saltRounds);

    // Insere usuário
    const result = await pool.query(
      `INSERT INTO tb_usuarios (name, email, cpf, password_hash, user_type) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, cpf, user_type, created_at`,
      [userData.name, userData.email, userData.cpf, passwordHash, userData.user_type]
    );

    const newUser = result.rows[0];
    return { 
      success: true, 
      user: newUser, 
      message: "Usuário cadastrado com sucesso" 
    };

  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return { success: false, message: "Erro interno do servidor" };
  }
};

/**
 * Autentica um usuário
 */
export const authenticateUser = async (email: string, password: string): Promise<{ success: boolean; user?: User; message: string }> => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, cpf, password_hash, user_type FROM tb_usuarios WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return { success: false, message: "Email não encontrado" };
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return { success: false, message: "Senha incorreta" };
    }

    // Remove password_hash do retorno
    const { password_hash, ...userWithoutPassword } = user;
    
    return { 
      success: true, 
      user: userWithoutPassword, 
      message: "Login realizado com sucesso" 
    };

  } catch (error) {
    console.error("Erro ao autenticar usuário:", error);
    return { success: false, message: "Erro interno do servidor" };
  }
};

/**
 * Verifica se email existe
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const result = await pool.query("SELECT id FROM tb_usuarios WHERE email = $1", [email]);
    return result.rows.length > 0;
  } catch (error) {
    console.error("Erro ao verificar email:", error);
    return false;
  }
};

/**
 * Busca usuário por ID
 */
export const getUserById = async (id: number): Promise<User | null> => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, cpf, user_type, created_at FROM tb_usuarios WHERE id = $1",
      [id]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
};