"use client";

import { useState, useEffect } from "react";
import TutorCard from "./tutorCard";
import { getSponsoredTutors } from "@/lib/getSponsoredTutors";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { useRouter } from "next/navigation";

interface Tutor {
	id: string;
	full_name: string;
	profile_picture: string;
	subjects: string;
	rating?: number;
}

const SponsoredCarousel = () => {
	const [tutors, setTutors] = useState<Tutor[]>([]);
	const router = useRouter();

	useEffect(() => {
        const fetchTutors = async () => {
            const data = await getSponsoredTutors();
            console.log("Tutors in carousel: ", data);
            setTutors(data);
        };
		fetchTutors();
	}, []);

	if (!tutors.length) return null;

	const redirect = (tutorId: string) => {
		router.push(`/tutors/${tutorId}`);
	};

	return (
		<div className="w-full max-w-7xl mx-auto px-4 py-10">
			<h2 className="text-2xl font-bold text-gray-800 mb-6">
				Tutores{" "}
				<span className="bg-blue-100 text-blue-500 px-2 py-1 rounded">
					patrocinados
				</span>
			</h2>

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
								name={tutor.full_name}
								profileImage={tutor.profile_picture}
								subjects={tutor.subjects}
								rating={tutor.rating}
								onClick={() => {redirect(tutor.id)}}
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

export default SponsoredCarousel;
