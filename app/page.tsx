"use client";

import CardsCta from "@/components/cardsCta";
import ClassCardCarousel from "@/components/classCardCarrusel";
import ResourceCarrusel from "@/components/ResourceCarrusel";
import TutorCarousel from "@/components/tutorCarrusel";
import SponsoredCarousel from "@/components/SponsoredCarousel";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import FilterDialog from "@/components/FilterDialog";
import ClassCardCarrusel from "@/components/classCardCarrusel";
const tutorsData = [
	{
		id: 1,
		name: "Pepe Juan",
		profileImage: "/tutor-pepe-juan.jpg",
		subjects: "Programación I | Programación II",
		rating: 5,
	},
	{
		id: 2,
		name: "María García",
		profileImage: "/tutor-maria-garcia.jpg",
		subjects: "Matemáticas | Cálculo",
		rating: 4,
	},
	{
		id: 3,
		name: "Carlos López",
		profileImage: "/tutor-carlos-lopez.jpg",
		subjects: "Física | Química",
		rating: 5,
	},
	{
		id: 4,
		name: "Ana Martínez",
		profileImage: "/tutor-ana-martinez.jpg",
		subjects: "Inglés | Literatura",
		rating: 4,
	},
	{
		id: 5,
		name: "Diego Rodríguez",
		profileImage: "/tutor-diego-rodriguez.jpg",
		subjects: "Historia | Geografía",
		rating: 5,
	},
	{
		id: 6,
		name: "Laura Sánchez",
		profileImage: "/tutor-laura-sanchez.jpg",
		subjects: "Biología | Anatomía",
		rating: 4,
	},
];
const classesData = [
	{
		id: 1,
		subject: "Análisis Matemático II",
		students: 18500,
		tutors: 12430,
		classImage: "/clase-analisis-2.jpg",
	},
	{
		id: 2,
		subject: "Programación I",
		students: 15200,
		tutors: 8950,
		classImage: "/clase-prog.jpg",
	},
	{
		id: 3,
		subject: "Física General",
		students: 12800,
		tutors: 6720,
		classImage: "/clase-fisica.jpg",
	},
	{
		id: 4,
		subject: "Química Orgánica",
		students: 9500,
		tutors: 4320,
		classImage: "/clase-quimica.jpg",
	},
	{
		id: 5,
		subject: "Cálculo Diferencial",
		students: 14600,
		tutors: 7890,
		classImage: "/clase-mate.jpg",
	},
	{
		id: 6,
		subject: "Inglés Técnico",
		students: 11200,
		tutors: 5670,
		classImage: "/clase-ingles.jpg",
	},
];

export default function Home() {
	const [profileName, setProfileName] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [subjects, setSubjects] = useState<string[]>([]);
	const [carrers, setCarrers] = useState<string[]>([]);
	const [years, setYears] = useState<string[]>([]);
	const [filteredTutors, setFilteredTutors] = useState(tutorsData);

	const fetchUser = async () => {
		try {
			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser();

			if (userError || !user) {
				throw new Error("Error en el fetch del usuario.");
			}

			const { data, error } = await supabase
				.from("profiles")
				.select("full_name")
				.eq("id", user.id)
				.single();

			if (error || !data) {
				throw new Error("Error en el fetch a Supabase.");
			}

			const name = data.full_name?.split(" ")[0] ?? "Usuario";
			setProfileName(name);
		} catch (error) {
			console.error("Hubo un error en el Fetch del usuario: ", error);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	useEffect(() => {
		const lower = searchTerm.toLowerCase();

		const filtered = tutorsData
			.filter(
				(t) =>
					t.name.toLowerCase().includes(lower) ||
					t.subjects.toLowerCase().includes(lower)
			)
			.filter(
				(t) =>
					subjects.length === 0 ||
					subjects.some((s) =>
						t.subjects.toLocaleLowerCase().includes(s.toLowerCase())
					)
			);

		setFilteredTutors(filtered);
	}, [searchTerm, subjects]);

	function toggle(arr: string[], setFn: (val: string[]) => void, val: string) {
		setFn(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
	}

	return (
		<>
			{/* Blue background shape - positioned absolutely */}
			<div className="absolute top-0 left-0 right-0 h-80 md:h-96 bg-gradient-to-br from-blue-500 to-blue-600 rounded-b-[6rem] md:rounded-b-[8rem] -z-10"></div>

			{/* Content container - positioned relative to appear above background */}
			<div className="relative w-full max-w-7xl mx-auto px-4 pt-20 pb-16">
				<div className="text-center mb-12">
					{/* White text for h1 */}
					<h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-sm">
						Bienvenido{profileName ? `, ${profileName}` : ""}
						<span className="inline-block ml-2">👋</span>
					</h1>

					{/* Subtitle with white/light text */}
					<p className="text-xl text-blue-50 max-w-2xl mx-auto mb-8 drop-shadow-sm">
						Encuentra el tutor perfecto para alcanzar tus objetivos académicos
					</p>
				</div>

				{/* Search section */}
				<div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-2xl mx-auto">
					<div className="relative w-full">
						<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
							<svg
								className="h-5 w-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
						<Input
							placeholder="Buscar tutores o materias..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-11 h-14 text-lg bg-white/95 backdrop-blur-sm border-0 rounded-xl shadow-lg focus:bg-white focus:ring-2 focus:ring-white/50 transition-all duration-200"
						/>

						{/* Search results dropdown */}
						{searchTerm && (
							<div className="absolute inset-x-0 top-[calc(100%+8px)] z-50 bg-white rounded-xl shadow-xl border border-gray-100 max-h-80 overflow-y-auto">
								{filteredTutors.length > 0 ? (
									filteredTutors.map((tutor) => (
										<div
											key={tutor.id}
											className="flex items-center p-4 hover:bg-blue-50 cursor-pointer transition-colors first:rounded-t-xl last:rounded-b-xl"
										>
											<img
												src={tutor.profileImage}
												alt={tutor.name}
												className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-gray-100"
											/>
											<div>
												<p className="font-semibold text-gray-900">
													{tutor.name}
												</p>
												<p className="text-sm text-blue-600">
													{tutor.subjects}
												</p>
											</div>
										</div>
									))
								) : (
									<div className="p-8 text-center text-gray-500">
										<div className="mb-2">🔍</div>
										No se encontraron resultados
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="py-8 bg-gradient-to-b from-white to-gray-50/50">
				<div className="w-full max-w-7xl mx-auto px-4">
					{/* Enhanced Section Header */}
					<div className="text-center mb-">
						<div className="flex items-center justify-center gap-3 mb-6">
							<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
								<span className="text-2xl">⭐</span>
							</div>
							<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
								Tutores{" "}
								<span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
									patrocinados
								</span>
							</h2>
						</div>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
							Los tutores más destacados y confiables de nuestra plataforma
						</p>
						<div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full"></div>
					</div>
					<SponsoredCarousel />
				</div>
			</div>

			{/* Regular Tutors Section */}
			<div className="py-6 bg-white">
				<div className="w-full max-w-7xl mx-auto px-4">
					{/* Enhanced Section Header */}
					<div className="text-center mb-">
						<div className="flex items-center justify-center gap-3 mb-6">
							<div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
								<span className="text-2xl">🏆</span>
							</div>
							<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
								Tutores mejor calificados
							</h2>
						</div>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
							Estudiantes que han demostrado excelencia académica y enseñanza
						</p>
						<div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
					</div>
					<TutorCarousel title="" />
				</div>
			</div>
			<ResourceCarrusel />
			<CardsCta />
		</>
	);
}
