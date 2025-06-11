"use client";

import { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Loader2, Clock, CreditCard, Calendar } from "lucide-react";
import {
	CardNumber,
	SecurityCode,
	ExpirationDate,
	createCardToken,
} from "@mercadopago/sdk-react";
import { supabase } from "@/lib/supabase";

interface ParsedPricing {
	duration_minutes: number;
	price_ars: number;
	original: {
		price: string;
		duration: string;
	};
}

interface ClassPaymentDialogProps {
	tutorId: string;
	tutorName: string;
	calendlyLink: string;
	studentId: string;
	studentEmail: string;
	trigger?: React.ReactNode;
}

export default function ClassPaymentDialog({
	tutorId,
	tutorName,
	calendlyLink,
	studentId,
	studentEmail,
	trigger,
}: ClassPaymentDialogProps) {
	const [open, setOpen] = useState(false);
	const [step, setStep] = useState<"select" | "payment" | "success">("select");
	const [loading, setLoading] = useState(false);
	const [pricing, setPricing] = useState<ParsedPricing[]>([]);
	const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
	const [selectedPrice, setSelectedPrice] = useState<number>(0);
	const [paymentData, setPaymentData] = useState({
		cardholderName: "",
		email: studentEmail,
		docType: "DNI",
		docNumber: "",
		installments: 1,
	});

	// Load tutor pricing when dialog opens
	useEffect(() => {
		if (open) {
			loadTutorPricing();
		}
	}, [open]);

	const loadTutorPricing = async () => {
		try {
			const response = await fetch(`/api/tutors/${tutorId}/pricing`);
			const data = await response.json();
			setPricing(data);
		} catch (error) {
			console.error("Error loading pricing:", error);
		}
	};

	const handleDurationSelect = (duration: number) => {
		setSelectedDuration(duration);
		const selected = pricing.find((p) => p.duration_minutes === duration);
		setSelectedPrice(selected?.price_ars || 0);
	};

	const handlePayment = async () => {
		if (!selectedDuration || !selectedPrice) return;

		setLoading(true);

		try {
			// Create card token
			const token = await createCardToken({
				cardholderName: paymentData.cardholderName,
				identificationType: paymentData.docType,
				identificationNumber: paymentData.docNumber,
			});

			// Process payment
			const response = await fetch("/api/payments/class", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					studentId,
					tutorId,
					durationMinutes: selectedDuration,
					studentEmail,
					cardToken: token?.id,
					installments: paymentData.installments,
				}),
			});

			const result = await response.json();

			if (result.success && result.status === "approved") {
				setStep("success");
			} else {
				throw new Error(result.error || "Payment failed");
			}
		} catch (error) {
			console.error("Payment error:", error);
			alert("Error al procesar el pago. Intenta nuevamente.");
		} finally {
			setLoading(false);
		}
	};

	const openCalendly = () => {
		window.open(calendlyLink, "_blank");
		setOpen(false);
		setStep("select");
	};

	const resetDialog = () => {
		setStep("select");
		setSelectedDuration(null);
		setSelectedPrice(0);
		setPaymentData((prev) => ({ ...prev, cardholderName: "", docNumber: "" }));
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
				if (!isOpen) resetDialog();
			}}
		>
			<DialogTrigger asChild>
				{trigger || (
					<Button className="w-full">
						<Calendar className="mr-2 h-4 w-4" />
						Agendar Tutoría
					</Button>
				)}
			</DialogTrigger>

			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>
						{step === "select" && "Seleccionar Duración"}
						{step === "payment" && "Procesar Pago"}
						{step === "success" && "¡Pago Exitoso!"}
					</DialogTitle>
				</DialogHeader>

				{/* Step 1: Duration Selection */}
				{step === "select" && (
					<div className="space-y-4">
						<p className="text-sm text-muted-foreground">
							Selecciona la duración de tu tutoría con {tutorName}
						</p>

						<div className="grid gap-3">
							{pricing.map((option, index) => (
								<Card
									key={index}
									className={`cursor-pointer transition-colors ${
										selectedDuration === option.duration_minutes
											? "ring-2 ring-primary"
											: "hover:bg-muted/50"
									}`}
									onClick={() => handleDurationSelect(option.duration_minutes)}
								>
									<CardContent className="flex items-center justify-between p-4">
										<div className="flex items-center space-x-2">
											<Clock className="h-4 w-4 text-muted-foreground" />
											<span>{option.original.duration}</span>
										</div>
										<span className="font-semibold">
											{option.original.price}
										</span>
									</CardContent>
								</Card>
							))}
						</div>

						<Button
							className="w-full"
							onClick={() => setStep("payment")}
							disabled={!selectedDuration}
						>
							Continuar al Pago
						</Button>
					</div>
				)}

				{/* Step 2: Payment Form */}
				{step === "payment" && (
					<div className="space-y-4">
						<div className="flex items-center justify-between p-4 bg-muted rounded-lg">
							<span>Tutoría de {selectedDuration} minutos</span>
							<span className="font-semibold">
								ARS ${selectedPrice.toLocaleString()}
							</span>
						</div>

						<div className="space-y-4">
							<div>
								<Label>Número de Tarjeta</Label>
								<CardNumber placeholder="0000 0000 0000 0000" />
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label>Código de Seguridad</Label>
									<SecurityCode placeholder="123" />
								</div>
								<div>
									<Label>Vencimiento</Label>
									<ExpirationDate placeholder="MM/AA" />
								</div>
							</div>

							<div>
								<Label>Titular de la Tarjeta</Label>
								<Input
									value={paymentData.cardholderName}
									onChange={(e) =>
										setPaymentData((prev) => ({
											...prev,
											cardholderName: e.target.value,
										}))
									}
									placeholder="Nombre completo"
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label>Tipo de Documento</Label>
									<Select
										value={paymentData.docType}
										onValueChange={(value) =>
											setPaymentData((prev) => ({
												...prev,
												docType: value,
											}))
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="DNI">DNI</SelectItem>
											<SelectItem value="CUIT">CUIT</SelectItem>
											<SelectItem value="CUIL">CUIL</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label>Número de Documento</Label>
									<Input
										value={paymentData.docNumber}
										onChange={(e) =>
											setPaymentData((prev) => ({
												...prev,
												docNumber: e.target.value,
											}))
										}
										placeholder="12345678"
									/>
								</div>
							</div>

							<div>
								<Label>Cuotas</Label>
								<Select
									value={paymentData.installments.toString()}
									onValueChange={(value) =>
										setPaymentData((prev) => ({
											...prev,
											installments: parseInt(value),
										}))
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="1">1 cuota sin interés</SelectItem>
										<SelectItem value="3">3 cuotas</SelectItem>
										<SelectItem value="6">6 cuotas</SelectItem>
										<SelectItem value="12">12 cuotas</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="flex gap-2">
							<Button
								variant="outline"
								onClick={() => setStep("select")}
								disabled={loading}
							>
								Volver
							</Button>
							<Button
								className="flex-1"
								onClick={handlePayment}
								disabled={
									loading ||
									!paymentData.cardholderName ||
									!paymentData.docNumber
								}
							>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Procesando...
									</>
								) : (
									<>
										<CreditCard className="mr-2 h-4 w-4" />
										Pagar ARS ${selectedPrice.toLocaleString()}
									</>
								)}
							</Button>
						</div>
					</div>
				)}

				{/* Step 3: Success & Calendly */}
				{step === "success" && (
					<div className="text-center space-y-4">
						<div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
							<Calendar className="w-6 h-6 text-green-600" />
						</div>

						<div>
							<h3 className="text-lg font-semibold">¡Pago exitoso!</h3>
							<p className="text-muted-foreground">
								Tu pago de ARS ${selectedPrice.toLocaleString()} ha sido
								procesado correctamente.
							</p>
						</div>

						<Button className="w-full" onClick={openCalendly}>
							<Calendar className="mr-2 h-4 w-4" />
							Agendar en Calendly
						</Button>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
