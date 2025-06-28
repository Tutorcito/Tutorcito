// components/checkout/SubscriptionSuccessContent.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { CheckCircle, Star, Home, User } from "lucide-react";

export default function SubscriptionSuccessContent() {
	const searchParams = useSearchParams();
	const router = useRouter();

	// MercadoPago sends these parameters
	const paymentId = searchParams.get("payment_id");
	const status = searchParams.get("status");
	const externalReference = searchParams.get("external_reference");

	const [paymentData, setPaymentData] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (externalReference || paymentId) {
			fetchPaymentData();
		}
	}, [externalReference, paymentId]);

	const fetchPaymentData = async () => {
		try {
			// Get payment data from our database using external_reference
			let paymentRecord = null;

			if (externalReference) {
				const { data, error } = await supabase
					.from("payment_transactions")
					.select("*")
					.eq("external_reference", externalReference)
					.single();

				if (!error && data) {
					paymentRecord = data;
				}
			}

			// If no record found and we have paymentId, try with that
			if (!paymentRecord && paymentId) {
				const { data, error } = await supabase
					.from("payment_transactions")
					.select("*")
					.eq("mercadopago_payment_id", paymentId)
					.single();

				if (!error && data) {
					paymentRecord = data;
				}
			}

			if (paymentRecord) {
				setPaymentData(paymentRecord);
				await updatePaymentAndUserStatus(paymentRecord);
			} else {
				console.error("Payment record not found");
				router.push("/checkout/subscription/failure");
			}
		} catch (error) {
			console.error("Error fetching payment data:", error);
			router.push("/checkout/subscription/failure");
		} finally {
			setLoading(false);
		}
	};

	const updatePaymentAndUserStatus = async (paymentRecord: any) => {
		try {
			// Update payment status in database
			await supabase
				.from("payment_transactions")
				.update({
					status: status || "approved",
					mercadopago_payment_id: paymentId,
					paid_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				})
				.eq("id", paymentRecord.id);

			// Update user's sponsored status
			if (paymentRecord.student_id) {
				await supabase
					.from("profiles")
					.update({
						sponsored: true,
						updated_at: new Date().toISOString(),
					})
					.eq("id", paymentRecord.student_id);
			}
		} catch (error) {
			console.error("Error updating payment status:", error);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
					<p>Procesando información...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-2xl mx-auto px-4">
				{/* Success Header */}
				<div className="text-center mb-8">
					<div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
						<CheckCircle className="w-8 h-8 text-green-600" />
					</div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						¡Suscripción Activada!
					</h1>
					<p className="text-gray-600">
						Ya eres un tutor patrocinado de Tutorcito
					</p>
				</div>

				{/* Payment Details */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle className="flex items-center gap-3">
							<Star className="h-5 w-5 text-yellow-500" />
							Plan Premium Activado
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4 pt-4 border-t">
								<div>
									<p className="text-sm text-gray-600">Plan</p>
									<p className="font-medium">Premium Mensual</p>
								</div>
								<div>
									<p className="text-sm text-gray-600">Estado</p>
									<p className="font-medium text-green-600">Activo</p>
								</div>
								<div>
									<p className="text-sm text-gray-600">Monto</p>
									<p className="font-medium">
										ARS ${paymentData?.amount?.toLocaleString()}
									</p>
								</div>
								<div>
									<p className="text-sm text-gray-600">ID de Pago</p>
									<p className="font-medium text-xs text-gray-500">
										{paymentId || "N/A"}
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Benefits Active */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>Beneficios Activados</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
								<h3 className="font-semibold text-green-900 mb-3">
									¡Ya tienes acceso a estos beneficios!
								</h3>
								<ul className="space-y-2 text-green-800 text-sm">
									<li className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4" />
										Mayor visibilidad en los resultados de búsqueda
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4" />
										Aparición en la sección "Tutores Patrocinados"
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4" />
										Badge de "Tutor Premium" en tu perfil
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4" />
										Te quedas con el 100% de lo que generas
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4" />
										Soporte prioritario
									</li>
								</ul>
							</div>

							<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
								<h3 className="font-semibold text-blue-900 mb-2">
									Próximos pasos
								</h3>
								<ul className="text-blue-800 text-sm space-y-1">
									<li>
										• Tu perfil aparecerá destacado en los próximos minutos
									</li>
									<li>• Recibirás más solicitudes de estudiantes</li>
									<li>• Podrás cancelar tu suscripción en cualquier momento</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Action Buttons */}
				<div className="space-y-3">
					<Button
						onClick={() => router.push("/profiles/" + paymentData?.student_id)}
						className="w-full bg-blue-500 hover:bg-blue-600 text-white"
					>
						<User className="mr-2 h-4 w-4" />
						Ver Mi Perfil Premium
					</Button>

					<Button
						onClick={() => router.push("/")}
						variant="outline"
						className="w-full"
					>
						<Home className="mr-2 h-4 w-4" />
						Volver al Inicio
					</Button>
				</div>

				{/* Important Note */}
				<div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
					<p className="text-yellow-800 text-sm">
						<strong>Recordatorio:</strong> Tu suscripción se renovará
						automáticamente cada mes. Puedes cancelarla en cualquier momento
						desde tu perfil o contactándonos.
					</p>
				</div>
			</div>
		</div>
	);
}
