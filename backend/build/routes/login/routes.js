/**
 * @fileoverview Definição de constantes para as rotas (endpoints)
 * de autenticação (login) da API.
 */
// NOTA: Os caminhos a seguir foram corrigidos para usar "/auth/" em vez de "/'auht/"
/**
 * Define a rota (endpoint) de login para o papel de **administrador**.
 * @type {string}
 */
export const loginAdmin = "/auth/login/admin";
/**
 * Define a rota (endpoint) de login para o papel de **médico**.
 * @type {string}
 */
export const loginDoctor = "/auth/login/doctor";
/**
 * Define a rota (endpoint) de login para o papel de **usuário** (padrão).
 * @type {string}
 */
export const loginUser = "/auth/login/user";
