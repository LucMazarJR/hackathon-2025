-- Adicionar campos para médicos na tabela tb_usuarios
ALTER TABLE tb_usuarios 
ADD COLUMN IF NOT EXISTS crm VARCHAR(20),
ADD COLUMN IF NOT EXISTS specialty VARCHAR(100);

-- Criar índice para CRM
CREATE INDEX IF NOT EXISTS idx_usuarios_crm ON tb_usuarios(crm);