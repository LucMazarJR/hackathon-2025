# Implementações Necessárias para o Fluxo de Autenticação

## 1. Corrigir Home.tsx
- Mudar botão "Começar Agora" de `/login` para `/welcome`

## 2. Implementar verificação de email na Welcome.tsx
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  try {
    const response = await fetch('http://localhost:3000/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    
    const result = await response.json()
    
    if (result.exists) {
      // Redireciona para login com email preenchido
      navigate(`/login?email=${encodeURIComponent(email)}`)
    } else {
      // Redireciona para registro com email preenchido
      navigate(`/register?email=${encodeURIComponent(email)}`)
    }
  } catch (error) {
    console.error('Erro ao verificar email:', error)
    alert('Erro de conexão')
  }
}
```

## 3. Criar endpoint no backend (logger.ts)
```typescript
// Adicionar após as rotas existentes
app.post("/auth/check-email", async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: "Email é obrigatório" });
  }
  
  try {
    const result = await pool.query("SELECT id FROM tb_usuarios WHERE email = $1", [email]);
    return res.status(200).json({ exists: result.rows.length > 0 });
  } catch (error) {
    console.error("Erro ao verificar email:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
});
```

## 4. Atualizar Login.tsx para usar URL params
```typescript
const [formData, setFormData] = useState({
  email: new URLSearchParams(location.search).get('email') || '',
  password: ''
})
```

## 5. Atualizar Register.tsx para usar URL params
```typescript
const [formData, setFormData] = useState({
  name: '',
  email: new URLSearchParams(location.search).get('email') || '',
  cpf: '',
  password: '',
  confirmPassword: ''
})
```

## 6. Estrutura do Banco de Dados Necessária

### Tabela tb_usuarios:
```sql
CREATE TABLE tb_usuarios (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  cpf VARCHAR(11) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) DEFAULT 'patient' CHECK (user_type IN ('patient', 'doctor', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 7. Fluxo Correto:
1. Home → Botão "Começar Agora" → Welcome
2. Welcome → Digita email → Fetch para verificar
3. Se existe: Login (com email preenchido)
4. Se não existe: Register (com email preenchido)
5. Após registro: Redireciona para Login
6. Após login: Redireciona para /user