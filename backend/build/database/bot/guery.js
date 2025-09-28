"use strict";
/*INSERTS: */
let query1 = "INSERT INTO tb_historico (pergunta, resposta) VALUES (TEXT, TEXT)";
let query2 = "INSERT INTO tb_localizacoes (estado, cidade, bairro, rua, numero) VALUES ( VARCHAR(40), VARCHAR(100), VARCHAR(100), VARCHAR(150), INTEGER)";
let query3 = "INSERT INTO tb_convenios (nome, valor, dt_cadastro, fg_ativo) VALUES (VARCHAR(100), MONEY, DATE, BOOLEAN)";
let query4 = "INSERT INTO tb_protocolos (id_protocolo, descricao) VALUES (VARCHAR(15), TEXT)";
let query5 = "INSERT INTO tb_pacientes (id_localizacao, id_convenio, id_historico, id_protocolo, nome, sobrenome, senha, dt_nascimento, dt_cadastro, cpf, rg, genero, telefone, email) VALUES (INTEGER, INTEGER, INTEGER, VARCHAR(15), VARCHAR(60), VARCHAR(120), TEXT, DATE, DATE, VARCHAR(11), VARCHAR(30), VARCHAR(9), telefone(20), VARCHAR(255))";
let query6 = "INSERT INTO tb_especializacoes (nome) VALUES (nome)";
let query7 = "INSERT INTO tb_medicos (id_especializacao, nome, sobrenome, senha,  crm_registro, crm_uf, dt_nascimento, dt_cadastro, cpf) VALUES (INTEGER, VARCHAR(60), VARCHAR(120), TEXT, VARCHAR(10), VARCHAR(2), DATE, DATE, VARCHAR(11))";
let query8 = "INSERT INTO tb_procedimentos (terminologia, correlacao, nome_procedimento, resolucao, vigencia, cobertura_ob, cobertura_amb, cobertura_hco, cobertura_hso, pac, dut, subgrupo, grupo, capitulo, tipo) VALUES (TEXT, BOOLEAN, VARCHAR(255), VARCHAR(50), DATE, VARCHAR(2), VARCHAR(3), VARCHAR(3), VARCHAR(3), VARCHAR(3), INTEGER), VARCHAR(150), VARCHAR(150), VARCHAR(150), VARCHAR(13))";
let query9 = "INSERT INTO tb_consultas (id_paciente, id_medico, id_procedimento, situacao, dt_consulta) VALUES (INTEGER, INTEGER, INTEGER, BOOLEAN, DATE)";
/*SELECTS: */
let query10 = "SELECT h.* FROM tb_pacientes p INNER JOIN tb_historico h ON (p.id_historico = h.id_conversa)";
let query11 = "SELECT * FROM tb_historico";
let query12 = "SELECT * FROM tb_localizacoes";
let query13 = "SELECT * FROM tb_convenios";
let query14 = "SELECT * FROM tb_protocolos";
let query15 = "SELECT * FROM tb_pacientes";
let query16 = "SELECT * FROM tb_especializacoes";
let query17 = "SELECT * FROM tb_medicos";
let query18 = "SELECT * FROM tb_procedimentos";
let query19 = "SELECT * FROM tb_consultas";
let query20 = "SELECT nome_procedimento, tipo FROM tb_procedimentos WHERE nome_procedimento = 'sua_variavel'";
