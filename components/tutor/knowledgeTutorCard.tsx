import React from 'react'
import { TutorSection } from './tutorSection';

type KnowledgeItem = {
  icon: string;
  label: string;
};

type KnowledgeTutorCardProps = {
  items: KnowledgeItem[];
  onEdit?: () => void;
};

const KnowledgeTutorCard: React.FC<KnowledgeTutorCardProps> = ({ items, onEdit }) => {
  return (
    <TutorSection 
      title="Mis conocimientos" 
      onEdit={onEdit} 
      containerClassName="bg-white shadow-sm p-4 sm:p-6 rounded-lg"
      titleClassName="font-medium mb-3 text-lg sm:text-xl"
    >
      <div className="flex flex-wrap gap-4">
        {items.map((item, index) => (
          <div 
            key={index}
            className="flex items-center bg-gray-100 border border-gray-200 rounded-md px-4 py-2 text-sm sm:text-base flex-shrink-0 w-full sm:w-auto"
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
    </TutorSection>
  )
}

export default KnowledgeTutorCard