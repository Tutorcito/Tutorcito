"use client";

import React from "react";
import TutorBanner from "./tutorBanner";
import AboutMe from "./aboutMe";
import KnowledgeTutorCard from "./knowledgeTutorCard";
import PriceCard from "./tutorPriceCard";
import CommentsSection from "./CommentsSection";
import CommentForm from "./CommentForm";

export type TutorProfileContainerProps = {
	tutorData: {
		name: string;
		specialty: string;
		rating?: number;
		bannerUrl?: string;
		avatarUrl?: string;
		aboutMe: string;
		knowledge: Array<{
			icon: string;
			label: string;
		}>;
		prices: Array<{
			price: string;
			duration: string;
		}>;
		comments: Array<{
			name: string;
			date: string;
			rating: number;
			text: string;
		}>;
	};
	onEditAbout?: () => void;
	onEditKnowledge?: () => void;
	onEditPrices?: () => void;
	onSubmitComment?: (comment: string, rating: number) => Promise<void>;
	submitting?: boolean;
};

const TutorProfileContainer: React.FC<TutorProfileContainerProps> = ({
	tutorData,
	onEditAbout,
	onEditKnowledge,
	onEditPrices,
	onSubmitComment,
	submitting = false,
}) => {
	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			{/* Banner y Avatar */}
			<div className="bg-white shadow-sm mb-6">
				<TutorBanner
					bannerUrl={tutorData.bannerUrl}
					avatarUrl={tutorData.avatarUrl}
				/>

				{/* Espacio para acomodar el avatar que se desborda del banner */}
				<div className="h-14"></div>

				{/* Nombre del tutor y detalles generales */}
				<div className="text-center mb-4">
					<h1 className="text-2xl sm:text-3xl font-bold">{tutorData.name}</h1>
					<p className="text-gray-600 text-sm sm:text-base">
						{tutorData.specialty}
					</p>
					<div className="flex flex-col items-center justify-center gap-2 mt-2">
						{tutorData.rating && (
							<div className="flex items-center justify-center mt-4">
								<span className="font-bold mr-1">
									{tutorData.rating.toFixed(1)}
								</span>
								<span className="text-yellow-400">★</span>
							</div>
						)}
						<button className="bg-blue-500 text-white px-6 py-2 rounded-md mt-3 hover:bg-blue-800 mb-10">
							Agendar tutoría
						</button>
					</div>
				</div>
			</div>

			{/* Contenido principal en dos columnas */}

			{/* Tarjetas en grilla 3 columnas */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
				<AboutMe content={tutorData.aboutMe} onEdit={onEditAbout} />
				<PriceCard prices={tutorData.prices} onEdit={onEditPrices} />
				<KnowledgeTutorCard
					items={tutorData.knowledge}
					onEdit={onEditKnowledge}
				/>
			</div>

			{/* Comentarios a pantalla completa */}
			<div className="w-full space-y-6 mb-8">
				{onSubmitComment && (
					<CommentForm onSubmit={onSubmitComment} loading={submitting} />
				)}
				<CommentsSection comments={tutorData.comments} />
			</div>
		</div>
	);
};

export default TutorProfileContainer;
