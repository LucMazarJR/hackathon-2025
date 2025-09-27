import { useState } from "react";
import { useLocation } from 'react-router-dom'
import { fetchChatBot } from "../lib/api/bot/fecthBot.ts";
import Message from "../components/layout/message";

import FormattedMessage from "../components/layout/FormattedMessage";
import { useMenu } from '../hooks/useMenu'

interface ChatMessage {
  id: number;
  type: "usr" | "chat";
  message: string;
}

export default function Chat() {
  const { shouldRender, isClosing, isOpening, handleClose, handleOpen } = useMenu()
  const location = useLocation()
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, type: 'chat', message: 'Olá! Sou o **MedBot**, seu assistente médico virtual.\n\nEnvie uma mensagem para iniciarmos nossa conversa!' }
  ]);
  const [usrMessage, setUsrMessage] = useState("");

  const handleSendMessage = async () => {
    const userMsg = {
      id: messages.length + 1,
      type: "usr" as const,
      message: usrMessage,
    };
    setMessages((prev) => [...prev, userMsg]);
    setUsrMessage("");

    const botResponse = await fetchChatBot(usrMessage);
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
              {location.pathname !== '/profile' && (
                <a href="/profile" className="block w-full text-left p-3 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors">
                  Perfil
                </a>
              )}
              {location.pathname !== '/calendar' && (
                <a href="/calendar" className="block w-full text-left p-3 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors">
                  Calendário
                </a>
              )}
              <button className="w-full text-left p-3 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors">
                Configurações
              </button>
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
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
        <div className="max-w-4xl mx-auto flex gap-2">
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
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none min-h-[48px] max-h-32"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors self-end"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}