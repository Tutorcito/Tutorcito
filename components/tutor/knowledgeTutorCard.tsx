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
    <TutorSection title="Mis conocimientos" onEdit={onEdit}>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <div 
            key={index}
            className="flex items-center bg-white border border-gray-300 rounded px-3 py-1 text-sm"
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