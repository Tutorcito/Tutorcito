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
      containerClassName="bg-gray-800 text-white" 
      titleClassName="font-medium mb-2"
      onEdit={onEdit}
    >
      <p className="text-sm">{content}</p>
    </TutorSection>
  );
};

export default AboutMe;