import { useState } from 'react'

interface Context {
  id: string
  name: string
  instructions: string
}

interface ContextListProps {
  contexts: Context[]
  onEdit: (context: Context) => void
  onAdd: () => void
}

export default function ContextList({ contexts, onEdit, onAdd }: ContextListProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const displayedContexts = isExpanded ? contexts : contexts.slice(0, 3)
  const hasMore = contexts.length > 3

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Contextos do Chatbot</h3>
        <span className="text-sm text-gray-600">{contexts.length} total</span>
      </div>
      
      {contexts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Nenhum contexto cadastrado</p>
      ) : (
        <div className="space-y-4">
          <div className={`space-y-4 ${isExpanded ? 'max-h-96 overflow-y-auto' : ''}`}>
            {displayedContexts.map((context) => (
              <div key={context.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{context.name}</h4>
                  <button
                    onClick={() => onEdit(context)}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Editar
                  </button>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {truncateText(context.instructions)}
                </p>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pt-4 space-y-3">
            {hasMore && (
              <div className="text-center">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  {isExpanded ? 'Ver menos' : `Ver todos os ${contexts.length} contextos`}
                </button>
              </div>
            )}
            
            <div className="text-center">
              <button
                onClick={onAdd}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                + Adicionar Contexto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}