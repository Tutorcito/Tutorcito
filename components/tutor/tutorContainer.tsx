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
    rating?: number;
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Banner y Avatar */}
      <div className="bg-white shadow-sm mb-6">
        <TutorBanner 
          bannerUrl={tutorData.bannerUrl} 
          avatarUrl={tutorData.avatarUrl} 
        />
        
        {/* Espacio para acomodar el avatar que se desborda del banner */}
        <div className="h-14"></div>
        
        {/* Nombre del tutor y detalles generales */}
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold">{tutorData.name}</h1>
          <p className="text-gray-600 text-sm sm:text-base">{tutorData.specialty}</p>
          {tutorData.rating && (
            <div className="flex items-center justify-center mt-2">
              <span className="font-bold mr-1">{tutorData.rating}</span>
              <span className="text-yellow-400">★</span>
            </div>
          )}
          <button className="bg-blue-500 text-white px-6 py-2 rounded-md mt-3 hover:bg-blue-800 mb-10">
            Agendar tutoría
          </button>
        </div>
      </div>
      
      {/* Contenido principal en dos columnas */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Columna izquierda para comentarios */}
        <div className="w-full md:w-1/2">
          <CommentsSection comments={tutorData.comments} />
        </div>
        
        {/* Columna derecha para información del tutor */}
        <div className="w-full md:w-1/2 space-y-4">
          {/* Sobre Mí */}
          <AboutMe 
            content={tutorData.aboutMe} 
            onEdit={onEditAbout}
          />
          
          {/* Precios */}
          <PriceCard 
            prices={tutorData.prices} 
            onEdit={onEditPrices}
          />
          
          {/* Conocimientos */}
          <KnowledgeTutorCard 
            items={tutorData.knowledge} 
            onEdit={onEditKnowledge}
          />
        </div>
      </div>
    </div>
  );
};

export default TutorProfileContainer;