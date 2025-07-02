"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, CreditCard, Star, Check } from "lucide-react";
import { useToast } from "@/hooks/useToast";

export default function SubscriptionCheckoutPage() {
	const router = useRouter();
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [processingPayment, setProcessingPayment] = useState(false);
	const { error } = useToast();

	useEffect(() => {
		fetchCurrentUser();
	}, []);

	const fetchCurrentUser = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			router.push("/auth/login");
			return;
		}

		// Get user profile to get additional info if needed
		const { data: profile } = await supabase
			.from("profiles")
			.select("full_name, profile_picture, role")
			.eq("id", user.id)
			.single();

		setUser({
			...user,
			profile: profile,
		});
		setLoading(false);
	};

	const createSubscriptionPreference = async () => {
		if (!user) return null;

		const externalReference = `subscription-${user.id}-${Date.now()}`;

		const preference = {
			items: [
				{
					id: "premium-subscription",
					title: "Plan Premium Tutorcito",
					description: "Suscripción Premium - Mayor visibilidad",
					quantity: 1,
					unit_price: 5,
					currency_id: "ARS",
				},
			],
			back_urls: {
				success: `https://tutorcito.netlify.app/checkout/subscription/success`,
				failure: `https://tutorcito.netlify.app/checkout/subscription/failure`,
				pending: `https://tutorcito.netlify.app/checkout/subscription/pending`,
			},
			external_reference: externalReference,
			payer: {
				email: user.email,
			},
			notification_url: `https://tutorcito.netlify.app/api/webhooks/mercadopago`,
			statement_descriptor: "TUTORCITO PREMIUM",
			metadata: {
				user_id: user.id,
				payment_type: "subscription",
			},
		};

		try {
			const response = await fetch("/api/checkout/preferences", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(preference),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Error creating payment preference");
			}

			return await response.json();
		} catch (error) {
			console.error("Error creating preference:", error);
			throw error;
		}
	};

	const handleSubscriptionPayment = async () => {
		if (!user) return;

		setProcessingPayment(true);

		try {
			// Use the same preference creation logic as classes
			const preferenceData = await createSubscriptionPreference();

			if (!preferenceData || !preferenceData.init_point) {
				throw new Error("No se pudo crear la preferencia de pago");
			}

			// Store the payment record
			const externalReference = `subscription-${user.id}-${Date.now()}`;

			const { error: insertError } = await supabase
				.from("payment_transactions")
				.insert({
					student_id: user.id,
					external_reference: externalReference,
					payment_type: "subscription",
					amount: 5,
					status: "pending",
					description: "Plan Premium Tutorcito - Suscripción",
					metadata: {
						preference_id: preferenceData.id,
						subscription_type: "premium",
					},
				});

			if (insertError) {
				throw insertError;
			}

			// Redirect to MercadoPago instead of success page
			window.location.href = preferenceData.init_point;
		} catch (error: any) {
			console.error("Subscription payment error:", error);
			alert(`Error al procesar el pago: ${error.message}`);
		} finally {
			setProcessingPayment(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p>Cargando información...</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-600">Necesitas iniciar sesión</p>
					<Button onClick={() => router.push("/auth/login")} className="mt-4">
						Iniciar Sesión
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-2xl mx-auto px-4">
				{/* Header */}
				<div className="mb-6">
					<Button
						variant="ghost"
						onClick={() => router.back()}
						className="mb-4"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Volver
					</Button>
					<h1 className="text-3xl font-bold text-gray-900">
						Plan Premium Tutorcito
					</h1>
					<p className="text-gray-600">
						Mejora tu visibilidad y llega a más estudiantes
					</p>
				</div>

				{/* Plan Details */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle className="flex items-center gap-3">
							<Star className="h-5 w-5 text-yellow-500" />
							Plan Premium
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="text-center py-4">
								<p className="text-3xl font-bold text-blue-600">ARS $5,000</p>
								<p className="text-gray-600">por mes</p>
							</div>

							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<Check className="h-5 w-5 text-green-500" />
									<span>Mayor visibilidad en los resultados de búsqueda</span>
								</div>
								<div className="flex items-center gap-3">
									<Check className="h-5 w-5 text-green-500" />
									<span>Aparición en la sección de "Tutores Patrocinados"</span>
								</div>
								<div className="flex items-center gap-3">
									<Check className="h-5 w-5 text-green-500" />
									<span>Quedás con el 100% de lo que generás</span>
								</div>
								<div className="flex items-center gap-3">
									<Check className="h-5 w-5 text-green-500" />
									<span>Mejor porcentaje de conversión</span>
								</div>
								<div className="flex items-center gap-3">
									<Check className="h-5 w-5 text-green-500" />
									<span>Badge de "Tutor Premium" en tu perfil</span>
								</div>
								<div className="flex items-center gap-3">
									<Check className="h-5 w-5 text-green-500" />
									<span>Soporte prioritario</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Payment Section */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-3">
							<CreditCard className="h-5 w-5" />
							Proceder al Pago
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
								<div>
									<p className="font-medium">Plan Premium Tutorcito</p>
									<p className="text-sm text-gray-600">Suscripción mensual</p>
								</div>
								<p className="font-bold text-xl">ARS $5,000</p>
							</div>

							<div className="pt-4 border-t">
								<Button
									onClick={handleSubscriptionPayment}
									disabled={processingPayment}
									className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
								>
									{processingPayment ? (
										<>
											<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
											Procesando...
										</>
									) : (
										<>
											<CreditCard className="mr-2 h-5 w-5" />
											Pagar con MercadoPago
										</>
									)}
								</Button>
							</div>

							<div className="text-center">
								<p className="text-xs text-gray-500">
									Serás redirigido a MercadoPago para completar el pago de forma
									segura
								</p>
								<p className="text-xs text-gray-500 mt-1">
									Podrás cancelar tu suscripción en cualquier momento
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
