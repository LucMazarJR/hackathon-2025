import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Consulta {
  id_consulta: number;
  data_consulta: string;
  hora_consulta: string;
  protocolo: string;
  status: string;
  nome_paciente?: string; // Para médicos
  nome_medico?: string; // Para pacientes
  especialidade?: string;
  observacoes?: string;
}

export default function Calendar() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchConsultas();
  }, []);

  const fetchConsultas = async () => {
    try {
      setLoading(true);
      let url = '';
      
      if (user.type === 'doctor') {
        // Buscar consultas do médico
        url = `http://localhost:3000/api/consultas/medico/${user.id}`;
      } else if (user.type === 'patient' && user.cpf) {
        // Buscar consultas do paciente
        url = `http://localhost:3000/api/consultas/paciente/${user.cpf}`;
      } else if (user.type === 'admin') {
        // Administrador pode ver todas as consultas
        url = `http://localhost:3000/api/consultas/todas`;
      } else {
        // Se não tem CPF, mostrar mensagem sem erro
        setConsultas([]);
        setLoading(false);
        return;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setConsultas(data.consultas || []);
      } else {
        setConsultas([]);
      }
    } catch (err) {
      setConsultas([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // HH:MM
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      case 'concluida': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const finalizarConsulta = async (idConsulta: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/consultas/${idConsulta}/finalizar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          observacoes: 'Consulta finalizada pelo médico'
        })
      });

      if (response.ok) {
        // Atualizar a lista de consultas
        fetchConsultas();
      } else {
        console.error('Erro ao finalizar consulta');
      }
    } catch (error) {
      console.error('Erro ao finalizar consulta:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando consultas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <button
              onClick={() => navigate('/user')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              ← Voltar
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Calendário</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {user.type === 'doctor' ? 'Minhas Consultas' : 
                 user.type === 'admin' ? 'Consultas do Sistema' : 
                 'Minhas Consultas Agendadas'}
              </h2>
              <button
                onClick={fetchConsultas}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Atualizar
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {consultas.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📅</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma consulta agendada
                </h3>
                <p className="text-gray-600">
                  {user.type === 'doctor' 
                    ? 'Você não tem consultas marcadas no momento.'
                    : user.type === 'admin'
                    ? 'Não há consultas no sistema no momento.'
                    : 'Você não tem consultas agendadas. Use o chat para agendar uma consulta.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {consultas.map((consulta) => (
                  <div key={consulta.id_consulta} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-medium text-gray-900">
                            📅 {formatDate(consulta.data_consulta)}
                          </span>
                          <span className="text-lg font-medium text-green-600">
                            🕐 {formatTime(consulta.hora_consulta)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consulta.status)}`}>
                            {consulta.status}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          {user.type === 'doctor' ? (
                            <p><strong>Paciente:</strong> {consulta.nome_paciente}</p>
                          ) : (
                            <>
                              <p><strong>Médico:</strong> {consulta.nome_medico}</p>
                              <p><strong>Especialidade:</strong> {consulta.especialidade}</p>
                            </>
                          )}
                          {consulta.observacoes && (
                            <p><strong>Observações:</strong> {consulta.observacoes}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Protocolo</p>
                        <p className="text-sm font-mono text-gray-700">{consulta.protocolo}</p>
                        
                        {user.type === 'doctor' && consulta.status === 'agendada' && (
                          <button
                            onClick={() => finalizarConsulta(consulta.id_consulta)}
                            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                          >
                            Finalizar Consulta
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}