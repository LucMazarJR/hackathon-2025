-- Inserir especialidades se não existirem
INSERT INTO tb_especializacoes (id_especializacao, nome_especializacao) VALUES 
(1, 'Cardiologia'),
(2, 'Pediatria')
ON CONFLICT (id_especializacao) DO NOTHING;

-- Inserir os 4 médicos conforme solicitado
INSERT INTO tb_medicos (nome, sobrenome, cpf, crm_registro, crm_uf, id_especializacao, dt_nascimento, dt_cadastro) VALUES 
('Dr. Carlos', 'Silva', '12345678901', '12345', 'SP', 1, '1980-05-15', CURRENT_DATE),
('Dra. Ana', 'Santos', '23456789012', '23456', 'SP', 1, '1985-08-20', CURRENT_DATE),
('Dr. Pedro', 'Lima', '34567890123', '34567', 'RJ', 2, '1978-12-10', CURRENT_DATE),
('Dra. Maria', 'Costa', '45678901234', '45678', 'RJ', 2, '1982-03-25', CURRENT_DATE)
ON CONFLICT (cpf) DO NOTHING;