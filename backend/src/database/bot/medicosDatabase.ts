/**
 * @fileoverview Funções para gerenciar médicos no banco de dados PostgreSQL
 */

import { pool } from '../connection.js';

export interface MedicoData {
  id_medico: number;
  nome: string;
  sobrenome: string;
  especialidade: string;
  crm_registro: string;
  crm_uf: string;
}

/**
 * Busca médicos por especialidade no banco PostgreSQL
 */
export const buscarMedicosPorEspecialidadeDB = async (especialidade: string) => {
  try {
    const query = `
      SELECT 
        m.id_medico,
        m.nome,
        m.sobrenome,
        e.nome_especializacao as especialidade,
        m.crm_registro,
        m.crm_uf
      FROM tb_medicos m
      JOIN tb_especializacoes e ON m.id_especializacao = e.id_especializacao
      WHERE LOWER(e.nome_especializacao) LIKE LOWER($1)
      ORDER BY m.nome
    `;
    
    const result = await pool.query(query, [`%${especialidade}%`]);
    
    return {
      success: true,
      data: result.rows
    };
  } catch (error) {
    const err = error as Error;
    console.error('Erro ao buscar médicos por especialidade:', error);
    return {
      success: false,
      error: err.message
    };
  }
};

/**
 * Busca todos os médicos disponíveis
 */
export const buscarTodosMedicos = async () => {
  try {
    const query = `
      SELECT 
        m.id_medico,
        m.nome,
        m.sobrenome,
        e.nome_especializacao as especialidade,
        m.crm_registro,
        m.crm_uf
      FROM tb_medicos m
      JOIN tb_especializacoes e ON m.id_especializacao = e.id_especializacao
      ORDER BY e.nome_especializacao, m.nome
    `;
    
    const result = await pool.query(query);
    
    return {
      success: true,
      data: result.rows
    };
  } catch (error) {
    const err = error as Error;
    console.error('Erro ao buscar todos os médicos:', error);
    return {
      success: false,
      error: err.message
    };
  }
};

/**
 * Busca médico por ID
 */
export const buscarMedicoPorId = async (idMedico: number) => {
  try {
    const query = `
      SELECT 
        m.id_medico,
        m.nome,
        m.sobrenome,
        e.nome_especializacao as especialidade,
        m.crm_registro,
        m.crm_uf
      FROM tb_medicos m
      JOIN tb_especializacoes e ON m.id_especializacao = e.id_especializacao
      WHERE m.id_medico = $1
    `;
    
    const result = await pool.query(query, [idMedico]);
    
    return {
      success: true,
      data: result.rows[0] || null
    };
  } catch (error) {
    const err = error as Error;
    console.error('Erro ao buscar médico por ID:', error);
    return {
      success: false,
      error: err.message
    };
  }
};