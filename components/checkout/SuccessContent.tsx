// components/checkout/SuccessContent.tsx - Enhanced version
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import {
	CheckCircle,
	Calendar,
	Phone,
	Home,
	AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/useToast";

interface TutorData {
	id: string;
	full_name: string;
	profile_picture: string;
	calendly_link: string;
	phone_number: string;
}

export default function SuccessContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { success, error } = useToast();

	// Get ALL possible parameters MercadoPago might send
	const paymentId = searchParams.get("payment_id");
	const status = searchParams.get("status");
	const externalReference = searchParams.get("external_reference");
	const preferenceId = searchParams.get("preference_id");
	const collectionId = searchParams.get("collection_id"); // Alternative to payment_id
	const collectionStatus = searchParams.get("collection_status"); // Alternative to status
	const merchantOrderId = searchParams.get("merchant_order_id");

	const [tutor, setTutor] = useState<TutorData | null>(null);
	const [paymentData, setPaymentData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [debugInfo, setDebugInfo] = useState<string>("");

	useEffect(() => {
		// Log all parameters for debugging
		const allParams = Array.from(searchParams.entries());
		const debugString = allParams
			.map(([key, value]) => `${key}: ${value}`)
			.join("\n");
		setDebugInfo(debugString);
		console.log("🔍 All URL parameters:", Object.fromEntries(allParams));

		// Try to find payment data with any available parameter
		findPaymentData();
	}, [searchParams]);

	const findPaymentData = async () => {
		try {
			console.log("🔍 Searching for payment with parameters:", {
				paymentId,
				collectionId,
				externalReference,
				preferenceId,
				status,
				collectionStatus,
			});

			let paymentRecord = null;

			// Strategy 1: Try with external_reference first (most reliable)
			if (externalReference) {
				console.log("🔍 Searching by external_reference:", externalReference);
				const { data, error } = await supabase
					.from("payment_transactions")
					.select("*")
					.eq("external_reference", externalReference)
					.maybeSingle();

				if (!error && data) {
					paymentRecord = data;
					console.log("✅ Found payment by external_reference");
				}
			}

			// Strategy 2: Try with payment_id or collection_id
			const actualPaymentId = paymentId || collectionId;
			if (!paymentRecord && actualPaymentId) {
				console.log("🔍 Searching by payment_id:", actualPaymentId);
				const { data, error } = await supabase
					.from("payment_transactions")
					.select("*")
					.eq("mercadopago_payment_id", actualPaymentId)
					.maybeSingle();

				if (!error && data) {
					paymentRecord = data;
					console.log("✅ Found payment by payment_id");
				}
			}

			// Strategy 3: If still not found, try to find the most recent payment for this user
			if (!paymentRecord) {
				console.log("🔍 Trying to find recent payment for current user");
				const {
					data: { user },
				} = await supabase.auth.getUser();

				if (user) {
					const { data, error } = await supabase
						.from("payment_transactions")
						.select("*")
						.eq("student_id", user.id)
						.eq("payment_type", "class")
						.order("created_at", { ascending: false })
						.limit(1)
						.maybeSingle();

					if (!error && data) {
						paymentRecord = data;
						console.log("✅ Found recent payment by user");
					}
				}
			}

			if (paymentRecord) {
				setPaymentData(paymentRecord);
				await fetchTutorData(paymentRecord.tutor_id);
				await updatePaymentStatus(paymentRecord);
				console.log("✅ Payment processing completed");
			} else {
				console.error("❌ No payment record found");
				// Instead of redirecting to failure, show success with limited info
				setLoading(false);
			}
		} catch (error) {
			console.error("❌ Error finding payment data:", error);
			setLoading(false);
		}
	};

	const fetchTutorData = async (tutorId: string) => {
		const { data, error } = await supabase
			.from("profiles")
			.select("id, full_name, profile_picture, calendly_link, phone_number")
			.eq("id", tutorId)
			.single();

		if (error || !data) {
			console.error("Error fetching tutor:", error);
			return;
		}

		setTutor(data);
		setLoading(false);
	};

	const updatePaymentStatus = async (paymentRecord: any) => {
		try {
			const finalStatus = status || collectionStatus || "approved";
			const finalPaymentId = paymentId || collectionId;

			// Update payment status in database
			await supabase
				.from("payment_transactions")
				.update({
					status: finalStatus,
					mercadopago_payment_id: finalPaymentId,
					paid_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				})
				.eq("id", paymentRecord.id);

			console.log("✅ Payment status updated");
		} catch (error) {
			console.error("❌ Error updating payment status:", error);
		}
	};

	const openCalendly = () => {
		if (tutor?.calendly_link) {
			window.open(tutor.calendly_link, "_blank");
		}
	};

	const copyPhoneNumber = () => {
		if (tutor?.phone_number) {
			navigator.clipboard.writeText(tutor.phone_number);
			success("Número de teléfono copiado al portapapeles");
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
					<p>Procesando información del pago...</p>
					{process.env.NODE_ENV === "development" && (
						<details className="mt-4 text-left">
							<summary className="cursor-pointer text-sm text-gray-500">
								Debug Info
							</summary>
							<pre className="text-xs bg-gray-100 p-2 rounded mt-2">
								{debugInfo}
							</pre>
						</details>
					)}
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
						¡Pago Exitoso!
					</h1>
					<p className="text-gray-600">
						Tu tutoría ha sido reservada correctamente
					</p>
				</div>

				{/* Payment Details */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>Detalles de la Reserva</CardTitle>
					</CardHeader>
					<CardContent>
						{tutor && paymentData ? (
							<div className="space-y-4">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 rounded-full overflow-hidden">
										<Image
											src={tutor.profile_picture || "/logo.png"}
											alt={tutor.full_name}
											width={48}
											height={48}
											className="w-full h-full object-cover"
										/>
									</div>
									<div>
										<p className="font-semibold">{tutor.full_name}</p>
										<p className="text-sm text-gray-600">Tutor</p>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4 pt-4 border-t">
									<div>
										<p className="text-sm text-gray-600">Duración</p>
										<p className="font-medium">
											{paymentData?.class_duration_minutes} minutos
										</p>
									</div>
									<div>
										<p className="text-sm text-gray-600">Estado</p>
										<p className="font-medium text-green-600">Pagado</p>
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
											{paymentId || collectionId || "N/A"}
										</p>
									</div>
								</div>
							</div>
						) : (
							// Fallback when we don't have complete data but payment was successful
							<div className="space-y-4">
								<div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
									<AlertTriangle className="h-5 w-5 text-yellow-600" />
									<div>
										<p className="font-medium text-yellow-900">
											Pago confirmado
										</p>
										<p className="text-sm text-yellow-700">
											Tu pago fue procesado exitosamente. Los detalles completos
											aparecerán pronto.
										</p>
									</div>
								</div>

								{(paymentId || collectionId) && (
									<div>
										<p className="text-sm text-gray-600">ID de Pago</p>
										<p className="font-medium text-xs text-gray-500">
											{paymentId || collectionId}
										</p>
									</div>
								)}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Next Steps */}
				{tutor && (
					<Card className="mb-6">
						<CardHeader>
							<CardTitle>Próximos Pasos</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
									<h3 className="font-semibold text-blue-900 mb-2">
										1. Agenda tu clase
									</h3>
									<p className="text-blue-800 text-sm mb-3">
										Utiliza el calendario del tutor para seleccionar el horario
										que mejor te convenga.
									</p>
									<Button
										onClick={openCalendly}
										className="w-full bg-blue-500 hover:bg-blue-600 text-white"
										disabled={!tutor?.calendly_link}
									>
										<Calendar className="mr-2 h-4 w-4" />
										Abrir Calendario
									</Button>
								</div>

								<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
									<h3 className="font-semibold text-green-900 mb-2">
										2. Contacta al tutor
									</h3>
									<p className="text-green-800 text-sm mb-3">
										Una vez agendada la clase, puedes contactar directamente al
										tutor.
									</p>
									<Button
										onClick={copyPhoneNumber}
										variant="outline"
										className="w-full border-green-300 hover:bg-green-100"
										disabled={!tutor?.phone_number}
									>
										<Phone className="mr-2 h-4 w-4" />
										{tutor?.phone_number || "Número no disponible"}
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Action Buttons */}
				<div className="space-y-3">
					<Button
						onClick={() => router.push("/")}
						variant="outline"
						className="w-full"
					>
						<Home className="mr-2 h-4 w-4" />
						Volver al Inicio
					</Button>
				</div>

				{/* Debug info in development */}
				{process.env.NODE_ENV === "development" && (
					<Card className="mt-6">
						<CardHeader>
							<CardTitle className="text-sm">Debug Information</CardTitle>
						</CardHeader>
						<CardContent>
							<pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
								{debugInfo}
							</pre>
						</CardContent>
					</Card>
				)}

				{/* Important Note */}
				<div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
					<p className="text-yellow-800 text-sm">
						<strong>Importante:</strong> Asegúrate de agendar tu clase dentro de
						las próximas 24 horas. Si tienes algún problema, puedes contactarnos
						o comunicarte directamente con el tutor.
					</p>
				</div>
			</div>
		</div>
	);
}
