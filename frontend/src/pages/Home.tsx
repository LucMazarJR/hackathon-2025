import NavButton from "../components/buttons/nav_buton";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="px-4 pt-16 pb-12 text-center">
        <h1 className="text-4xl tablet:text-5xl desktop:text-6xl font-bold text-gray-900 mb-6">
          Bem-vindo ao
          <span className="block text-primary">MedBot</span>
        </h1>
        <p className="text-lg tablet:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Assistente inteligente para agendamentos, consulta de exames e suporte a processos médicos.
        </p>
        <NavButton
          className="w-full tablet:w-auto bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
          path="/welcome"
        >
          Começar Agora
        </NavButton>
      </section>

      {/* Features */}
      <section className="px-4 py-12">
        <h2 className="text-2xl tablet:text-3xl font-bold text-center text-gray-900 mb-8">
          O que você pode fazer?
        </h2>
        <div className="space-y-6 tablet:grid tablet:grid-cols-2 desktop:grid-cols-3 tablet:gap-6 tablet:space-y-0 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Agendamentos</h3>
            <p className="text-gray-600">Marque consultas e procedimentos de forma rápida e fácil.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔬</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Consultar Exames</h3>
            <p className="text-gray-600">Verifique resultados e tire dúvidas sobre seus exames.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Suporte</h3>
            <p className="text-gray-600">Tire dúvidas sobre processos e procedimentos médicos.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-12 bg-gray-50">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl tablet:text-3xl font-bold text-gray-900 mb-4">
            Pronto para começar?
          </h2>
          <p className="text-gray-600 mb-8">
            Experimente nosso assistente inteligente e simplifique seus processos médicos.
          </p>
        </div>
      </section>
    </div>
  )
}