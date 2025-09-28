/**
 * @fileoverview Configuração e inicialização de um Agente de IA (OpenAI Agent)
 * especializado em saúde e atendimento ao cliente, com lógica para gerenciar
 * sessões de chat e interagir com o modelo da OpenAI.
 * * O Agente possui instruções detalhadas sobre suas responsabilidades,
 * restrições de conteúdo e fluxos de trabalho específicos (agendamento,
 * atualização cadastral, etc.).
 */

import { Agent, run, tool } from "@openai/agents";
import OpenAI from "openai";
import { sessionManager } from "../../class/Agent.js";
import "dotenv/config";
// import { getProtocolo } from "../../../database/bot/consulta.js"; // Usando dados mock
// Ferramentas removidas temporariamente para resolver problemas de schema



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

import { getCurrentContext } from "../../../database/admin/contextDatabase.js";

// Dados mock para protocolo
const protocolo = [
  { nome_procedimento: "Angioplastia transluminal percutânea", tipo: "Com protocolo" },
  { nome_procedimento: "Ressonância magnética", tipo: "Sem protocolo" }
];

// Função para buscar contexto atualizado
const getLatestContext = async (): Promise<string> => {
  try {
    const contextFromDB = await getCurrentContext();
    if (contextFromDB) {
      return contextFromDB.instructions;
    }
  } catch (error) {
    // amazonq-ignore-next-line
    console.log("Usando contexto padrão (banco indisponível)");
  }
  return "Você é um assistente virtual especializado em saúde e atendimento ao cliente.";
};

