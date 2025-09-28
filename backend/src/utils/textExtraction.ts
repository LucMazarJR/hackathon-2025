import Tesseract from 'tesseract.js';
import fs from 'fs';
import path from 'path';
import PDFParser from 'pdf2json';

export class TextExtractionService {
  /**
   * Extrai texto de uma imagem usando Tesseract OCR
   */
  static async extractTextFromImage(filePath: string): Promise<string> {
    try {
      const { data: { text } } = await Tesseract.recognize(filePath, 'por', {
        logger: m => console.log(m)
      });
      console.log(text)
      return text.trim();
    } catch (error) {
      console.error('Erro ao extrair texto da imagem:', error);
      throw new Error('Falha na extração de texto da imagem');
    }
  }

  /**
   * Extrai texto de um PDF usando pdf2json
   */
  static async extractTextFromPDF(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const pdfParser = new (PDFParser as any)(null, 1);
      
      pdfParser.on('pdfParser_dataError', (errData: any) => {
        console.error('Erro ao extrair texto do PDF:', errData.parserError);
        reject(new Error('Falha na extração de texto do PDF'));
      });
      
      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        try {
          let text = '';
          if (pdfData.Pages) {
            pdfData.Pages.forEach((page: any) => {
              if (page.Texts) {
                page.Texts.forEach((textItem: any) => {
                  if (textItem.R) {
                    textItem.R.forEach((run: any) => {
                      if (run.T) {
                        text += decodeURIComponent(run.T) + ' ';
                      }
                    });
                  }
                });
              }
              text += '\n';
            });
          }
          resolve(text.trim());
        } catch (error) {
          reject(new Error('Erro ao processar dados do PDF'));
        }
      });
      
      pdfParser.loadPDF(filePath);
    });
  }

  /**
   * Determina o tipo de arquivo e extrai o texto apropriadamente
   */
  static async extractText(filePath: string): Promise<string> {
    const extension = path.extname(filePath).toLowerCase();
    
    if (['.jpg', '.jpeg', '.png', '.gif'].includes(extension)) {
      return await this.extractTextFromImage(filePath);
    } else if (extension === '.pdf') {
      return await this.extractTextFromPDF(filePath);
    } else {
      throw new Error('Tipo de arquivo não suportado');
    }
  }

  /**
   * Formata o texto extraído para ser usado como contexto de documento
   */
  static formatDocumentContext(extractedText: string, fileName: string): string {
    return `[DOCUMENTO: ${fileName}]\n${extractedText}\n[FIM DO DOCUMENTO]\n\n`;
  }
}