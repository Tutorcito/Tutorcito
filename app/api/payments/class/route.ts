import { NextRequest, NextResponse } from "next/server";
import { mercadoPagoService } from "@/lib/mercadopago-service";
import { supabase } from "@/lib/supabase";
import { findPriceByDuration, TutorPricing } from "@/lib/pricing-utils";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const {
			studentId,
			tutorId,
			durationMinutes,
			studentEmail,
			cardToken,
			installments,
		} = body;

		// Get tutor profile with pricing
		const { data: tutorProfile, error: tutorError } = await supabase
			.from("profiles")
			.select("prices")
			.eq("id", tutorId)
			.eq("role", "tutor")
			.single();

		if (tutorError || !tutorProfile) {
			return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
		}

		// Parse pricing and find the price for the requested duration
		const price = findPriceByDuration(
			tutorProfile.prices as TutorPricing[],
			durationMinutes
		);

		if (!price) {
			return NextResponse.json(
				{ error: "Pricing not found for this duration" },
				{ status: 404 }
			);
		}

		const result = await mercadoPagoService.createClassPayment({
			studentId,
			tutorId,
			amount: price,
			durationMinutes,
			studentEmail,
			cardToken,
			installments,
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error("Class payment API error:", error);
		return NextResponse.json(
			{ error: "Payment creation failed" },
			{ status: 500 }
		);
	}
}
