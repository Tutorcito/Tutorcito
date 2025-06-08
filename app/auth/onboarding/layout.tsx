
import React, { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Onboarding | Tutorcito",
	description: "Proceso de onboarding de Tutorcito."
}

interface OnboardingLayoutProps {
	children: ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 sm:px-6 lg:px-8">
			{/* Carta */}
			<div className="w-full max-w-lg p-6 sm:p-8 bg-white rounded-lg shadow-md border border-gray-100">
				{/* Contenido principal */}
				<div className="py-4">{children}</div>
			</div>
		</div>
	);
}
