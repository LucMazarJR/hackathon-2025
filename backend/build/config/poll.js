import { Pool } from "pg";
import dotenv from 'dotenv';
dotenv.config();
/**
 * @fileoverview Configuração e exportação de um pool de conexões
 * para o banco de dados PostgreSQL usando o pacote `pg`.
 *
 * As variáveis de ambiente necessárias são:
 * - DB_USER: usuário do banco
 * - DB_HOST: host/servidor do banco
 * - DB_DATABASE: nome do banco de dados
 * - DB_PASSWORD: senha do usuário
 * - DB_PORT: porta de conexão (número)
 */
/**
 * Pool de conexões com o banco PostgreSQL.
 * O `Pool` gerencia múltiplas conexões, permitindo
 * melhor performance em aplicações que fazem muitas
 * consultas simultâneas.
 *
 * @constant
 * @type {Pool}
 */
export const pool = new Pool({
    /** Usuário do banco de dados */
    user: process.env.DB_USER,
    /** Endereço do host/servidor do banco */
    host: process.env.DB_HOST,
    /** Nome do banco de dados */
    database: process.env.DB_DATABASE,
    /** Senha do usuário */
    password: process.env.DB_PASSWORD,
    /** Porta de conexão (convertida para número) */
    port: Number(process.env.DB_PORT),
});
/**
 * Evento disparado quando a conexão com o PostgreSQL é estabelecida com sucesso.
 *
 * @event connect
 */
pool.on("connect", () => {
    console.log("Conectado ao PostgreSQL via Pool!");
});
/**
 * Evento disparado em caso de erro inesperado no pool de conexões.
 *
 * @event error
 * @param {Error} err - Objeto de erro retornado pelo evento.
 */
pool.on("error", (err) => {
    console.error("Erro inesperado no pool de conexões:", err);
});
