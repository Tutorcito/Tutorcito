// In components/resourcesCard.tsx
import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

interface resourcesCardProps {
	icon: any;
	description1: string;
	description2: string;
	description3: string;
	sitelink: string;
}

function ResourcesCard({
	icon,
	description1,
	description2,
	description3,
	sitelink,
}: resourcesCardProps) {
	const imageSrc = typeof icon === "object" && icon.src ? icon.src : icon;

	return (
		<Card className="group h-full bg-white/95 backdrop-blur-sm border-0 rounded-xl shadow-lg hover:shadow-xl hover:bg-white hover:-translate-y-2 transition-all duration-300">
			<CardHeader className="p-6 pb-4">
				<div className="flex items-center justify-center h-16 mb-4">
					<div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
						<img
							src={imageSrc}
							alt="Resource Logo"
							className="max-h-10 max-w-full object-contain"
						/>
					</div>
				</div>
			</CardHeader>

			<CardContent className="px-6 pb-6 flex flex-col h-full">
				<div className="space-y-3 mb-8 flex-grow">
					<div className="flex items-center">
						<div className="w-2 h-2 rounded-full bg-blue-500 mr-3 flex-shrink-0" />
						<span className="text-gray-700 text-sm font-medium">
							{description1}
						</span>
					</div>
					<div className="flex items-center">
						<div className="w-2 h-2 rounded-full bg-blue-500 mr-3 flex-shrink-0" />
						<span className="text-gray-700 text-sm font-medium">
							{description2}
						</span>
					</div>
					<div className="flex items-center">
						<div className="w-2 h-2 rounded-full bg-blue-500 mr-3 flex-shrink-0" />
						<span className="text-gray-700 text-sm font-medium">
							{description3}
						</span>
					</div>
				</div>

				<Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg group-hover:scale-105">
					<Link target="_blank" href={sitelink} className="block w-full">
						Ir al sitio
					</Link>
				</Button>
			</CardContent>
		</Card>
	);
}

export default ResourcesCard;
