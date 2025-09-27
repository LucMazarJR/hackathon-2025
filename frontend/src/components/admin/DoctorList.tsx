import { useState } from "react"

interface Doctor {
  id: string
  name: string
  cpf: string
  crm: string
  specialty: string
  email: string
}

interface DoctorListProps {
  doctors: Doctor[]
  onAdd: () => void
}

export default function DoctorList({ doctors, onAdd }: DoctorListProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const displayedDoctors = isExpanded ? doctors : doctors.slice(0, 3)
  const hasMore = doctors.length > 3

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Médicos Cadastrados</h3>
        <span className="text-sm text-gray-600">{doctors.length} total</span>
      </div>
      
      {doctors.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Nenhum médico cadastrado</p>
      ) : (
        <div className="space-y-4">
          <div className={`space-y-4 ${isExpanded ? 'max-h-96 overflow-y-auto' : ''}`}>
            {displayedDoctors.map((doctor) => (
              <div key={doctor.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{doctor.name}</h4>
                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                    <p className="text-sm text-gray-500">CRM: {doctor.crm}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{doctor.email}</p>
                    <p className="text-sm text-gray-500">{doctor.cpf}</p>
                  </div>
                </div>
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
                  {isExpanded ? 'Ver menos' : `Ver todos os ${doctors.length} médicos`}
                </button>
              </div>
            )}
            
            <div className="text-center">
              <button
                onClick={onAdd}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                + Cadastrar Médico
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}