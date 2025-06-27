import React from "react";
import ResourcesCard from "./resourcesCard";
import ExcalidrawLogo from "../public/Excalidraw.png";
import NotebookLMLogo from "../public/NotebookLM.png";
import GeogebraLogo from "../public/Geogebra.png";
import AnkiLogo from "../public/Anki.png";

const ResourceCarrusel = () => {
	return (
		// Alternative background with gradient and pattern
		<div className="relative py-20 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
			{/* Blue accent background */}
			<div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/20"></div>

			{/* Decorative pattern */}
			<div className="absolute inset-0 opacity-5">
				<div className="absolute top-20 left-20 w-4 h-4 bg-blue-500 rounded-full"></div>
				<div className="absolute top-40 right-32 w-6 h-6 bg-blue-400 rounded-full"></div>
				<div className="absolute bottom-32 left-1/4 w-3 h-3 bg-blue-600 rounded-full"></div>
				<div className="absolute bottom-20 right-20 w-5 h-5 bg-blue-500 rounded-full"></div>
			</div>

			{/* Content */}
			<div className="relative w-full max-w-7xl mx-auto px-4">
				<div className="text-center mb-12">
					<h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						Recursos útiles para estudiantes
					</h3>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Herramientas que te ayudarán a potenciar tu aprendizaje
					</p>
					<div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mt-4 rounded-full"></div>
				</div>

				{/* Grid that matches carousel card width and spacing */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					<ResourcesCard
						icon={NotebookLMLogo.src}
						description1="Resúmenes con IA"
						description2="Materias teóricas"
						description3="Chatbot personalizado"
						sitelink="https://notebooklm.google.com/"
					/>

					<ResourcesCard
						icon={ExcalidrawLogo.src}
						description1="Mapas mentales"
						description2="Diagramas de flujo"
						description3="Anotaciones"
						sitelink="https://excalidraw.com/"
					/>

					<ResourcesCard
						icon={GeogebraLogo.src}
						description1="Gráficos"
						description2="Análisis matemático"
						description3="Animaciones de gráficos"
						sitelink="https://www.geogebra.org/"
					/>

					<ResourcesCard
						icon={AnkiLogo.src}
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
