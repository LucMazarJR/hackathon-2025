-- Estrutura completa do banco de dados para o projeto MedBot

-- Criar banco de dados (se não existir)
-- CREATE DATABASE db_devianos;

-- Conectar ao banco db_devianos e executar:

-- 1. Tabela de usuários
CREATE TABLE IF NOT EXISTS tb_usuarios (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  cpf VARCHAR(11) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) DEFAULT 'patient' CHECK (user_type IN ('patient', 'doctor', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de contexto do bot
CREATE TABLE IF NOT EXISTS tb_bot_context (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  instructions TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de médicos
CREATE TABLE IF NOT EXISTS tb_medicos (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cpf VARCHAR(11) UNIQUE NOT NULL,
  crm VARCHAR(20) UNIQUE NOT NULL,
  specialty VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  agenda_status VARCHAR(20) DEFAULT 'disponivel' CHECK (agenda_status IN ('disponivel', 'cheia')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de procedimentos médicos
CREATE TABLE IF NOT EXISTS tb_procedimentos (
  id SERIAL PRIMARY KEY,
  nome_procedimento VARCHAR(500) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  prazo_dias INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON tb_usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_cpf ON tb_usuarios(cpf);
CREATE INDEX IF NOT EXISTS idx_medicos_crm ON tb_medicos(crm);
CREATE INDEX IF NOT EXISTS idx_medicos_specialty ON tb_medicos(specialty);

-- Inserir dados iniciais
-- Usuário admin padrão (senha: admin123)
INSERT INTO tb_usuarios (name, email, cpf, password_hash, user_type) 
VALUES (
  'Administrador Sistema', 
  'admin@medbot.com', 
  '00000000000', 
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Contexto inicial do bot
INSERT INTO tb_bot_context (name, instructions) VALUES (
  'Assistente de Saúde',
  'Você é um assistente virtual especializado em saúde e atendimento ao cliente.'
) ON CONFLICT DO NOTHING;

-- Médicos de exemplo
INSERT INTO tb_medicos (name, cpf, crm, specialty, email, agenda_status) VALUES 
('Dr. Carlos Silva', '12345678901', '12345-SP', 'Cardiologia', 'carlos@hospital.com', 'cheia'),
('Dra. Ana Santos', '23456789012', '23456-SP', 'Cardiologia', 'ana@hospital.com', 'disponivel'),
('Dr. Pedro Lima', '34567890123', '34567-RJ', 'Pediatria', 'pedro@clinica.com', 'cheia'),
('Dra. Maria Costa', '45678901234', '45678-RJ', 'Pediatria', 'maria@clinica.com', 'disponivel')
ON CONFLICT (crm) DO NOTHING;

-- Procedimentos médicos de exemplo
INSERT INTO tb_procedimentos (nome_procedimento, tipo, prazo_dias) VALUES 
('Angioplastia transluminal percutânea', 'Com protocolo', 5),
('Ressonância magnética', 'Sem protocolo', 0)
ON CONFLICT DO NOTHING;