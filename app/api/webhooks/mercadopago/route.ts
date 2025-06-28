import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { MercadoPagoConfig, Payment } from "mercadopago";

// Initialize MercadoPago client
const client = new MercadoPagoConfig({
	accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(request: NextRequest) {
	try {
		console.log("🔔 Webhook received from MercadoPago");

		const body = await request.json();
		console.log("Webhook body:", body);

		// MercadoPago sends different types of notifications
		const { type, data } = body;

		switch (type) {
			case "payment":
				await handlePaymentNotification(data.id);
				break;
			case "subscription_preapproval":
				await handleSubscriptionNotification(data.id);
				break;
			default:
				console.log("📝 Unhandled webhook type:", type);
		}

		// ALWAYS return 200 to acknowledge receipt
		return NextResponse.json({ received: true }, { status: 200 });
	} catch (error) {
		console.error("❌ Webhook error:", error);
		// Still return 200 to prevent MercadoPago from retrying
		return NextResponse.json(
			{ error: "Webhook processing failed" },
			{ status: 200 }
		);
	}
}

async function handlePaymentNotification(paymentId: string) {
	try {
		console.log("💳 Processing payment notification for ID:", paymentId);

		// Get payment details from MercadoPago
		const payment = new Payment(client);
		const paymentData = await payment.get({ id: paymentId });

		console.log("Payment status:", paymentData.status);
		console.log("External reference:", paymentData.external_reference);

		// Find the payment in your database
		const { data: existingPayment, error: findError } = await supabase
			.from("payment_transactions")
			.select("*")
			.or(
				`mercadopago_payment_id.eq.${paymentId},external_reference.eq.${paymentData.external_reference}`
			)
			.single();

		if (findError || !existingPayment) {
			console.error("❌ Payment not found in database:", paymentId);
			return;
		}

		// Update payment status in your database
		const updateData: any = {
			status: paymentData.status,
			mercadopago_payment_id: paymentId,
			updated_at: new Date().toISOString(),
		};

		// If payment is approved, set paid_at timestamp
		if (paymentData.status === "approved") {
			updateData.paid_at = new Date().toISOString();
			console.log("✅ Payment approved!");
		}

		const { error: updateError } = await supabase
			.from("payment_transactions")
			.update(updateData)
			.eq("id", existingPayment.id);

		if (updateError) {
			console.error("❌ Error updating payment:", updateError);
			return;
		}

		// Handle specific actions based on payment type and status
		if (paymentData.status === "approved") {
			if (existingPayment.payment_type === "subscription") {
				// Activate premium for subscription payments
				await activatePremiumSubscription(existingPayment.student_id);
			}
			// For class payments, the user can already access the tutor info
		}

		console.log("✅ Payment notification processed successfully");
	} catch (error) {
		console.error("❌ Error handling payment notification:", error);
	}
}

async function handleSubscriptionNotification(subscriptionId: string) {
	try {
		console.log(
			"🔔 Processing subscription notification for ID:",
			subscriptionId
		);

		// Update subscription status in your database
		// You can expand this based on your subscription logic
	} catch (error) {
		console.error("❌ Error handling subscription notification:", error);
	}
}

async function activatePremiumSubscription(userId: string) {
	try {
		console.log("⭐ Activating premium subscription for user:", userId);

		const { error } = await supabase
			.from("profiles")
			.update({
				sponsored: true,
			})
			.eq("id", userId);

		if (error) {
			console.error("❌ Error activating premium subscription:", error);
		} else {
			console.log("✅ Premium subscription activated!");
		}
	} catch (error) {
		console.error("❌ Error in activatePremiumSubscription:", error);
	}
}
