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
import { salvarConsulta, gerarProtocolo, ConsultaData } from '../../../database/bot/consultaDatabase.js';
import { buscarMedicosPorEspecialidadeDB } from '../../../database/bot/medicosDatabase.js';

// Função para detectar e salvar agendamentos
const processarAgendamento = async (botResponse: string, sessionId: string) => {
  // Detectar se o bot confirmou um agendamento
  if ((botResponse.includes('✅') && botResponse.includes('Agendamento realizado')) || 
      (botResponse.includes('agendamento') && botResponse.includes('realizado') && botResponse.includes('protocolo'))) {
    try {
      console.log('🔍 Detectado agendamento na resposta do bot');
      
      // Recuperar dados da sessão
      const sessionData = sessionCache.get(sessionId);
      if (!sessionData) {
        console.log('❌ Dados da sessão não encontrados');
        return null;
      }
      
      const messages = sessionData.messages.join(' ');
      console.log('📝 Mensagens da sessão:', messages);
      
      // Extrair informações do agendamento com padrões mais flexíveis
      const especialidadeMatch = messages.match(/(cardiologia|dermatologia|neurologia|pediatria|ortopedia|ginecologia|clínica geral|cardio|dermato|neuro|ortoped|gineco)/i);
      const nomeMatch = messages.match(/(?:nome|paciente)[^:]*:?\s*([A-Za-záéíóúâêîôûàèìòùãõç\s]{2,50})/i) || 
                       messages.match(/(?:sou|me chamo|meu nome é)\s+([A-Za-záéíóúâêîôûàèìòùãõç\s]{2,50})/i);
      const cpfMatch = messages.match(/(?:cpf|CPF)[^:]*:?\s*(\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})/i);
      const horaMatch = botResponse.match(/(?:às|horário)\s*(\d{1,2}:\d{2})/i) || messages.match(/(\d{1,2}:\d{2})/i);
      const dataMatch = botResponse.match(/(?:Data|data):\s*(\d{4}-\d{2}-\d{2})/i);
      
      console.log('🔍 Matches encontrados:', {
        especialidade: especialidadeMatch?.[1],
        nome: nomeMatch?.[1],
        cpf: cpfMatch?.[1],
        hora: horaMatch?.[1],
        data: dataMatch?.[1]
      });
      
      if (especialidadeMatch && nomeMatch) {
        const especialidade = especialidadeMatch[1].toLowerCase();
        const nomePaciente = nomeMatch[1].trim();
        const cpfPaciente = cpfMatch ? cpfMatch[1].replace(/\D/g, '') : undefined;
        const hora = horaMatch ? horaMatch[1] : '09:00';
        
        // Buscar médico real do banco por especialidade
        let idMedico = 1; // Fallback
        try {
          const medicosResult = await buscarMedicosPorEspecialidadeDB(especialidade);
          if (medicosResult.success && medicosResult.data && medicosResult.data.length > 0) {
            // Pegar o primeiro médico da especialidade
            idMedico = medicosResult.data[0].id_medico;
            console.log(`👨‍⚕️ Médico encontrado: ID ${idMedico} para ${especialidade}`);
          } else {
            console.log(`⚠️ Nenhum médico encontrado para ${especialidade}, usando fallback`);
          }
        } catch (error) {
          console.error('❌ Erro ao buscar médico:', error);
        }
        
        // Usar data do bot ou próximo dia útil
        let dataConsulta: string;
        if (dataMatch) {
          dataConsulta = dataMatch[1];
        } else {
          const proximoDia = new Date();
          proximoDia.setDate(proximoDia.getDate() + 1);
          dataConsulta = proximoDia.toISOString().split('T')[0];
        }
        
        const protocolo = gerarProtocolo();
        
        const consultaData: ConsultaData = {
          id_medico: idMedico,
          nome_paciente: nomePaciente,
          cpf_paciente: cpfPaciente,
          data_consulta: dataConsulta,
          hora_consulta: hora,
          protocolo: protocolo,
          observacoes: `Agendamento via chat - Especialidade: ${especialidade}`
        };
        
        console.log('💾 Salvando consulta:', consultaData);
        
        const result = await salvarConsulta(consultaData);
        if (result.success) {
          console.log(`✅ Agendamento salvo no banco: ${protocolo}`);
          return protocolo;
        } else {
          console.error('❌ Erro ao salvar consulta:', result.error);
        }
      } else {
        console.log('❌ Informações insuficientes para salvar agendamento');
      }
    } catch (error) {
      console.error('❌ Erro ao processar agendamento:', error);
    }
  }
  return null;
};



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

  1) AGENDAMENTO DE CONSULTAS (quando o usuário quer MARCAR uma consulta)
  - Use quando: "quero agendar", "marcar consulta", "preciso de médico", "consulta com cardiologista"
  
  PROCESSO DE AGENDAMENTO (OBRIGATÓRIO seguir esta ordem):
  1º) Pergunte qual especialidade o paciente precisa
  2º) Pergunte em qual cidade prefere ser atendido
  3º) Pergunte o NOME COMPLETO do paciente
  4º) Pergunte o CPF do paciente (obrigatório para salvar no sistema)
  5º) Ofereça horários disponíveis
  6º) Confirme TODOS os dados antes de finalizar
  7º) SÓ ENTO confirme o agendamento
  
  - Médicos disponíveis por especialidade:
    * Cardiologia: Dr. Carlos Silva (São Paulo) - AGENDA OCUPADA nos próximos dias
    * Dermatologia: Dra. Ana Santos (Rio de Janeiro) - Disponível
    * Neurologia: Dr. João Oliveira (Belo Horizonte) - Disponível
    * Pediatria: Dra. Maria Costa (São Paulo) - Disponível
    * Ortopedia: Dr. Pedro Almeida (Porto Alegre) - Disponível
    * Ginecologia: Dra. Lucia Ferreira (Curitiba) - Disponível
    * Clínica Geral: Dr. Roberto Lima (Salvador) - Disponível
  
  - IMPORTANTE: Dr. Carlos Silva (Cardiologia) tem agenda LOTADA - ofereça outros cardiologistas ou outras especialidades
  - Consultas só para os PRÓXIMOS 30 DIAS
  - Horários disponíveis: 08:00, 09:00, 10:00, 11:00 (manhã)
  - SEMPRE mencione o nome do médico quando oferecer agendamento
  - Se Dr. Carlos Silva (Cardiologia) estiver ocupado, sugira: "Dr. Carlos está com agenda cheia, mas temos outros cardiologistas disponíveis ou posso agendar com Clínica Geral"
  - NUNCA confirme agendamento sem ter NOME COMPLETO e CPF
  - Após confirmar, informe que foi SALVO NO SISTEMA e aparecerá no calendário

  2) VERIFICAÇÃO DE PROCEDIMENTOS (quando o usuário quer saber se um procedimento é coberto)
  - Use quando: "preciso fazer tomografia", "meu médico pediu ressonância", "posso fazer hemograma?"
  - Procedimentos SIMPLES (autorizado imediatamente): consulta, hemograma, raio-x, eletrocardiograma
  - Procedimentos COMPLEXOS (auditoria 5 dias): tomografia, ressonância, ultrassom, endoscopia, cirurgias simples
  - Procedimentos OPME (auditoria 10 dias): angioplastia, marca-passo, próteses, stents, implantes
  - Gere protocolo: PROC + data/hora + número

  3) ANÁLISE DE DOCUMENTOS (quando o usuário envia um arquivo/documento)
  - Use quando: usuário anexa PDF, imagem, documento médico
  - LEIA o documento completamente
  - IDENTIFIQUE os procedimentos/exames mencionados no documento
  - Para CADA procedimento encontrado, verifique:
    * Se é simples (autorizado), complexo (5 dias) ou OPME (10 dias)
    * Gere protocolo individual para cada procedimento
  - Exemplo: "No seu documento identifiquei: Tomografia (auditoria 5 dias - PROC123), Hemograma (autorizado - PROC124)"
  - Se não conseguir ler o documento, peça para o usuário digitar os procedimentos

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

