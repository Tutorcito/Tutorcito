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
    <div className="flex justify-center items-start min-h-screen 
                    p-2 sm:p-4 md:p-6 lg:p-8 xl:p-12
                    bg-gray-50 sm:bg-gray-100/50">
      <div className="w-full 
                     max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl
                     shadow-md sm:shadow-lg md:shadow-xl lg:shadow-2xl
                     overflow-hidden 
                     bg-white 
                     rounded-lg sm:rounded-xl md:rounded-2xl
                     transition-all duration-300 ease-in-out
                     hover:shadow-xl sm:hover:shadow-2xl md:hover:shadow-3xl
                     my-4 sm:my-6 md:my-8 lg:my-12">
        
        {/* Banner Section */}
        <ProfileBanner bannerUrl="" avatarUrl="" />
        
        {/* Header Section */}
        <div className="px-4 sm:px-6 md:px-8 lg:px-10">
          <ProfileHeader 
            name={userData.name} 
            title={userData.title} 
            year={userData.year} 
          />
        </div>
        
        {/* Content Section */}
        <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6
                       p-4 sm:p-6 md:p-8 lg:p-10
                       bg-white 
                       mb-4 sm:mb-6 md:mb-8">
          
          <AboutMe content={userData.aboutMeContent} />
          
          <PricingSection prices={userData.prices} />
          
          <KnowledgeSection items={userData.knowledge} />
        </div>
        
        {/* Actions Section */}
        <ProfileActions />
      </div>
    </div>
  );
};

export default ProfileCardContainer;
