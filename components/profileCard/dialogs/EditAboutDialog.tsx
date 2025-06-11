"use client";

import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/useToast";

interface EditAboutDialogProps {
	isOpen: boolean;
	onClose: () => void;
	currentAbout: string;
	userId: string;
	onUpdate: (newAbout: string) => void;
}

const EditAboutDialog: React.FC<EditAboutDialogProps> = ({
	isOpen,
	onClose,
	currentAbout,
	userId,
	onUpdate,
}) => {
	const [aboutText, setAboutText] = useState(currentAbout);
	const [isLoading, setIsLoading] = useState(false);
	const { success, error } = useToast();

	const handleSave = async () => {
		setIsLoading(true);

		try {
			const { error: updateError } = await supabase
				.from("profiles")
				.update({ about_me: aboutText })
				.eq("id", userId);

			if (updateError) {
				throw updateError;
			}

			onUpdate(aboutText);
			success("Información actualizada correctamente");
			onClose();
		} catch (err) {
			console.error("Error updating about:", err);
			error("Error al actualizar la información");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		setAboutText(currentAbout); // Reset to original
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px] bg-white">
				<DialogHeader>
					<DialogTitle>Editar "Sobre mí"</DialogTitle>
					<DialogDescription>
						Contanos un poco sobre vos, tus estudios y tu experiencia.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<Textarea
						placeholder="Escribe sobre tu experiencia, estudios, materias que dominas..."
						value={aboutText}
						onChange={(e) => setAboutText(e.target.value)}
						className="min-h-[120px] resize-none"
						maxLength={500}
					/>
					<p className="text-sm text-gray-500 text-right">
						{aboutText.length}/500 caracteres
					</p>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={handleCancel} disabled={isLoading}>
						Cancelar
					</Button>
					<Button onClick={handleSave} disabled={isLoading}>
						{isLoading ? "Guardando..." : "Guardar"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default EditAboutDialog;
