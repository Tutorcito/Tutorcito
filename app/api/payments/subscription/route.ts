import { NextRequest, NextResponse } from "next/server";
import { mercadoPagoService } from "@/lib/mercadopago-service";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { userId, userEmail, cardToken } = body;

		const result = await mercadoPagoService.createSubscription({
			userId,
			userEmail,
			cardToken,
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error("Subscription API error:", error);
		return NextResponse.json(
			{ error: "Subscription creation failed" },
			{ status: 500 }
		);
	}
}
