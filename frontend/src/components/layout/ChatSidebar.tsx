import { useState, useEffect } from 'react'

interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const [isClosing, setIsClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const [isOpening, setIsOpening] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      setIsClosing(false)
      setIsOpening(true)
      const timer = setTimeout(() => setIsOpening(false), 50)
      return () => clearTimeout(timer)
    } else if (shouldRender) {
      setIsClosing(true)
      const timer = setTimeout(() => {
        setShouldRender(false)
        setIsClosing(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen, shouldRender])

  if (!shouldRender) return null

  const handleClose = () => {
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-200 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />
      
      {/* Menu */}
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
        
        {/* Menu Items */}
        <div className="space-y-2">
          <button className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors">
            Nova Conversa
          </button>
          <button className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors">
            Histórico
          </button>
          <button className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors">
            Configurações
          </button>
        </div>
      </div>
    </>
  )
}