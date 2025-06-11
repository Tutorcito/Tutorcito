import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { parseTutorPricing, TutorPricing } from "@/lib/pricing-utils";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ tutorId: string }> }
) {
	try {
		const resolvedParams = await params;
		const tutorId = resolvedParams.tutorId;

		const { data: tutorProfile, error } = await supabase
			.from("profiles")
			.select("prices")
			.eq("id", tutorId)
			.eq("role", "tutor")
			.single();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		if (!tutorProfile?.prices) {
			return NextResponse.json({ error: "No pricing found" }, { status: 404 });
		}

		// Parse and return the pricing in a consistent format
		const parsedPricing = parseTutorPricing(
			tutorProfile.prices as TutorPricing[]
		);

		return NextResponse.json(parsedPricing);
	} catch (error) {
		console.error("Get tutor pricing error:", error);
		return NextResponse.json(
			{ error: "Failed to get tutor pricing" },
			{ status: 500 }
		);
	}
}

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ tutorId: string }> }
) {
	try {
		const resolvedParams = await params;
		const tutorId = resolvedParams.tutorId;
		const body = await request.json();
		const { pricing } = body; // Expected to be in your JSON format

		const { data, error } = await supabase
			.from("profiles")
			.update({
				prices: pricing,
				updated_at: new Date(),
			})
			.eq("id", tutorId)
			.eq("role", "tutor")
			.select()
			.single();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json(data);
	} catch (error) {
		console.error("Set tutor pricing error:", error);
		return NextResponse.json(
			{ error: "Failed to set tutor pricing" },
			{ status: 500 }
		);
	}
}
