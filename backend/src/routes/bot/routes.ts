/**
 * @fileoverview Definição de constantes para rotas (endpoints) da API.
 */

/**
 * Define a rota (endpoint) da API para interagir com o bot.
 * O `:id` indica um parâmetro de caminho dinâmico, geralmente usado para
 * identificar a **Session ID** da conversa.
 * @type {string}
 */
export let bot = "/bot/:id";

/**
 * Define a rota (endpoint) da API para upload de documentos.
 * @type {string}
 */
export let botDocument = "/bot/:id/document";

/**
 * Define a rota base para agendamentos médicos.
 * @type {string}
 */
export let agendamento = "/agendamento";