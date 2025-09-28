/**
 * Mocks para OpenAI
 */

export const mockOpenAIResponse = {
  state: {
    modelResponses: [{
      output: [{
        content: [{
          text: 'Olá! Como posso ajudá-lo hoje?'
        }]
      }]
    }]
  }
};

export const mockAgendamentoResponse = {
  state: {
    modelResponses: [{
      output: [{
        content: [{
          text: '✅ Agendamento realizado com sucesso!\n\nDetalhes:\n- Especialidade: Cardiologia\n- Médico: Dr. Carlos Silva\n- Data: 2024-01-15\n- Horário: 09:00\n- Protocolo: AGD123456789'
        }]
      }]
    }]
  }
};

export const mockSendMessage = jest.fn().mockResolvedValue('Resposta do bot de teste');

export const mockAgent = {
  name: 'TestBot',
  model: 'gpt-4o-mini',
  tools: [],
  instructions: 'Bot de teste'
};

export const mockRun = jest.fn().mockResolvedValue(mockOpenAIResponse);