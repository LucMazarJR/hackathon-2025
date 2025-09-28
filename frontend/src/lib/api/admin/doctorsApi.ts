/**
 * @fileoverview APIs para CRUD de médicos
 */

const API_BASE_URL = 'http://localhost:3000';

export interface Doctor {
  id_medico?: number;
  nome: string;
  sobrenome: string;
  cpf: string;
  crm_registro: string;
  crm_uf: string;
  id_especializacao: number;
  especialidade?: string;
  dt_nascimento?: string;
  dt_cadastro?: string;
  agenda_status?: 'disponivel' | 'cheia';
}

/**
 * Busca todos os médicos
 */
export const getDoctors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/doctors`);
    const result = await response.json();
    
    return {
      success: response.ok,
      data: result,
      status: response.status
    };
  } catch (error) {
    console.error('Erro ao buscar médicos:', error);
    return {
      success: false,
      data: { message: 'Erro de conexão' },
      status: 500
    };
  }
};

/**
 * Cria um novo médico
 */
export const createDoctor = async (doctorData: Doctor) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/doctors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doctorData),
    });

    const result = await response.json();
    
    return {
      success: response.ok,
      data: result,
      status: response.status
    };
  } catch (error) {
    console.error('Erro ao criar médico:', error);
    return {
      success: false,
      data: { message: 'Erro de conexão' },
      status: 500
    };
  }
};

/**
 * Atualiza um médico
 */
export const updateDoctor = async (id: number, doctorData: Doctor) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/doctors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doctorData),
    });

    const result = await response.json();
    
    return {
      success: response.ok,
      data: result,
      status: response.status
    };
  } catch (error) {
    console.error('Erro ao atualizar médico:', error);
    return {
      success: false,
      data: { message: 'Erro de conexão' },
      status: 500
    };
  }
};

/**
 * Remove um médico
 */
export const deleteDoctor = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/doctors/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();
    
    return {
      success: response.ok,
      data: result,
      status: response.status
    };
  } catch (error) {
    console.error('Erro ao remover médico:', error);
    return {
      success: false,
      data: { message: 'Erro de conexão' },
      status: 500
    };
  }
};