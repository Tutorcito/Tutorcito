"use client";

import React, { useState, useRef, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, FileText, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/useToast";
import { v4 as uuidv4 } from "uuid";

export type TutorFile = {
	id: string;
	tutor_id: string;
	file_url: string;
	description: string | null;
};

interface EditKnowledgeDialogProps {
	isOpen: boolean;
	onClose: () => void;
	currentFiles: TutorFile[];
	userId: string;
	onUpdate: (newFiles: TutorFile[]) => void;
}

const EditKnowledgeDialog: React.FC<EditKnowledgeDialogProps> = ({
	isOpen,
	onClose,
	currentFiles,
	userId,
	onUpdate,
}) => {
	const [files, setFiles] = useState<TutorFile[]>(currentFiles);
	const [isLoading, setIsLoading] = useState(false);
	const [uploadingFile, setUploadingFile] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { success, error } = useToast();

	// Sync local state with currentFiles when they change
	useEffect(() => {
		setFiles(currentFiles);
	}, [currentFiles]);

	const handleFileUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const selectedFile = event.target.files?.[0];
		if (!selectedFile) return;

		// Validate file type and size
		const allowedTypes = [
			"application/pdf",
			"image/jpeg",
			"image/png",
			"image/jpg",
		];
		if (!allowedTypes.includes(selectedFile.type)) {
			error("Solo se permiten archivos PDF, JPG y PNG");
			return;
		}

		if (selectedFile.size > 5 * 1024 * 1024) {
			// 5MB limit
			error("El archivo no puede ser mayor a 5MB");
			return;
		}

		const fileId = uuidv4();
		setUploadingFile(fileId);

		try {
			// Clean filename
			const cleanFileName = selectedFile.name
				.normalize("NFD")
				.replace(/[^\\w.\\-]/g, "");

			const filePath = `${userId}/${uuidv4()}-${cleanFileName}`;

			// Upload to Supabase Storage
			const { error: uploadError } = await supabase.storage
				.from("tutor-validation-files")
				.upload(filePath, selectedFile);

			if (uploadError) {
				throw uploadError;
			}

			// Get public URL
			const { data } = supabase.storage
				.from("tutor-validation-files")
				.getPublicUrl(filePath);

			// Create new file object
			const newFile: TutorFile = {
				id: fileId,
				tutor_id: userId,
				file_url: data.publicUrl,
				description: selectedFile.name.replace(/\.[^/.]+$/, ""), // Remove extension for default description
			};

			// Save to database immediately
			const { error: insertError } = await supabase
				.from("tutor_files")
				.insert([newFile]);

			if (insertError) {
				// If database insert fails, clean up the uploaded file
				await supabase.storage
					.from("tutor-validation-files")
					.remove([filePath]);
				throw insertError;
			}

			// Update local state and parent component
			const updatedFiles = [...files, newFile];
			setFiles(updatedFiles);
			onUpdate(updatedFiles);

			success("Archivo subido y guardado correctamente");
		} catch (err) {
			console.error("Error uploading file:", err);
			error("Error al subir el archivo");
		} finally {
			setUploadingFile(null);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	const removeFile = async (fileId: string, fileUrl: string) => {
		try {
			// Delete from database first
			const { error: deleteError } = await supabase
				.from("tutor_files")
				.delete()
				.eq("id", fileId);

			if (deleteError) {
				throw deleteError;
			}

			// Delete from storage
			const urlParts = fileUrl.split("/");
			const fileName = urlParts[urlParts.length - 1];
			const filePath = `${userId}/${fileName}`;

			await supabase.storage.from("tutor-validation-files").remove([filePath]);

			// Update local state and parent component
			const updatedFiles = files.filter((file) => file.id !== fileId);
			setFiles(updatedFiles);
			onUpdate(updatedFiles);

			success("Archivo eliminado correctamente");
		} catch (err) {
			console.error("Error removing file:", err);
			error("Error al eliminar el archivo");
		}
	};

	const updateFileDescription = (fileId: string, description: string) => {
		setFiles((prev) =>
			prev.map((file) => (file.id === fileId ? { ...file, description } : file))
		);
	};

	const handleSave = async () => {
		setIsLoading(true);

		try {
			// Only update descriptions for existing files
			for (const file of files) {
				const originalFile = currentFiles.find((f) => f.id === file.id);
				if (originalFile && originalFile.description !== file.description) {
					const { error: updateError } = await supabase
						.from("tutor_files")
						.update({ description: file.description })
						.eq("id", file.id);

					if (updateError) {
						throw updateError;
					}
				}
			}

			// Update parent component with final state
			onUpdate(files);
			success("Descripciones actualizadas correctamente");
			onClose();
		} catch (err) {
			console.error("Error updating descriptions:", err);
			error("Error al actualizar las descripciones");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		// Reset descriptions to original values
		setFiles(currentFiles);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[600px] bg-white max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Editar Documentos de Validación</DialogTitle>
					<DialogDescription>
						Los archivos se guardan automáticamente al subirlos. Solo necesitas
						guardar los cambios en las descripciones.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					{/* Upload Section */}
					<div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
						<input
							ref={fileInputRef}
							type="file"
							accept=".pdf,.jpg,.jpeg,.png"
							onChange={handleFileUpload}
							className="hidden"
						/>
						<div className="text-center">
							<Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
							<Button
								variant="outline"
								onClick={() => fileInputRef.current?.click()}
								disabled={uploadingFile !== null || files.length >= 10}
							>
								{uploadingFile ? "Subiendo..." : "Subir Documento"}
							</Button>
							<p className="text-sm text-gray-500 mt-2">
								PDF, JPG, PNG (máx. 5MB)
							</p>
							<p className="text-xs text-blue-600 mt-1">
								Los archivos se guardan automáticamente
							</p>
						</div>
					</div>

					{/* Files List */}
					{files.map((file, index) => (
						<div
							key={file.id}
							className="flex gap-3 items-center p-3 border rounded-lg"
						>
							<FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />

							<div className="flex-1 min-w-0">
								<Input
									placeholder="Descripción del documento..."
									value={file.description || ""}
									onChange={(e) =>
										updateFileDescription(file.id, e.target.value)
									}
									maxLength={100}
									className="mb-1"
								/>
								<p className="text-xs text-gray-500 truncate">
									{file.file_url.split("/").pop()}
								</p>
							</div>

							<div className="flex gap-2 flex-shrink-0">
								<Button
									variant="outline"
									size="sm"
									onClick={() => window.open(file.file_url, "_blank")}
								>
									Ver
								</Button>
								<Button
									variant="outline"
									size="icon"
									onClick={() => removeFile(file.id, file.file_url)}
									className="text-red-600 hover:text-red-700"
									disabled={uploadingFile !== null}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						</div>
					))}

					{files.length === 0 && (
						<div className="text-center py-8 text-gray-500">
							<FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
							<p>No hay documentos cargados</p>
							<p className="text-sm">
								Sube certificados, analíticos u otros documentos
							</p>
						</div>
					)}

					{files.length >= 10 && (
						<p className="text-sm text-amber-600 text-center">
							Máximo 10 documentos permitidos
						</p>
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={handleCancel} disabled={isLoading}>
						Cancelar
					</Button>
					<Button onClick={handleSave} disabled={isLoading}>
						{isLoading ? "Guardando descripciones..." : "Guardar descripciones"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default EditKnowledgeDialog;
