# Teste do Fluxo de Autenticação

## Estrutura do Banco Existente
✅ Tabela `tb_usuarios` já configurada com:
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- email (VARCHAR UNIQUE)
- cpf (VARCHAR UNIQUE) 
- password_hash (VARCHAR)
- user_type (VARCHAR DEFAULT 'patient')
- created_at (TIMESTAMP)

## APIs Ajustadas
✅ `/auth/check-email` - Verifica se email existe
✅ `/auth/register` - Cadastra novo usuário
✅ `/auth/login` - Autentica usuário

## Fluxo Completo
1. **Home** → Clica "Começar Agora" → `/welcome`
2. **Welcome** → Digita email → POST `/auth/check-email`
3. Se existe: → `/login?email=xxx`
4. Se não existe: → `/register?email=xxx`
5. **Register** → Cadastra → `/login?email=xxx`
6. **Login** → Autentica → `/user`

## Para Testar
1. `cd backend && npm start`
2. `cd frontend && npm run dev`
3. Acesse http://localhost:5173
4. Teste com email existente e novo email