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
				console.error("Session error:", error);
				throw error;
			}

			if (data?.session) {
				const user = data.session.user;
				console.log("User confirmed:", user.id);

				// Check if profile exists
				const { data: profile, error: profileError } = await supabase
					.from("profiles")
					.select("*")
					.eq("id", user.id)
					.maybeSingle();

				if (profileError && profileError.code !== "PGRST116") {
					console.error("Profile fetch error:", profileError);
					throw profileError;
				}

				if (!profile) {
					// Profile doesn't exist, create it
					console.log("Creating profile for confirmed user...");

					// Try to get stored name from localStorage (from registration)
					const pendingUserName = localStorage.getItem("pendingUserName");
					const pendingUserId = localStorage.getItem("pendingUserId");

					let fullName =
						user.user_metadata?.full_name ||
						user.user_metadata?.name ||
						pendingUserName ||
						"Usuario";

					// Verify this is the same user
					if (pendingUserId && pendingUserId !== user.id) {
						console.warn("User ID mismatch, using default name");
						fullName = "Usuario";
					}

					const { error: insertError } = await supabase
						.from("profiles")
						.insert({
							id: user.id,
							full_name: fullName,
							created_at: new Date().toISOString(),
						});

					if (insertError) {
						console.error("Profile creation error:", insertError);
						throw insertError;
					}

					console.log("Profile created successfully");

					// Clean up localStorage
					localStorage.removeItem("pendingUserName");
					localStorage.removeItem("pendingUserId");

					// Redirect to onboarding
					router.push("/auth/onboarding/step1");
				} else {
					console.log("Profile exists, checking completeness...");

					// Profile exists, check if onboarding is complete
					if (!profile.role) {
						router.push("/auth/onboarding/step1");
					} else if (
						!profile.full_name ||
						!profile.degree ||
						!profile.year_in_degree
					) {
						router.push("/auth/onboarding/step2");
					} else {
						// Profile is complete
						router.push("/");
					}
				}
			} else {
				console.log("No session found, redirecting to login");
				router.push("/auth/login");
			}
		} catch (error) {
			console.error("Error during auth callback: ", error);

			// Clean up localStorage on error
			localStorage.removeItem("pendingUserName");
			localStorage.removeItem("pendingUserId");

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
							Procesando tu cuenta
							<span className="inline-block ml-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
								⏳
							</span>
						</h1>

						<div className="w-16 sm:w-20 md:w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
					</div>

					<div className="space-y-3 sm:space-y-4">
						<p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed px-2 sm:px-4">
							Estamos confirmando tu email y configurando tu perfil.
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
							<div
								className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
								style={{ animationDelay: "0.2s" }}
							></div>
							<div
								className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
								style={{ animationDelay: "0.4s" }}
							></div>
						</div>
					</div>
				</div>

				{/* Footer Message */}
				<div className="pt-6 sm:pt-8 border-t border-gray-200">
					<p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
						Si este proceso toma más de lo esperado, serás redirigido
						automáticamente.
					</p>
				</div>
			</div>
		</div>
	);
}
