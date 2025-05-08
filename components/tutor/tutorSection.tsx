"use client";

import React, { ReactNode } from "react";
import { Pencil } from "lucide-react";

type TutorSectionProps = {
  title: string;
  children: ReactNode;
  onEdit?: () => void;
  containerClassName?: string;
  titleClassName?: string;
};

export const TutorSection: React.FC<TutorSectionProps> = ({ 
  title, 
  children, 
  onEdit,
  containerClassName = "bg-gray-200 shadow-md",
  titleClassName = "font-semibold mb-2"
}) => {
  return (
    <div className={`${containerClassName} p-4 rounded-md relative`}>
      <h3 className={`${titleClassName}`}>{title}</h3>
      {children}
      {onEdit && (
        <button 
          className="absolute top-3 right-3 p-1" 
          onClick={onEdit}
        >
          <Pencil size={16} />
        </button>
      )}
    </div>
  );
};
