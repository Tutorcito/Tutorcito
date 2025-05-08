"use client";

import React from 'react';
import TutorBanner from './tutorBanner';
import AboutMe from './aboutMe';
import KnowledgeTutorCard from './knowledgeTutorCard';
import PriceCard from './tutorPriceCard';
import CommentsSection from './CommentsSection';

type TutorProfileContainerProps = {
  tutorData: {
    name: string;
    specialty: string;
    bannerUrl?: string;
    avatarUrl?: string;
    aboutMe: string;
    knowledge: Array<{
      icon: string;
      label: string;
    }>;
    prices: Array<{
      price: string;
      duration: string;
    }>;
    comments: Array<{
      name: string;
      date: string;
      rating: number;
      text: string;
    }>;
  };
  // Opcional: callbacks para funciones de edición
  onEditAbout?: () => void;
  onEditKnowledge?: () => void;
  onEditPrices?: () => void;
};

const TutorProfileContainer: React.FC<TutorProfileContainerProps> = ({
  tutorData,
  onEditAbout,
  onEditKnowledge,
  onEditPrices
}) => {
  return (
    <div className="max-w-3xl mx-auto bg-gray-100 rounded-lg overflow-hidden shadow-lg">
      {/* Banner y Avatar */}
      <TutorBanner 
        bannerUrl={tutorData.bannerUrl} 
        avatarUrl={tutorData.avatarUrl} 
      />
      
      {/* Espacio para acomodar el avatar que se desborda del banner */}
      <div className="h-12"></div>
      
      {/* Nombre del tutor y detalles generales */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mt-2">{tutorData.name}</h1>
        <p className="text-gray-600">{tutorData.specialty}</p>
      </div>
      
      {/* Secciones del perfil */}
      <div className="space-y-6 px-4 pb-10 shadow-md">
        {/* Sobre Mí */}
        <AboutMe 
          content={tutorData.aboutMe} 
          onEdit={onEditAbout}
        />
        
        {/* Conocimientos */}
        <KnowledgeTutorCard 
          items={tutorData.knowledge} 
          onEdit={onEditKnowledge}
        />
        
        {/* Precios */}
        <PriceCard 
          prices={tutorData.prices} 
          onEdit={onEditPrices}
        />
        
        {/* Comentarios */}
        <CommentsSection comments={tutorData.comments} />
      </div>
    </div>
  );
};

export default TutorProfileContainer;