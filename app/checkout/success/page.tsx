"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { CheckCircle, Calendar, Phone, Home } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/useToast";

interface TutorData {
	id: string;
	full_name: string;
	profile_picture: string;
	calendly_link: string;
	phone_number: string;
}

export default function PaymentSuccessPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { success } = useToast();

	// MercadoPago sends these parameters
	const paymentId = searchParams.get("payment_id");
	const status = searchParams.get("status");
	const externalReference = searchParams.get("external_reference");
	const preferenceId = searchParams.get("preference_id");

	const [tutor, setTutor] = useState<TutorData | null>(null);
	const [paymentData, setPaymentData] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (externalReference || paymentId) {
			fetchPaymentData();
		}
	}, [externalReference, paymentId]);

	const fetchPaymentData = async () => {
		try {
			// First, try to get payment data from our database using external_reference
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
				await fetchTutorData(paymentRecord.tutor_id);
				await updatePaymentStatus(paymentRecord);
			} else {
				console.error("Payment record not found");
				router.push("/checkout/failure");
			}
		} catch (error) {
			console.error("Error fetching payment data:", error);
			router.push("/checkout/failure");
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
		} catch (error) {
			console.error("Error updating payment status:", error);
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
						{tutor && (
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
											{paymentId || "N/A"}
										</p>
									</div>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Next Steps */}
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