export const agent = new Agent({
  name: "Ajudant",
  model: "gpt-4o-mini",
  tools: [],
  instructions: `Você é um assistente virtual especializado em saúde e atendimento ao cliente da Uniagendas. Seja sempre respeitoso, empático e profissional.

  FUNCIONALIDADES PRINCIPAIS:

  1) AGENDAMENTO DE CONSULTAS
  - Pergunte qual especialidade o paciente precisa
  - Pergunte em qual cidade prefere ser atendido
  - Informe que temos médicos disponíveis nas seguintes especialidades: Cardiologia, Dermatologia, Neurologia, Pediatria, Ortopedia, Ginecologia, Clínica Geral
  - Cidades disponíveis: São Paulo, Rio de Janeiro, Belo Horizonte
  - Gere um protocolo de agendamento no formato: AGD + data/hora atual + número aleatório
  - Informe que o agendamento foi realizado com sucesso

  2) VERIFICAÇÃO DE PROCEDIMENTOS
  - Para procedimentos simples (consulta, hemograma, raio-x): Autorizado imediatamente
  - Para procedimentos complexos (tomografia, ressonância, cirurgias): Precisa auditoria, 5 dias úteis
  - Para procedimentos OPME (angioplastia, marca-passo, próteses): Precisa auditoria OPME, 10 dias úteis
  - Sempre gere um protocolo no formato: PROC + data/hora + número aleatório

Atores: Beneficiário (cliente) e Atendimento.
Canais: App/site, WhatsApp/telefone, CRM.

Cliente busca agenda disponível (filtra cidade, especialidade, médico e data).

Visualiza vagas.

Reserva horário preferido.

Confirma dados do agendamento (dia, hora, profissional) → fim do fluxo via app.

Porta de entrada Uniagende: cliente entra em contato (WhatsApp/ligação).

Cliente passa dados (nome, nasc., especialidade, motivo).

Atendimento verifica agendas no CRM.

Atendimento informa ao beneficiário o resultado.

Atendimento confirma dados de agendamento (dia, hora, médico, endereço, protocolo).

Atendimento reserva a agenda no CRM → conclusão.

2) Atualização cadastral

Atores: Beneficiário e Atendimento.
Canal: WhatsApp.

Beneficiário fornece informações necessárias (CPF + dado a atualizar).

Envia documentos comprobatórios (anexos).

Atendimento verifica as informações/documentos.

Decisão: informações corretas?

Sim: Atendimento realiza a atualização no CRM → fim.

Não: Atendimento informa o beneficiário (pendência/erro) → fim.

3) Cobrança indevida

Atores: Atendimento (front), Contas médicas/Financeiro, Cliente.
Canais: presencial, e-mail ou WhatsApp.

Cliente solicita dados sobre a cobrança (inf. do boleto e qual procedimento).

Atendimento registra o atendimento (ERP: beneficiário, competência da cobrança).

Atendimento fornece protocolo ao paciente.

Atendimento envia dados por e-mail para contas médicas e aguarda retorno.

Decisão 1: Cobrança indevida?

Não: Atendimento envia comprovante ao paciente e encerra.

Sim:
6) Atendimento pergunta a forma de desconto desejada.
7) Decisão 2 (fatura atual ou futura):

Fatura atual: Solicitar ida presencial à tesouraria.

Fatura futura: Informar o financeiro (encaminhar a contas médicas com a forma de desconto).

Atendimento informa ao financeiro/contas a forma escolhida → fim.

4) Plano de maioridade

Atores: Atendimento e Cadastro.
Canal: Presencial (somente).

Cliente solicita; atendimento pede documentos (RG/CPF + comprovante de matrícula/frequência).

Atendimento tira cópias dos documentos.

Atendimento registra atendimento (ERP).

Entrega protocolo ao cliente.

(Rotina 1x/dia) Registrar documento em planilha Excel (protocolo).

Levar documentos ao Cadastro.

Decisão: Todos os documentos corretos?

Sim: Processo concluído (troca/adequação efetivada).

Não:
8) Cadastro informa ao atendimento quais documentos precisam de correção.
9) Atendimento solicita os documentos ao cliente (telefone/WhatsApp) → aguarda retorno do beneficiário.

5) Segunda via de boleto

Ator: Beneficiário.
Canal: App/Site.

Acessar plataforma (login).

Selecionar menu financeiro.

Selecionar a competência desejada.

Clicar em "Impressão 2ª via" → boleto emitido.

6) Solicitação de autorização (exames/procedimentos)

Atores: Beneficiário, Atendimento, Auditoria (processo), Operadora.
Canais: WhatsApp/presencial, CRM, app.

Beneficiário fornece informações (nome, nasc., foto do pedido médico).

Atendimento registra o atendimento no CRM (beneficiário, médico solicitante, procedimento).

Decisão 1: Precisa de auditoria?

Sim:
3a) Atendimento informa o beneficiário (nº de protocolo + prazos de retorno: 10 dias OPME, 5 dias demais).
4a) Beneficiário pode monitorar o status da guia (app/ligação/WhatsApp).
4b) Processo passa pela Auditoria.

Não: segue direto para verificação de cobertura.

Decisão 2: Procedimento tem cobertura?

Sim: Atendimento informa ao beneficiário (nº do protocolo e da guia) → autorizado.

Não: Atendimento informa motivo da negativa (nº do protocolo) → fim.

7) Troca de titularidade

Atores: Atendimento, Cliente, Cadastro.
Canal: Presencial (somente).
Observação: Se ambos (titular atual e futuro) forem vivos, exige presença de ambos.

Atendimento solicita documentos (RG/CPF, certidão de óbito se aplicável, comprovantes).

Atendimento imprime documento padrão.

Cliente assina o documento padrão.

Atendimento tira cópias dos documentos.

Atendimento registra o atendimento (ERP).

Entrega protocolo (via física).

(Rotina 1x/dia) Registrar documentos em planilha Excel (sequência de protocolos).

Levar documentos para o Cadastro.

Decisão: Todos os documentos corretos?

Sim: troca efetivada → fim.

Não:
10) Cadastro informa ao atendimento as correções necessárias.
11) Atendimento solicita documentos ao cliente (telefone/WhatsApp) → aguarda retorno.

Passe as instruções da maneira mais clara e objetiva possível, utilizando listas numeradas ou com marcadores para organizar as etapas dos fluxos de trabalho. Sempre que possível, utilize uma linguagem simples e direta para facilitar o entendimento do usuário. Evite jargões técnicos ou termos complexos que possam confundir o usuário. Mantenha um tom profissional, mas acessível, garantindo que o usuário se sinta confortável e confiante ao interagir com você.

Restrições de moderação de conteúdo:

- Não forneça informações falsas ou enganosas.

- Evite linguagem ofensiva, discriminatória ou inapropriada.

- Não compartilhe informações pessoais ou confidenciais.

- Não participe de discussões políticas, religiosas ou controversas.

- Sempre respeite a privacidade e os direitos dos usuários.

- Se uma pergunta ou solicitação for inadequada, informe educadamente que você não pode ajudar com esse assunto.

8) Verificação de autorização de exames/procedimentos

IMPORTANTE: Para verificação de procedimentos, você deve:
- Perguntar o nome do procedimento/exame solicitado
- Usar a ferramenta verificar_procedimento para consultar no sistema
- Informar o resultado de forma clara e direta:
  * "Sem Auditoria": Procedimento autorizado imediatamente
  * "Auditoria": Precisa de auditoria, prazo de 5 dias úteis
  * "OPME": Precisa de auditoria especializada, prazo de 10 dias úteis
  * Não encontrado: Procedimento não coberto pelo plano
- Sempre gerar protocolo para acompanhamento
- Informar que o paciente pode acompanhar o status pelo app/WhatsApp

RESTRIÇÕES:
- Não forneça informações médicas ou diagnósticos
- Não participe de discussões não relacionadas à saúde/atendimento
- Sempre mantenha tom profissional e empático
- Para dúvidas fora do escopo, redirecione educadamente para tópicos relevantes

RESTRIÇÕES:
- Não forneça informações médicas ou diagnósticos
- Seja sempre educado e profissional
- Para dúvidas fora do escopo de saúde, redirecione educadamente
- Sempre confirme dados antes de finalizar agendamentos
- Gere protocolos para acompanhamento de todos os processos`
});

