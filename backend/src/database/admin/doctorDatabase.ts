/**
 * @fileoverview Funções para gerenciar médicos no banco de dados
 */

import { pool } from "../../config/poll.js";

export interface Doctor {
  id_medico?: number;
  nome: string;
  sobrenome: string;
  cpf: string;
  crm_registro: string;
  crm_uf: string;
  id_especializacao: number;
  especialidade?: string; // Para exibição
  dt_nascimento?: string;
  dt_cadastro?: string;
  agenda_status?: 'disponivel' | 'cheia';
}

/**
 * Busca todos os médicos
 */
export const getAllDoctors = async (): Promise<Doctor[]> => {
  try {
    const result = await pool.query(`
      SELECT 
        m.id_medico,
        m.nome,
        m.sobrenome,
        m.cpf,
        m.crm_registro,
        m.crm_uf,
        m.id_especializacao,
        e.nome_especializacao as especialidade,
        m.dt_nascimento,
        m.dt_cadastro,
        CASE 
          WHEN m.id_medico IN (1, 3) THEN 'cheia'
          ELSE 'disponivel'
        END as agenda_status
      FROM tb_medicos m
      LEFT JOIN tb_especializacoes e ON m.id_especializacao = e.id_especializacao
      ORDER BY m.nome
    `);
    return result.rows;
  } catch (error) {
    console.error("Erro ao buscar médicos:", error);
    return [];
  }
};

/**
 * Cria um novo médico
 */
export const createDoctor = async (doctorData: Doctor): Promise<{ success: boolean; doctor?: Doctor; message: string }> => {
  try {
    // Verifica se CRM já existe
    const crmCheck = await pool.query("SELECT id_medico FROM tb_medicos WHERE crm_registro = $1 AND crm_uf = $2", [doctorData.crm_registro, doctorData.crm_uf]);
    if (crmCheck.rows.length > 0) {
      return { success: false, message: "CRM já cadastrado" };
    }

    // Verifica se CPF já existe
    const cpfCheck = await pool.query("SELECT id_medico FROM tb_medicos WHERE cpf = $1", [doctorData.cpf]);
    if (cpfCheck.rows.length > 0) {
      return { success: false, message: "CPF já cadastrado" };
    }

    const result = await pool.query(
      `INSERT INTO tb_medicos (nome, sobrenome, cpf, crm_registro, crm_uf, id_especializacao, dt_nascimento, dt_cadastro) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE) 
       RETURNING *`,
      [doctorData.nome, doctorData.sobrenome, doctorData.cpf, doctorData.crm_registro, doctorData.crm_uf, doctorData.id_especializacao, doctorData.dt_nascimento]
    );

    return { 
      success: true, 
      doctor: result.rows[0], 
      message: "Médico cadastrado com sucesso" 
    };
  } catch (error) {
    console.error("Erro ao criar médico:", error);
    return { success: false, message: "Erro interno do servidor" };
  }
};

/**
 * Atualiza um médico
 */
export const updateDoctor = async (id: number, doctorData: Doctor): Promise<{ success: boolean; doctor?: Doctor; message: string }> => {
  try {
    const result = await pool.query(
      `UPDATE tb_medicos 
       SET nome = $1, sobrenome = $2, cpf = $3, crm_registro = $4, crm_uf = $5, id_especializacao = $6, dt_nascimento = $7
       WHERE id_medico = $8 
       RETURNING *`,
      [doctorData.nome, doctorData.sobrenome, doctorData.cpf, doctorData.crm_registro, doctorData.crm_uf, doctorData.id_especializacao, doctorData.dt_nascimento, id]
    );

    if (result.rows.length === 0) {
      return { success: false, message: "Médico não encontrado" };
    }

    return { 
      success: true, 
      doctor: result.rows[0], 
      message: "Médico atualizado com sucesso" 
    };
  } catch (error) {
    console.error("Erro ao atualizar médico:", error);
    return { success: false, message: "Erro interno do servidor" };
  }
};

/**
 * Remove um médico
 */
export const deleteDoctor = async (id: number): Promise<{ success: boolean; message: string }> => {
  try {
    const result = await pool.query("DELETE FROM tb_medicos WHERE id_medico = $1", [id]);

    if (result.rowCount === 0) {
      return { success: false, message: "Médico não encontrado" };
    }

    return { success: true, message: "Médico removido com sucesso" };
  } catch (error) {
    console.error("Erro ao remover médico:", error);
    return { success: false, message: "Erro interno do servidor" };
  }
};