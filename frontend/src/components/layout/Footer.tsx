export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <img src="/src/assets/logo.png" alt="MedBot" className="w-6 h-6" />
            <span className="text-lg font-semibold">MedBot</span>
          </div>
          <p className="text-gray-300 text-sm">
            © 2025 MedBot. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}