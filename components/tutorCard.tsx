// In components/tutorCard.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Star, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface TutorCardProps {
	id?: string;
	name: string;
	profileImage: string;
	subjects: string;
	rating?: number;
	onClick?: (tutorId: string) => void;
}

const TutorCard = ({
	id,
	name,
	profileImage,
	subjects,
	rating = 5,
	onClick,
}: TutorCardProps) => {
	const router = useRouter();

	const handleCardClick = () => {
		if (!id) return;

		if (onClick) {
			onClick(id);
		} else {
			router.push(`/tutors/${id}`);
		}
	};

	return (
		<Card
			className={`group relative overflow-hidden bg-white border border-gray-100 max-w-sm transition-all duration-300 hover:shadow-2xl hover:border-blue-200 hover:-translate-y-3 ${
				id ? "cursor-pointer" : ""
			}`}
			onClick={handleCardClick}
		>
			{/* Modern gradient background */}
			<div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-70 group-hover:opacity-90 transition-opacity"></div>

			{/* Decorative elements */}
			<div className="absolute top-4 right-4 w-8 h-8 bg-blue-100 rounded-full opacity-30 group-hover:opacity-50 transition-opacity"></div>
			<div className="absolute top-8 right-8 w-4 h-4 bg-indigo-200 rounded-full opacity-40 group-hover:opacity-60 transition-opacity"></div>

			<CardHeader className="relative pt-8 pb-6">
				{/* Enhanced profile section */}
				<div className="flex justify-center mb-6">
					<div className="relative">
						{/* Profile image with modern styling */}
						<div className="w-20 h-20 rounded-2xl overflow-hidden border-3 border-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
							<Image
								src={profileImage}
								alt={`${name} profile`}
								width={80}
								height={80}
								className="w-full h-full object-cover"
							/>
						</div>

						{/* Status indicator */}
						<div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r from-green-400 to-green-500 border-3 border-white rounded-full flex items-center justify-center shadow-md">
							<div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
						</div>

						{/* Premium badge for sponsored tutors (optional) */}
						<div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
							<span className="text-white text-xs font-bold">✨</span>
						</div>
					</div>
				</div>

				{/* Name with enhanced typography */}
				<CardTitle className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-blue-600 transition-colors line-clamp-1">
					{name}
				</CardTitle>

				{/* Subject tags with modern design */}
				<div className="flex flex-wrap gap-2 justify-center mb-4 min-h-[2.5rem]">
					{subjects
						.split(" | ")
						.slice(0, 2)
						.map((subject, index) => (
							<span
								key={index}
								className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200/50 transition-all duration-200 hover:shadow-sm"
							>
								{subject}
							</span>
						))}
					{subjects.split(" | ").length > 2 && (
						<span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
							+{subjects.split(" | ").length - 2}
						</span>
					)}
				</div>

				{/* Enhanced rating display */}
				<div className="flex justify-center items-center gap-2">
					<div className="flex gap-0.5">
						{[1, 2, 3, 4, 5].map((star) => (
							<Star
								key={star}
								className={`w-4 h-4 transition-all duration-200 ${
									star <= rating
										? "fill-yellow-400 text-yellow-400 scale-100"
										: "fill-gray-200 text-gray-200 scale-90"
								}`}
							/>
						))}
					</div>
					<span className="ml-1 text-sm font-bold text-gray-700">
						{rating}.0
					</span>
					<span className="text-xs text-gray-500 ml-1">(12+ reseñas)</span>
				</div>
			</CardHeader>

			{/* Action area */}
			<CardContent className="pt-0 pb-6">
				{/* Hover call-to-action */}
				<div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
					<div className="flex items-center justify-center gap-2 text-blue-600 font-semibold text-sm bg-blue-50 py-2 px-4 rounded-xl border border-blue-100">
						<span>Ver perfil completo</span>
						<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
					</div>
				</div>
			</CardContent>

			{/* Subtle hover effect overlay */}
			<div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
		</Card>
	);
};

export default TutorCard;
