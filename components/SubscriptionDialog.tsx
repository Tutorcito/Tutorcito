"use client";

import { useState } from "react";
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

			success("¡Estado premium activado!");

			// Close dialog and redirect to subscription page
			onClose();
			router.push("https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808497c19ac40197cb1b08c50451");
		} catch (err) {
			console.error("Error activating subscription:", err);
			error("Error al activar el estado premium. Intenta nuevamente.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
				<DialogHeader className="space-y-3 sm:space-y-4">
					<DialogTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl text-center sm:text-left">
						<Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 flex-shrink-0" />
						<span className="leading-tight">Plan Premium Tutorcito</span>
					</DialogTitle>
					<DialogDescription className="text-sm sm:text-base text-center sm:text-left">
						Mejora tu visibilidad y llega a más estudiantes con nuestro plan
						premium
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 sm:space-y-6 mt-4">
					{/* Price Display - Responsive */}
					<div className="text-center py-3 sm:py-4 bg-blue-50 rounded-lg">
						<p className="text-2xl sm:text-3xl font-bold text-blue-600">
							ARS $5,000
						</p>
						<p className="text-sm sm:text-base text-gray-600">por mes</p>
					</div>

					{/* Benefits List - Responsive */}
					<div className="space-y-3 sm:space-y-4">
						<h3 className="font-semibold text-base sm:text-lg text-center sm:text-left">
							¿Qué incluye el plan premium?
						</h3>
						<div className="space-y-2 sm:space-y-3">
							<div className="flex items-start gap-2 sm:gap-3">
								<Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
								<span className="text-sm sm:text-base leading-relaxed">
									🎯 Mayor visibilidad en los resultados de búsqueda
								</span>
							</div>
							<div className="flex items-start gap-2 sm:gap-3">
								<Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
								<span className="text-sm sm:text-base leading-relaxed">
									⭐ Aparición en la sección "Tutores Patrocinados"
								</span>
							</div>
							<div className="flex items-start gap-2 sm:gap-3">
								<Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
								<span className="text-sm sm:text-base leading-relaxed">
									💰 Te quedás con el 100% de lo que generás
								</span>
							</div>
							<div className="flex items-start gap-2 sm:gap-3">
								<Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
								<span className="text-sm sm:text-base leading-relaxed">
									📈 Mejor porcentaje de conversión
								</span>
							</div>
						</div>
					</div>

					{/* Process Explanation - Responsive */}
					<div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
						<h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">
							¿Cómo funciona?
						</h4>
						<ol className="text-xs sm:text-sm text-blue-800 space-y-1 leading-relaxed">
							<li>1. Tu estado premium se activará inmediatamente</li>
							<li>
								2. Serás redirigido a la página de pago para completar la
								suscripción
							</li>
							<li>3. Podés cancelar en cualquier momento desde tu perfil</li>
						</ol>
					</div>

					{/* Subscribe Button - Responsive */}
					<div className="pt-2">
						<Button
							onClick={handleSubscribeClick}
							disabled={loading}
							className="w-full bg-blue-600 hover:bg-blue-700 text-white 
                       py-3 sm:py-3 
                       text-sm sm:text-base lg:text-lg 
                       font-semibold 
                       h-12 sm:h-14
                       transition-all duration-200"
						>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
									<span className="text-xs sm:text-sm lg:text-base">
										Activando premium...
									</span>
								</>
							) : (
								<>
									<CreditCard className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
									<span className="text-xs sm:text-sm lg:text-base leading-tight">
										Activar Premium y Continuar al Pago
									</span>
								</>
							)}
						</Button>
					</div>

					{/* Small disclaimer text - Responsive */}
					<p className="text-center text-xs sm:text-sm text-gray-500 leading-relaxed px-2">
						Al activar el plan premium, aceptás que tu perfil sea destacado
						inmediatamente. El pago se procesará en la siguiente pantalla.
					</p>
				</div>
			</DialogContent>
		</Dialog>
	);
}
