/**
 * @fileoverview Função para verificar se email existe no banco
 */

import { pool } from "../../config/poll.js";

/**
 * Verifica se um email existe no banco de dados
 */
export const checkEmailExists = async (email: string): Promise<{ exists: boolean; message: string }> => {
  try {
    const result = await pool.query(
      "SELECT id FROM tb_usuarios WHERE email = $1",
      [email]
    );

    return {
      exists: result.rows.length > 0,
      message: result.rows.length > 0 ? "Email encontrado" : "Email não encontrado"
    };
  } catch (error) {
    console.error("Erro ao verificar email:", error);
    return {
      exists: false,
      message: "Erro interno do servidor"
    };
  }
};