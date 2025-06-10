import React from 'react';
import ResourcesCard from './resourcesCard';
import ExcalidrawLogo from '../public/Excalidraw.png';
import NotebookLMLogo from '../public/NotebookLM.png';
import GeogebraLogo from '../public/Geogebra.png';
import AnkiLogo from '../public/Anki.png';

const ResourceCarrusel = () => {
    return (
        <div className='flex flex-col items-center justify-center w-full py-10'>
            <h3 className='flex text-2xl font-medium mx-1 mb-8'>Recursos útiles para estudiantes</h3>
            
            {/* Grid responsive que se adapta a diferentes tamaños de pantalla */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl px-4">
                <ResourcesCard
                    icon={NotebookLMLogo.src}
                    description1="Resúmenes con IA"
                    description2="Materias teóricas"
                    description3="Chatbot personalizado"
                    sitelink='https://notebooklm.google.com/'
                />

                <ResourcesCard
                    icon={ExcalidrawLogo.src}
                    description1="Mapas mentales"
                    description2="Diagramas de flujo"
                    description3="Anotaciones"
                    sitelink='https://excalidraw.com/'
                />
                
                <ResourcesCard
                    icon={GeogebraLogo.src}
                    description1="Gráficos"
                    description2="Análisis matemático"
                    description3="Animaciones de gráficos"
                    sitelink='https://www.geogebra.org/'
                />
                
                <ResourcesCard
                    icon={AnkiLogo.src}
                    description1="Flashcards"
                    description2="Repaso de examen"
                    description3="Memorización de conceptos"
                    sitelink='https://apps.ankiweb.net/'
                />
            </div>
        </div>
    );
};

export default ResourceCarrusel;