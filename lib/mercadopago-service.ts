import { MercadoPagoConfig, Payment, PreApproval } from "mercadopago";
import { supabase } from "@/lib/supabase";

const client = new MercadoPagoConfig({
	accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
	options: {
		timeout: 5000,
	},
});

export interface ClassPaymentRequest {
	studentId: string;
	tutorId: string;
	amount: number;
	durationMinutes: number;
	studentEmail: string;
	cardToken: string;
	installments?: number;
}

export interface SubscriptionRequest {
	userId: string;
	userEmail: string;
	cardToken: string;
}

export class MercadoPagoService {
	private payment = new Payment(client);
	private preApproval = new PreApproval(client);

	async createClassPayment(request: ClassPaymentRequest) {
		try {
			const externalReference = `class-${request.tutorId}-${
				request.studentId
			}-${Date.now()}`;

			// First, get the tutor's MercadoPago user ID
			const { data: tutorProfile, error: tutorError } = await supabase
				.from("profiles")
				.select("mercadopago_user_id, full_name")
				.eq("id", request.tutorId)
				.single();

			if (tutorError || !tutorProfile) {
				throw new Error("Tutor not found");
			}

			// Check if tutor has MercadoPago integration
			if (!tutorProfile.mercadopago_user_id) {
				throw new Error("Tutor doesn't have MercadoPago integration set up");
			}

			// Calculate split amounts
			const platformFeePercentage = 4.5;
			const platformFee = Math.round(request.amount * (platformFeePercentage / 100));
			const tutorAmount = request.amount - platformFee;

			const paymentData = {
				transaction_amount: request.amount,
				token: request.cardToken,
				description: `Tutoría de ${request.durationMinutes} minutos con ${tutorProfile.full_name}`,
				installments: request.installments || 1,
				payment_method_id: "visa", // This will be determined by the card
				payer: {
					email: request.studentEmail,
				},
				external_reference: externalReference,
				notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/mercadopago`,
				// HERE'S THE KEY PART: Add application fee for split payment
				application_fee: platformFee,
				// Specify where the money should go (to the tutor)
				marketplace: "MARKETPLACE",
				// Additional metadata for tracking
				metadata: {
					student_id: request.studentId,
					tutor_id: request.tutorId,
					duration_minutes: request.durationMinutes,
					payment_type: "class",
					platform_fee: platformFee,
					tutor_amount: tutorAmount,
				},
			};

			const paymentPayload = {
				...paymentData,
				collector_id: tutorProfile.mercadopago_user_id,
			};

			console.log("Creating split payment:", {
				total: request.amount,
				platformFee,
				tutorAmount,
				tutorMercadoPagoId: tutorProfile.mercadopago_user_id
			});

			const payment = await this.payment.create({ body: paymentPayload });

			// Store payment in database
			const { data: paymentRecord, error } = await supabase
				.from("payment_transactions")
				.insert({
					student_id: request.studentId,
					tutor_id: request.tutorId,
					mercadopago_payment_id: payment.id?.toString(),
					external_reference: externalReference,
					payment_type: "class",
					amount: request.amount,
					status: payment.status || "pending",
					class_duration_minutes: request.durationMinutes,
					description: paymentData.description,
					metadata: {
						mercadopago_response: payment,
						platform_fee: platformFee,
						tutor_amount: tutorAmount,
						tutor_mercadopago_id: tutorProfile.mercadopago_user_id,
					},
				})
				.select()
				.single();

			if (error) {
				console.error("Database error:", error);
				throw new Error("Failed to store payment record");
			}

			return {
				success: true,
				payment_id: payment.id,
				status: payment.status,
				payment_record_id: paymentRecord.id,
				external_reference: externalReference,
				split_info: {
					total_amount: request.amount,
					platform_fee: platformFee,
					tutor_amount: tutorAmount,
				},
			};
		} catch (error) {
			console.error("Class payment creation error:", error);
			throw error;
		}
	}

	async createSubscription(request: SubscriptionRequest) {
		try {
			const externalReference = `subscription-${request.userId}-${Date.now()}`;

			const subscriptionData = {
				reason: "Plan Pro Tutorcito - Suscripción Mensual",
				external_reference: externalReference,
				payer_email: request.userEmail,
				card_token_id: request.cardToken,
				auto_recurring: {
					frequency: 1,
					frequency_type: "months" as const,
					transaction_amount: 5000,
					currency_id: "ARS" as const,
					start_date: new Date(Date.now() + 24 * 60 * 60 * 1000)
						.toISOString()
						.split("T")[0], // Tomorrow
				},
				back_url: `https://tutorcito.netlify.app/subscription/success`,
				notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/mercadopago`,
			};

			const subscription = await this.preApproval.create({
				body: subscriptionData,
			});

			// Store subscription in database
			const { data: subscriptionRecord, error } = await supabase
				.from("subscriptions")
				.insert({
					user_id: request.userId,
					mercadopago_subscription_id: subscription.id,
					status: subscription.status || "pending",
					amount: 5000,
					metadata: {
						mercadopago_response: subscription,
					},
				})
				.select()
				.single();

			if (error) {
				console.error("Database error:", error);
				throw new Error("Failed to store subscription record");
			}

			// Also create a payment transaction record for tracking
			await supabase.from("payment_transactions").insert({
				student_id: request.userId,
				mercadopago_payment_id: subscription.id,
				external_reference: externalReference,
				payment_type: "subscription",
				amount: 5000,
				status: subscription.status || "pending",
				description: "Plan Pro Tutorcito - Suscripción Mensual",
			});

			return {
				success: true,
				subscription_id: subscription.id,
				status: subscription.status,
				subscription_record_id: subscriptionRecord.id,
				external_reference: externalReference,
			};
		} catch (error) {
			console.error("Subscription creation error:", error);
			throw error;
		}
	}

	async getPaymentStatus(paymentId: string) {
		try {
			const payment = await this.payment.get({ id: paymentId });

			// Update payment status in database
			await supabase
				.from("payment_transactions")
				.update({
					status: payment.status || "unknown",
					paid_at: payment.status === "approved" ? new Date() : null,
					updated_at: new Date(),
				})
				.eq("mercadopago_payment_id", paymentId);

			return payment;
		} catch (error) {
			console.error("Get payment status error:", error);
			throw error;
		}
	}

	async cancelSubscription(subscriptionId: string) {
		try {
			const result = await this.preApproval.update({
				id: subscriptionId,
				body: { status: "cancelled" },
			});

			// Update subscription status in database
			await supabase
				.from("subscriptions")
				.update({
					status: "cancelled",
					cancelled_at: new Date(),
					updated_at: new Date(),
				})
				.eq("mercadopago_subscription_id", subscriptionId);

			return result;
		} catch (error) {
			console.error("Cancel subscription error:", error);
			throw error;
		}
	}
}

export const mercadoPagoService = new MercadoPagoService();
