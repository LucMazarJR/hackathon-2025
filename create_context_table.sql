-- Criar tabela para contexto do chatbot
CREATE TABLE IF NOT EXISTS tb_bot_context (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  instructions TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir contexto padrão
INSERT INTO tb_bot_context (name, instructions) 
VALUES (
  'MedBot - Assistente de Saúde',
  'Você é um assistente virtual especializado em saúde e atendimento ao cliente. Ajude com agendamentos, informações médicas e suporte geral. Seja sempre educado, empático e profissional.'
) ON CONFLICT DO NOTHING;