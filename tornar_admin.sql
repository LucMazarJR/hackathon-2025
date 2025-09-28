-- Query para tornar um usuário administrador
-- Substitua 'seu@email.com' pelo seu email cadastrado

UPDATE tb_usuarios 
SET user_type = 'admin' 
WHERE email = 'seu@email.com';

-- Para verificar se funcionou:
SELECT id, name, email, user_type FROM tb_usuarios WHERE email = 'seu@email.com';