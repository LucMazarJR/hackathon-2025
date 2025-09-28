-- Estrutura do banco de dados necessária para o projeto

-- Criar banco de dados (se não existir)
-- CREATE DATABASE db_devianos;

-- Conectar ao banco db_devianos e executar:

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS tb_usuarios (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  cpf VARCHAR(11) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) DEFAULT 'patient' CHECK (user_type IN ('patient', 'doctor', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON tb_usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_cpf ON tb_usuarios(cpf);

-- Inserir usuário admin padrão (opcional)
-- Senha: admin123 (hash bcrypt)
INSERT INTO tb_usuarios (name, email, cpf, password_hash, user_type) 
VALUES (
  'Administrador', 
  'admin@medbot.com', 
  '00000000000', 
  '$2b$10$rQZ8qNqZ8qNqZ8qNqZ8qNOJ8qNqZ8qNqZ8qNqZ8qNqZ8qNqZ8qNqZ', 
  'admin'
) ON CONFLICT (email) DO NOTHING;