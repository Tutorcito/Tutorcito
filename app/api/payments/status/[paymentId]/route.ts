import { NextRequest, NextResponse } from "next/server";
import { mercadoPagoService } from "@/lib/mercadopago-service";

export async function GET(
	request: NextRequest,
	{ params }: { params: { paymentId: string } }
) {
	try {
		const payment = await mercadoPagoService.getPaymentStatus(params.paymentId);
		return NextResponse.json({
			status: payment.status,
			status_detail: payment.status_detail,
			id: payment.id,
		});
	} catch (error) {
		console.error("Payment status API error:", error);
		return NextResponse.json(
			{ error: "Failed to get payment status" },
			{ status: 500 }
		);
	}
}
