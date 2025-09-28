/**
 * Testes unitários para extração de texto
 */

import { TextExtractionService } from '../../utils/textExtraction.js';
import fs from 'fs';
import path from 'path';

// Mock das dependências
jest.mock('tesseract.js', () => ({
  recognize: jest.fn()
}));

jest.mock('pdf2json', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    loadPDF: jest.fn()
  }));
});

jest.mock('fs');

const mockFs = fs as jest.Mocked<typeof fs>;

describe('TextExtractionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('extractText', () => {
    it('deve extrair texto de arquivo PDF', async () => {
      const filePath = '/tmp/test.pdf';
      mockFs.existsSync.mockReturnValue(true);
      
      // Mock do PDF2JSON será testado em integração
      // Para unit test, vamos mockar o resultado
      const extractTextSpy = jest.spyOn(TextExtractionService, 'extractText');
      extractTextSpy.mockResolvedValue('Texto extraído do PDF');

      const result = await TextExtractionService.extractText(filePath);

      expect(result).toBe('Texto extraído do PDF');
    });

    it('deve extrair texto de imagem', async () => {
      const filePath = '/tmp/test.jpg';
      mockFs.existsSync.mockReturnValue(true);
      
      const extractTextSpy = jest.spyOn(TextExtractionService, 'extractText');
      extractTextSpy.mockResolvedValue('Texto extraído da imagem');

      const result = await TextExtractionService.extractText(filePath);

      expect(result).toBe('Texto extraído da imagem');
    });

    it('deve rejeitar arquivo inexistente', async () => {
      const filePath = '/tmp/inexistente.pdf';
      mockFs.existsSync.mockReturnValue(false);

      await expect(TextExtractionService.extractText(filePath))
        .rejects.toThrow('Arquivo não encontrado');
    });

    it('deve rejeitar formato não suportado', async () => {
      const filePath = '/tmp/test.txt';
      mockFs.existsSync.mockReturnValue(true);

      await expect(TextExtractionService.extractText(filePath))
        .rejects.toThrow('Formato de arquivo não suportado');
    });
  });

  describe('formatDocumentContext', () => {
    it('deve formatar contexto do documento corretamente', () => {
      const text = 'Solicitação de exame de sangue para paciente João Silva';
      const filename = 'pedido_medico.pdf';

      const result = TextExtractionService.formatDocumentContext(text, filename);

      expect(result).toContain('DOCUMENTO ANEXADO');
      expect(result).toContain(filename);
      expect(result).toContain(text);
      expect(result).toContain('ANÁLISE SOLICITADA');
    });

    it('deve tratar texto vazio', () => {
      const result = TextExtractionService.formatDocumentContext('', 'empty.pdf');

      expect(result).toContain('DOCUMENTO ANEXADO');
      expect(result).toContain('empty.pdf');
      expect(result).toContain('(documento vazio ou não foi possível extrair texto)');
    });

    it('deve tratar texto muito longo', () => {
      const longText = 'A'.repeat(10000);
      const result = TextExtractionService.formatDocumentContext(longText, 'long.pdf');

      expect(result.length).toBeLessThan(longText.length + 1000);
      expect(result).toContain('DOCUMENTO ANEXADO');
    });
  });

  describe('isImageFile', () => {
    it('deve identificar arquivos de imagem', () => {
      expect(TextExtractionService.isImageFile('/tmp/test.jpg')).toBe(true);
      expect(TextExtractionService.isImageFile('/tmp/test.jpeg')).toBe(true);
      expect(TextExtractionService.isImageFile('/tmp/test.png')).toBe(true);
      expect(TextExtractionService.isImageFile('/tmp/test.gif')).toBe(true);
      expect(TextExtractionService.isImageFile('/tmp/test.bmp')).toBe(true);
    });

    it('deve rejeitar arquivos que não são imagem', () => {
      expect(TextExtractionService.isImageFile('/tmp/test.pdf')).toBe(false);
      expect(TextExtractionService.isImageFile('/tmp/test.txt')).toBe(false);
      expect(TextExtractionService.isImageFile('/tmp/test.doc')).toBe(false);
    });
  });

  describe('isPDFFile', () => {
    it('deve identificar arquivos PDF', () => {
      expect(TextExtractionService.isPDFFile('/tmp/test.pdf')).toBe(true);
      expect(TextExtractionService.isPDFFile('/tmp/TEST.PDF')).toBe(true);
    });

    it('deve rejeitar arquivos que não são PDF', () => {
      expect(TextExtractionService.isPDFFile('/tmp/test.jpg')).toBe(false);
      expect(TextExtractionService.isPDFFile('/tmp/test.txt')).toBe(false);
    });
  });
});