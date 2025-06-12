"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail } from "lucide-react";

export default function ResetPasswordPage() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setMessage("");

		if (!email) {
			setError("Por favor ingresa tu email.");
			setLoading(false);
			return;
		}

		if (!email.includes("@")) {
			setError("Por favor ingresa un email válido.");
			setLoading(false);
			return;
		}

		try {
			const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/auth/update-password`,
			});

			if (error) {
				throw error;
			}

			setMessage(
				"Te enviamos un email con instrucciones para restablecer tu contraseña. Revisa tu bandeja de entrada y carpeta de spam."
			);

			// Clear the email field
			setEmail("");
		} catch (err: any) {
			console.error("Password reset error:", err);

			if (err.message?.includes("Email not confirmed")) {
				setError(
					"Tu email no está confirmado. Revisa tu bandeja de entrada para confirmar tu cuenta primero."
				);
			} else if (err.message?.includes("Invalid email")) {
				setError("El formato del email no es válido.");
			} else if (err.message?.includes("too many requests")) {
				setError(
					"Demasiados intentos. Espera unos minutos antes de intentar nuevamente."
				);
			} else {
				setError(
					"Error al enviar email de recuperación. Verifica que el email esté registrado."
				);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen bg-white">
			{/* Left side - Reset Form */}
			<div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
				<div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
					{/* Logo and title */}
					<div className="flex items-center justify-center mb-6 sm:mb-8">
						<Image
							src="/tutorcito-logo.png"
							alt="Logo de Tutorcito"
							width={48}
							height={48}
							className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 mr-2 sm:mr-3"
						/>
						<h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
							Tutorcito
						</h1>
					</div>

					{/* Main header */}
					<div className="mb-8 sm:mb-10 lg:mb-12 text-center">
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-700 mb-2 leading-tight">
							¿Olvidaste tu contraseña?
						</h2>
						<p className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium leading-relaxed px-2 sm:px-4">
							No te preocupes, te ayudamos a recuperar el acceso a tu cuenta.
						</p>
					</div>

					{/* Separator */}
					<div className="border-t border-gray-200 my-6 sm:my-8"></div>

					{/* Error/Success Messages */}
					{error && (
						<div className="p-3 sm:p-4 mb-4 sm:mb-6 text-sm sm:text-base text-red-700 bg-red-50 border border-red-200 rounded-lg">
							{error}
						</div>
					)}

					{message && (
						<div className="p-3 sm:p-4 mb-4 sm:mb-6 text-sm sm:text-base text-green-700 bg-green-50 border border-green-200 rounded-lg">
							<div className="flex items-start">
								<Mail className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
								<div>
									{message}
									<p className="mt-2 text-xs text-green-600">
										El email puede tardar unos minutos en llegar.
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Reset form title */}
					<div className="mb-6 sm:mb-8">
						<p className="text-center text-base sm:text-lg font-semibold text-gray-700">
							Restablecer contraseña
						</p>
					</div>

					{/* Reset Form */}
					<form
						onSubmit={handleResetPassword}
						className="space-y-4 sm:space-y-6"
					>
						<div>
							<label
								htmlFor="email"
								className="block text-sm sm:text-base font-medium text-gray-700 mb-2"
							>
								Email registrado
							</label>
							<Input
								id="email"
								name="email"
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-lg 
                          text-sm sm:text-base placeholder-gray-400
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                          hover:border-gray-400 transition-colors duration-200
                          disabled:bg-gray-50 disabled:cursor-not-allowed"
								placeholder="tu@email.com"
								disabled={loading}
							/>
						</div>

						<div className="pt-2 sm:pt-4">
							<Button
								type="submit"
								disabled={loading || !email}
								className="w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold 
                          text-white bg-blue-600 rounded-lg hover:bg-blue-700 
                          focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          disabled:bg-blue-400 disabled:cursor-not-allowed 
                          transition-colors duration-200"
							>
								{loading ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
										Enviando...
									</>
								) : (
									<>
										<Mail className="w-4 h-4 mr-2" />
										Enviar instrucciones
									</>
								)}
							</Button>
						</div>
					</form>

					{/* Additional links */}
					<div className="mt-6 sm:mt-8 text-center space-y-2">
						<Link
							href="/auth/login"
							className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
						>
							<ArrowLeft className="w-4 h-4 mr-1" />
							Volver al login
						</Link>

						<p className="text-xs sm:text-sm text-gray-500 mt-4">
							¿No tenés cuenta?{" "}
							<Link
								href="/auth/register"
								className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors duration-200"
							>
								Regístrate aquí
							</Link>
						</p>
					</div>

					{/* Help text */}
					<div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
						<p className="text-xs text-gray-600 leading-relaxed">
							<strong>¿Problemas para recibir el email?</strong>
							<br />
							• Revisa tu carpeta de spam o correo no deseado
							<br />
							• Verifica que el email esté escrito correctamente
							<br />• El email puede tardar hasta 10 minutos en llegar
						</p>
					</div>
				</div>
			</div>

			{/* Right side - Image */}
			<div className="hidden lg:block lg:w-1/2 relative">
				<Image
					src="/onboarding.jpg"
					alt="Students studying together"
					fill
					className="object-cover object-center"
					priority
					sizes="50vw"
				/>
			</div>
		</div>
	);
}
