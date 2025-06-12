import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface TutorCardProps {
  id?: string; // Add id prop
  name: string;
  profileImage: string;
  subjects: string;
  rating?: number;
  onClick?: (tutorId: string) => void; // Optional custom click handler
}

const TutorCard = ({ 
  id,
  name, 
  profileImage, 
  subjects, 
  rating = 5,
  onClick 
}: TutorCardProps) => {
  const router = useRouter();

  const handleCardClick = () => {
    if (!id) return;
    
    if (onClick) {
      onClick(id);
    } else {
      // Default behavior: navigate to tutor profile
      router.push(`/tutors/${id}`);
    }
  };

  return (
    <Card 
      className={`relative overflow-hidden bg-white shadow-sm border border-gray-200 max-w-sm transition-all duration-300 hover:shadow-lg   ${id ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
    >
      {/* Background decorativo */}
      <div className="absolute top-0 left-0 right-0 h-22 bg-gradient-to-br from-blue-100 to-blue-300 opacity-60"></div>
      
      <CardHeader className="relative pt-6 pb-4">
        {/* Imagen de perfil */}
        <div className="flex justify-start mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white shadow-md">
            <Image 
              src={profileImage} 
              alt={`${name} profile`} 
              width={64} 
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Nombre */}
        <CardTitle className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
          {name}
        </CardTitle>
        
        {/* Materias */}
        <p className="text-gray-600 text-sm mb-4">
          {subjects}
        </p>
        
        {/* Estrellas de calificación */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 ${
                star <= rating 
                  ? "fill-yellow-500 text-yellow-500" 
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
        </div>
      </CardHeader>
      
      {/* Add click indicator */}
      {id && (
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="text-blue-600 text-xs font-medium">
            Ver perfil →
          </div>
        </div>
      )}
    </Card>
  );
};

export default TutorCard;