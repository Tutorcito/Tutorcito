"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function Step2() {
	const router = useRouter();
	const [user, setUser] = useState<any>(null);
	const [profile, setProfile] = useState<any>(null);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [degree, setDegree] = useState("");
	const [year, setYear] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const getProfile = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
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
			const yearNumber = parseInt(year, 10);

			await supabase
				.from("profiles")
				.update({
					full_name: fullName,
					degree: degree,
					year_in_degree: yearNumber,
				})
				.eq("id", user.id);

			const isTutor = profile?.role === "tutor" || profile?.role === "ambos";

			if (isTutor) {
				router.push("/auth/onboarding/step3");
			} else {
				router.push("/");
			}
		} catch (error) {
			console.error("Error saving profile: ", error);
		} finally {
			setIsLoading(false);
		}
	};

	const isFormValid = firstName && lastName && degree && year;

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

			<div className="w-full mb-6 flex justify-center">
				<div className="relative w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
					<span className="text-gray-500">
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
                    variant={'default'}
                    disabled={!isFormValid || isLoading}
                    onClick={handleNext}
                    className="w-full max-w-xs"
                >
                    {isLoading ? "Guardando..." : "Siguiente"}
                </Button>
		</div>
	);
}
