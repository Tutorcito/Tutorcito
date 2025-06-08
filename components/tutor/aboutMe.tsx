"use client";

import React from 'react';
import { TutorSection } from './tutorSection';

type AboutMeProps = {
  content: string;
  onEdit?: () => void;
};

const AboutMe: React.FC<AboutMeProps> = ({ content, onEdit }) => {
  return (
    <TutorSection 
      title="Sobre mí" 
      containerClassName="bg-gray-800 text-white p-4 sm:p-6 rounded-lg shadow-md" 
      titleClassName="font-medium mb-4 text-lg sm:text-xl"
      onEdit={onEdit}
    >
      <p className="text-sm sm:text-base leading-relaxed">{content}</p>
    </TutorSection>
  );
};

export default AboutMe;