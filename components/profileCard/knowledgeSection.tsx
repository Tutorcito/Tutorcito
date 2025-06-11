import React from "react";
import { ProfileSection } from "./profileSection";
import { FileText, ExternalLink } from "lucide-react";

export type TutorFile = {
	id: string;
	tutor_id: string;
	file_url: string;
	description: string | null;
};

type KnowledgeSectionProps = {
	files: TutorFile[];
	onEdit?: () => void;
};

const KnowledgeSection: React.FC<KnowledgeSectionProps> = ({
	files,
	onEdit,
}) => {
	const handleFileView = (fileUrl: string, fileName: string) => {
		// Open file in new tab
		window.open(fileUrl, "_blank");
	};

	return (
		<ProfileSection
			title="Mis documentos y certificaciones"
			onEdit={onEdit}
			titleClassName="text-sm sm:text-base md:text-lg font-medium mb-2 sm:mb-3"
		>
			{files.length > 0 ? (
				<div className="grid gap-3">
					{files.map((file) => (
						<div
							key={file.id}
							className="flex items-center justify-between bg-white border border-gray-300 rounded-lg 
                         p-3 transition-all duration-200 ease-in-out
                         hover:shadow-sm hover:border-gray-400 hover:bg-gray-50
                         group cursor-pointer"
							onClick={() =>
								handleFileView(file.file_url, file.description || "Documento")
							}
						>
							<div className="flex items-center gap-3 flex-1 min-w-0">
								<div className="flex-shrink-0">
									<FileText className="h-5 w-5 text-blue-600" />
								</div>

								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-900 truncate">
										{file.description || "Documento sin descripción"}
									</p>
									<p className="text-xs text-gray-500 truncate">
										{file.file_url
											.split("/")
											.pop()
											?.split("-")
											.slice(1)
											.join("-") || "archivo"}
									</p>
								</div>
							</div>

							<div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
								<ExternalLink className="h-4 w-4 text-gray-400" />
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-6 text-gray-500">
					<FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
					<p className="text-sm font-medium">No hay documentos cargados</p>
					<p className="text-xs mt-1">
						Haz clic en el ícono de edición para subir certificados y
						validaciones
					</p>
				</div>
			)}

			{files.length > 0 && (
				<div className="mt-3 pt-3 border-t border-gray-200">
					<p className="text-xs text-gray-500 text-center">
						{files.length} documento{files.length !== 1 ? "s" : ""} cargado
						{files.length !== 1 ? "s" : ""}
					</p>
				</div>
			)}
		</ProfileSection>
	);
};

export default KnowledgeSection;
