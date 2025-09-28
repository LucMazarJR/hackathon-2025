import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchChatBot, fetchChatBotWithDocument } from "../lib/api/bot/fecthBot.ts";
import Message from "../components/layout/message";
import FormattedMessage from "../components/layout/FormattedMessage";
import { useMenu } from '../hooks/useMenu'
import { useUser } from '../contexts/UserContext'

interface ChatMessage {
  id: number;
  type: "usr" | "chat";
  message: string;
}

export default function Chat() {
  const { shouldRender, isClosing, isOpening, handleClose, handleOpen } = useMenu()
  const { isLoggedIn } = useUser()
  const location = useLocation()
  const navigate = useNavigate()
  
  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     navigate('/welcome')
  //   }
  // }, [isLoggedIn, navigate])
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, type: 'chat', message: 'Olá! Sou o **MedBot**, seu assistente médico virtual.\n\nEnvie uma mensagem para iniciarmos nossa conversa!' }
  ]);
  const [usrMessage, setUsrMessage] = useState("");
  const [showDocumentMenu, setShowDocumentMenu] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!usrMessage.trim() && !selectedFile) return;
    
    let messageContent = usrMessage;
    if (selectedFile) {
      messageContent += `\n\n📄 Documento: ${selectedFile.name}`;
    }
    
    const userMsg = {
      id: messages.length + 1,
      type: "usr" as const,
      message: messageContent,
    };
    setMessages((prev) => [...prev, userMsg]);
    
    const currentMessage = usrMessage;
    const currentFile = selectedFile;
    setUsrMessage("");
    setSelectedFile(null);

    try {
      let botResponse;
      if (currentFile) {
        botResponse = await fetchChatBotWithDocument(currentMessage, currentFile);
      } else {
        botResponse = await fetchChatBot(currentMessage);
      }
      
      const botMsg = {
        id: messages.length + 2,
        type: "chat" as const,
        message: botResponse.message,
      };
      setMessages((prev) => {
        const updatedMessages = [...prev, botMsg];
        localStorage.setItem("messages", JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMsg = {
        id: messages.length + 2,
        type: "chat" as const,
        message: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header with Menu Button */}
      <header className="px-4 bg-white border-b flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between h-16 items-center">
            <button
              onClick={handleOpen}
              className="w-10 h-10 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <span className="text-sm">☰</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Chat</h1>
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
              {location.pathname !== '/dashboard' && (
                <a href="/dashboard" className="block w-full text-left p-3 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors">
                  Dashboard
                </a>
              )}
              {location.pathname !== '/calendar' && (
                <a href="/calendar" className="block w-full text-left p-3 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors">
                  Calendário
                </a>
              )}
              <a href="/profile" className="block w-full text-left p-3 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors">
                Configurações
              </a>
            </div>
          </div>
        </>
      )}

      {/* Messages Area - Scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg) => (
            <Message
              key={msg.id}
              orientation={msg.type === "chat" ? "left" : "right"}
            >
              <FormattedMessage 
                content={msg.message} 
                isBot={msg.type === "chat"} 
              />
            </Message>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          {selectedFile && (
            <div className="mb-3 flex items-center justify-between bg-blue-50 p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-blue-600">📄</span>
                <span className="text-sm text-blue-700">{selectedFile.name}</span>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>
          )}
          
          <div className="flex gap-2 items-start">
            <div className="flex-1 relative">
              <textarea
                placeholder="Digite sua mensagem..."
                value={usrMessage}
                onChange={(e) => setUsrMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none min-h-[48px] max-h-32"
                rows={1}
              />
              <div className="absolute right-2 top-3">
                <button
                  onClick={() => setShowDocumentMenu(!showDocumentMenu)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.64 16.2a2 2 0 01-2.83-2.83l8.49-8.49"/>
                  </svg>
                </button>
                {showDocumentMenu && (
                  <div className="absolute right-0 bottom-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[150px]">
                    <button
                      onClick={() => {
                        fileInputRef.current?.click()
                        setShowDocumentMenu(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-green-50 hover:text-green-700 text-sm transition-colors"
                    >
                      Inserir documento
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!usrMessage.trim() && !selectedFile}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Enviar
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.gif"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}