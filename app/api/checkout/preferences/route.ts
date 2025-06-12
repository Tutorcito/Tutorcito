import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
	accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
	options: {
		timeout: 5000,
	},
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		// Validate required fields
		if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
			return NextResponse.json(
				{ error: "Items are required" },
				{ status: 400 }
			);
		}

		// Validate each item
		for (const item of body.items) {
			if (!item.title || !item.quantity || !item.unit_price) {
				return NextResponse.json(
					{ error: "Each item must have title, quantity, and unit_price" },
					{ status: 400 }
				);
			}
		}

		// Validate back_urls
		if (!body.back_urls || !body.back_urls.success) {
			return NextResponse.json(
				{ error: "Back URLs are required" },
				{ status: 400 }
			);
		}

		const preference = new Preference(client);

		// Ensure all back URLs are properly defined
		const backUrls = {
			success: body.back_urls.success,
			failure: body.back_urls.failure || body.back_urls.success,
			pending: body.back_urls.pending || body.back_urls.success,
		};

		const preferenceData = {
			items: body.items.map((item: any) => ({
				id: item.id || `item-${Date.now()}`,
				title: item.title,
				description: item.description || "",
				quantity: parseInt(item.quantity),
				unit_price: parseFloat(item.unit_price),
				currency_id: item.currency_id || "ARS",
			})),
			back_urls: backUrls,
			// Remove auto_return for now to avoid the error
			// auto_return: "approved",
			external_reference: body.external_reference,
			notification_url: body.notification_url,
			statement_descriptor: body.statement_descriptor || "TUTORCITO",
			payment_methods: {
				excluded_payment_types: [],
				excluded_payment_methods: [],
				installments: body.payment_methods?.installments || 12,
			},
			payer: {
				email: body.payer?.email || "",
			},
			metadata: body.metadata || {},
		};

		console.log(
			"Creating preference with data:",
			JSON.stringify(preferenceData, null, 2)
		);

		const result = await preference.create({ body: preferenceData });

		console.log("Preference created successfully:", result);

		return NextResponse.json({
			id: result.id,
			init_point: result.init_point,
			sandbox_init_point: result.sandbox_init_point,
		});
	} catch (error: any) {
		console.error("Preference creation error:", error);

		// Handle MercadoPago API errors
		if (error.cause && error.cause.length > 0) {
			const mpError = error.cause[0];
			return NextResponse.json(
				{
					error: `MercadoPago Error: ${mpError.description || mpError.message}`,
					details: mpError,
				},
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{
				error: "Failed to create payment preference",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
