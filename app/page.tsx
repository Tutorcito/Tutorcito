import ResourcesCard from "@/components/resourcesCard";
import ExcalidrawLogo from "../public/Excalidraw.png";
import NotebookLMLogo from "../public/NotebookLM.png";

export default function Home() {
	return (
		<div className="flex gap-4 min-w-screen">
			<ResourcesCard
				icon={ExcalidrawLogo.src}
				description1="Mapas mentales"
				description2="Diagrama de flujo"
				description3="Anotaciones"
			/>
			<ResourcesCard
				icon={NotebookLMLogo.src}
				description1="Resumenes con IA"
				description2="Materias teoricas"
				description3="Chatbot Personalizado"
			/>
			<ResourcesCard
				icon="/Geogebra.png"
				description1="Graficos"
				description2="Analisis matematico"
				description3="Animaciones de graficos"
			/>
			<ResourcesCard
				icon="/Anki.png"
				description1="Flashcards"
				description2="Repaso de examen"
				description3="Memorizacion de conceptos"
			/>
		</div>
	);
}
