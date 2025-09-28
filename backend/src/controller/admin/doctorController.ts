/**
 * @fileoverview Controller para CRUD de médicos
 */

import { getAllDoctors, createDoctor, updateDoctor, deleteDoctor, type Doctor } from "../../database/admin/doctorDatabase.js";

/**
 * Busca todos os médicos
 */
export const getDoctorsController = async (): Promise<[number, any]> => {
  try {
    const doctors = await getAllDoctors();
    return [200, { doctors }];
  } catch (error) {
    console.error("Erro ao buscar médicos:", error);
    return [500, { message: "Erro interno do servidor" }];
  }
};

/**
 * Cria um novo médico
 */
export const createDoctorController = async (
  nome: string,
  sobrenome: string,
  cpf: string,
  crm_registro: string,
  crm_uf: string,
  id_especializacao: number,
  dt_nascimento?: string
): Promise<[number, any]> => {
  try {
    // Validações básicas
    if (!nome || !sobrenome || !cpf || !crm_registro || !crm_uf || !id_especializacao) {
      return [400, { message: "Todos os campos são obrigatórios" }];
    }

    // Validação de CPF (11 dígitos)
    const cpfNumbers = cpf.replace(/\D/g, '');
    if (cpfNumbers.length !== 11) {
      return [400, { message: "CPF inválido" }];
    }

    const doctorData: Doctor = {
      nome,
      sobrenome,
      cpf: cpfNumbers,
      crm_registro,
      crm_uf,
      id_especializacao,
      dt_nascimento
    };

    const result = await createDoctor(doctorData);

    if (result.success) {
      return [201, { message: result.message, doctor: result.doctor }];
    } else {
      return [400, { message: result.message }];
    }
  } catch (error) {
    console.error("Erro no createDoctorController:", error);
    return [500, { message: "Erro interno do servidor" }];
  }
};

/**
 * Atualiza um médico
 */
export const updateDoctorController = async (
  id: number,
  nome: string,
  sobrenome: string,
  cpf: string,
  crm_registro: string,
  crm_uf: string,
  id_especializacao: number,
  dt_nascimento?: string
): Promise<[number, any]> => {
  try {
    const doctorData: Doctor = {
      nome,
      sobrenome,
      cpf: cpf.replace(/\D/g, ''),
      crm_registro,
      crm_uf,
      id_especializacao,
      dt_nascimento
    };

    const result = await updateDoctor(id, doctorData);

    if (result.success) {
      return [200, { message: result.message, doctor: result.doctor }];
    } else {
      return [404, { message: result.message }];
    }
  } catch (error) {
    console.error("Erro no updateDoctorController:", error);
    return [500, { message: "Erro interno do servidor" }];
  }
};

/**
 * Remove um médico
 */
export const deleteDoctorController = async (id: number): Promise<[number, any]> => {
  try {
    const result = await deleteDoctor(id);

    if (result.success) {
      return [200, { message: result.message }];
    } else {
      return [404, { message: result.message }];
    }
  } catch (error) {
    console.error("Erro no deleteDoctorController:", error);
    return [500, { message: "Erro interno do servidor" }];
  }
};