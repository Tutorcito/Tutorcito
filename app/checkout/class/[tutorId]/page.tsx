"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Clock, ArrowLeft, CreditCard, User } from "lucide-react";
import Image from "next/image";

interface TutorData {
	id: string;
	full_name: string;
	profile_picture: string;
	prices: Array<{ price: string; duration: string }>;
	calendly_link: string;
	phone_number: string;
}

interface ParsedPrice {
	duration_minutes: number;
	price_ars: number;
	original: { price: string; duration: string };
}

export default function CheckoutPage() {
	const params = useParams();
	const router = useRouter();
	const tutorId = typeof params?.tutorId === "string" ? params.tutorId : "";

	const [tutor, setTutor] = useState<TutorData | null>(null);
	const [parsedPrices, setParsedPrices] = useState<ParsedPrice[]>([]);
	const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
	const [selectedPrice, setSelectedPrice] = useState<number>(0);
	const [loading, setLoading] = useState(true);
	const [processingPayment, setProcessingPayment] = useState(false);
	const [user, setUser] = useState<any>(null);

	useEffect(() => {
		fetchTutorData();
		fetchCurrentUser();
	}, [tutorId]);

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
			.select("full_name, profile_picture")
			.eq("id", user.id)
			.single();

		setUser({
			...user,
			profile: profile,
		});
	};

	const fetchTutorData = async () => {
		if (!tutorId) return;

		const { data, error } = await supabase
			.from("profiles")
			.select(
				"id, full_name, profile_picture, prices, calendly_link, phone_number"
			)
			.eq("id", tutorId)
			.in("role", ["tutor", "ambos"])
			.single();

		if (error || !data) {
			console.error("Error fetching tutor:", error);
			router.push("/");
			return;
		}

		setTutor(data);

		// Parse prices
		if (data.prices && Array.isArray(data.prices)) {
			const parsed = data.prices.map((item: any) => ({
				duration_minutes: parseInt(item.duration.replace(" min", "")),
				price_ars: parseFloat(
					item.price.replace("ARS ", "").replace(".", "").replace(",", ".")
				),
				original: item,
			}));
			setParsedPrices(parsed);
		}

		setLoading(false);
	};

	const handleDurationSelect = (duration: number, price: number) => {
		setSelectedDuration(duration);
		setSelectedPrice(price);
	};

	const createPaymentPreference = async () => {
		if (!selectedDuration || !selectedPrice || !user || !tutor) return null;

		const externalReference = `class-${tutorId}-${user.id}-${Date.now()}`;

		const preference = {
			items: [
				{
					id: `tutoria-${tutorId}-${selectedDuration}`,
					title: `Tutoría con ${tutor.full_name}`,
					description: `Sesión de ${selectedDuration} minutos`,
					quantity: 1,
					unit_price: selectedPrice,
					currency_id: "ARS",
				},
			],
			back_urls: {
				success: `${window.location.origin}/checkout/success`,
				failure: `${window.location.origin}/checkout/failure`,
				pending: `${window.location.origin}/checkout/pending`,
			},
			external_reference: externalReference,
			payer: {
				email: user.email,
			},
			payment_methods: {
				excluded_payment_types: [],
				excluded_payment_methods: [],
				installments: 12,
			},
			notification_url: `${window.location.origin}/api/webhooks/mercadopago`,
			statement_descriptor: "TUTORCITO",
			metadata: {
				student_id: user.id,
				tutor_id: tutorId,
				duration_minutes: selectedDuration.toString(),
				payment_type: "class",
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

	const handlePayment = async () => {
		if (!selectedDuration || !selectedPrice || !user || !tutor) return;

		setProcessingPayment(true);

		try {
			// Create payment preference using backend API
			const preferenceData = await createPaymentPreference();

			if (!preferenceData || !preferenceData.init_point) {
				throw new Error("No se pudo crear la preferencia de pago");
			}

			const externalReference = `class-${tutorId}-${user.id}-${Date.now()}`;

			// Store payment record in database
			const { error: insertError } = await supabase
				.from("payment_transactions")
				.insert({
					student_id: user.id,
					tutor_id: tutorId,
					external_reference: externalReference,
					payment_type: "class",
					amount: selectedPrice,
					status: "pending",
					class_duration_minutes: selectedDuration,
					description: `Tutoría de ${selectedDuration} minutos con ${tutor.full_name}`,
					metadata: {
						preference_id: preferenceData.id,
					},
				});

			if (insertError) {
				console.error("Error storing payment record:", insertError);
				// Continue anyway as the payment preference was created
			}

			// Redirect to MercadoPago checkout
			window.location.href = preferenceData.init_point;
		} catch (error: any) {
			console.error("Payment error:", error);
			alert(`Error al procesar el pago: ${error.message}`);
		} finally {
			setProcessingPayment(false);
		}
	};

    const handleTestPayment = async () => {
			if (process.env.NODE_ENV !== "development") return;

			if (!selectedDuration || !selectedPrice || !user || !tutor) return;

			setProcessingPayment(true);

			try {
				const externalReference = `class-${tutorId}-${user.id}-${Date.now()}`;

				// Store payment record in database as "approved"
				const { error: insertError } = await supabase
					.from("payment_transactions")
					.insert({
						student_id: user.id,
						tutor_id: tutorId,
						external_reference: externalReference,
						payment_type: "class",
						amount: selectedPrice,
						status: "approved",
						class_duration_minutes: selectedDuration,
						description: `TEST: Tutoría de ${selectedDuration} minutos con ${tutor.full_name}`,
						mercadopago_payment_id: `test-${Date.now()}`,
						paid_at: new Date().toISOString(),
					});

				if (insertError) {
					throw insertError;
				}

				// Redirect to success page with test parameters
				router.push(
					`/checkout/success?payment_id=test-${Date.now()}&status=approved&external_reference=${externalReference}`
				);
			} catch (error: any) {
				console.error("Test payment error:", error);
				alert(`Error en pago de prueba: ${error.message}`);
			} finally {
				setProcessingPayment(false);
			}
		}; 

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p>Cargando información del tutor...</p>
				</div>
			</div>
		);
	}

	if (!tutor) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-600">Tutor no encontrado</p>
					<Button onClick={() => router.push("/")} className="mt-4">
						Volver al inicio
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-4xl mx-auto px-4">
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
					<h1 className="text-3xl font-bold text-gray-900">Reservar Tutoría</h1>
					<p className="text-gray-600">
						Selecciona la duración y procede con el pago
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-8">
					{/* Tutor Info */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-3">
								<User className="h-5 w-5" />
								Información del Tutor
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-4 mb-4">
								<div className="w-16 h-16 rounded-full overflow-hidden">
									<Image
										src={tutor.profile_picture || "/logo.png"}
										alt={tutor.full_name}
										width={64}
										height={64}
										className="w-full h-full object-cover"
									/>
								</div>
								<div>
									<h3 className="font-semibold text-lg">{tutor.full_name}</h3>
									<p className="text-gray-600">Tutor verificado</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Duration Selection */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-3">
								<Clock className="h-5 w-5" />
								Seleccionar Duración
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{parsedPrices.map((option, index) => (
									<div
										key={index}
										className={`p-4 border rounded-lg cursor-pointer transition-colors ${
											selectedDuration === option.duration_minutes
												? "border-blue-500 bg-blue-50"
												: "border-gray-200 hover:border-gray-300"
										}`}
										onClick={() =>
											handleDurationSelect(
												option.duration_minutes,
												option.price_ars
											)
										}
									>
										<div className="flex justify-between items-center">
											<div>
												<p className="font-medium">
													{option.original.duration}
												</p>
												<p className="text-sm text-gray-600">
													Sesión individual
												</p>
											</div>
											<div className="text-right">
												<p className="font-bold text-lg">
													{option.original.price}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Payment Section */}
				{selectedDuration && (
					<Card className="mt-8">
						<CardHeader>
							<CardTitle className="flex items-center gap-3">
								<CreditCard className="h-5 w-5" />
								Resumen del Pago
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
									<div>
										<p className="font-medium">
											Tutoría de {selectedDuration} minutos
										</p>
										<p className="text-sm text-gray-600">
											con {tutor.full_name}
										</p>
									</div>
									<p className="font-bold text-xl">
										ARS ${selectedPrice.toLocaleString()}
									</p>
								</div>

								<div className="pt-4 border-t">
									<Button
										onClick={handlePayment}
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

                                    <div className="mt-4">
                                    {process.env.NODE_ENV === 'development' && (
                                        <Button
                                            onClick={handleTestPayment}
                                            variant="outline"
                                            className="w-full mt-2 border-green-500 text-green-600 hover:bg-green-50"
                                            disabled={processingPayment || !selectedDuration}
                                        >
                                            🧪 Test Payment (Dev Only)
                                        </Button>
                                    )}
                                    </div>
								</div>

								<div className="text-center">
									<p className="text-xs text-gray-500">
										Serás redirigido a MercadoPago para completar el pago de
										forma segura
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
