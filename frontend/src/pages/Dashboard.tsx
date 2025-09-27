import { useState, useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useMenu } from '../hooks/useMenu'
import { useUser } from '../contexts/UserContext'
import DoctorForm from '../components/admin/DoctorForm'
import DoctorList from '../components/admin/DoctorList'
import ContextForm from '../components/admin/ContextForm'
import ContextList from '../components/admin/ContextList'
import {fetchContext} from "../lib/api/adm/fetchBotContext.js"
type UserType = 'patient' | 'doctor' | 'admin'

export default function Dashboard() {
  const { shouldRender, isClosing, isOpening, handleClose, handleOpen } = useMenu()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  
  // Pega tipo da URL ou usa 'patient' como padrão
  const userType = (searchParams.get('type') as UserType) || 'patient'
  
  // Estado para médicos (mockado)
  const [doctors, setDoctors] = useState([
    {
      id: '1',
      name: 'Dr. João Silva',
      cpf: '123.456.789-00',
      crm: '12345-SP',
      specialty: 'Cardiologia',
      email: 'joao@hospital.com'
    },
    {
      id: '2',
      name: 'Dra. Maria Santos',
      cpf: '987.654.321-00',
      crm: '54321-RJ',
      specialty: 'Dermatologia',
      email: 'maria@clinica.com'
    },
    {
      id: '3',
      name: 'Dr. Carlos Oliveira',
      cpf: '456.789.123-00',
      crm: '67890-MG',
      specialty: 'Neurologia',
      email: 'carlos@neuro.com'
    },
    {
      id: '4',
      name: 'Dra. Ana Costa',
      cpf: '789.123.456-00',
      crm: '13579-RS',
      specialty: 'Pediatria',
      email: 'ana@pediatria.com'
    },
    {
      id: '5',
      name: 'Dr. Pedro Lima',
      cpf: '321.654.987-00',
      crm: '24680-PR',
      specialty: 'Ortopedia',
      email: 'pedro@ortopedia.com'
    }
  ])
  
  const handleSaveDoctor = (doctorData: { id?: string; name: string; cpf: string; crm: string; specialty: string; email: string }) => {
    if (doctorData.id) {
      // Editando
      setDoctors(prev => prev.map(doc => 
        doc.id === doctorData.id ? { ...doctorData, id: doctorData.id } : doc
      ))
      alert('Médico atualizado com sucesso!')
    } else {
      // Adicionando
      const newDoctor = {
        ...doctorData,
        id: Date.now().toString()
      }
      setDoctors(prev => [...prev, newDoctor])
      alert('Médico cadastrado com sucesso!')
    }
    setEditingDoctor(null)
  }
  
  const handleDeleteDoctor = (doctorId: string) => {
    setDoctors(prev => prev.filter(doc => doc.id !== doctorId))
    alert('Médico excluído com sucesso!')
  }
  
  const handleEditDoctor = (doctor: { id: string; name: string; cpf: string; crm: string; specialty: string; email: string }) => {
    setEditingDoctor(doctor)
    setIsDoctorFormOpen(true)
  }
  
  // Estado para contexto único do chatbot
  const [context, setContext] = useState({
    name: 'Assistente de Saúde',
    instructions: `Você é um assistente virtual especializado em saúde e atendimento ao cliente, com foco em fornecer informações precisas e úteis. Você deve seguir as diretrizes de moderação de conteúdo e garantir que suas respostas sejam sempre respeitosas e empáticas. caso o ususario pergunte algo que não esteja relacionado a saúde ou atendimento ao cliente, informe educadamente que você não pode ajudar com esse assunto, e redirecione a conversa para tópicos relevantes.
  Você vai abrir uma exceção para os seguintes topicos

  1) Agendamento de consultas

Atores: Beneficiário (cliente) e Atendimento.
Canais: App/site, WhatsApp/telefone, CRM.

Cliente busca agenda disponível (filtra cidade, especialidade, médico e data).

Visualiza vagas.

Reserva horário preferido.

Confirma dados do agendamento (dia, hora, profissional) → fim do fluxo via app.

Porta de entrada Uniagende: cliente entra em contato (WhatsApp/ligação).

Cliente passa dados (nome, nasc., especialidade, motivo).

Atendimento verifica agendas no CRM.

Atendimento informa ao beneficiário o resultado.

Atendimento confirma dados de agendamento (dia, hora, médico, endereço, protocolo).

Atendimento reserva a agenda no CRM → conclusão.

2) Atualização cadastral

Atores: Beneficiário e Atendimento.
Canal: WhatsApp.

Beneficiário fornece informações necessárias (CPF + dado a atualizar).

Envia documentos comprobatórios (anexos).

Atendimento verifica as informações/documentos.

Decisão: informações corretas?

Sim: Atendimento realiza a atualização no CRM → fim.

Não: Atendimento informa o beneficiário (pendência/erro) → fim.

3) Cobrança indevida

Atores: Atendimento (front), Contas médicas/Financeiro, Cliente.
Canais: presencial, e-mail ou WhatsApp.

Cliente solicita dados sobre a cobrança (inf. do boleto e qual procedimento).

Atendimento registra o atendimento (ERP: beneficiário, competência da cobrança).

Atendimento fornece protocolo ao paciente.

Atendimento envia dados por e-mail para contas médicas e aguarda retorno.

Decisão 1: Cobrança indevida?

Não: Atendimento envia comprovante ao paciente e encerra.

Sim:
6) Atendimento pergunta a forma de desconto desejada.
7) Decisão 2 (fatura atual ou futura):

Fatura atual: Solicitar ida presencial à tesouraria.

Fatura futura: Informar o financeiro (encaminhar a contas médicas com a forma de desconto).

Atendimento informa ao financeiro/contas a forma escolhida → fim.

4) Plano de maioridade

Atores: Atendimento e Cadastro.
Canal: Presencial (somente).

Cliente solicita; atendimento pede documentos (RG/CPF + comprovante de matrícula/frequência).

Atendimento tira cópias dos documentos.

Atendimento registra atendimento (ERP).

Entrega protocolo ao cliente.

(Rotina 1x/dia) Registrar documento em planilha Excel (protocolo).

Levar documentos ao Cadastro.

Decisão: Todos os documentos corretos?

Sim: Processo concluído (troca/adequação efetivada).

Não:
8) Cadastro informa ao atendimento quais documentos precisam de correção.
9) Atendimento solicita os documentos ao cliente (telefone/WhatsApp) → aguarda retorno do beneficiário.

5) Segunda via de boleto

Ator: Beneficiário.
Canal: App/Site.

Acessar plataforma (login).

Selecionar menu financeiro.

Selecionar a competência desejada.

Clicar em “Impressão 2ª via” → boleto emitido.

6) Solicitação de autorização (exames/procedimentos)

Atores: Beneficiário, Atendimento, Auditoria (processo), Operadora.
Canais: WhatsApp/presencial, CRM, app.

Beneficiário fornece informações (nome, nasc., foto do pedido médico).

Atendimento registra o atendimento no CRM (beneficiário, médico solicitante, procedimento).

Decisão 1: Precisa de auditoria?

Sim:
3a) Atendimento informa o beneficiário (nº de protocolo + prazos de retorno: 10 dias OPME, 5 dias demais).
4a) Beneficiário pode monitorar o status da guia (app/ligação/WhatsApp).
4b) Processo passa pela Auditoria.

Não: segue direto para verificação de cobertura.

Decisão 2: Procedimento tem cobertura?

Sim: Atendimento informa ao beneficiário (nº do protocolo e da guia) → autorizado.

Não: Atendimento informa motivo da negativa (nº do protocolo) → fim.

7) Troca de titularidade

Atores: Atendimento, Cliente, Cadastro.
Canal: Presencial (somente).
Observação: Se ambos (titular atual e futuro) forem vivos, exige presença de ambos.

Atendimento solicita documentos (RG/CPF, certidão de óbito se aplicável, comprovantes).

Atendimento imprime documento padrão.

Cliente assina o documento padrão.

Atendimento tira cópias dos documentos.

Atendimento registra o atendimento (ERP).

Entrega protocolo (via física).

(Rotina 1x/dia) Registrar documentos em planilha Excel (sequência de protocolos).

Levar documentos para o Cadastro.

Decisão: Todos os documentos corretos?

Sim: troca efetivada → fim.

Não:
10) Cadastro informa ao atendimento as correções necessárias.
11) Atendimento solicita documentos ao cliente (telefone/WhatsApp) → aguarda retorno.

Passe as instruções da maneira mais clara e objetiva possível, utilizando listas numeradas ou com marcadores para organizar as etapas dos fluxos de trabalho. Sempre que possível, utilize uma linguagem simples e direta para facilitar o entendimento do usuário. Evite jargões técnicos ou termos complexos que possam confundir o usuário. Mantenha um tom profissional, mas acessível, garantindo que o usuário se sinta confortável e confiante ao interagir com você.

Restrições de moderação de conteúdo:

- Não forneça informações falsas ou enganosas.

- Evite linguagem ofensiva, discriminatória ou inapropriada.

- Não compartilhe informações pessoais ou confidenciais.

- Não participe de discussões políticas, religiosas ou controversas.

- Sempre respeite a privacidade e os direitos dos usuários.

- Se uma pergunta ou solicitação for inadequada, informe educadamente que você não pode ajudar com esse assunto.`
  })
  
  // Estados para controle do modal e valor para banco
  const [contextModalValue, setContextModalValue] = useState(context)
  
  // Buscar contexto do banco ao carregar página
  useEffect(() => {
    //Implementar Fetch inicial do context
  }, [])
  
  const [isContextFormOpen, setIsContextFormOpen] = useState(false)
  const [isDoctorFormOpen, setIsDoctorFormOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<{ id: string; name: string; cpf: string; crm: string; specialty: string; email: string } | null>(null)
  
  const handleSaveContext = (contextData: { name: string; instructions: string }) => {
    setContext(contextData)
    setContextModalValue(contextData)
    fetchContext(contextData.instructions);
    
    console.log('Enviando para banco:', contextData)
    alert('Contexto atualizado com sucesso!')
  }
  
  const handleEditContext = () => {
    setContextModalValue(context) // Sincroniza valor do modal
    setIsContextFormOpen(true)
  }

  const renderPatientDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Próximas Consultas</h3>
          <p className="text-3xl font-bold text-green-600">2</p>
          <p className="text-sm text-gray-600">Esta semana</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Exames Pendentes</h3>
          <p className="text-3xl font-bold text-orange-600">1</p>
          <p className="text-sm text-gray-600">Para agendar</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Receitas</h3>
          <p className="text-3xl font-bold text-blue-600">3</p>
          <p className="text-sm text-gray-600">Ativas</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <div className="text-green-600 font-medium">Agendar Consulta</div>
          </button>
          <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="text-blue-600 font-medium">Ver Exames</div>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <div className="text-purple-600 font-medium">Receitas</div>
          </button>
          <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <div className="text-orange-600 font-medium">Histórico</div>
          </button>
        </div>
      </div>
    </div>
  )

  const renderDoctorDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Consultas Hoje</h3>
          <p className="text-3xl font-bold text-green-600">8</p>
          <p className="text-sm text-gray-600">6 realizadas</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Pacientes</h3>
          <p className="text-3xl font-bold text-blue-600">156</p>
          <p className="text-sm text-gray-600">Total ativo</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Pendências</h3>
          <p className="text-3xl font-bold text-orange-600">4</p>
          <p className="text-sm text-gray-600">Laudos para revisar</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Receita Mensal</h3>
          <p className="text-3xl font-bold text-green-600">R$ 12.5k</p>
          <p className="text-sm text-gray-600">Este mês</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <div className="text-green-600 font-medium">Nova Consulta</div>
          </button>
          <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="text-blue-600 font-medium">Ver Agenda</div>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <div className="text-purple-600 font-medium">Pacientes</div>
          </button>
          <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <div className="text-orange-600 font-medium">Relatórios</div>
          </button>
        </div>
      </div>
    </div>
  )

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      {/* Gestão de Médicos */}
      <DoctorList 
        doctors={doctors} 
        onAdd={() => {
          setEditingDoctor(null)
          setIsDoctorFormOpen(true)
        }}
        onEdit={handleEditDoctor}
      />
      
      {/* Contexto do Chatbot */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Contexto do Chatbot</h3>
          <button
            onClick={handleEditContext}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            Editar Contexto
          </button>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">{context.name}</h4>
          <div className="max-h-32 overflow-y-auto">
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {context.instructions}
            </p>
          </div>
        </div>
      </div>
      
      <DoctorForm
        isOpen={isDoctorFormOpen}
        onClose={() => {
          setIsDoctorFormOpen(false)
          setEditingDoctor(null)
        }}
        onSave={handleSaveDoctor}
        onDelete={handleDeleteDoctor}
        editingDoctor={editingDoctor}
      />
      
      <ContextForm
        isOpen={isContextFormOpen}
        onClose={() => setIsContextFormOpen(false)}
        onSave={handleSaveContext}
        editingContext={contextModalValue}
      />
    </div>
  )

  const renderDashboardContent = () => {
    switch (userType) {
      case 'patient':
        return renderPatientDashboard()
      case 'doctor':
        return renderDoctorDashboard()
      case 'admin':
        return renderAdminDashboard()
      default:
        return renderPatientDashboard()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Menu Button */}
      <header className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between h-16 items-center">
            <button
              onClick={handleOpen}
              className="w-10 h-10 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <span className="text-sm">☰</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      {/* Menu Modal */}
      {shouldRender && (
        <>
          <div 
            className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
              isClosing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={handleClose}
          />
          <div className={`fixed left-0 top-0 h-full w-80 bg-white shadow-lg z-50 p-4 transform transition-transform duration-300 ease-out ${
            isClosing ? '-translate-x-full' : isOpening ? '-translate-x-full' : 'translate-x-0'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
              <button 
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              {location.pathname !== '/calendar' && (
                <a href="/calendar" className="block w-full text-left p-3 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors">
                  Calendário
                </a>
              )}
              {location.pathname !== '/chat' && (
                <a href="/chat" className="block w-full text-left p-3 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors">
                  Chat
                </a>
              )}
              <a href="/profile" className="block w-full text-left p-3 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors">
                Configurações
              </a>
            </div>
          </div>
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <p className="text-gray-600 capitalize">
            {userType === 'patient' ? 'Paciente' : userType === 'doctor' ? 'Médico' : 'Administrador'}
          </p>
        </div>
        
        {renderDashboardContent()}
      </div>
    </div>
  )
}