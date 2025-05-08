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
    <ProfileSection title="Mis conocimientos" onEdit={onEdit}>
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
    </ProfileSection>
  )
}

export default KnowledgeSection