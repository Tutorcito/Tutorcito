"use client";

import React from 'react';
import { ProfileSection } from "./profileSection";

type AboutMeProps = {
  content: string;
};

const AboutMe: React.FC<AboutMeProps> = ({ content }) => {
  return (
    <ProfileSection title="Sobre mí" containerClassName="bg-black" titleClassName="text-white">
      <p className="text-sm text-white">{content}</p>
    </ProfileSection>
  );
};

export default AboutMe;
