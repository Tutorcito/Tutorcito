"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Star, Check, CreditCard, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";

interface SubscriptionDialogProps {
	isOpen: boolean;
	onClose: () => void;
	user: any;
}

export default function SubscriptionDialog({
	isOpen,
	onClose,
	user,
}: SubscriptionDialogProps) {
	const [loading, setLoading] = useState(false);
	const { success, error } = useToast();
	const router = useRouter();

	// Load MercadoPago script when dialog opens
	useEffect(() => {
		if (isOpen && typeof window !== "undefined") {
			loadMercadoPagoScript();
		}
	}, [isOpen]);

	const loadMercadoPagoScript = () => {
		if (window.$MPC_loaded) return;

		const script = document.createElement("script");
		script.type = "text/javascript";
		script.async = true;
		script.src =
			document.location.protocol + "//secure.mlstatic.com/mptools/render.js";

		const firstScript = document.getElementsByTagName("script")[0];
		firstScript.parentNode?.insertBefore(script, firstScript);

		window.$MPC_loaded = true;

		// Listen for MercadoPago modal close events
		window.addEventListener("message", handleMercadoPagoMessage);
	};

	const handleMercadoPagoMessage = (event: MessageEvent) => {
		// Handle MercadoPago callback messages
		console.log("MercadoPago message received:", event.data);

		// You can handle success/failure messages here if needed
		if (event.data && event.data.includes("preapproval_id")) {
			success("¡Suscripción procesada! Redirigiendo...");
			setTimeout(() => {
				router.push("/");
			}, 2000);
		}
	};

	const handleSubscribeClick = async () => {
		if (!user) {
			error("Debes estar logueado para suscribirte");
			return;
		}

		setLoading(true);

		try {
			// Update sponsored status immediately
			const { error: updateError } = await supabase
				.from("profiles")
				.update({
					sponsored: true,
					updated_at: new Date().toISOString(),
				})
				.eq("id", user.id);

			if (updateError) {
				throw updateError;
			}

			// // Create a transaction record for tracking
			// const externalReference = `subscription-${user.id}-${Date.now()}`;

			// await supabase.from("payment_transactions").insert({
			// 	student_id: user.id,
			// 	external_reference: externalReference,
			// 	payment_type: "subscription",
			// 	amount: 5000,
			// 	status: "pending",
			// 	description: "Plan Premium Tutorcito - Suscripción MP",
			// 	metadata: {
			// 		mercadopago_plan_id: "2c93808497c19ac40197cb1b08c50451",
			// 		direct_mp_subscription: true,
			// 	},
			// });

			success("¡Estado premium activado! Serás redirigido a MercadoPago...");

			// Small delay to show the success message before redirect
			setTimeout(() => {
				// Trigger the MercadoPago subscription
				window.open(
					"https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808497c19ac40197cb1b08c50451",
					"_self"
				);
			}, 1500);
		} catch (err) {
			console.error("Error activating subscription:", err);
			error("Error al procesar la suscripción. Intenta nuevamente.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="sm:max-w-[600px] bg-white">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-3 text-2xl">
							<Star className="h-6 w-6 text-yellow-500" />
							Plan Premium Tutorcito
						</DialogTitle>
						<DialogDescription className="text-base">
							Mejora tu visibilidad y llega a más estudiantes con nuestro plan
							premium
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-6">
						{/* Price Display */}
						<div className="text-center py-4 bg-blue-50 rounded-lg">
							<p className="text-3xl font-bold text-blue-600">ARS $5,000</p>
							<p className="text-gray-600">por mes</p>
						</div>

						{/* Benefits List */}
						<div className="space-y-4">
							<h3 className="font-semibold text-lg">
								¿Qué incluye el plan premium?
							</h3>
							<div className="grid gap-3">
								<div className="flex items-center gap-3">
									<Check className="h-5 w-5 text-green-500" />
									<span>
										🎯 Mayor visibilidad en los resultados de búsqueda
									</span>
								</div>
								<div className="flex items-center gap-3">
									<Check className="h-5 w-5 text-green-500" />
									<span>⭐ Aparición en la sección "Tutores Patrocinados"</span>
								</div>
								<div className="flex items-center gap-3">
									<Check className="h-5 w-5 text-green-500" />
									<span>💰 Te quedás con el 100% de lo que generás</span>
								</div>
								<div className="flex items-center gap-3">
									<Check className="h-5 w-5 text-green-500" />
									<span>📈 Mejor porcentaje de conversión</span>
								</div>
								<div className="flex items-center gap-3">
									<Check className="h-5 w-5 text-green-500" />
									<span>🏆 Badge de "Tutor Premium" en tu perfil</span>
								</div>
								<div className="flex items-center gap-3">
									<Check className="h-5 w-5 text-green-500" />
									<span>🎧 Soporte prioritario</span>
								</div>
							</div>
						</div>

						{/* Process Explanation */}
						<div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
							<h4 className="font-medium text-yellow-900 mb-2">
								¿Cómo funciona?
							</h4>
							<ol className="text-sm text-yellow-800 space-y-1">
								<li>
									1. Al hacer clic en "Suscribirme", tu estado premium se activa
									inmediatamente
								</li>
								<li>
									2. Serás redirigido a MercadoPago para completar el pago de
									forma segura
								</li>
								<li>
									3. Podés cancelar tu suscripción en cualquier momento desde tu
									perfil
								</li>
							</ol>
						</div>

						{/* Custom MercadoPago Button */}
						<div className="space-y-3">
							<Button
								onClick={handleSubscribeClick}
								disabled={loading}
								className="w-full bg-[#3483FA] hover:bg-[#2a68c8] text-white py-3 text-lg font-semibold rounded-lg transition-colors duration-300"
							>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-5 w-5 animate-spin" />
										Activando premium...
									</>
								) : (
									<>
										<CreditCard className="mr-2 h-5 w-5" />
										Suscribirme al Plan Premium
									</>
								)}
							</Button>

							<p className="text-center text-xs text-gray-500">
								Serás redirigido a MercadoPago para completar el pago de forma
								segura
							</p>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Add the MercadoPago styles */}
			<style jsx>{`
				.blue-button {
					background-color: #3483fa;
					color: white;
					padding: 10px 24px;
					text-decoration: none;
					border-radius: 5px;
					display: inline-block;
					font-size: 16px;
					transition: background-color 0.3s;
					font-family: Arial, sans-serif;
				}
				.blue-button:hover {
					background-color: #2a68c8;
				}
			`}</style>
		</>
	);
}

// Extend window object for TypeScript
declare global {
	interface Window {
		$MPC_loaded?: boolean;
	}
}
