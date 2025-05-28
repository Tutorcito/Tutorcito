"use client";

import React, { ReactNode } from "react";
import Image from "next/image";

interface OnboardingLayoutProps {
	children: ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
			{/* Carta */}
			<div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md border border-gray-100">
				{/* Contenido principal */}
				<div className="py-4">{children}</div>
			</div>
		</div>
	);
}
