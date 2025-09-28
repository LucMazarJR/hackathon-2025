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

interface User {
  id: string
  name: string
  email: string
  type: UserType
  cpf?: string
  crm?: string
  specialty?: string
}

export default function User() {
  const { shouldRender, isClosing, isOpening, handleClose, handleOpen } = useMenu()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  
  const { userId } = useUser()
  const [user, setUser] = useState<User | null>(null)
  
  // Carrega dados do usuário do localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      // amazonq-ignore-next-line
      const userData = JSON.parse(savedUser)
      setUser({
        id: userData.id.toString(),
        name: userData.name,
        email: userData.email,
        type: userData.user_type,
        cpf: userData.cpf
      })
    }
  }, [userId])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Estados para admin (médicos e contexto)
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
    }
  ])

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

Clicar em "Impressão 2ª via" → boleto emitido.

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

  const [isContextFormOpen, setIsContextFormOpen] = useState(false)
  const [isDoctorFormOpen, setIsDoctorFormOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<any>(null)
  const [contextModalValue, setContextModalValue] = useState(context)

  // Buscar contexto do banco ao carregar página
  useEffect(() => {
    const fetchInitialContext = async () => {
      try {
        // amazonq-ignore-next-line
        const response = await fetch('http://localhost:3000/admin/context');
        if (response.ok) {
          const contextData = await response.json();
          setContext(contextData);
          setContextModalValue(contextData);
        }
      } catch (error) {
        console.log('Usando contexto padrão');
      }
    };
    
    fetchInitialContext();
  }, [])

  const handleSaveDoctor = (doctorData: any) => {
    if (doctorData.id) {
      setDoctors(prev => prev.map(doc => 
        doc.id === doctorData.id ? { ...doctorData, id: doctorData.id } : doc
      ))
      alert('Médico atualizado com sucesso!')
    } else {
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

  const handleEditDoctor = (doctor: any) => {
    setEditingDoctor(doctor)
    setIsDoctorFormOpen(true)
  }

  const handleSaveContext = (contextData: { name: string; instructions: string }) => {
    setContext(contextData)
    setContextModalValue(contextData)
    fetchContext(contextData.instructions)
    console.log('Contexto atualizado:', contextData)
  }

  const handleEditContext = () => {
    setContextModalValue(context)
    setIsContextFormOpen(true)
  }

  const renderPatientDashboard = () => (
    <div className="space-y-6">
      {/* Informações do Perfil */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Informações Pessoais</h3>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Editar Perfil
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            // amazonq-ignore-next-line
            <p className="mt-1 text-sm text-gray-900">{user?.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CPF</label>
            <p className="mt-1 text-sm text-gray-900">{user?.cpf}</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDoctorDashboard = () => (
    <div className="space-y-6">
      {/* Informações do Perfil */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Informações Profissionais</h3>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Editar Perfil
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <p className="mt-1 text-sm text-gray-900">{user?.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CRM</label>
            <p className="mt-1 text-sm text-gray-900">{user?.crm}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Especialidade</label>
            <p className="mt-1 text-sm text-gray-900">{user?.specialty}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
          </div>
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

      {/* Informações do Perfil */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Painel Administrativo</h3>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Editar Perfil
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            // amazonq-ignore-next-line
            <p className="mt-1 text-sm text-gray-900">{user?.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nível de Acesso</label>
            <p className="mt-1 text-sm text-gray-900">Administrador</p>
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

  const renderContent = () => {
    // amazonq-ignore-next-line
    if (!user) return <div>Carregando...</div>
    
    switch (user.type) {
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
              className="w-10 h-10 lg:w-12 lg:h-12 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 hover:shadow-xl transition-all flex items-center justify-center"
            >
              <span className="text-sm lg:text-base">☰</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Painel do Usuário</h1>
            <div className="w-10 lg:w-12"></div>
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
            </div>
          </div>
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <p className="text-gray-600 capitalize">
            // amazonq-ignore-next-line
            {user?.type === 'patient' ? 'Paciente' : user?.type === 'doctor' ? 'Médico' : 'Administrador'}
          </p>
        </div>
        
        {renderContent()}
        
        {/* Modal de Edição */}
        {isEditModalOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
              onClick={() => setIsEditModalOpen(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Editar Perfil</h3>
                    <button 
                      onClick={() => setIsEditModalOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                      <input 
                        type="text" 
                        defaultValue={user?.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        // amazonq-ignore-next-line
                        defaultValue={user?.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    
                    {user?.cpf && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                        <input 
                          type="text" 
                          defaultValue={user?.cpf}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    )}
                    
                    {user?.crm && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CRM</label>
                        <input 
                          type="text" 
                          defaultValue={user?.crm}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    )}
                    
                    {user?.specialty && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
                        <input 
                          type="text" 
                          defaultValue={user?.specialty}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    )}
                    
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Salvar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}