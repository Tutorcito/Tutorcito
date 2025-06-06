"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FilterDialogProps {
	subjects: string[];
	setSubjects: (val: string[]) => void;
	careers: string[];
	setCareers: (val: string[]) => void;
	years: string[];
	setYears: (val: string[]) => void;
}

export default function FilterDialog({
	subjects,
	setSubjects,
	careers,
	setCareers,
	years,
	setYears,
}: FilterDialogProps) {
	const [open, setOpen] = useState(false);

	const toggle = (
		arr: string[],
		setFn: (val: string[]) => void,
		val: string
	) => {
		setFn(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant={"outline"}
					className="hover:cursor-pointer hover:bg-blue-500 hover:text-white transition-all duration-150 border-gray-300 border-2 min-h-12 hover:border-none"
				>
					Filtros
				</Button>
			</DialogTrigger>
			<DialogContent className="bg-white">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">Filtros</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div>
						<p className="font-semibold mb-2">Materias</p>
						{[
							"Programación I",
							"Programación II",
							"Matemáticas",
							"Física",
							"Química",
							"Inglés",
							"Historia",
							"Geografía",
							"Biología",
							"Anatomía",
						].map((tag) => (
							<Button
								key={tag}
								variant={subjects.includes(tag) ? "default" : "outline"}
								onClick={() => toggle(subjects, setSubjects, tag)}
								className={`mr-2 mb-2 ${
									subjects.includes(tag)
										? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
										: "bg-white text-black border-gray-300 cursor-pointer"
								}`}
							>
								{tag}
							</Button>
						))}
					</div>
					<div>
						<p className="font-semibold mb-2">Carreras</p>
						{[
							"Ingeniería en Sistemas",
							"Lic. Informática",
							"Lic. en Sistemas",
							"Lic. en Mecánica",
							"Lic. en Química",
							"Lic. en Civil",
							"Lic. en Industrial",
							"Lic. en Telecomunicaciones",
						].map((tag) => (
							<Button
								key={tag}
								variant={careers.includes(tag) ? "default" : "outline"}
								onClick={() => toggle(careers, setCareers, tag)}
								className={`mr-2 mb-2 ${
									careers.includes(tag)
										? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
										: "bg-white text-black border-gray-300 cursor-pointer"
								}`}
							>
								{tag}
							</Button>
						))}
					</div>
					<div>
						<p className="font-semibold mb-2">Años</p>
						{["1ro", "2do", "3ro", "4to", "5to", "6to", "otro"].map((tag) => (
							<Button
								key={tag}
								variant={years.includes(tag) ? "default" : "outline"}
								onClick={() => toggle(years, setYears, tag)}
								className={`mr-2 mb-2 ${
									years.includes(tag)
										? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
										: "bg-white text-black border-gray-300 cursor-pointer"
								}`}
							>
								{tag}
							</Button>
						))}
					</div>
					<Button
						onClick={() => setOpen(false)}
						className="w-full bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
					>
						Aplicar filtros
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
