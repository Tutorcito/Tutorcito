"use client";

import React from 'react';
import { ProfileSection } from "./profileSection";

type AboutMeProps = {
  content: string;
};

const AboutMe: React.FC<AboutMeProps> = ({ content }) => {
  return (
    <ProfileSection 
      title="Sobre mí" 
      containerClassName="bg-black" 
      titleClassName="text-white text-base sm:text-lg font-medium"
    >
      <p className="text-xs sm:text-sm md:text-base text-white leading-relaxed sm:leading-loose max-w-none break-words">
        {content}
      </p>
    </ProfileSection>
  );
};

export default AboutMe;
