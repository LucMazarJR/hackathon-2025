import { useState, useEffect } from 'react'

interface Context {
  id?: string
  name: string
  instructions: string
}

interface ContextFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (context: { name: string; instructions: string }) => void
  editingContext?: { name: string; instructions: string } | null
}

export default function ContextForm({ isOpen, onClose, onSave, editingContext }: ContextFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    instructions: ''
  })
  const [showSuccess, setShowSuccess] = useState(false)

  const defaultInstructions = `Você é um assistente virtual especializado em saúde e atendimento ao cliente da Uniagendas. Seja sempre respeitoso, empático e profissional.

FUNCIONALIDADES PRINCIPAIS:

1) AGENDAMENTO DE CONSULTAS (quando o usuário quer MARCAR uma consulta)
- Use quando: "quero agendar", "marcar consulta", "preciso de médico", "consulta com cardiologista"
- Pergunte qual especialidade o paciente precisa
- Pergunte em qual cidade prefere ser atendido
- Especialidades: Cardiologia, Dermatologia, Neurologia, Pediatria, Ortopedia, Ginecologia, Clínica Geral
- Cidades: São Paulo, Rio de Janeiro, Belo Horizonte
- Pergunte nome completo e CPF do paciente
- Consultas só para os PRÓXIMOS 30 DIAS
- Horários: 08:00, 09:00, 10:00, 11:00 (manhã)
- Confirme agendamento e informe que foi SALVO NO SISTEMA

2) VERIFICAÇÃO DE PROCEDIMENTOS (quando o usuário quer saber se um procedimento é coberto)
- Use quando: "preciso fazer tomografia", "meu médico pediu ressonância", "posso fazer hemograma?"
- Procedimentos SIMPLES (autorizado imediatamente): consulta, hemograma, raio-x, eletrocardiograma
- Procedimentos COMPLEXOS (auditoria 5 dias): tomografia, ressonância, ultrassom, endoscopia, cirurgias simples
- Procedimentos OPME (auditoria 10 dias): angioplastia, marca-passo, próteses, stents, implantes
- Gere protocolo: PROC + data/hora + número

3) ANÁLISE DE DOCUMENTOS (quando o usuário envia um arquivo/documento)
- Use quando: usuário anexa PDF, imagem, documento médico
- LEIA o documento completamente
- IDENTIFIQUE os procedimentos/exames mencionados no documento
- Para CADA procedimento encontrado, verifique:
  * Se é simples (autorizado), complexo (5 dias) ou OPME (10 dias)
  * Gere protocolo individual para cada procedimento
- Exemplo: "No seu documento identifiquei: Tomografia (auditoria 5 dias - PROC123), Hemograma (autorizado - PROC124)"
- Se não conseguir ler o documento, peça para o usuário digitar os procedimentos

IMPORTANTE - COMO IDENTIFICAR A INTENÇÃO DO USUÁRIO:

📅 AGENDAMENTO (marcar consulta):
- "Quero agendar uma consulta"
- "Preciso marcar com cardiologista"
- "Quando posso consultar?"
- "Tem vaga para dermatologista?"

📋 VERIFICAÇÃO (saber se procedimento é coberto):
- "Posso fazer tomografia?"
- "Meu médico pediu ressonância"
- "Preciso de autorização para cirurgia"
- "Hemograma é coberto?"

📄 ANÁLISE DE DOCUMENTO (usuário envia arquivo):
- Usuário anexa PDF, imagem, documento
- "Analise este pedido médico"
- "O que precisa de autorização neste documento?"
- Qualquer mensagem com arquivo anexado

SEMPRE identifique PRIMEIRO qual é a intenção antes de responder!

RESTRIÇÕES:
- Não forneça informações médicas ou diagnósticos
- Seja sempre educado e profissional
- Para dúvidas fora do escopo de saúde, redirecione educadamente
- Sempre confirme dados antes de finalizar agendamentos
- IMPORTANTE: Agendamentos são REAIS e ficam salvos no banco de dados
- Consultas só podem ser marcadas para os PRÓXIMOS 30 DIAS
- Pacientes podem consultar seus agendamentos informando o CPF
- Médicos podem ver suas consultas no calendário do sistema
- Horário de atendimento: 08:00 às 12:00 (manhã)
- SEMPRE leia documentos anexados COMPLETAMENTE antes de responder
- Para documentos, identifique TODOS os procedimentos mencionados e verifique cada um`;

  useEffect(() => {
    if (editingContext) {
      setFormData({
        name: editingContext.name,
        instructions: editingContext.instructions
      })
    } else {
      setFormData({
        name: '',
        instructions: defaultInstructions
      })
    }
  }, [editingContext, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    onSave(formData)
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      onClose()
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Editar Contexto</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Contexto
              </label>
              <input
                type="text"
                disabled
                value={formData.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instruções
              </label>
              <textarea
                required
                rows={15}
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 resize-none"
                placeholder="Digite as instruções completas para o chatbot..."
              />
            </div>
            
            {showSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-green-700 text-sm">Contexto atualizado com sucesso!</span>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={showSuccess}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {showSuccess ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}