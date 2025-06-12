// app/components/classCard.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ClassCardProps {
  subject: string; // nombre de clase o asignatura
  students: number; // cantidad de estudiantes de la asignatura
  tutors: number; // cantidad de tutores en la asignatura
  classImage: string; // imagen de la asignatura
  onClick?: (subject: string) => void; // Función opcional para manejar clicks
}

function ClassCard({ subject, students, tutors, classImage, onClick }: ClassCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (onClick) {
      onClick(subject);
    } else {
      const encodedSubject = encodeURIComponent(subject);
      router.push(`/materias/${encodedSubject}`);
    }
  };

  return (
    <Card 
      className="relative overflow-hidden bg-white shadow-sm border border-gray-200 max-w-md h-64 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-blue-300"
      onClick={handleCardClick}
    >
      <div className="absolute inset-0">
        <Image
          src={classImage}
          alt={`${subject} background`}
          fill
          className="object-cover opacity-75 transition-opacity duration-300 hover:opacity-60"
        />
        <div className="absolute inset-0 bg-black/45 transition-all duration-300 hover:bg-black/35"></div>
      </div>

      <div className="relative h-full flex flex-col justify-between p-6">
        <CardHeader className="p-0">
          <CardTitle className="text-2xl font-bold text-white mb-2 transition-all duration-300 hover:text-blue-200">
            {subject}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 mt-auto">
          <div className="flex items-center gap-1 text-white font-medium">
            <span>{new Intl.NumberFormat("es-AR").format(students)} estudiantes</span>
            <span className="mx-1">|</span>
            <span>{new Intl.NumberFormat("es-AR").format(tutors)} tutores</span>
          </div>
          <div className="mt-2 text-blue-200 text-sm font-medium opacity-75 hover:opacity-100 transition-opacity duration-300">
            Ver tutores disponibles →
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export default ClassCard;