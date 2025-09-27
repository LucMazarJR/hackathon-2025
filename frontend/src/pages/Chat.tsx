import { useState } from 'react'
import ChatSidebar from '../components/layout/ChatSidebar'
import Message from '../components/layout/message'

export default function Chat() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const messages = [
    { id: 1, type: 'chat', message: 'Olá! Sou o MedBot, seu assistente médico. Como posso ajudá-lo hoje?' },
    { id: 2, type: 'usr', message: 'Oi! Preciso agendar uma consulta' },
    { id: 3, type: 'chat', message: 'Posso ajudá-lo com agendamentos, consulta de exames ou esclarecer dúvidas sobre procedimentos.' },
    { id: 4, type: 'usr', message: 'Gostaria de marcar com um cardiologista' },
    { id: 5, type: 'chat', message: 'Perfeito! Vou agendar sua consulta. Em qual especialidade você precisa?' },
    { id: 6, type: 'usr', message: 'Pode ser na próxima semana, de preferência pela manhã' }
  ]

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar Modal */}
      <ChatSidebar
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* Fixed Menu Button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="fixed top-20 left-4 z-30 w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center"
      >
        <span className="text-lg">☰</span>
      </button>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 p-4 pt-20 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {messages.map((msg) => (
              <Message 
                key={msg.id} 
                orientation={msg.type === 'chat' ? 'left' : 'right'}
              >
                {msg.message}
              </Message>
            ))}

          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto flex gap-2">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
            <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}