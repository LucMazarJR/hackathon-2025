import * as adminModel from "../../model/admin/adminModel.js";
/**
 * Realiza o login de um administrador do sistema.
 *
 * @async
 * @function loginAdmin
 * @param {string} email - E-mail do administrador.
 * @param {string} password - Senha do administrador.
 * @returns {Promise<[number, string]>} Uma promessa que retorna uma tupla:
 * - O primeiro valor é o código de status (ex.: 200 para sucesso, 401 para não autorizado).
 * - O segundo valor é uma mensagem descritiva do resultado do login.
 *
 * @example
 * const [status, message] = await loginAdmin("admin@email.com", "123456");
 * if (status === 200) {
 *   console.log("Login realizado com sucesso:", message);
 * } else {
 *   console.error("Erro no login:", message);
 * }
 */
export let loginAdmin = async (email, password) => {
    let [status, message] = await adminModel.loginAdmin(email, password);
    return [status, message];
};
export let adminContextController = async (context) => {
    try {
        let [status, message] = await adminModel.adminContext(context);
        return [status, message];
    }
    catch (error) {
        console.error("Erro ao processar contexto do administrador:", Error);
        return [500, "Erro interno do servidor"];
    }
};
