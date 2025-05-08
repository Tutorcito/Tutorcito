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
      containerClassName="bg-white" 
      titleClassName="font-semibold mb-2"
      onEdit={onEdit}
    >
      <p className="text-sm text-gray-700">{content}</p>
    </TutorSection>
  );
};

export default AboutMe;