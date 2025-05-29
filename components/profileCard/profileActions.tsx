import React from 'react'

const ProfileActions = () => {
  return (
    <div className="flex justify-between gap-3 pb-6 px-4">
      <button 
        className="flex-1 border border-gray-300 rounded py-2 px-4 text-gray-800 hover:bg-gray-100 transition-colors"

      >
        Salir de la cuenta
      </button>
      <button 
        className="flex-1 bg-red-500 text-white rounded py-2 px-4 hover:bg-red-600 transition-colors"

      >
        Eliminar cuenta
      </button>
    </div>
  )
}

export default ProfileActions