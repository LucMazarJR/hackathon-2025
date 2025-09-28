/**
 * @fileoverview Ponto de entrada principal da aplicação (servidor).
 * Este módulo é responsável por carregar variáveis de ambiente, definir a porta
 * e iniciar o processo de conexão do servidor.
 */
import { connectServer } from "./utils/logger.js";
import dotenv from "dotenv";
/**
 * Carrega as variáveis de ambiente do arquivo `.env` para `process.env`.
 * @returns {object} Um objeto com o resultado da configuração.
 */
dotenv.config();
/**
 * Porta na qual o servidor irá escutar.
 * O valor é lido da variável de ambiente `PORT` e convertido para um número.
 * @type {number}
 */
const PORT = Number(process.env.PORT);
/**
 * Inicia o servidor e loga a confirmação de conexão (função presumida em "./utils/logger.js").
 * @param {number} PORT - A porta na qual o servidor deve ser inicializado.
 * @returns {void}
 */
connectServer(PORT);
