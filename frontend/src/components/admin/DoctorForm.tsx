import { useState, useEffect } from 'react'

interface DoctorFormProps {
  isOpen: boolean
  onClose: () => void
  onAddDoctor: (doctor: any) => void
}

const formatCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

const validateCPF = (cpf: string) => {
  const numbers = cpf.replace(/\D/g, '')
  return numbers.length === 11
}

export default function DoctorForm({ isOpen, onClose, onAddDoctor }: DoctorFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    crm: '',
    specialty: '',
    email: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'cpf') {
      setFormData({
        ...formData,
        [name]: formatCPF(value)
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        cpf: '',
        crm: '',
        specialty: '',
        email: ''
      })
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateCPF(formData.cpf)) {
      alert('CPF inválido')
      return
    }
    
    onAddDoctor(formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Cadastrar Médico</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">CPF</label>
            <input
              type="text"
              name="cpf"
              required
              value={formData.cpf}
              onChange={handleChange}
              maxLength={14}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="000.000.000-00"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">CRM</label>
            <input
              type="text"
              name="crm"
              required
              value={formData.crm}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="12345-SP"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Especialidade</label>
            <select
              name="specialty"
              required
              value={formData.specialty}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Selecione...</option>
              <option value="Cardiologia">Cardiologia</option>
              <option value="Dermatologia">Dermatologia</option>
              <option value="Neurologia">Neurologia</option>
              <option value="Pediatria">Pediatria</option>
              <option value="Ortopedia">Ortopedia</option>
              <option value="Ginecologia">Ginecologia</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
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
                Cadastrar Médico
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}