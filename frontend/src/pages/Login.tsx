import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implementar lógica de login
    console.log('Login:', { email, password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl tablet:text-4xl font-bold text-gray-900 mb-2">
            <span className="text-primary">MedBot</span>
          </h1>
          <p className="text-gray-600">Entre na sua conta</p>
        </div>

        {/* Login Form */}
        <div className="bg-white p-6 tablet:p-8 rounded-lg shadow-sm border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-primary hover:text-green-700">
              Esqueceu sua senha?
            </a>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Não tem uma conta?{' '}
            <a href="#" className="text-primary hover:text-green-700 font-medium">
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}