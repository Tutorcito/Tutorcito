"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/useToast";

const ProfileActions = () => {
	const [user, setUser] = useState<any>(null);
	const [userProfile, setUserProfile] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isCancelling, setIsCancelling] = useState(false);
	const { success, error } = useToast();

	useEffect(() => {
		fetchUserData();
	}, []);

	const fetchUserData = async () => {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) return;

			setUser(user);

			// Fetch user profile to check sponsored status
			const { data: profile } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", user.id)
				.single();

			if (profile) {
				setUserProfile(profile);
			}
		} catch (err) {
			console.error("Error fetching user data:", err);
		}
	};

	const handleLogout = async () => {
		setIsLoading(true);
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;

			// Redirect will happen automatically due to auth state change
			window.location.href = "/";
		} catch (err) {
			console.error("Error logging out:", err);
			error("Error al cerrar sesión");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancelSubscription = async () => {
		if (!user || !userProfile?.sponsored) return;

		const confirmed = window.confirm(
			"¿Estás seguro que querés cancelar tu suscripción premium?\n\n" +
				"Perderás los siguientes beneficios:\n" +
				"• Mayor visibilidad en búsquedas\n" +
				"• Aparición en tutores patrocinados\n" +
				"• Badge de tutor premium\n" +
				"• Soporte prioritario\n\n" +
				"Podés reactivarla en cualquier momento."
		);

		if (!confirmed) return;

		setIsCancelling(true);

		try {
			// Update user's sponsored status to false
			const { error: updateError } = await supabase
				.from("profiles")
				.update({
					sponsored: false,
				})
				.eq("id", user.id);

			if (updateError) throw updateError;

			// Create a cancellation record in payment_transactions for tracking
			await supabase.from("payment_transactions").insert({
				student_id: user.id,
				external_reference: `subscription-cancel-${user.id}-${Date.now()}`,
				payment_type: "subscription",
				amount: 0,
				status: "cancelled",
				description: "Cancelación de Plan Premium Tutorcito",
				metadata: {
					cancellation_date: new Date().toISOString(),
					cancelled_by_user: true,
				},
			});

			// Update local state
			setUserProfile((prev: any) => ({ ...prev, sponsored: false }));

			success(
				"Tu suscripción premium ha sido cancelada correctamente. Los beneficios se desactivarán en las próximas horas."
			);
		} catch (err) {
			console.error("Error cancelling subscription:", err);
			error("Error al cancelar la suscripción. Intenta nuevamente.");
		} finally {
			setIsCancelling(false);
		}
	};

	const handleDeleteAccount = async () => {
		if (!user) return;

		// First confirmation
		const confirmed = window.confirm(
			"⚠️ ELIMINAR CUENTA PERMANENTEMENTE ⚠️\n\n" +
				"Esta acción es IRREVERSIBLE y eliminará:\n\n" +
				"✗ Todos tus datos de perfil\n" +
				"✗ Historial completo de tutorías\n" +
				"✗ Todos los comentarios y calificaciones\n" +
				"✗ Archivos y certificaciones subidos\n" +
				"✗ Suscripción premium (si la tenés)\n" +
				"✗ Historial de pagos\n\n" +
				"¿Estás ABSOLUTAMENTE seguro?\n\n" +
				'Hacé clic en "Aceptar" solo si realmente querés eliminar tu cuenta.'
		);

		if (!confirmed) return;

		// Second confirmation with text input
		const confirmation = prompt(
			"Para confirmar la eliminación de tu cuenta, escribí exactamente:\n\n" +
				"ELIMINAR\n\n" +
				"(en mayúsculas)"
		);

		if (confirmation !== "ELIMINAR") {
			if (confirmation !== null) {
				// User didn't cancel, but wrote wrong text
				error("Texto de confirmación incorrecto. La cuenta NO fue eliminada.");
			}
			return;
		}

		// Final confirmation
		const finalConfirm = window.confirm(
			"🚨 ÚLTIMA CONFIRMACIÓN 🚨\n\n" +
				"Tu cuenta será eliminada PERMANENTEMENTE en 5 segundos.\n\n" +
				"Esta es tu ÚLTIMA oportunidad para cancelar.\n\n" +
				"¿Proceder con la eliminación?"
		);

		if (!finalConfirm) return;

		setIsLoading(true);

		try {
			// Call the delete account API
			const response = await fetch("/api/user/delete-account", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: user.id,
					confirmationText: "ELIMINAR",
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Error al eliminar la cuenta");
			}

			// Success - account deleted
			success(
				"Tu cuenta ha sido eliminada correctamente. Serás redirigido al inicio."
			);

			// Sign out and redirect after a short delay
			setTimeout(async () => {
				await supabase.auth.signOut();
				window.location.href = "/";
			}, 2000);
		} catch (err: any) {
			console.error("Error deleting account:", err);
			error(`Error al eliminar la cuenta: ${err.message}`);
		} finally {
			setIsLoading(false);
		}
	};

	// Show subscription cancellation button only for sponsored users
	const showCancelSubscription =
		userProfile?.sponsored &&
		(userProfile?.role === "tutor" || userProfile?.role === "ambos");

	return (
		<div className="pb-4 sm:pb-6 lg:pb-8 px-3 sm:px-4 lg:px-6">
			{/* Subscription cancellation - Only for premium users */}
			{showCancelSubscription && (
				<div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
					<div className="flex items-center justify-between">
						<div>
							<h4 className="font-medium text-yellow-800">
								Plan Premium Activo
							</h4>
							<p className="text-sm text-yellow-600">
								Tenés acceso a todos los beneficios premium
							</p>
						</div>
						<button
							onClick={handleCancelSubscription}
							disabled={isCancelling}
							className="px-4 py-2 text-sm font-medium text-yellow-700 bg-white border border-yellow-300 rounded-md hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{isCancelling ? "Cancelando..." : "Cancelar Premium"}
						</button>
					</div>
				</div>
			)}

			{/* Horizontal layout for larger screens */}
			<div className="hidden sm:flex justify-between gap-2 md:gap-3 lg:gap-4">
				<button
					onClick={handleLogout}
					disabled={isLoading}
					className="flex-1 border border-gray-300 rounded-md lg:rounded-lg
                     py-2 md:py-2.5 lg:py-3 px-3 md:px-4 lg:px-6
                     text-sm md:text-base lg:text-lg font-medium text-gray-800 
                     hover:bg-gray-100 hover:border-gray-400
                     focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2
                     active:bg-gray-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 ease-in-out
                     min-h-[2.75rem] md:min-h-[3rem] lg:min-h-[3.25rem]"
				>
					{isLoading ? "Cerrando..." : "Salir de la cuenta"}
				</button>
				<button
					onClick={handleDeleteAccount}
					disabled={isLoading}
					className="flex-1 bg-red-500 text-white rounded-md lg:rounded-lg
                     py-2 md:py-2.5 lg:py-3 px-3 md:px-4 lg:px-6
                     text-sm md:text-base lg:text-lg font-medium
                     hover:bg-red-600 hover:shadow-md
                     focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2
                     active:bg-red-700
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 ease-in-out
                     min-h-[2.75rem] md:min-h-[3rem] lg:min-h-[3.25rem]"
				>
					Eliminar cuenta
				</button>
			</div>

			{/* Vertical layout for mobile screens */}
			<div className="flex sm:hidden flex-col gap-3">
				<button
					onClick={handleLogout}
					disabled={isLoading}
					className="w-full border border-gray-300 rounded-lg
                     py-3 px-4
                     text-base font-medium text-gray-800 
                     hover:bg-gray-100 hover:border-gray-400
                     focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2
                     active:bg-gray-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 ease-in-out
                     min-h-[3rem]"
				>
					{isLoading ? "Cerrando..." : "Salir de la cuenta"}
				</button>
				<button
					onClick={handleDeleteAccount}
					disabled={isLoading}
					className="w-full bg-red-500 text-white rounded-lg
                     py-3 px-4
                     text-base font-medium
                     hover:bg-red-600 hover:shadow-lg
                     focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2
                     active:bg-red-700
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 ease-in-out
                     min-h-[3rem]"
				>
					Eliminar cuenta
				</button>
			</div>
		</div>
	);
};

export default ProfileActions;
