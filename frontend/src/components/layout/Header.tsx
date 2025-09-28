import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-3 text-white hover:text-green-100 transition-colors">
            <img src="/src/assets/logo.png" alt="MedBot" className="w-8 h-8" />
            <span className="text-2xl font-bold">MedBot</span>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link to="/dashboard" className="text-white hover:text-green-100 transition-colors font-medium">
              Dashboard
            </Link>
            <Link to="/chat" className="text-white hover:text-green-100 transition-colors font-medium">
              Chat
            </Link>
            <Link to="/calendar" className="text-white hover:text-green-100 transition-colors font-medium">
              Calendário
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="text-white hover:text-green-100 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}