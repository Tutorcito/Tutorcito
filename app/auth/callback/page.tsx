"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, supabase } from "@/lib/supabase";

export default function AuthCallback() {
	const router = useRouter();

	const handleAuthCallback = async () => {
		try {
			const { data, error } = await auth.getSession();

			if (error) {
				throw error;
			}

			if (data?.session) {
				const { data: profile, error: profileError } = await supabase
					.from("profiles")
					.select("*")
					.eq("id", data.session.user.id)
					.single();

				if (profileError && profileError.code === "PGRST116") {
					router.push("/auth/onboarding/step1");
				} else {
					router.push("/");
				}
			} else {
				router.push("/auth/login");
			}
		} catch (error) {
			console.error("Error during auth callback: ", error);
			router.push("/auth/login?error=callback");
		}
	};

	useEffect(() => {
		handleAuthCallback();
	}, [router]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-6 text-center">
				{/* Loading Animation */}
				<div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center">
					<div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-200 border-t-blue-600"></div>
				</div>

				{/* Main Content */}
				<div className="space-y-4 sm:space-y-6">
					<div className="space-y-2 sm:space-y-3">
						<h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
							Procesando tu solicitud
							<span className="inline-block ml-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">⏳</span>
						</h1>
						
						<div className="w-16 sm:w-20 md:w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
					</div>

					<div className="space-y-3 sm:space-y-4">
						<p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed px-2 sm:px-4">
							Por favor espera mientras creamos tu cuenta y configuramos tu perfil.
						</p>
						
						<p className="text-xs sm:text-sm text-gray-500 leading-relaxed px-2 sm:px-4">
							Este proceso puede tomar unos segundos. No cierres esta ventana.
						</p>
					</div>
				</div>

				{/* Progress Indicator */}
				<div className="pt-4 sm:pt-6">
					<div className="flex items-center justify-center space-x-2">
						<div className="flex space-x-1">
							<div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
							<div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
							<div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
						</div>
					</div>
				</div>

				{/* Footer Message */}
				<div className="pt-6 sm:pt-8 border-t border-gray-200">
					<p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
						Si este proceso toma más de lo esperado, serás redirigido automáticamente.
					</p>
				</div>
			</div>
		</div>
	);
}
