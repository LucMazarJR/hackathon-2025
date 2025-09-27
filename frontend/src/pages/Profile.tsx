import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

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

export default function Profile() {
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
  
  // TODO: Pegar dados do usuário logado
  const [user] = useState<User>({
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    type: 'patient',
    cpf: '123.456.789-00'
  })

  const renderPatientProfile = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Informações Pessoais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <p className="mt-1 text-sm text-gray-900">{user.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-sm text-gray-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CPF</label>
            <p className="mt-1 text-sm text-gray-900">{user.cpf}</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDoctorProfile = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Informações Profissionais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <p className="mt-1 text-sm text-gray-900">{user.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CRM</label>
            <p className="mt-1 text-sm text-gray-900">{user.crm}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Especialidade</label>
            <p className="mt-1 text-sm text-gray-900">{user.specialty}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-sm text-gray-900">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAdminProfile = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Painel Administrativo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <p className="mt-1 text-sm text-gray-900">{user.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-sm text-gray-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nível de Acesso</label>
            <p className="mt-1 text-sm text-gray-900">Administrador</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderProfileContent = () => {
    switch (user.type) {
      case 'patient':
        return renderPatientProfile()
      case 'doctor':
        return renderDoctorProfile()
      case 'admin':
        return renderAdminProfile()
      default:
        return renderPatientProfile()
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
            <h1 className="text-xl font-semibold text-gray-900">Perfil</h1>
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
              <a href="/1/chat" className="block w-full text-left p-3 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors">
                Chat
              </a>
              <button className="w-full text-left p-3 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors">
                Configurações
              </button>
            </div>
          </div>
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <p className="text-gray-600 capitalize">{user.type === 'patient' ? 'Paciente' : user.type === 'doctor' ? 'Médico' : 'Administrador'}</p>
        </div>
        
        {renderProfileContent()}
        
        <div className="mt-8">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Editar Perfil
          </button>
        </div>
      </div>
    </div>
  )
}