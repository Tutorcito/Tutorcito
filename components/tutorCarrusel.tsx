// Update components/tutorCarrusel.tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import TutorCard from "./tutorCard";
import { getAllTutors } from "@/lib/getAllTutors";

interface Tutor {
	id: string;
	name: string;
	profileImage: string;
	subjects: string;
	rating?: number;
}

interface TutorCarouselProps {
	title?: string;
}

const TutorCarousel = ({
	title = "Tutores Destacados",
}: TutorCarouselProps) => {
	const [tutors, setTutors] = useState<Tutor[]>([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const fetchTutors = async () => {
			try {
				setLoading(true);
				const data = await getAllTutors();
				console.log("All tutors fetched:", data);
				setTutors(data);
			} catch (error) {
				console.error("Error fetching tutors:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchTutors();
	}, []);

	const handleTutorClick = (tutorId: string) => {
		router.push(`/tutors/${tutorId}`);
	};

	if (loading) {
		return (
			<div className="w-full max-w-7xl mx-auto px-4 py-10">
				<h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
				<div className="flex justify-center items-center h-48">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				</div>
			</div>
		);
	}

	if (!tutors.length) {
		return (
			<div className="w-full max-w-7xl mx-auto px-4 py-10">
				<h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
				<p className="text-gray-600 text-center">
					No hay tutores disponibles en este momento.
				</p>
			</div>
		);
	}

	return (
		<div className="w-full max-w-7xl mx-auto px-4 py-10">
			<h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>

			<Carousel
				opts={{
					align: "start",
					loop: true,
				}}
				className="w-full"
			>
				<CarouselContent className="-ml-2 md:-ml-4">
					{tutors.map((tutor) => (
						<CarouselItem
							key={tutor.id}
							className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
						>
							<TutorCard
								id={tutor.id}
								name={tutor.name}
								profileImage={tutor.profileImage}
								subjects={tutor.subjects}
								rating={tutor.rating}
								onClick={handleTutorClick}
							/>
						</CarouselItem>
					))}
				</CarouselContent>

				<CarouselPrevious className="hidden sm:flex" />
				<CarouselNext className="hidden sm:flex" />
			</Carousel>
		</div>
	);
};

export default TutorCarousel;
