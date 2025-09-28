/**
 * @fileoverview Classes e gerenciamento de sessões para manter o histórico
 * de conversas (contexto) entre o usuário e o Agente de IA.
 */
/**
 * Representa uma única sessão de chat (conversa) com o Agente de IA.
 * Ela armazena o histórico de mensagens trocadas.
 */
export class AgentChat {
    /**
     * Cria uma nova instância de AgentChat com históricos de requisição e resposta vazios.
     */
    constructor() {
        this.historyRequest = [];
        this.historyResponse = [];
    }
    /**
     * Adiciona uma nova troca de mensagem (requisição do usuário e resposta do agente)
     * ao histórico da sessão. As mensagens são armazenadas em ordem cronológica.
     * @param {string} request - A mensagem enviada pelo usuário.
     * @param {string} response - A resposta gerada pelo assistente.
     * @returns {void}
     */
    addMessage(request, response) {
        this.historyRequest.push(request);
        this.historyResponse.push(response);
    }
    /**
     * Gera o contexto completo da conversa formatado como uma string.
     * O formato é ideal para ser passado como histórico (contexto)
     * para o modelo de linguagem do Agente de IA.
     * @returns {string} O histórico de mensagens formatado (e.g., "Usuário: ...\nAssistente: ...\n").
     */
    getContext() {
        let context = "";
        for (let i = 0; i < this.historyRequest.length; i++) {
            context += `Usuário: ${this.historyRequest[i]}\n`;
            if (this.historyResponse[i]) {
                context += `Assistente: ${this.historyResponse[i]}\n`;
            }
        }
        return context;
    }
}
/**
 * Gerencia múltiplas sessões de chat, mapeando um ID de sessão (sessionId)
 * para um objeto AgentChat correspondente.
 * Implementa o padrão de "lazy loading" (carregamento sob demanda) para sessões.
 */
class SessionManager {
    constructor() {
        /**
         * Armazenamento interno das sessões de chat. A chave é o sessionId (string)
         * e o valor é a instância de AgentChat.
         * @private
         * @type {Map<string, AgentChat>}
         */
        this.sessions = new Map();
    }
    /**
     * Obtém uma sessão de chat pelo seu ID. Se a sessão não existir, uma nova é criada
     * e armazenada antes de ser retornada.
     * @param {string} sessionId - O identificador único da sessão de chat.
     * @returns {AgentChat} A instância de AgentChat associada ao ID.
     */
    getSession(sessionId) {
        if (!this.sessions.has(sessionId)) {
            this.sessions.set(sessionId, new AgentChat());
        }
        // O operador '!' (non-null assertion) é usado pois acabamos de verificar ou criar a sessão.
        return this.sessions.get(sessionId);
    }
}
/**
 * A instância singleton (única) do SessionManager, usada para gerenciar
 * todas as sessões de chat em toda a aplicação.
 * @type {SessionManager}
 */
export const sessionManager = new SessionManager();
