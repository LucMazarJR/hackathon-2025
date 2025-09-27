import { sendMessage } from "../../model/bot/botConfig/config.js";

/**
 * Controlador responsável por enviar mensagens ao bot e tratar a resposta.
 *
 * @async
 * @function messageBotController
 * @param {string} message - Texto da mensagem enviada pelo usuário ao bot.
 * @returns {Promise<[number, string]>} Uma promessa que retorna uma tupla:
 * - O primeiro valor é o código de status (200 em caso de sucesso, 500 em caso de erro).
 * - O segundo valor é a resposta do bot ou uma mensagem de erro.
 *
 * @example
 * const [status, resposta] = await messageBotController("Olá, bot!");
 * if (status === 200) {
 *   console.log("Bot respondeu:", resposta);
 * } else {
 *   console.error("Erro:", resposta);
 * }
 */
export let messageBotController = async (
  message: string
): Promise<[number, string]> => {
  try {
    const response = await sendMessage(message);
    return [200, response];
  } catch (error) {
    console.error("Erro ao processar mensagem no botController:", error);
    return [500, "Erro interno do servidor"];
  }
};
