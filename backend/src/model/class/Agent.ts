export class AgentChat {
  public historyRequest: string[];
  public historyResponse: string[];

  constructor() {
    this.historyRequest = [];
    this.historyResponse = [];
  }

  public addMessage(request: string, response: string): void {
    this.historyRequest.push(request);
    this.historyResponse.push(response);
  }

  public getContext(): string {
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

// Gerenciador de sessões
class SessionManager {
  private sessions: Map<string, AgentChat> = new Map();

  getSession(sessionId: string): AgentChat {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, new AgentChat());
    }
    return this.sessions.get(sessionId)!;
  }
}

export const sessionManager = new SessionManager();
