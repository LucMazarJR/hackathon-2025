# 🏥 UniAgendas - Sistema de Agendamento Médico Inteligente

<div align="center">

![Logo](frontend/src/assets/logo.png)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-orange.svg)](https://openai.com/)

*Sistema inteligente de agendamento médico com assistente virtual especializado em saúde*

</div>

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Como Usar](#-como-usar)
- [API Endpoints](#-api-endpoints)
- [Documentação](#-documentação)
- [Contribuição](#-contribuição)
- [Licença](#-licença)
- [Equipe](#-equipe)

## 🎯 Sobre o Projeto

O **UniAgendas** é uma solução completa para agendamento médico que combina uma interface web moderna com um assistente virtual inteligente. O sistema foi desenvolvido para facilitar o acesso aos serviços de saúde, permitindo agendamentos automatizados, verificação de procedimentos e análise de documentos médicos.

### 🌟 Diferenciais

- **Assistente Virtual Inteligente**: Powered by OpenAI GPT-4o-mini
- **Agendamento Automatizado**: Sistema completo de marcação de consultas
- **Análise de Documentos**: OCR e processamento de pedidos médicos
- **Interface Moderna**: Design responsivo com React e Tailwind CSS
- **Arquitetura Robusta**: Backend TypeScript com PostgreSQL

## ⚡ Funcionalidades

### 🤖 Assistente Virtual (Ajudant)

- **Agendamento de Consultas**
  - Busca por especialidade e cidade
  - Verificação de disponibilidade em tempo real
  - Confirmação automática com protocolo
  - Integração com calendário médico

- **Verificação de Procedimentos**
  - Autorização imediata para procedimentos simples
  - Auditoria automática para procedimentos complexos
  - Geração de protocolos únicos
  - Classificação por tipo (Simples/Complexo/OPME)

- **Análise de Documentos**
  - OCR para PDFs e imagens
  - Extração automática de procedimentos
  - Verificação de cobertura
  - Processamento de pedidos médicos

### 🖥️ Interface Web

- **Dashboard Administrativo**
  - Gestão de médicos e especialidades
  - Configuração de contextos do bot
  - Relatórios e estatísticas

- **Portal do Paciente**
  - Visualização de agendamentos
  - Histórico de consultas
  - Chat com assistente virtual

- **Sistema de Autenticação**
  - Login seguro com JWT
  - Proteção de rotas
  - Gestão de sessões

## 🛠️ Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **OpenAI API** - Inteligência artificial
- **Multer** - Upload de arquivos
- **Tesseract.js** - OCR
- **PDF2JSON** - Processamento de PDFs
- **JWT** - Autenticação
- **Bcrypt** - Criptografia

### Frontend
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS
- **React Router** - Roteamento
- **React Markdown** - Renderização de markdown
- **Vite** - Build tool

### DevOps & Ferramentas
- **ESLint** - Linting
- **PostCSS** - Processamento CSS
- **Cross-env** - Variáveis de ambiente
- **TS-Node** - Execução TypeScript

## 🏗️ Arquitetura

```
hackathon-2025/
├── backend/                 # API e lógica de negócio
│   ├── src/
│   │   ├── config/         # Configurações
│   │   ├── controller/     # Controladores
│   │   ├── database/       # Camada de dados
│   │   ├── middleware/     # Middlewares
│   │   ├── model/          # Modelos e IA
│   │   ├── routes/         # Rotas da API
│   │   ├── utils/          # Utilitários
│   │   └── validations/    # Validações
│   └── uploads/            # Arquivos temporários
├── frontend/               # Interface do usuário
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── contexts/       # Contextos React
│   │   ├── hooks/          # Hooks customizados
│   │   ├── lib/           # Bibliotecas e APIs
│   │   ├── pages/         # Páginas da aplicação
│   │   └── utils/         # Utilitários
└── docs/                  # Documentação
    ├── BPMN.pdf          # Processos de negócio
    ├── DER.jpg           # Diagrama entidade-relacionamento
    ├── Modelo Canvas.pdf  # Modelo de negócio
    └── UML.svg           # Diagrama UML
```

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+
- PostgreSQL 12+
- NPM ou Yarn

### 1. Clone o repositório

```bash
git clone https://github.com/DiegoHenriqueMelo/hackathon-2025.git
cd hackathon-2025
```

### 2. Instale as dependências

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 3. Configure o banco de dados

```sql
-- Criar banco de dados
CREATE DATABASE uniagendas;

-- Executar scripts de criação das tabelas
-- (consulte a documentação do banco para scripts completos)
```

## ⚙️ Configuração

### Backend (.env)

```env
# Servidor
PORT=3000

# Banco de dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=uniagendas
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

# OpenAI
OPENAI_API_KEY=sua_chave_openai

# JWT
JWT_SECRET=seu_jwt_secret
JWT_EXPIRES_IN=24h

# Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### Frontend

O frontend utiliza as configurações padrão do Vite. Para desenvolvimento, certifique-se de que o backend esteja rodando na porta 3000.

## 🎮 Como Usar

### 1. Inicie o backend

```bash
cd backend
npm run build
npm start
```

### 2. Inicie o frontend

```bash
cd frontend
npm run dev
```

### 3. Acesse a aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

### 4. Interaja com o assistente

1. Faça login ou registre-se
2. Acesse o chat
3. Experimente comandos como:
   - "Quero agendar uma consulta com cardiologista"
   - "Posso fazer uma tomografia?"
   - Envie um documento médico para análise

## 📡 API Endpoints

### Autenticação
```
POST /api/auth/login      # Login
POST /api/auth/register   # Registro
POST /api/auth/logout     # Logout
```

### Bot/Chat
```
POST /api/bot/message     # Enviar mensagem
POST /api/bot/document    # Upload de documento
```

### Agendamentos
```
GET  /api/agendamentos    # Listar agendamentos
POST /api/agendamentos    # Criar agendamento
PUT  /api/agendamentos/:id # Atualizar agendamento
```

### Administração
```
GET  /api/admin/doctors   # Listar médicos
POST /api/admin/doctors   # Criar médico
GET  /api/admin/context   # Obter contexto do bot
PUT  /api/admin/context   # Atualizar contexto do bot
```

## 📚 Documentação

- **[BPMN](docs/BPMN.pdf)**: Processos de negócio detalhados
- **[DER](docs/DER.jpg)**: Modelo de dados
- **[Canvas](docs/Modelo%20Canvas.pdf)**: Modelo de negócio
- **[UML](docs/UML.svg)**: Arquitetura do sistema

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código

- Use TypeScript para tipagem
- Siga as configurações do ESLint
- Documente funções complexas
- Escreva testes para novas funcionalidades

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](backend/LICENSE) para mais detalhes.

## 👥 Equipe

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/DiegoHenriqueMelo">
        <img src="https://github.com/DiegoHenriqueMelo.png" width="100px;" alt="Diego Melo"/>
        <br />
        <sub><b>Diego Melo</b></sub>
      </a>
    </td>
    <td align="center">
      <sub><b>Davi Muniz</b></sub>
    </td>
    <td align="center">
      <sub><b>Luciano Neves</b></sub>
    </td>
    <td align="center">
      <sub><b>Renan Prado</b></sub>
    </td>
  </tr>
</table>

---

<div align="center">

**[⬆ Voltar ao topo](#-uniagendas---sistema-de-agendamento-médico-inteligente)**

Desenvolvido com ❤️ para o Hackathon 2025

</div>