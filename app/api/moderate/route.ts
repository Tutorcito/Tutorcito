// app/api/moderate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { moderateContent } from "@/lib/moderation";

export async function POST(request: NextRequest) {
	try {
		const { text } = await request.json();

		if (!text || typeof text !== "string") {
			return NextResponse.json(
				{ error: "Text is required and must be a string" },
				{ status: 400 }
			);
		}

		if (text.length > 2000) {
			return NextResponse.json(
				{ error: "Text too long. Maximum 2000 characters." },
				{ status: 400 }
			);
		}

		const moderationResult = await moderateContent(text);

		return NextResponse.json({
			success: true,
			result: moderationResult,
		});
	} catch (error) {
		console.error("Moderation API error:", error);
		return NextResponse.json(
			{ error: "Internal server error during moderation" },
			{ status: 500 }
		);
	}
}
