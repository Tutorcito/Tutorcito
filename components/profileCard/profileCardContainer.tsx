"use client";

import React from 'react';
import ProfileBanner from "./profileBanner";
import ProfileHeader from "./profileHeader";
import AboutMe from "./aboutMe";
import PricingSection from "./pricingSection";
import KnowledgeSection from "./knowledgeSection";
import ProfileActions from "./profileActions";

const ProfileCardContainer: React.FC = () => {
  const userData = {
    name: "nombre de usuario",
    title: "Carrera del usuario",
    year: "año del estudiante",
    aboutMeContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. fugiat nulla pariatur. deserunt mollit anim id est laborum.",
    prices: [
      { price: "ARS 3.500", duration: "30 min" },
      { price: "ARS 5.000", duration: "60 min" },
      { price: "ARS 7.500", duration: "100 min" }
    ],
    knowledge: [
      { icon: "📘", label: "Analítico secundario" },
      { icon: "📔", label: "Materias aprobadas" },
      { icon: "📓", label: "Alumno regular" }
    ]
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md shadow-lg overflow-hidden bg-white rounded-lg">
        <ProfileBanner bannerUrl="" avatarUrl="" />
        <ProfileHeader 
          name={userData.name} 
          title={userData.title} 
          year={userData.year} 
        />
        <div className="space-y-4 p-6 bg-amber-900">
          <AboutMe content={userData.aboutMeContent} />
          
          <PricingSection 
            prices={userData.prices} 
            
          />
          <KnowledgeSection 
            items={userData.knowledge} 
            
          />
        </div>
        <ProfileActions/>
      </div>
    </div>
  );
};

export default ProfileCardContainer;