Cliente solicita; atendimento pede documentos (RG/CPF +import { BedrockAgentRuntimeClient } from '@aws-sdk/client-bedrock-agent-runtime';
import { run } from '@aws-sdk/bedrock-agent-runtime';
import { processarAgendamento } from '../agendamento/agendamentoService';

// Configuração do cliente Bedrock
const client = new BedrockAgentRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Configuração do agente
const agent = {
  agentId: process.env.BEDROCK_AGENT_ID!,
  agentAliasId: process.env.BEDROCK_AGENT_ALIAS_ID!,
  sessionId: 'default-session',
  inputText: Você é um assistente virtual especializado em saúde e atendimento ao cliente, com foco em fornecer informações precisas e úteis. Você deve seguir as diretrizes de moderação de conteúdo e garantir que suas respostas sejam sempre respeitosas e empáticas. Caso o usuário pergunte algo que não esteja relacionado a saúde ou atendimento ao cliente, informe educadamente que você não pode ajudar com esse assunto, e redirecione a conversa para tópicos relevantes.

Você vai abrir uma exceção para os seguintes tópicos:

1) Agendamento de consultas

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

IMPORTANTE - COMO IDENTIFICAR A INTENÇÃO DO USUÁRIO:

📅 AGENDAMENTO (marcar consulta):
- "Quero agendar uma consulta"
- "Preciso marcar com cardiologista"
- "Quando posso consultar?"
- "Tem vaga para dermatologista?"

📋 VERIFICAÇÃO (saber se procedimento é coberto):
- "Posso fazer tomografia?"
- "Meu médico pediu ressonância"
- "Preciso de autorização para cirurgia"
- "Hemograma é coberto?"

📄 ANÁLISE DE DOCUMENTO (usuário envia arquivo):
- Usuário anexa PDF, imagem, documento
- "Analise este pedido médico"
- "O que precisa de autorização neste documento?"
- Qualquer mensagem com arquivo anexado

SEMPRE identifique PRIMEIRO qual é a intenção antes de responder!
PODE E DEVE aconselhar sobre a area da saude mesmo que fuja do escopo dos fluxosgramas

RESTRIÇÕES:
- Não participe de discussões não relacionadas à saúde/atendimento
- Sempre mantenha tom profissional e empático
- Para dúvidas fora do escopo, redirecione educadamente para tópicos relevantes

RESTRIÇÕES:
- Seja sempre educado e profissional
- Para dúvidas fora do escopo de saúde, redirecione educadamente
- Sempre confirme dados antes de finalizar agendamentos
- IMPORTANTE: Agendamentos são REAIS e ficam salvos no banco de dados
- Consultas só podem ser marcadas para os PRÓXIMOS 30 DIAS
- Pacientes podem consultar seus agendamentos informando o CPF
- Médicos podem ver suas consultas no calendário do sistema
- Horário de atendimento: 08:00 às 12:00 (manhã)
- SEMPRE leia documentos anexados COMPLETAMENTE antes de responder
- Para documentos, identifique TODOS os procedimentos mencionados e verifique cada um`
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
          // Processar agendamento se detectado
          const protocoloReal = await processarAgendamento(path, sessionId);
          
          // Adicionar resposta do bot ao histórico
          const sessionData = sessionCache.get(sessionId);
          if (sessionData) {
            sessionData.messages.push(`Bot: ${path}`);
            sessionCache.set(sessionId, sessionData);
          }
          
          // Se foi salvo um agendamento real, substituir protocolo na resposta
          if (protocoloReal && path.includes('protocolo')) {
            return path.replace(/AGD\d+/g, protocoloReal);
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