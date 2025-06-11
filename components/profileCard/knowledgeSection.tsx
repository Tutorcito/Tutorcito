import React from "react";

type KnowledgeItem = {
  icon: string;
  label: string;
};

type KnowledgeSectionProps = {
  knowledge: KnowledgeItem[];
};

const KnowledgeSection: React.FC<KnowledgeSectionProps> = ({ knowledge }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-4 mt-4">
      <h2 className="text-lg font-semibold mb-2">Mis conocimientos</h2>
      <div className="flex flex-wrap gap-2">
        {knowledge.map((item, idx) => (
          <span
            key={idx}
            className="bg-white border rounded-full px-3 py-1 text-sm flex items-center gap-1"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeSection;
