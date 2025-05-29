import React from "react";
import { Card, CardContent, CardHeader} from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

interface resourcesCardProps {
  icon: any;  // al admitir tanto una imagen, como un string, podemos cargar un source o una ruta.
  description1: string;
  description2: string;
  description3: string;
  sitelink: string;
}

function ResourcesCard({ icon, description1, description2, description3,sitelink }: resourcesCardProps) {
  const imageSrc = typeof icon === 'object' && icon.src ? icon.src : icon; // aca es donde comparamos si es un source o una ruta.
  return (
    <Card className="w-80 rounded-lg bg-white p-4 shadow-md ">
      <CardHeader className="p-0 pb-4">
      <div className="flex items-center justify-center w-full h-10 mb-1">
          {/* Mostrar la imagen con configuración más flexible */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={imageSrc} 
              alt="Resource Logo" 
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
      {/* //seria la parte del figma que esta en puntos. */}
      <ul className="mb-12 space-y-2">
        <li className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-gray-700">{description1}</span>
        </li>
        <li className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-gray-700">{description2}</span>
        </li>
        <li className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-gray-700">{description3}</span>
        </li>
      </ul>

      <Button variant={"default"}  className="w-full bg-blue-500 text-white py-2 px-4 rounded font-medium hover:bg-blue-600 transition-colors">
        <Link target="_blank" href={sitelink}>ir al sitio</Link>
      </Button>

      </CardContent>
    </Card>
  );
}

export default ResourcesCard;
