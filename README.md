# 🏥 MedBot - Sistema de Assistente Médico Virtual

Sistema completo de assistente médico virtual desenvolvido para o Hackathon 2025, integrando frontend React com backend Node.js e IA conversacional.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Instalação](#instalação)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Testes](#testes)
- [Contribuição](#contribuição)

## 🎯 Visão Geral

O MedBot é uma plataforma completa que oferece:

- **Assistente Virtual Inteligente**: Chatbot especializado em saúde com contextos personalizáveis
- **Gestão de Usuários**: Sistema de autenticação com diferentes tipos de usuário (Paciente, Médico, Admin)
- **Dashboard Administrativo**: Interface para gerenciar médicos e configurar contextos do chatbot
- **Agendamento de Consultas**: Sistema integrado para marcação de consultas
- **Interface Responsiva**: Design moderno e intuitivo

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│  (PostgreSQL)   │
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • API REST      │    │ • Users         │
│ • Chat          │    │ • Auth JWT      │    │ • Doctors       │
│ • Admin Panel   │    │ • OpenAI        │    │ • Contexts      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Tecnologias

### Frontend
- **React 19** - Framework principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **React Router** - Roteamento
- **Vite** - Build tool
- **React Markdown** - Renderização de markdown

### Backend
- **Node.js** - Runtime
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **PostgreSQL** - Banco de dados
- **OpenAI API** - IA conversacional
- **JWT** - Autenticação
- **Multer** - Upload de arquivos
- **Jest** - Testes

## ✨ Funcionalidades

### 👤 Usuários
- **Pacientes**: Chat com assistente, agendamento, histórico
- **Médicos**: Dashboard profissional, gestão de pacientes
- **Administradores**: Gestão completa do sistema

### 🤖 Chatbot Inteligente
- Contextos personalizáveis por administrador
- Respostas especializadas em saúde
- Integração com OpenAI
- Histórico de conversas
- Scroll automático suave

### 🏥 Gestão Médica
- Cadastro de médicos com validação de CPF/CRM
- CRUD completo (Create, Read, Update, Delete)
- Lista expansível com scroll
- Validações de dados

### ⚙️ Administração
- Dashboard com métricas
- Gestão de contextos do chatbot
- Configuração de instruções IA
- Interface intuitiva

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/DiegoHenriqueMelo/hackathon-2025.git
cd hackathon-2025
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure as variáveis de ambiente
npm run build
npm start
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Variáveis de Ambiente
```env
# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/medbot
OPENAI_API_KEY=your_openai_key
JWT_SECRET=your_jwt_secret
PORT=3001
```

## 🎮 Uso

### Acesso ao Sistema
1. **Desenvolvimento**: `http://localhost:3000`
2. **API**: `http://localhost:3001`

### Tipos de Usuário
- **Admin**: `/dashboard?type=admin`
- **Médico**: `/dashboard?type=doctor`
- **Paciente**: `/dashboard?type=patient`

### Navegação
- **Dashboard**: Página principal com métricas
- **Chat**: `/chat` - Assistente virtual
- **Calendário**: `/calendar` - Agendamentos
- **Configurações**: `/profile` - Perfil do usuário

## 🔌 API Endpoints

### Autenticação
```
POST /api/auth/login     - Login de usuário
POST /api/auth/register  - Registro de usuário
GET  /api/auth/profile   - Perfil do usuário
```

### Chatbot
```
POST /api/bot/chat       - Enviar mensagem
GET  /api/bot/context    - Obter contexto atual
PUT  /api/bot/context    - Atualizar contexto
```

### Administração
```
GET    /api/admin/doctors     - Listar médicos
POST   /api/admin/doctors     - Cadastrar médico
PUT    /api/admin/doctors/:id - Atualizar médico
DELETE /api/admin/doctors/:id - Excluir médico
```

### Agendamentos
```
GET  /api/agendamento/consultas - Listar consultas
POST /api/agendamento/agendar   - Agendar consulta
```

## 📁 Estrutura do Projeto

```
hackathon-2025/
├── backend/
│   ├── src/
│   │   ├── controller/     # Controladores da API
│   │   ├── database/       # Conexão e queries
│   │   ├── middleware/     # Middlewares
│   │   ├── model/          # Modelos de dados
│   │   ├── routes/         # Rotas da API
│   │   ├── utils/          # Utilitários
│   │   └── __tests__/      # Testes
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── contexts/       # Context API
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # APIs e utilitários
│   │   ├── pages/          # Páginas da aplicação
│   │   └── utils/          # Funções utilitárias
│   └── package.json
├── docs/                   # Documentação
└── README.md
```

## 🧪 Testes

### Backend
```bash
cd backend
npm test                 # Todos os testes
npm run test:unit        # Testes unitários
npm run test:integration # Testes de integração
npm run test:coverage    # Cobertura de testes
```

### Tipos de Teste
- **Unitários**: Funções individuais
- **Integração**: APIs e banco de dados
- **E2E**: Fluxos completos
- **Performance**: Testes de carga

## 🎨 Componentes Principais

### Frontend

#### Dashboard
- **AdminDashboard**: Gestão completa do sistema
- **DoctorDashboard**: Interface para médicos
- **PatientDashboard**: Interface para pacientes

#### Formulários
- **DoctorForm**: Modal para CRUD de médicos
- **ContextForm**: Modal para configurar chatbot
- **AuthForms**: Login e registro

#### Chat
- **Chat**: Interface principal do chatbot
- **Message**: Componente de mensagem
- **FormattedMessage**: Renderização com markdown

### Backend

#### Controllers
- **AuthController**: Autenticação e autorização
- **BotController**: Lógica do chatbot
- **AdminController**: Funcionalidades administrativas

#### Models
- **Agent**: Classe principal do chatbot
- **BotModel**: Configurações da IA
- **AdminModel**: Operações administrativas

## 🔧 Configurações

### Context API
```tsx
// Gerenciamento global de usuário
const { userId, isLoggedIn, setUserId } = useUser()
```

### Hooks Customizados
```tsx
// Menu lateral com animações
const { shouldRender, handleOpen, handleClose } = useMenu()
```

### Validações
```tsx
// Validação de CPF
import { validateCPF, formatCPF } from './utils/cpf'
```

## 🚀 Deploy

### Produção
1. **Build do Frontend**:
   ```bash
   cd frontend && npm run build
   ```

2. **Build do Backend**:
   ```bash
   cd backend && npm run build
   ```

3. **Variáveis de Produção**:
   - Configure DATABASE_URL
   - Configure OPENAI_API_KEY
   - Configure JWT_SECRET

## ⚠️ Status do Projeto

**ATENÇÃO**: Este projeto está temporariamente fora do ar para manutenção e atualizações.

## 🤝 Contribuição

### Equipe
- **Davi Muniz**
- **Diego Melo**  
- **Luciano Neves**
- **Renan Prado**

### Como Contribuir
1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Padrões de Código
- **TypeScript** para tipagem
- **ESLint** para linting
- **Prettier** para formatação
- **Conventional Commits** para mensagens

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Para suporte e dúvidas:
- **Issues**: [GitHub Issues](https://github.com/DiegoHenriqueMelo/hackathon-2025/issues)
- **Email**: Contate a equipe de desenvolvimento

---

**Desenvolvido com ❤️ para o Hackathon 2025**