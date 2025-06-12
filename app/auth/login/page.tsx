"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/supabase";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";

export default function Login() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const error = searchParams.get("error");
	const message = searchParams.get("message");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(
		error === "callback"
			? "Hubo un error durante la autenticación, por favor intenta nuevamente."
			: null
	);

	// Success message for password updates
	const successMessage =
		message === "password_updated"
			? "Contraseña actualizada exitosamente. Inicia sesión con tu nueva contraseña."
			: null;

	const handleGoogleLogin = async () => {
		try {
			setIsLoading(true);
			setErrorMessage(null);

			const { error } = await auth.signInWithGoogle();

			if (error) {
				throw error;
			}
		} catch (error: any) {
			console.error("Google login error: ", error);
			setErrorMessage(error.message || "Error al iniciar sesión con Google.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleEmailLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !password) {
			setErrorMessage("Por favor completa todos los campos.");
			return;
		}

		try {
			setIsLoading(true);
			setErrorMessage(null);

			const { data, error } = await auth.signIn(email, password);

			if (error) {
				throw error;
			}

			if (data?.user) {
				router.push("/");
			}
		} catch (error: any) {
			console.error("Email login error: ", error);

			if (error.message?.includes("Invalid login credentials")) {
				setErrorMessage("Email o contraseña incorrectos.");
			} else if (error.message?.includes("Email not confirmed")) {
				setErrorMessage(
					"Tu email no está confirmado. Revisa tu bandeja de entrada y haz clic en el enlace de confirmación."
				);
			} else if (error.message?.includes("Too many requests")) {
				setErrorMessage(
					"Demasiados intentos. Espera unos minutos antes de intentar nuevamente."
				);
			} else {
				setErrorMessage(error.message || "Error al iniciar sesión.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen bg-white">
			{/* Left side - Login Form */}
			<div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
				<div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
					{/* Logo and title */}
					<div className="flex items-center justify-center mb-6 sm:mb-8">
						<Image
							src={"/tutorcito-logo.png"}
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
						<h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-700 mb-1 sm:mb-2 leading-tight">
							Aprendé con quienes
						</h2>
						<h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-blue-500 mb-4 sm:mb-6 leading-tight">
							ya pasaron por ahí
						</h2>
						<p className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium leading-relaxed px-2 sm:px-4">
							Accedé a ayuda personalizada, de estudiante a estudiante, cuándo
							más lo necesités.
						</p>
					</div>

					{/* Separator */}
					<div className="border-t border-gray-200 my-6 sm:my-8"></div>

					{/* Success message */}
					{successMessage && (
						<div className="p-3 sm:p-4 mb-4 sm:mb-6 text-sm sm:text-base text-green-700 bg-green-50 border border-green-200 rounded-lg">
							<div className="flex items-center">
								<CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
								{successMessage}
							</div>
						</div>
					)}

					{/* Error message */}
					{errorMessage && (
						<div className="p-3 sm:p-4 mb-4 sm:mb-6 text-sm sm:text-base text-red-700 bg-red-50 border border-red-200 rounded-lg">
							{errorMessage}
						</div>
					)}

					{/* Login title */}
					<div className="mb-6 sm:mb-8">
						<p className="text-center text-base sm:text-lg font-semibold text-gray-700">
							Ingresá a Tutorcito
						</p>
					</div>

					{/* Google Login Button */}
					<Button
						variant="outline"
						onClick={handleGoogleLogin}
						disabled={isLoading}
						className="w-full flex items-center justify-center py-3 sm:py-4 px-4 sm:px-6 
                            border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 
                            mb-6 sm:mb-8 transition-all duration-200 disabled:opacity-50 
                            disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						<div className="flex items-center">
							<div className="mr-3 sm:mr-4">
								<Image
									src={"/googleLogo.png"}
									alt="Google logo"
									height={20}
									width={20}
									className="w-5 h-5 sm:w-6 sm:h-6"
								/>
							</div>
							<span className="text-sm sm:text-base font-medium text-gray-700">
								{isLoading ? "Conectando..." : "Ingresar con Google"}
							</span>
						</div>
					</Button>

					{/* Separator with text */}
					<div className="relative mb-6 sm:mb-8">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-200"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-4 bg-white text-gray-500 font-medium">
								o continúa con email
							</span>
						</div>
					</div>

					{/* Email Login Form */}
					<form onSubmit={handleEmailLogin} className="space-y-4 sm:space-y-6">
						<div>
							<label
								htmlFor="email"
								className="block text-sm sm:text-base font-medium text-gray-700 mb-2"
							>
								Email
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
								disabled={isLoading}
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm sm:text-base font-medium text-gray-700 mb-2"
							>
								Contraseña
							</label>
							<Input
								id="password"
								name="password"
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-lg 
                                    text-sm sm:text-base placeholder-gray-400
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                    hover:border-gray-400 transition-colors duration-200
                                    disabled:bg-gray-50 disabled:cursor-not-allowed"
								placeholder="Tu contraseña"
								disabled={isLoading}
							/>
						</div>

						<div className="pt-2 sm:pt-4">
							<Button
								type="submit"
								disabled={isLoading}
								className="w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold 
                                    text-white bg-blue-600 rounded-lg hover:bg-blue-700 
                                    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                    disabled:bg-blue-400 disabled:cursor-not-allowed 
                                    transition-colors duration-200"
							>
								{isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
							</Button>
						</div>
					</form>

					{/* Password Reset Link */}
					<div className="text-center mt-4">
						<Link
							href="/auth/reset-password"
							className="text-blue-600 hover:text-blue-500 hover:underline text-sm transition-colors duration-200"
						>
							¿Olvidaste tu contraseña?
						</Link>
					</div>

					{/* Register Link */}
					<div className="mt-6 sm:mt-8 text-center">
						<p className="text-xs sm:text-sm text-gray-500">
							¿No tenés cuenta?{" "}
							<Link
								href="/auth/register"
								className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors duration-200"
							>
								Regístrate aquí
							</Link>
						</p>
					</div>
				</div>
			</div>

			{/* Right side - Image */}
			<div className="hidden lg:block lg:w-1/2 relative">
				<Image
					src="/onboarding.jpg"
					alt="Students having a tutoring session together."
					fill
					className="object-cover object-center"
					priority
					sizes="50vw"
				/>
			</div>
		</div>
	);
}
