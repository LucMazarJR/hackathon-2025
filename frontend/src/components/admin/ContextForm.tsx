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

  useEffect(() => {
    if (editingContext) {
      setFormData({
        name: editingContext.name,
        instructions: editingContext.instructions
      })
    } else {
      setFormData({
        name: '',
        instructions: ''
      })
    }
  }, [editingContext, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    onSave(formData)
    onClose()
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
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}