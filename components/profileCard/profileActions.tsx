import React from 'react'

const ProfileActions = () => {
  return (
    <div className="pb-4 sm:pb-6 lg:pb-8 px-3 sm:px-4 lg:px-6">
      {/* Horizontal layout for larger screens */}
      <div className="hidden sm:flex justify-between gap-2 md:gap-3 lg:gap-4">
        <button 
          className="flex-1 border border-gray-300 rounded-md lg:rounded-lg
                     py-2 md:py-2.5 lg:py-3 px-3 md:px-4 lg:px-6
                     text-sm md:text-base lg:text-lg font-medium text-gray-800 
                     hover:bg-gray-100 hover:border-gray-400
                     focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2
                     active:bg-gray-200
                     transition-all duration-200 ease-in-out
                     min-h-[2.75rem] md:min-h-[3rem] lg:min-h-[3.25rem]"
        >
          Salir de la cuenta
        </button>
        <button 
          className="flex-1 bg-red-500 text-white rounded-md lg:rounded-lg
                     py-2 md:py-2.5 lg:py-3 px-3 md:px-4 lg:px-6
                     text-sm md:text-base lg:text-lg font-medium
                     hover:bg-red-600 hover:shadow-md
                     focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2
                     active:bg-red-700
                     transition-all duration-200 ease-in-out
                     min-h-[2.75rem] md:min-h-[3rem] lg:min-h-[3.25rem]"
        >
          Eliminar cuenta
        </button>
      </div>

      {/* Vertical layout for mobile screens */}
      <div className="flex sm:hidden flex-col gap-3">
        <button 
          className="w-full border border-gray-300 rounded-lg
                     py-3 px-4
                     text-base font-medium text-gray-800 
                     hover:bg-gray-100 hover:border-gray-400
                     focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2
                     active:bg-gray-200
                     transition-all duration-200 ease-in-out
                     min-h-[3rem]"
        >
          Salir de la cuenta
        </button>
        <button 
          className="w-full bg-red-500 text-white rounded-lg
                     py-3 px-4
                     text-base font-medium
                     hover:bg-red-600 hover:shadow-lg
                     focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2
                     active:bg-red-700
                     transition-all duration-200 ease-in-out
                     min-h-[3rem]"
        >
          Eliminar cuenta
        </button>
      </div>
    </div>
  )
}

export default ProfileActions