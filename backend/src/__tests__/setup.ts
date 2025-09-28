/**
 * Setup global para testes
 */

import dotenv from 'dotenv';

// Carrega variáveis de ambiente de teste
dotenv.config({ path: '.env.test' });

// Mock do console para testes mais limpos
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

// Timeout global para testes
jest.setTimeout(30000);