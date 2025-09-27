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