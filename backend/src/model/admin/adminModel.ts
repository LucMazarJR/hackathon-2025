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
 * // Login correto
 * const [status, msg] = await loginAdmin("admin@example.com", "admin123");
 * // status = 200, msg = "Login bem-sucedido"
 *
 * @example
 * // Login errado
 * const [status, msg] = await loginAdmin("teste@teste.com", "senhaErrada");
 * // status = 401, msg = "Credenciais inválidas"
 */
export let loginAdmin = async (
  email: string,
  password: string
): Promise<[number, string]> => {
  if (email === "admin@example.com" && password === "admin123") {
    return [200, "Login bem-sucedido"];
  }
  return [401, "Credenciais inválidas"];
};
