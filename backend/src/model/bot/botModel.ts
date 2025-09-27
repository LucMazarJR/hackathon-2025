/**
 * @fileoverview Módulo responsável por encapsular a chamada à função
 * de envio de mensagens do bot (definida em 'botConfig/config.js')
 * e padronizar o retorno da resposta com um código de status HTTP.
 */

import {sendMessage} from "./botConfig/config.js"

/**
 * Envia uma mensagem de um usuário para o modelo de bot de IA e
 * retorna a resposta do bot juntamente com um código de status HTTP 200.
 *
 * @param {string} message - A mensagem de texto que o usuário está enviando ao bot.
 * @param {string} [sessionId] - O ID da sessão de chat. Se omitido,
 * será usado o valor padrão "default".
 * @returns {Promise<[number, string]>} Uma Promise que resolve para um array,
 * onde o primeiro elemento é o código de status HTTP (200) e o segundo é
 * a resposta de texto do assistente de IA.
 * @async
 */
export let messageBotModel = async (message: string, sessionId?: string): Promise<[number, string]> => {
  // Chama a função principal de envio de mensagem, usando "default" se o sessionId for nulo/indefinido.
  let response = await sendMessage(message, sessionId || "default")
  
  // Retorna o código de status 200 (OK) junto com a resposta do bot.
  return [200, response];
}