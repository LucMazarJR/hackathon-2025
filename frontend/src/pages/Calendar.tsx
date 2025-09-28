import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

export default function Calendar() {
  const { user } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const [isOpening, setIsOpening] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (isMenuOpen) {
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
  }, [isMenuOpen, shouldRender])

  const handleClose = () => {
    setIsMenuOpen(false)
  }

  const handleOpen = () => {
    setIsMenuOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Menu Button */}
      <header className="px-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between h-16 items-center">
            <button
              onClick={handleOpen}
              className="w-10 h-10 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <span className="text-sm">☰</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Calendário</h1>
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
      <div className="max-w-md mx-auto p-4">
        <div className="mb-6">
          <p className="text-gray-600 text-sm">
            {user?.user_type === 'admin' ? 'Gestão de agendamentos' : 
             user?.user_type === 'doctor' ? 'Seus atendimentos' : 
             'Seus compromissos e consultas'}
          </p>
        </div>
        
        {/* Espaço para o calendário */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="text-center text-gray-500 py-8">
            Calendário será implementado aqui
          </div>
        </div>
        
        {/* Lista de próximos compromissos */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">
            {user?.user_type === 'admin' ? 'Agendamentos do Sistema' : 
             user?.user_type === 'doctor' ? 'Próximos Atendimentos' : 
             'Próximos Compromissos'}
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Consulta Cardiologia</p>
                <p className="text-gray-600 text-xs">Dr. João Silva</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">15/01</p>
                <p className="text-xs text-gray-600">14:30</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Exame de Sangue</p>
                <p className="text-gray-600 text-xs">Laboratório Central</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">18/01</p>
                <p className="text-xs text-gray-600">08:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}