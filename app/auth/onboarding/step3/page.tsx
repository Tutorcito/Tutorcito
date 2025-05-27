"use client";
import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { File } from "lucide-react";
import { Button } from "@/components/ui/button";
const Step3 = () => {
	const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
	const [selectedSubjectId, setSelectedSubjectId] = useState<string[]>([]);
	const [files, setFiles] = useState<any>(null);
	const [tutorId, setTutorId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [userProfile, setUserProfile] = useState<any>(null);
	const router = useRouter();

	// Fetch subjects from supabase.
	const fetchSubjects = async () => {
		const { data, error } = await supabase.from("subjects").select("id, name");
		if (error) {
			console.error("Error fetching subjects:", error);
		} else {
			setSubjects(data);
		}
	};

	// Fetch user from supabase.
	const fetchUser = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			router.push("/auth/login");
			return;
		}

		setTutorId(user.id);

		const { data: userProfile, error: profileError } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", user.id)
			.single();

		if (userProfile) {
			setUserProfile(userProfile);
		}

		if (profileError) {
			console.error("Error fetching user profile:", profileError);
		}

		if (userProfile.role !== "tutor" && userProfile.role !== "ambos") {
			router.push("/");
			return;
		}

		if (
			!userProfile.full_name ||
			!userProfile.degree ||
			!userProfile.year_in_degree
		) {
			router.push("/auth/onboarding/step2");
			return;
		}
	};

	// Fetch subjects and user on component mount.
	useEffect(() => {
		fetchSubjects();
		fetchUser();
	}, []);

	const handleFileUpload = (e: any) => {
		setFiles(Array.from(e.target.files));
	};

	const toggleSubject = (id: any) => {
		setSelectedSubjectId((prev) =>
			prev.includes(id) ? prev.filter((sid) => sid !== sid) : [...prev, id]
		);
	};

	const handleSubmit = async () => {
		if (!selectedSubjectId.length || !files.length || !tutorId)
			return alert(
				"Selecciona al menos una materia, subí al menos un archivo y asegurate de estar logueado."
			);

		setIsLoading(true);

		// Generate unique file path.
		for (const file of files) {
			const cleanFileName = file.name
			.normalize('NFD')
			.replace(/[^\\w.\\-]/g, '')
			
			const filePath = `${tutorId}/${uuidv4()}-${cleanFileName}`;
			const { error: uploadError } = await supabase.storage
				.from("tutor-validation-files")
				.upload(filePath, file);

			if (uploadError) {
				setIsLoading(false);
				console.error("Error uploading file:", uploadError);
				alert("Error al subir el archivo. Por favor, inténtelo de nuevo.");
				return;
			}
		}

		const inserts = selectedSubjectId.map((subject_id) => {
			const subject = subjects.find(s => s.id === subject_id);
			return {
				id: uuidv4(),
				tutor_id: tutorId,
				subject_id,
				subject_name: subject?.name || null
			}
		});

		// Insert tutor data into supabase table 'tutor_subjects'.
		const { error: insertError } = await supabase
			.from("tutor_subjects")
			.insert(inserts);

		if (insertError) {
			setIsLoading(false);
			alert("Error al guardar datos. Por favor, inténtelo de nuevo.");
			return;
		}

		setIsLoading(false);
		router.push("/auth/onboarding/step4")
	};

	return (
		<div className="flex flex-col items-center">
			{/* Progress bar */}
			<div className="w-full flex justify-between mb-8 gap-1">
				<div className="h-1 bg-blue-500 w-1/4 rounded-full"></div>
				<div className="h-1 bg-blue-500 w-1/4 rounded-full"></div>
				<div className="h-1 bg-blue-500 w-1/4 rounded-full"></div>
				<div className="h-1 bg-blue-200 w-1/4 rounded-full"></div>
			</div>
			<div className="text-center mb-4">
				<h1 className="text-3xl font-bold mb-2">Bienvenido a Tutorcito</h1>
			</div>

			<h2 className="text-xl font-semibold text-gray-500 mb-6">
				Valida tus conocimientos
			</h2>

			{/* Subject selection area */}
			<div className="w-full mb-8 border rounded p-2">
				<p className="text-gray-600 mb-2 font-medium">
					Seleccioná materias a enseñar:
				</p>
				<div className="flex= flex-col gap-2 max-h-40 overflow-y-auto">
					{subjects.map((subject) => (
						<label key={subject.id} className="flex items-center gap-2">
							<input
								type="checkbox"
								checked={selectedSubjectId.includes(subject.id)}
								onChange={() => toggleSubject(subject.id)}
							/>
							<span>{subject.name}</span>
						</label>
					))}
				</div>
			</div>

			{/* File drop area */}
			<div className="w-full h-auto min-h-60 border-2 border-dashed border-gray-400 rounded flex flex-col items-center justify-center mb-4 p-4">
				<label className="cursor-pointer text-center text-gray-500 flex flex-col items-center w-full mb-4">
					<input
						type="file"
						className="hidden"
						multiple
						onChange={handleFileUpload}
					/>
					<div className="text-2xl mb-4">
						<File className="w-8 h-8" />
					</div>
					<span className="text-pretty">
						Adjuntá certificados, analíticos u otros documentos que validen tus
						conocimientos.
					</span>
				</label>
				{Array.isArray(files) && files.length > 0 && (
					<ul className="text-sm mt-2 text-gray-700 list-disc pl-4 w-full">
						{files.map((file: any, index: any) => (
							<li key={index}>
								<strong>{file.name}</strong>
							</li>
						))}
					</ul>
				)}
			</div>

			<Button
				className="w-full max-w-xs cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md disabled:opacity-50"
				variant={"default"}
				onClick={handleSubmit}
				disabled={isLoading}
			>
				{isLoading ? "Guardando..." : "Siguiente"}
			</Button>
		</div>
	);
};

export default Step3;
