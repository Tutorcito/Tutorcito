"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function PaymentFailurePage() {
	const router = useRouter();

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-2xl mx-auto px-4">
				<div className="text-center mb-8">
					<div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
						<XCircle className="w-8 h-8 text-red-600" />
					</div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Pago Rechazado
					</h1>
					<p className="text-gray-600">Hubo un problema procesando tu pago</p>
				</div>

				<Card className="mb-6">
					<CardHeader>
						<CardTitle>¿Qué pasó?</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<p className="text-gray-700">
								Tu pago no pudo ser procesado. Esto puede deberse a:
							</p>
							<ul className="list-disc list-inside space-y-2 text-gray-600">
								<li>Fondos insuficientes en tu tarjeta</li>
								<li>Datos incorrectos de la tarjeta</li>
								<li>Tu banco rechazó la transacción</li>
								<li>Problemas técnicos temporales</li>
							</ul>
						</div>
					</CardContent>
				</Card>

				<div className="space-y-3">
					<Button
						onClick={() => router.back()}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white"
					>
						<RefreshCw className="mr-2 h-4 w-4" />
						Intentar Nuevamente
					</Button>

					<Button
						onClick={() => router.push("/")}
						variant="outline"
						className="w-full"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Volver al Inicio
					</Button>
				</div>

				<div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
					<p className="text-yellow-800 text-sm">
						<strong>¿Necesitas ayuda?</strong> Si el problema persiste, puedes
						contactarnos o intentar con otro método de pago.
					</p>
				</div>
			</div>
		</div>
	);
}
