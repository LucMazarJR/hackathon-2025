import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Auth() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      alert('Por favor, digite seu email')
      return
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert('Por favor, digite um email válido')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:3000/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (result.exists) {
        // Email existe, vai para login com email preenchido
        navigate(`/login?email=${encodeURIComponent(email)}`)
      } else {
        // Email não existe, vai para registro
        navigate(`/register?email=${encodeURIComponent(email)}`)
      }
    } catch (error) {
      console.error('Erro ao verificar email:', error)
      alert('Erro de conexão. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Bem-vindo ao MedBot
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Digite seu email para continuar
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isLoading ? 'Verificando...' : 'Continuar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}