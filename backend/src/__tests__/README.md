# 🧪 Suíte de Testes - UniAgendas

## 📋 Visão Geral

Esta suíte de testes abrangente cobre todos os aspectos do sistema UniAgendas, desde testes unitários até testes de integração e performance.

## 🏗️ Estrutura dos Testes

```
__tests__/
├── setup.ts                 # Configuração global
├── mocks/                   # Mocks reutilizáveis
│   ├── database.ts         # Mocks do banco de dados
│   └── openai.ts           # Mocks da OpenAI
├── fixtures/               # Dados de teste
│   └── testData.ts         # Dados padronizados
├── unit/                   # Testes unitários
│   ├── auth.test.ts        # Autenticação
│   ├── bot.test.ts         # Bot/Chat
│   ├── consulta.test.ts    # Consultas
│   └── textExtraction.test.ts # Extração de texto
├── integration/            # Testes de integração
│   ├── api.test.ts         # API endpoints
│   ├── database.test.ts    # Operações de banco
│   └── bot-flow.test.ts    # Fluxos do bot
├── performance/            # Testes de performance
│   └── load.test.ts        # Carga e performance
└── e2e/                    # Testes end-to-end
    └── complete-flow.test.ts # Fluxos completos
```

## 🚀 Como Executar

### Instalar Dependências
```bash
npm install
```

### Executar Todos os Testes
```bash
npm test
```

### Executar por Categoria
```bash
# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration

# Com coverage
npm run test:coverage

# Modo watch
npm run test:watch
```

## 📊 Cobertura de Testes

### Módulos Testados

#### ✅ Autenticação
- [x] Registro de usuário
- [x] Login/logout
- [x] Validações de entrada
- [x] Hash de senhas
- [x] Verificação de duplicatas

#### ✅ Bot/Chat
- [x] Processamento de mensagens
- [x] Upload de documentos
- [x] Extração de texto (OCR/PDF)
- [x] Fluxos de agendamento
- [x] Verificação de procedimentos
- [x] Análise de documentos médicos

#### ✅ Consultas/Agendamentos
- [x] Criação de consultas
- [x] Busca por CPF
- [x] Busca por médico
- [x] Geração de protocolos
- [x] Validações de dados

#### ✅ Banco de Dados
- [x] Operações CRUD
- [x] Transações
- [x] Tratamento de erros
- [x] Validações de constraints

#### ✅ API Endpoints
- [x] Autenticação (/api/auth/*)
- [x] Bot (/api/bot/*)
- [x] Agendamentos (/api/agendamentos/*)
- [x] Admin (/api/admin/*)

## 🎯 Tipos de Teste

### 1. Testes Unitários
Testam funções e métodos isoladamente:
- Controllers
- Database functions
- Utilities
- Validations

### 2. Testes de Integração
Testam interação entre componentes:
- API endpoints
- Database operations
- Bot flows
- File processing

### 3. Testes de Performance
Verificam performance e escalabilidade:
- Tempo de resposta
- Usuários simultâneos
- Uso de memória
- Throughput

### 4. Testes E2E
Testam fluxos completos do usuário:
- Registro → Login → Agendamento
- Upload → Análise → Autorização
- Admin → Configuração → Uso

## 🔧 Configuração

### Variáveis de Ambiente (.env.test)
```env
NODE_ENV=test
DB_NAME=uniagendas_test
OPENAI_API_KEY=test_key
JWT_SECRET=test_secret
```

### Mocks Principais
- **Database**: Pool de conexão PostgreSQL
- **OpenAI**: API calls e responses
- **File System**: Upload e processamento
- **External APIs**: Serviços externos

## 📈 Métricas de Qualidade

### Cobertura Esperada
- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

### Performance Targets
- **Response Time**: < 2s
- **Concurrent Users**: 50+
- **Memory Usage**: < 100MB
- **Error Rate**: < 1%

## 🐛 Cenários de Teste

### Casos de Sucesso
- ✅ Registro válido
- ✅ Login correto
- ✅ Agendamento completo
- ✅ Procedimento autorizado
- ✅ Documento processado

### Casos de Erro
- ❌ Dados inválidos
- ❌ Usuário duplicado
- ❌ Credenciais incorretas
- ❌ Banco indisponível
- ❌ API externa falha

### Casos Limite
- 🔄 Sessões longas
- 🔄 Documentos grandes
- 🔄 Muitos usuários
- 🔄 Dados corrompidos
- 🔄 Timeouts

## 🛠️ Ferramentas Utilizadas

- **Jest**: Framework de testes
- **Supertest**: Testes de API
- **TypeScript**: Tipagem estática
- **Mocks**: Isolamento de dependências
- **Coverage**: Análise de cobertura

## 📝 Padrões de Teste

### Nomenclatura
```typescript
describe('ModuleName', () => {
  describe('functionName', () => {
    it('deve fazer algo específico', () => {
      // Arrange
      // Act  
      // Assert
    });
  });
});
```

### Estrutura AAA
```typescript
it('deve criar usuário válido', async () => {
  // Arrange
  const userData = { name: 'Test', email: 'test@test.com' };
  
  // Act
  const result = await createUser(userData);
  
  // Assert
  expect(result.success).toBe(true);
});
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Timeout nos testes**
   - Aumentar jest.setTimeout()
   - Verificar mocks assíncronos

2. **Mocks não funcionam**
   - Verificar ordem dos imports
   - Limpar mocks entre testes

3. **Cobertura baixa**
   - Adicionar testes para branches não cobertas
   - Testar casos de erro

### Debug
```bash
# Executar teste específico
npm test -- --testNamePattern="auth"

# Debug mode
npm test -- --detectOpenHandles --forceExit

# Verbose output
npm test -- --verbose
```

## 📚 Documentação Adicional

- [Jest Documentation](https://jestjs.io/docs)
- [Supertest Guide](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

**Desenvolvido com ❤️ para garantir qualidade e confiabilidade do UniAgendas**