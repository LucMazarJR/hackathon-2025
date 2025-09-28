/**
 * Testes unitários para bot
 */

import { messageBotController, documentUploadController } from '../../controller/bot/botController.js';
import { sendMessage } from '../../model/bot/botConfig/config.js';
import { TextExtractionService } from '../../utils/textExtraction.js';

// Mocks
jest.mock('../../model/bot/botConfig/config.js', () => ({
  sendMessage: jest.fn()
}));

jest.mock('../../utils/textExtraction.js', () => ({
  TextExtractionService: {
    extractText: jest.fn(),
    formatDocumentContext: jest.fn()
  }
}));

jest.mock('fs', () => ({
  unlinkSync: jest.fn(),
  existsSync: jest.fn().mockReturnValue(true)
}));

const mockSendMessage = sendMessage as jest.MockedFunction<typeof sendMessage>;
const mockExtractText = TextExtractionService.extractText as jest.MockedFunction<typeof TextExtractionService.extractText>;
const mockFormatDocumentContext = TextExtractionService.formatDocumentContext as jest.MockedFunction<typeof TextExtractionService.formatDocumentContext>;

describe('Bot Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('messageBotController', () => {
    it('deve processar mensagem com sucesso', async () => {
      mockSendMessage.mockResolvedValue('Olá! Como posso ajudá-lo?');

      const [status, response] = await messageBotController('Olá', 'session123');

      expect(status).toBe(200);
      expect(response).toBe('Olá! Como posso ajudá-lo?');
      expect(mockSendMessage).toHaveBeenCalledWith('Olá', 'session123');
    });

    it('deve usar sessão padrão quando não fornecida', async () => {
      mockSendMessage.mockResolvedValue('Resposta padrão');

      const [status, response] = await messageBotController('Teste');

      expect(status).toBe(200);
      expect(mockSendMessage).toHaveBeenCalledWith('Teste', 'default');
    });

    it('deve tratar erros do bot', async () => {
      mockSendMessage.mockRejectedValue(new Error('Erro do bot'));

      const [status, response] = await messageBotController('Teste');

      expect(status).toBe(500);
      expect(response).toBe('Erro interno do servidor');
    });
  });

  describe('documentUploadController', () => {
    const mockFile = {
      path: '/tmp/test.pdf',
      originalname: 'documento.pdf',
      mimetype: 'application/pdf',
      size: 1024
    } as Express.Multer.File;

    it('deve processar documento PDF com sucesso', async () => {
      const extractedText = 'Texto extraído do PDF';
      const formattedContext = 'Contexto formatado do documento';
      
      mockExtractText.mockResolvedValue(extractedText);
      mockFormatDocumentContext.mockReturnValue(formattedContext);
      mockSendMessage.mockResolvedValue('Documento analisado com sucesso');

      const [status, response] = await documentUploadController(
        mockFile,
        'Analise este documento',
        'session123'
      );

      expect(status).toBe(200);
      expect(response).toBe('Documento analisado com sucesso');
      expect(mockExtractText).toHaveBeenCalledWith('/tmp/test.pdf');
      expect(mockFormatDocumentContext).toHaveBeenCalledWith(extractedText, 'documento.pdf');
    });

    it('deve usar mensagem padrão quando não fornecida', async () => {
      mockExtractText.mockResolvedValue('Texto do documento');
      mockFormatDocumentContext.mockReturnValue('Contexto do documento');
      mockSendMessage.mockResolvedValue('Análise concluída');

      const [status, response] = await documentUploadController(mockFile);

      expect(status).toBe(200);
      expect(mockSendMessage).toHaveBeenCalledWith(
        expect.stringContaining('Analise este documento e me ajude'),
        'default'
      );
    });

    it('deve tratar erro na extração de texto', async () => {
      mockExtractText.mockRejectedValue(new Error('Erro na extração'));

      const [status, response] = await documentUploadController(mockFile);

      expect(status).toBe(500);
      expect(response).toBe('Erro ao processar documento');
    });
  });
});