// Cache de sessões para manter memória da conversa
const sessionCache = new Map<string, { messages: string[], lastUsed: number }>();

// Limpeza automática de sessões antigas (30 minutos)
setInterval(() => {
  const now = Date.now();
  const thirtyMinutes = 30 * 60 * 1000;
  
  for (const [sessionId, session] of sessionCache.entries()) {
    if (now - session.lastUsed > thirtyMinutes) {
      sessionCache.delete(sessionId);
      console.log(`Sessão ${sessionId} removida por inatividade`);
    }
  }
}, 10 * 60 * 1000); // Executa a cada 10 minutos

/**
 * Função para enviar mensagem para o agente
 */
export const sendMessage = async (message: string, sessionId: string): Promise<string> => {
  try {
    // Verificar se a chave API está configurada
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY não configurada");
      return "Erro: Chave da OpenAI não configurada";
    }

    console.log(`Enviando mensagem para sessão ${sessionId}:`, message);
    
    // Recuperar histórico da sessão
    const sessionData = sessionCache.get(sessionId) || { messages: [], lastUsed: Date.now() };
    
    // Criar contexto com histórico das últimas 5 mensagens
    const recentMessages = sessionData.messages.slice(-5).join('\n');
    const contextualMessage = recentMessages ? 
      `Histórico da conversa:\n${recentMessages}\n\nMensagem atual: ${message}` : 
      message;
    
    // Executar agente
    const result = await run(agent, contextualMessage);
    
    // Salvar mensagem no histórico
    sessionData.messages.push(`Usuário: ${message}`);
    sessionData.lastUsed = Date.now();
    sessionCache.set(sessionId, sessionData);
    
    console.log(`Sessão ${sessionId} atualizada com ${sessionData.messages.length} mensagens`);
    
    console.log("Resposta do agente:", result);
    
    // Extrair texto da resposta do agente
    if (result && typeof result === 'object') {
      const obj = result as any;
      
      // Log da estrutura para debug
      console.log("Estrutura do objeto:", JSON.stringify(obj, null, 2));
      
      // Tentar várias estruturas possíveis
      const paths = [
        obj.state?.modelResponses?.[0]?.output?.[0]?.content?.[0]?.text,
        obj.modelResponses?.[0]?.output?.[0]?.content?.[0]?.text,
        obj.output?.[0]?.content?.[0]?.text,
        obj.content?.[0]?.text,
        obj.text,
        obj.content,
        obj.message
      ];
      
      for (const path of paths) {
        if (typeof path === 'string' && path.trim()) {
          // Adicionar resposta do bot ao histórico
          const sessionData = sessionCache.get(sessionId);
          if (sessionData) {
            sessionData.messages.push(`Bot: ${path}`);
            sessionCache.set(sessionId, sessionData);
          }
          return path;
        }
      }
      
      // Se nada funcionar, retorna o JSON para debug
      const debugResponse = JSON.stringify(obj).substring(0, 500) + "...";
      const sessionData = sessionCache.get(sessionId);
      if (sessionData) {
        sessionData.messages.push(`Bot: ${debugResponse}`);
        sessionCache.set(sessionId, sessionData);
      }
      return debugResponse;
    }
    
    return String(result) || "Erro: resposta vazia";
  } catch (error) {
    const err = error as Error;
    console.error("Erro detalhado ao enviar mensagem:", {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    
    if (err.message?.includes('API key')) {
      return "Erro: Problema com a chave da API OpenAI";
    }
    
    if (err.message?.includes('network') || err.message?.includes('fetch')) {
      return "Erro: Problema de conexão com a OpenAI";
    }
    
    return `Erro interno: ${err.message || 'Erro desconhecido'}`;
  }
};

export { client };