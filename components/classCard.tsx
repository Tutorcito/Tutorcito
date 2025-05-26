import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";

interface ClassCardProps {
  subject: string; // nombre de clase o asignatura
  students: number; // cantidad de estudiantes de la asignatura
  tutors: number; // cantidad de tutores en la asignatura
  classImage: string; // imagen de la asignatura
}

function ClassCard({ subject, students, tutors, classImage }: ClassCardProps) {
  return (
    <Card className="relative overflow-hidden bg-white shadow-sm border border-gray-200 max-w-md h-64">
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <Image 
          src={classImage} 
          alt={`${subject} background`}
          fill
          className="object-cover"
        />
        {/* Overlay translúcido para mejorar legibilidad */}
        <div className="absolute inset-0 bg-black/45"></div>
      </div>
      
      {/* Contenido superpuesto */}
      <div className="relative h-full flex flex-col justify-between p-6">
        {/* Título en la parte superior */}
        <CardHeader className="p-0">
          <CardTitle className="text-2xl font-bold text-white mb-2">
            {subject}
          </CardTitle>
        </CardHeader>
        
        {/* Estadísticas en la parte inferior */}
        <CardContent className="p-0 mt-auto">
          <div className="flex items-center gap-1 text-white font-medium">
            <span>{students.toLocaleString()} estudiantes</span>
            <span className="mx-1">|</span>
            <span>{tutors.toLocaleString()} tutores</span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export default ClassCard;