import React from 'react';
import ResourcesCard from './resourcesCard';
import ExcalidrawLogo from '../public/Excalidraw.png';
import NotebookLMLogo from '../public/NotebookLM.png';

const ResourceCarrusel = () => {
    return (
        <div className='flex flex-col items-center justify-center w-full py-10'>
            <h3 className='flex text-2xl font-medium mx-1'>Recursos útiles para estudiantes</h3>
            <div className='flex flex-col p-8 items-center justify-center '>

                {/* Added flex-wrap and adjusted padding for better responsiveness */}
                <div className="flex flex-wrap gap-4 items-center justify-center bg-[#E6F1F8] p-4 sm:p-8 rounded-lg">
                    <ResourcesCard
                        icon={ExcalidrawLogo.src}
                        description1="Mapas mentales"
                        description2="Diagrama de flujo"
                        description3="Anotaciones"
                        sitelink='https://excalidraw.com/'
                    />

                    <ResourcesCard
                        icon={NotebookLMLogo.src}
                        description1="Resumenes con IA"
                        description2="Materias teoricas"
                        description3="Chatbot Personalizado"
                        sitelink='https://notebooklm.google.com/'
                    />
                    <ResourcesCard
                        icon="/Geogebra.png" // Assuming this path is correct
                        description1="Graficos"
                        description2="Analisis matematico"
                        description3="Animaciones de graficos"
                        sitelink='https://www.geogebra.org/'
                    />
                    <ResourcesCard
                        icon="/Anki.png" // Assuming this path is correct
                        description1="Flashcards"
                        description2="Repaso de examen"
                        description3="Memorizacion de conceptos"
                        sitelink='https://apps.ankiweb.net/'
                    />
                </div>

            </div>

        </div>
    );
};

export default ResourceCarrusel;