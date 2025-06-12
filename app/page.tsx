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
			<div className="w-full max-w-7xl mx-auto px-4 py-10">
				<h1 className="text-4xl font-bold text-start mb-6">
					Bienvenido{profileName ? `, ${profileName}` : ""} 👋
				</h1>
				<div className="flex gap-4 items-center">
					<div className="relative w-full max-w-md">
						<Input
							placeholder="Buscar clases o tutores..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="max-w-md border-gray-300 border-2 placeholder:font-semibold placeholder:text-gray-400 min-h-12 hover:cursor-pointer"
						/>

						{searchTerm && (
							<div className="absolute inset-x-0 top-[calc(100%+4px)] z-45 max-w-md bg-white rounded-md shadow-md border max-h-80 overflow-y-auto">
								{filteredTutors.length > 0 ? (
									filteredTutors.map((tutor) => (
										<div
											key={tutor.id}
											className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
										>
											<img
												src={tutor.profileImage}
												alt={tutor.name}
												className="w-10 h-10 rounded-full mr-4 object-cover"
											/>
											<div>
												<p className="font-semibold text-sm">{tutor.name}</p>
												<p className="text-xs text-gray-500">
													{tutor.subjects}
												</p>
											</div>
										</div>
									))
								) : (
									<div className="p-4 text-center text-gray-500">
										No se encontraron resu
									</div>
								)}
							</div>
						)}
					</div>

					<FilterDialog
						subjects={subjects}
						setSubjects={setSubjects}
						careers={carrers}
						setCareers={setCarrers}
						years={years}
						setYears={setYears}
					/>
				</div>
			</div>
			{/* <TutorCarousel tutors={filteredTutors} /> */}
			<SponsoredCarousel />
			<TutorCarousel tutors={tutorsData} title="Tutores mejor calificados" />
			<ClassCardCarousel classes={classesData} title="Materias más populares" />
			<ResourceCarrusel />
			<CardsCta />
		</>
	);
}
