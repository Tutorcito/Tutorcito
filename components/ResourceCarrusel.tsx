import React from "react";
import ResourcesCard from "./resourcesCard";
import ExcalidrawLogo from "../public/Excalidraw.png";
import NotebookLMLogo from "../public/NotebookLM.png";

const ResourceCarrusel = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full py-10">
      <h3 className="text-2xl font-medium mx-1 text-center">
        Recursos útiles para estudiantes
      </h3>

      <div className="w-full px-4 mt-8">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide p-4 bg-[#E6F1F8] rounded-lg">
          <ResourcesCard
            icon={ExcalidrawLogo.src}
            description1="Mapas mentales"
            description2="Diagrama de flujo"
            description3="Anotaciones"
            sitelink="https://excalidraw.com/"
          />

          <ResourcesCard
            icon={NotebookLMLogo.src}
            description1="Resúmenes con IA"
            description2="Materias teóricas"
            description3="Chatbot Personalizado"
            sitelink="https://notebooklm.google.com/"
          />

          <ResourcesCard
            icon="/Geogebra.png"
            description1="Gráficos"
            description2="Análisis matemático"
            description3="Animaciones de gráficos"
            sitelink="https://www.geogebra.org/"
          />

          <ResourcesCard
            icon="/Anki.png"
            description1="Flashcards"
            description2="Repaso de examen"
            description3="Memorización de conceptos"
            sitelink="https://apps.ankiweb.net/"
          />
        </div>
      </div>
    </div>
  );
};

export default ResourceCarrusel;