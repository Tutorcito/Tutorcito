"use client";

import React from 'react';
import TutorProfileContainer from '@/components/tutor/tutorContainer';

export default function TutorPage() {
  // Datos del tutor
  const tutorData = {
    // Datos básicos del perfil
    name: "Joaquín Cortez",
    specialty: "Laboratorio III | Programación II",
    rating: 4.7,
    bannerUrl: "/api/placeholder/800/200", // Placeholder para demostración
    avatarUrl: "/api/placeholder/200/200", // Placeholder para demostración
    
    // Contenido de la sección "Sobre mí"
    aboutMe: "Soy estudiante de Informática de 2do año. Me dedico a crear agentes de IA con Python y OpenAI. Puedo ayudarte con tu lógica de programación en lenguajes como Python, JavaScript y Node.",
    
    // Conocimientos del tutor
    knowledge: [
      { icon: "📊", label: "Análisis secundario" },
      { icon: "📝", label: "Materias aprobadas" },
      { icon: "👨‍🎓", label: "Alumno regular" }
    ],
    
    // Precios de las clases
    prices: [
      { price: "ARS 3.500", duration: "30 min" },
      { price: "ARS 5.000", duration: "60 min" },
      { price: "ARS 7.500", duration: "90 min" }
    ],
    
    // Comentarios de estudiantes
    comments: [
      {
        name: 'Fede Martorell',
        date: '10/04/25',
        rating: 5,
        text: 'Forem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.'
      },
      {
        name: 'Joaco González',
        date: '10/04/25',
        rating: 5,
        text: 'Forem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.'
      },
      {
        name: 'Fede Martorell',
        date: '10/04/25',
        rating: 5,
        text: 'Forem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.'
      },
      {
        name: 'Joaco González',
        date: '10/04/25',
        rating: 5,
        text: 'Forem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.'
      }
    ]
  };

  // Funciones para manejar la edición
  const handleEditAbout = () => {
    console.log('Editando sobre mí');
    // Implementar lógica de edición
  };

  const handleEditKnowledge = () => {
    console.log('Editando conocimientos');
    // Implementar lógica de edición
  };

  const handleEditPrices = () => {
    console.log('Editando precios');
    // Implementar lógica de edición
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <TutorProfileContainer  
        tutorData={tutorData}
        onEditAbout={handleEditAbout}
        onEditKnowledge={handleEditKnowledge}
        onEditPrices={handleEditPrices}
      />
    </div>
  );
}