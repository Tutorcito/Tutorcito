"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Home, RefreshCw } from "lucide-react";

export default function PaymentPendingPage() {
	const router = useRouter();

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-2xl mx-auto px-4">
				<div className="text-center mb-8">
					<div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
						<Clock className="w-8 h-8 text-yellow-600" />
					</div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Pago Pendiente
					</h1>
					<p className="text-gray-600">Tu pago está siendo procesado</p>
				</div>

				<Card className="mb-6">
					<CardHeader>
						<CardTitle>Procesando tu Pago</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<p className="text-gray-700">
								Tu pago está siendo verificado por MercadoPago. Esto puede tomar
								unos minutos.
							</p>

							<div className="bg-blue-50 p-4 rounded-lg">
								<h3 className="font-semibold text-blue-900 mb-2">
									¿Qué sucede ahora?
								</h3>
								<ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
									<li>Recibirás una confirmación por email</li>
									<li>Te notificaremos cuando el pago sea aprobado</li>
									<li>
										Podrás acceder a los datos del tutor una vez confirmado
									</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="space-y-3">
					<Button
						onClick={() => window.location.reload()}
						className="w-full bg-blue-600 hover:bg-blue-700"
					>
						<RefreshCw className="mr-2 h-4 w-4" />
						Verificar Estado
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

				<div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
					<p className="text-gray-700 text-sm">
						<strong>Tiempo estimado:</strong> La verificación puede tomar entre
						2-10 minutos. Si después de 15 minutos no tienes respuesta, contacta
						con soporte.
					</p>
				</div>
			</div>
		</div>
	);
}
