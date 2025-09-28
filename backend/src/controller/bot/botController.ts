import { sendMessage } from "../../model/bot/botConfig/config.js";
import { TextExtractionService } from "../../utils/textExtraction.js";
import fs from 'fs';

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
  message: string,
  sessionId: string = "default"
): Promise<[number, string]> => {
  try {
    const response = await sendMessage(message, sessionId);
    return [200, response];
  } catch (error) {
    console.error("Erro ao processar mensagem no botController:", error);
    return [500, "Erro interno do servidor"];
  }
};

/**
 * Controlador para processar upload de documentos e extrair texto
 */
export let documentUploadController = async (
  file: Express.Multer.File,
  message: string = "",
  sessionId: string = "default"
): Promise<[number, string]> => {
  try {
    // Extrai texto do documento
    const extractedText = await TextExtractionService.extractText(file.path);
    
    // Formata o contexto do documento
    const documentContext = TextExtractionService.formatDocumentContext(
      extractedText, 
      file.originalname
    );
    
    // Combina contexto do documento com mensagem do usuário
    const fullMessage = documentContext + (message || "Analise este documento e me ajude com informações sobre ele.");
    
    // Envia para o bot
    const response = await sendMessage(fullMessage, sessionId);
    
    // Remove arquivo temporário
    fs.unlinkSync(file.path);
    
    return [200, response];
  } catch (error) {
    console.error("Erro ao processar documento:", error);
    
    // Remove arquivo em caso de erro
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    
    return [500, "Erro ao processar documento"];
  }
};
