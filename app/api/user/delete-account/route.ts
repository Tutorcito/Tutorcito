import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function DELETE(request: NextRequest) {
	try {
		const body = await request.json();
		const { userId, confirmationText } = body;

		// Validate confirmation text
		if (confirmationText !== "ELIMINAR") {
			return NextResponse.json(
				{ error: "Confirmation text is incorrect" },
				{ status: 400 }
			);
		}

		if (!userId) {
			return NextResponse.json(
				{ error: "User ID is required" },
				{ status: 400 }
			);
		}

		// Get user session to verify they are authenticated
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user || user.id !== userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		console.log(`Starting account deletion process for user: ${userId}`);

		// Step 1: Delete related data in correct order (due to foreign key constraints)
		// Using admin client to bypass RLS policies

		// Delete tutor comments made by this user
		const { error: commentsError } = await supabaseAdmin
			.from("tutor_comments")
			.delete()
			.eq("user_id", userId);

		if (commentsError) {
			console.error("Error deleting tutor comments:", commentsError);
		}

		// Delete tutor comments for this tutor (if they are a tutor)
		const { error: tutorCommentsError } = await supabaseAdmin
			.from("tutor_comments")
			.delete()
			.eq("tutor_id", userId);

		if (tutorCommentsError) {
			console.error("Error deleting comments for tutor:", tutorCommentsError);
		}

		// Delete tutor files
		const { error: filesError } = await supabaseAdmin
			.from("tutor_files")
			.delete()
			.eq("tutor_id", userId);

		if (filesError) {
			console.error("Error deleting tutor files:", filesError);
		}

		// Delete tutor subjects
		const { error: subjectsError } = await supabaseAdmin
			.from("tutor_subjects")
			.delete()
			.eq("tutor_id", userId);

		if (subjectsError) {
			console.error("Error deleting tutor subjects:", subjectsError);
		}

		// Delete payment transactions as student
		const { error: paymentsError } = await supabaseAdmin
			.from("payment_transactions")
			.delete()
			.eq("student_id", userId);

		if (paymentsError) {
			console.error("Error deleting payment transactions:", paymentsError);
		}

		// Delete payment transactions as tutor
		const { error: tutorPaymentsError } = await supabaseAdmin
			.from("payment_transactions")
			.delete()
			.eq("tutor_id", userId);

		if (tutorPaymentsError) {
			console.error(
				"Error deleting tutor payment transactions:",
				tutorPaymentsError
			);
		}

		// Step 2: Delete user profile
		const { error: profileError } = await supabaseAdmin
			.from("profiles")
			.delete()
			.eq("id", userId);

		if (profileError) {
			console.error("Error deleting user profile:", profileError);
			return NextResponse.json(
				{ error: "Failed to delete user profile" },
				{ status: 500 }
			);
		}

		// Step 3: Delete user from Supabase Auth using admin client
		const { error: authDeleteError } =
			await supabaseAdmin.auth.admin.deleteUser(userId);

		if (authDeleteError) {
			console.error("Error deleting user from auth:", authDeleteError);
			return NextResponse.json(
				{ error: "Failed to delete user from authentication system" },
				{ status: 500 }
			);
		}

		console.log(`Successfully deleted account for user: ${userId}`);

		return NextResponse.json({
			success: true,
			message: "Account deleted successfully",
		});
	} catch (error: any) {
		console.error("Delete account API error:", error);
		return NextResponse.json(
			{
				error: "Failed to delete account",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}

// Also add a GET method to check if deletion is possible
export async function GET(request: NextRequest) {
	try {
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Check if user has any active subscriptions or pending payments
		const { data: activePayments, error: paymentsError } = await supabase
			.from("payment_transactions")
			.select("*")
			.eq("student_id", user.id)
			.eq("status", "approved")
			.eq("payment_type", "subscription");

		if (paymentsError) {
			console.error("Error checking active payments:", paymentsError);
		}

		return NextResponse.json({
			canDelete: true,
			hasActiveSubscriptions: activePayments && activePayments.length > 0,
			warnings:
				activePayments && activePayments.length > 0
					? ["You have active subscriptions that will be cancelled"]
					: [],
		});
	} catch (error: any) {
		console.error("Check deletion eligibility error:", error);
		return NextResponse.json(
			{ error: "Failed to check deletion eligibility" },
			{ status: 500 }
		);
	}
}
