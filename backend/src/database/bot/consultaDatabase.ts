/**
 * @fileoverview Funções para gerenciar consultas no banco de dados PostgreSQL
 */

import { pool } from '../connection.js';

export interface ConsultaData {
  id_medico: number;
  nome_paciente: string;
  cpf_paciente?: string;
  data_consulta: string;
  hora_consulta: string;
  protocolo: string;
  observacoes?: string;
}

/**
 * Salva uma nova consulta no banco de dados PostgreSQL
 */
export const salvarConsulta = async (consulta: ConsultaData) => {
  try {
    const query = `
      INSERT INTO tb_consultas 
      (id_medico, nome_paciente, cpf_paciente, data_consulta, hora_consulta, protocolo, observacoes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id_consulta, protocolo
    `;
    
    const values = [
      consulta.id_medico,
      consulta.nome_paciente,
      consulta.cpf_paciente,
      consulta.data_consulta,
      consulta.hora_consulta,
      consulta.protocolo,
      consulta.observacoes
    ];
    
    const result = await pool.query(query, values);
    console.log('✅ Consulta salva no PostgreSQL:', result.rows[0]);
    
    return {
      success: true,
      data: result.rows[0]
    };
  } catch (error) {
    const err = error as Error;
    console.error('❌ Erro ao salvar consulta:', error);
    return {
      success: false,
      error: err.message
    };
  }
};

/**
 * Busca consultas por CPF do paciente no PostgreSQL
 */
export const buscarConsultasPorCPF = async (cpf: string) => {
  try {
    const query = `
      SELECT 
        c.id_consulta,
        c.data_consulta,
        c.hora_consulta,
        c.protocolo,
        c.status,
        c.observacoes,
        CONCAT(m.nome, ' ', m.sobrenome) as nome_medico,
        e.nome_especializacao as especialidade
      FROM tb_consultas c
      JOIN tb_medicos m ON c.id_medico = m.id_medico
      JOIN tb_especializacoes e ON m.id_especializacao = e.id_especializacao
      WHERE c.cpf_paciente = $1
      ORDER BY c.data_consulta DESC, c.hora_consulta DESC
    `;
    
    const result = await pool.query(query, [cpf]);
    
    return {
      success: true,
      data: result.rows
    };
  } catch (error) {
    const err = error as Error;
    console.error('Erro ao buscar consultas por CPF:', error);
    return {
      success: false,
      error: err.message
    };
  }
};

/**
 * Busca consultas por ID do médico no PostgreSQL
 */
export const buscarConsultasPorMedico = async (idMedico: number) => {
  try {
    const query = `
      SELECT 
        c.id_consulta,
        c.nome_paciente,
        c.data_consulta,
        c.hora_consulta,
        c.protocolo,
        c.status,
        c.observacoes
      FROM tb_consultas c
      WHERE c.id_medico = $1
      ORDER BY c.data_consulta ASC, c.hora_consulta ASC
    `;
    
    const result = await pool.query(query, [idMedico]);
    
    return {
      success: true,
      data: result.rows
    };
  } catch (error) {
    const err = error as Error;
    console.error('Erro ao buscar consultas por médico:', error);
    return {
      success: false,
      error: err.message
    };
  }
};

/**
 * Gera protocolo único para consulta
 */
export const gerarProtocolo = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `AGD${timestamp}${random}`;
};