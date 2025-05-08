"use client";

import React from 'react';
import TutorProfileContainer from '@/components/tutor/tutorContainer';

export default function TutorPage() {
  // Datos del tutor
  const tutorData = {
    // Datos básicos del perfil
    name: "Alvaro Aguero",
    specialty: "Profesor de Matemáticas",
    bannerUrl: "/api/placeholder/800/200", // Placeholder para demostración
    avatarUrl: "/api/placeholder/200/200", // Placeholder para demostración
    
    // Contenido de la sección "Sobre mí"
    aboutMe: "Soy profesor de matemáticas con más de 8 años de experiencia enseñando a estudiantes de secundaria y universidad. Me especializo en álgebra, cálculo y estadística. Mi enfoque de enseñanza es práctico y personalizado, adaptándome a las necesidades de cada estudiante para ayudarles a desarrollar confianza y comprensión de los conceptos matemáticos.",
    
    // Conocimientos del tutor
    knowledge: [
      { icon: "📊", label: "Estadística" },
      { icon: "➗", label: "Álgebra" },
      { icon: "📈", label: "Cálculo" },
      { icon: "🧠", label: "Lógica" },
      { icon: "📝", label: "Preparación para exámenes" }
    ],
    
    // Precios de las clases
    prices: [
      { price: "ARS 3.500", duration: "30 min" },
      { price: "ARS 5.000", duration: "60 min" },
      { price: "ARS 7.500", duration: "100 min" }
    ],
    
    // Comentarios de estudiantes
    comments: [
      {
        name: 'Carlitos Rodríguez',
        date: '10/04/25',
        rating: 5,
        text: 'Excelente tutor, muy claro y paciente. Me ayudó a entender conceptos que me habían costado mucho tiempo.'
      },
      {
        name: 'Federico Martorell',
        date: '01/04/25',
        rating: 4,
        text: 'Me ayudó bastante con los temas difíciles de cálculo. Recomendada.'
      },
      {
        name: 'Lucía Méndez',
        date: '25/03/25',
        rating: 5,
        text: 'Gracias a sus clases pude aprobar mi examen final con una nota excelente.'
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