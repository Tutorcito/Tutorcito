"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import PaymentButton from "./paymentButton";
import type { PaymentItem } from "./paymentButton";
import { useToast } from "@/hooks/useToast";
import { Button } from "./ui/button";

const subscriptionItems: PaymentItem[] = [
	{
		id: "premium",
		title: "Suscripción Premium",
		quantity: 1,
		unit_price: 5000,
		currency_id: "ARS",
	},
];

const CardsCta = () => {
	const router = useRouter();
	const [user, setUser] = useState<any>(null);
	const [userProfile, setUserProfile] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);
	const { info } = useToast();

	// Obtener usuario y perfil
	const getUserAndProfile = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		setUser(user);

		if (user) {
			const { data: profile } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", user.id)
				.single();

			setUserProfile(profile);
		}
	};

	useEffect(() => {
		getUserAndProfile();
	}, []);

	const handleBecomeTeacher = async () => {
		setIsLoading(true);

		try {
			if (!user) {
				// Usuario no logueado - ir al paso 1
				router.push("/auth/login");
				return;
			}

			// Usuario logueado - verificar su perfil y estado
			if (!userProfile) {
				// Si no tiene perfil, ir al paso 1 para configurarlo
				router.push("/auth/onboarding/step1");
				return;
			}

			// Verificar si el usuario ya es tutor o ambos
			if (userProfile.role === "tutor" || userProfile.role === "ambos") {
				info("¡Ya sos tutor! Podés empezar a recibir estudiantes.");
			} else if (userProfile.role === "estudiante") {
				// Es estudiante, necesita cambiar su rol - ir al paso 1
				router.push("/auth/onboarding/step1");
			} else {
				// Rol no definido o incompleto - ir al paso 1
				router.push("/auth/onboarding/step1");
			}
		} catch (error) {
			console.error("Error al verificar usuario:", error);
			// En caso de error, ir al paso 1
			router.push("/auth/onboarding/step1");
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpgradeSubscription = () => {
		if (!user) {
			router.push("/auth/login");
			return;
		}

		// Verificar si el usuario es tutor
		if (
			userProfile &&
			(userProfile.role === "tutor" || userProfile.role === "ambos")
		) {
			router.push("/checkout/subscription");
		} else {
			info(
				"Primero necesitas ser tutor para acceder al plan premium. ¡Únete como tutor!"
			);
			handleBecomeTeacher();
		}
	};

	return (
		<div className="w-full bg-gray-50 py-20">
			{/* Container with max-width matching other sections */}
			<div className="max-w-7xl mx-auto px-4">
				{/* Optional section header */}
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
						Únete a la comunidad Tutorcito
					</h2>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Elige la opción que mejor se adapte a tus objetivos
					</p>
					<div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mt-4 rounded-full"></div>
				</div>

				{/* Centered cards container */}
				<div className="flex justify-center">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl w-full">
						{/* CARD 1 - Become Tutor */}
						<Card className="h-full rounded-xl shadow-lg shadow-blue-400/20 overflow-hidden border-0 bg-white flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-blue-400/30 hover:-translate-y-2">
							<CardHeader className="pb-4 text-center">
								<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<span className="text-2xl">📚</span>
								</div>
								<CardTitle className="text-xl font-bold text-gray-900 leading-tight">
									¿Querés generar ingresos mientras estudias?
								</CardTitle>
							</CardHeader>

							<CardContent className="pb-6 flex-grow flex flex-col justify-center">
								<ul className="space-y-4 mb-8">
									<li className="flex items-center">
										<div className="w-2 h-2 rounded-full bg-blue-500 mr-3 flex-shrink-0" />
										<span className="text-gray-700 font-medium">
											Vos definís tus horarios
										</span>
									</li>
									<li className="flex items-center">
										<div className="w-2 h-2 rounded-full bg-blue-500 mr-3 flex-shrink-0" />
										<span className="text-gray-700 font-medium">
											Generá ingresos por tutorías
										</span>
									</li>
									<li className="flex items-center">
										<div className="w-2 h-2 rounded-full bg-blue-500 mr-3 flex-shrink-0" />
										<span className="text-gray-700 font-medium">
											Ayudás a otros estudiantes
										</span>
									</li>
								</ul>
							</CardContent>

							<CardFooter className="pt-0">
								<Button
									className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 h-14 px-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
									onClick={handleBecomeTeacher}
									disabled={isLoading}
								>
									{isLoading ? "Verificando..." : "¡Quiero ser tutor!"}
								</Button>
							</CardFooter>
						</Card>

						{/* CARD 2 - Premium Subscription */}
						<Card className="h-full rounded-xl shadow-lg shadow-blue-200/50 overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-blue-300/50 hover:-translate-y-2">
							<CardHeader className="pb-4 text-center">
								<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
									<span className="text-2xl">⭐</span>
								</div>
								<CardTitle className="text-xl font-bold text-white leading-tight">
									¿Ya sos tutor y querés llegar a más estudiantes?
								</CardTitle>
								<CardDescription className="text-blue-100 font-medium mt-2">
									por solo ARS 5,000/mes
								</CardDescription>
							</CardHeader>

							<CardContent className="pb-6 flex-grow flex flex-col justify-center">
								<ul className="space-y-4 mb-8">
									<li className="flex items-center">
										<div className="w-2 h-2 rounded-full bg-white mr-3 flex-shrink-0" />
										<span className="text-white font-medium">
											Mejorá tu visibilidad en Tutorcito
										</span>
									</li>
									<li className="flex items-center">
										<div className="w-2 h-2 rounded-full bg-white mr-3 flex-shrink-0" />
										<span className="text-white font-medium">
											Quedate con el 100% de lo generado
										</span>
									</li>
									<li className="flex items-center">
										<div className="w-2 h-2 rounded-full bg-white mr-3 flex-shrink-0" />
										<span className="text-white font-medium">
											Mejor porcentaje de conversión
										</span>
									</li>
								</ul>
							</CardContent>

							<CardFooter className="pt-0">
								<Button
									onClick={handleUpgradeSubscription}
									className="w-full px-6 py-4 h-14 text-white bg-black hover:bg-gray-900 text-lg rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
								>
									Ser tutor patrocinado
								</Button>
							</CardFooter>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CardsCta;
