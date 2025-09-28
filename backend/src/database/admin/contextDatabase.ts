/**
 * @fileoverview Funções para gerenciar contexto do bot no banco de dados
 */

import { pool } from "../../config/poll.js";

export interface BotContext {
  id?: number;
  name: string;
  instructions: string;
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Busca o contexto atual do bot
 */
export const getCurrentContext = async (): Promise<BotContext | null> => {
  try {
    const result = await pool.query(
      "SELECT * FROM tb_bot_context ORDER BY updated_at DESC LIMIT 1"
    );
    
    if (result.rows.length === 0) {
      return {
        name: "MedBot - Assistente de Saúde",
        instructions: "Você é um assistente virtual especializado em saúde e atendimento ao cliente. Ajude com agendamentos, informações médicas e suporte geral. Seja sempre educado, empático e profissional."
      };
    }
    
    return result.rows[0];
  } catch (error) {
    console.error("Erro ao buscar contexto:", error);
    return {
      name: "MedBot - Assistente de Saúde",
      instructions: "Você é um assistente virtual especializado em saúde e atendimento ao cliente. Ajude com agendamentos, informações médicas e suporte geral. Seja sempre educado, empático e profissional."
    };
  }
};

/**
 * Atualiza o contexto do bot
 */
export const updateContext = async (name: string, instructions: string): Promise<boolean> => {
  try {
    // Verifica se já existe um contexto
    const existingContext = await getCurrentContext();
    
    if (existingContext && existingContext.id) {
      // Atualiza o contexto existente
      await pool.query(
        "UPDATE tb_bot_context SET name = $1, instructions = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3",
        [name, instructions, existingContext.id]
      );
    } else {
      // Cria um novo contexto
      await pool.query(
        "INSERT INTO tb_bot_context (name, instructions) VALUES ($1, $2)",
        [name, instructions]
      );
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao atualizar contexto:", error);
    return false;
  }
};