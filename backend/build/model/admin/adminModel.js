import { writeFile, readFile } from "fs/promises";
/**
 * Função de login para administradores.
 *
 * ⚠️ Atualmente é um mock simplificado: aceita apenas o par fixo
 * de credenciais `admin@example.com` / `admin123`.
 *
 * @async
 * @function loginAdmin
 * @param {string} email - E-mail informado pelo administrador.
 * @param {string} password - Senha informada pelo administrador.
 * @returns {Promise<[number, string]>} Uma promessa que retorna uma tupla:
 * - O primeiro valor é o código de status (200 para sucesso, 401 para erro).
 * - O segundo valor é a mensagem correspondente.
 *
 * @example
 * Login correto
 * const [status, msg] = await loginAdmin("admin@example.com", "admin123");
 * status = 200, msg = "Login bem-sucedido"
 *
 * @example
 * Login errado
 * const [status, msg] = await loginAdmin("teste@teste.com", "senhaErrada");
 * status = 401, msg = "Credenciais inválidas"
 */
export let loginAdmin = async (email, password) => {
    if (email === "admin@example.com" && password === "admin123") {
        return [200, "Login bem-sucedido"];
    }
    return [401, "Credenciais inválidas"];
};
export let adminContext = async (context) => {
    try {
        const path = "./src/model/bot/botConfig/config.ts";
        let conteudo = await readFile(path, "utf-8");
        // Regex para encontrar e substituir o conteúdo das instructions
        conteudo = conteudo.replace(/(instructions:\s*`)[^`]*(`)/, `$1${context}$2`);
        await writeFile(path, conteudo, { encoding: "utf-8" });
        return [200, "Contexto atualizado com sucesso"];
    }
    catch (error) {
        console.error("Erro ao atualizar contexto do administrador:", error);
        return [500, "Erro interno do servidor"];
    }
};
