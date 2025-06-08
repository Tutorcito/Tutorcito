import React from 'react'
import { ProfileSection } from "./profileSection";

type KnowledgeItem = {
    icon: string;
    label: string;
  };
  
  type KnowledgeSectionProps = {
    items: KnowledgeItem[];
    onEdit?: () => void;
  };

const KnowledgeSection: React.FC<KnowledgeSectionProps> = ({ items, onEdit }) => {
  return (
    <ProfileSection 
      title="Mis conocimientos" 
      onEdit={onEdit}
      titleClassName="text-sm sm:text-base md:text-lg font-medium mb-2 sm:mb-3"
    >
      <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 lg:gap-2.5">
        {items.map((item, index) => (
          <div 
            key={index}
            className="flex items-center bg-white border border-gray-300 rounded-md 
                       px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2
                       text-xs sm:text-sm md:text-base
                       transition-all duration-200 ease-in-out
                       hover:shadow-sm hover:border-gray-400
                       min-h-[2rem] sm:min-h-[2.25rem] md:min-h-[2.5rem]
                       max-w-full break-words"
          >
            <span className="mr-1.5 sm:mr-2 md:mr-2.5 text-sm sm:text-base md:text-lg flex-shrink-0">
              {item.icon}
            </span>
            <span className="leading-tight sm:leading-normal truncate sm:whitespace-normal">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </ProfileSection>
  )
}

export default KnowledgeSection