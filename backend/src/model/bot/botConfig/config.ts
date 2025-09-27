/**
 * @fileoverview Configuração e inicialização de um Agente de IA (OpenAI Agent)
 * especializado em saúde e atendimento ao cliente, com lógica para gerenciar
 * sessões de chat e interagir com o modelo da OpenAI.
 * * O Agente possui instruções detalhadas sobre suas responsabilidades,
 * restrições de conteúdo e fluxos de trabalho específicos (agendamento,
 * atualização cadastral, etc.).
 */

import { Agent, run } from "@openai/agents";
import OpenAI from "openai";
import { sessionManager } from "../../class/Agent.js";
import "dotenv/config";

/**
 * Inicializa o cliente da OpenAI usando a chave de API fornecida
 * na variável de ambiente.
 * @type {OpenAI}
 */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Definição do Agente de IA.
 * * O agente 'Ajudant' é configurado com instruções detalhadas para atuar
 * como um assistente virtual especializado em saúde, seguindo regras
 * específicas de moderação de conteúdo e fluxos de atendimento.
 * @type {Agent}
 */
export const agent = new Agent({
  name: "Ajudant",
  instructions: `Suas novas instruções aqui...`,
});

/**
 * Envia uma mensagem de um usuário para o Agente de IA e gerencia o contexto da sessão.
 * * A função recupera o contexto da conversa, constrói o prompt completo, executa o
 * agente e armazena a mensagem do usuário e a resposta do assistente no histórico.
 *
 * @param {string} message - A mensagem enviada pelo usuário.
 * @param {string} [sessionId="default"] - O ID da sessão de chat. Se não for fornecido, usa "default".
 * @returns {Promise<string>} Uma Promise que resolve para a mensagem de resposta do assistente de IA.
 * @async
 */
export let sendMessage = async (
  message: string,
  sessionId: string = "default"
): Promise<string> => {
  // Obtém a sessão de chat, criando-a se não existir (presumido pela implementação do sessionManager).
  const chat = sessionManager.getSession(sessionId); // Recupera o histórico de contexto da sessão.

  const context = chat.getContext(); // Constrói o prompt completo para o agente, incluindo o contexto da conversa.
  const fullPrompt = context ? `${context}\nUsuário: ${message}` : message; // Executa o agente com o prompt completo.

  const response = await run(agent, fullPrompt); // Extrai a mensagem final do assistente da resposta.
  const assistantMessage: any = response.finalOutput; // Adiciona as mensagens do usuário e do assistente ao histórico da sessão.

  chat.addMessage(message, assistantMessage); // Retorna a resposta do assistente.

  return assistantMessage;
};
