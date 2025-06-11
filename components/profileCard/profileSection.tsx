import React, { ReactNode } from "react";
import { Pencil } from "lucide-react";

type ProfileSectionProps = {
  title: string;
  children: ReactNode;
  onEdit?: () => void;
  containerClassName?: string;
  titleClassName?: string;
};

export const ProfileSection: React.FC<ProfileSectionProps> = ({ 
  title, 
  children, 
  onEdit,
  containerClassName = "bg-gray-200 shadow-md sm:shadow-lg md:shadow-xl",
  titleClassName = "font-semibold sm:font-bold mb-2 sm:mb-3 md:mb-4"
}) => {
  return (
    <div className={`${containerClassName} 
                     p-3 sm:p-4 md:p-5 lg:p-6
                     rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl
                     min-h-48
                     relative
                     transition-all duration-200 ease-in-out
                     hover:shadow-lg sm:hover:shadow-xl md:hover:shadow-2xl`}>
      <h3 className={`${titleClassName} 
                      text-sm sm:text-base md:text-lg lg:text-xl
                      leading-tight sm:leading-snug
                      text-gray-900
                      break-words
                      ${onEdit ? 'pr-8 sm:pr-10 md:pr-12' : ''}`}>
        {title}
      </h3>
      
      <div className="text-xs sm:text-sm md:text-base lg:text-lg
                     leading-relaxed sm:leading-normal md:leading-relaxed">
        {children}
      </div>
      
      {onEdit && (
        <button 
          className="absolute 
                     top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4
                     p-1.5 sm:p-2 md:p-2.5
                     rounded-md sm:rounded-lg
                     hover:bg-black/10 hover:backdrop-blur-sm
                     focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1
                     active:bg-black/20
                     transition-all duration-200 ease-in-out
                     min-w-[2rem] min-h-[2rem] sm:min-w-[2.25rem] sm:min-h-[2.25rem] md:min-w-[2.5rem] md:min-h-[2.5rem]
                     flex items-center justify-center
                     group"
          onClick={onEdit}
          aria-label="Editar sección"
        >
          <Pencil 
            size={14} 
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6
                      text-gray-600 hover:text-gray-800
                      group-hover:scale-110
                      transition-all duration-200 ease-in-out" 
          />
        </button>
      )}
    </div>
  );
};
