"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

export default function Step2() {
	const router = useRouter();
	const [user, setUser] = useState<any>(null);
	const [profile, setProfile] = useState<any>(null);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [degree, setDegree] = useState("");
	const [year, setYear] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [uploading, setUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const getProfile = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		console.log("Authenticated user ID: ", user?.id);
		if (!user) {
			router.push("/auth/login");
			return;
		}

		setUser(user);

		const { data, error } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", user.id)
			.single();

		if (error) {
			console.error("Failed to fetch profile: ", error.message);
		}

		if (data) {
			setProfile(data);
		}

		if (!data.role) {
			router.push("/auth/onboarding/step1");
			return;
		}

		if (data.full_name) {
			const nameParts = data.full_name.split(" ");
			setFirstName(nameParts[0] || "");
			setLastName(nameParts.slice(1).join(" ") || "");
		}
		setDegree(data.degree || "");
		setYear(data.year_in_degree ? data.year_in_degree.toString() : "");
	};

	useEffect(() => {
		getProfile();
	}, [router]);

	const handleNext = async () => {
		if (!user) return;

		setIsLoading(true);

		try {
			const fullName = `${firstName} ${lastName}`.trim();
			const yearMap: Record<string, number> = {
				"1er": 1,
				"2do": 2,
				"3er": 3,
				"4to": 4,
				"5to": 5,
				"6to": 6,
				Otro: 0,
			};

			const yearNumber = yearMap[year];

			const { error } = await supabase
				.from("profiles")
				.update({
					full_name: fullName,
					degree: degree,
					year_in_degree: yearNumber,
				})
				.eq("id", user.id)
				.select();

			console.log("Updated payload: ", { firstName, degree, yearNumber });

			if (error) {
				console.error("Supabase update error: ", error.message);
				return;
			}

			const isTutor = profile?.role === "tutor" || profile?.role === "ambos";

			router.push(isTutor ? "/auth/onboarding/step3" : "/");
		} catch (error) {
			console.error("Error saving profile: ", error);
		} finally {
			setIsLoading(false);
		}
	};

	const isFormValid = firstName && lastName && degree && year;

	const handleAvatarClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const input = e.target;
		const file = input.files?.[0];
		if (!file || !user) return;

		setUploading(true);
		const fileExt = file.name.split(".").pop();
		const filePath = `avatar-${user.id}-${Date.now()}.${fileExt}`;

		const { error: uploadError } = await supabase.storage
			.from("avatars")
			.upload(filePath, file, {
				cacheControl: "3600",
				upsert: true,
			});

		if (uploadError) {
			console.error("Upload failed: ", uploadError.message);
			setUploading(false);
			return;
		}

		const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

		const publicUrl = data.publicUrl;

		const { error: updateError } = await supabase
			.from("profiles")
			.update({ profile_picture: publicUrl })
			.eq("id", user.id);

		if (updateError) {
			console.error("Profile update failed: ", updateError.message);
		} else {
			console.log("Profile picture updated successfully.");
			setProfile((prev: any) => ({ ...prev, profile_picture: publicUrl }));
		}

		setUploading(false);
	};

	return (
		<div className="flex flex-col items-center">
			{/* barra de progreso */}
			<div className="w-full flex justify-between mb-8 gap-1">
				<div className="h-1 bg-blue-500 w-1/4 rounded-full"></div>
				<div className="h-1 bg-blue-500 w-1/4 rounded-full"></div>
				<div className="h-1 bg-blue-200 w-1/4 rounded-full"></div>
				<div className="h-1 bg-blue-200 w-1/4 rounded-full"></div>
			</div>
			<div className="text-center mb-4">
				<h1 className="text-3xl font-bold mb-2">Bienvenido a Tutorcito</h1>
			</div>

			<h2 className="text-xl font-semibold text-gray-500 mb-6">
				Personaliza tu perfil
			</h2>

			<div
				onClick={handleAvatarClick}
				className="relative w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer overflow-hidden mb-6"
			>
				{profile?.profile_picture ? (
					<Image
						src={profile.profile_picture}
						alt="Avatar"
						fill
						sizes=""
						className="object-cover rounded-full"
					/>
				) : (
					<span className="text-gray-500">
						{/* Placeholder para la foto del usuario */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
							<circle cx="9" cy="7" r="4"></circle>
							<path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
							<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
						</svg>
					</span>
				)}

				{/* Input escondido para subir archivos */}
				<input
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					ref={fileInputRef}
					className="hidden cursor-pointer"
				/>

				{/* Icono de editar */}
				<span className="absolute bottom-0 right-0 bg-white p-1 rounded-full border border-gray-300">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
						<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
					</svg>
				</span>
			</div>
			<div className="w-full space-y-4 mb-8">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Input
							type="text"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							placeholder="Nombre"
							className="w-full px-3 py-2 border border-gray-300 rounded-md hover:border-blue-500"
						/>
					</div>
					<div>
						<Input
							type="text"
							value={lastName}
							onChange={(e) => {
								setLastName(e.target.value);
							}}
							placeholder="Apellido"
							className="w-full px-3 py-2 border border-gray-300 hover:border-blue-500"
						/>
					</div>
				</div>
				<div>
					<Input
						type="text"
						value={degree}
						onChange={(e) => {
							setDegree(e.target.value);
						}}
						placeholder="¿Qué carrera cursás?"
						className="w-full px-3 py-2 border border-gray-300 hover:border-blue-500"
					/>
				</div>
				<div>
					<Select value={year} onValueChange={setYear}>
						<SelectTrigger className="w-full px-3 py-2 border border-gray-300">
							<SelectValue placeholder="¿En qué año estás?" />
						</SelectTrigger>
						<SelectContent className="bg-white">
							<SelectItem className="hover:bg-blue-200" value="1er">
								1er año
							</SelectItem>
							<SelectItem className="hover:bg-blue-200" value="2do">
								2do año
							</SelectItem>
							<SelectItem className="hover:bg-blue-200" value="3er">
								3er año
							</SelectItem>
							<SelectItem className="hover:bg-blue-200" value="4to">
								4to año
							</SelectItem>
							<SelectItem className="hover:bg-blue-200" value="5to">
								5to año
							</SelectItem>
							<SelectItem className="hover:bg-blue-200" value="6to">
								6to año
							</SelectItem>
							<SelectItem className="hover:bg-blue-200" value="Otro">
								otro
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
			<Button
				variant={"default"}
				disabled={!isFormValid || isLoading}
				onClick={handleNext}
				className="w-full max-w-xs bg-blue-500 text-white"
			>
				{isLoading ? "Guardando..." : "Siguiente"}
			</Button>
		</div>
	);
}
