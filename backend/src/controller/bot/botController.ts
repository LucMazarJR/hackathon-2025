import {sendMessage} from "../../model/bot/botConfig/config.js"

export let messageBotController = async (message: string): Promise<[number, string]> => {
  try {
    const response = await sendMessage(message);
    return [200, response];
  } catch (error) {
    console.error("Erro ao processar mensagem no botController:", error);
    return [500, "Erro interno do servidor"];
  }
}