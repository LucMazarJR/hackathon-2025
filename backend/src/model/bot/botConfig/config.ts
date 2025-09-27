import { Agent, run } from "@openai/agents";
import OpenAI from "openai";
import { sessionManager } from "../../class/Agent.js";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const agent = new Agent({
  name: "Ajudant",
  instructions: `Você é assistente virtual especialzado em saude, você deve auxiliar o usuario com as perguntas que ele tiver, sempre de forma educada e prestativa. Seja breve e objetivo em suas respostas, evite respostas longas. Seja empático e amigável. Se o usuário fizer uma pergunta que não esteja relacionada à saúde, responda educadamente que você só pode ajudar com questões de saúde.`,
});

export let sendMessage = async (message: string, sessionId: string = "default"): Promise<string> => {
  const chat = sessionManager.getSession(sessionId);
  
  const context = chat.getContext();
  const fullPrompt = context ? `${context}\nUsuário: ${message}` : message;

  const response = await run(agent, fullPrompt);
  const assistantMessage: any = response.finalOutput;
  
  chat.addMessage(message, assistantMessage);
  console.log(fullPrompt)

  return assistantMessage;
};
