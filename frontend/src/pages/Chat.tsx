import { useState } from "react";
import { fetchChatBot } from "../lib/api/bot/fecthBot.ts";
import ChatSidebar from "../components/layout/ChatSidebar";
import Message from "../components/layout/message";
import FormattedMessage from "../components/layout/FormattedMessage";

interface ChatMessage {
  id: number;
  type: "usr" | "chat";
  message: string;
}

export default function Chat() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <div className="min-h-screen bg-white flex">
      {/* Sidebar Modal */}
      <ChatSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

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

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
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
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors self-end"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
