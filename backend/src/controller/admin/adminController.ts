import * as adminModel from "../../model/admin/adminModel.js";
import { updateContext } from "../../database/admin/contextDatabase.js";

/**
 * Realiza o login de um administrador do sistema.
 */
export let loginAdmin = async (
  email: string,
  password: string
): Promise<[number, string]> => {
  let [status, message] = await adminModel.loginAdmin(email, password);
  return [status, message];
};

/**
 * Controller para atualizar contexto do bot
 */
export let adminContextController = async (
  context: string
): Promise<[number, string]> => {
  try {
    // amazonq-ignore-next-line
    const success = await updateContext("Assistente de Saúde", context);
    
    if (success) {
      return [200, "Contexto atualizado com sucesso"];
    } else {
      return [500, "Erro ao atualizar contexto no banco de dados"];
    }
  } catch (error) {
    console.error("Erro ao processar contexto do administrador:", error);
    return [500, "Erro interno do servidor"];
  }
};
