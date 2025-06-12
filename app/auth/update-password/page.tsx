"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Lock, CheckCircle, Eye, EyeOff } from "lucide-react";

export default function UpdatePasswordPage() {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isValidSession, setIsValidSession] = useState(false);
	const [checkingSession, setCheckingSession] = useState(true);

	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		checkSession();
	}, []);

	const checkSession = async () => {
		try {
			setCheckingSession(true);

			// Check if user has a valid session for password update
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();

			if (error) {
				console.error("Session error:", error);
				setError(
					"Error de sesión. Por favor, solicita un nuevo enlace de recuperación."
				);
				setCheckingSession(false);
				return;
			}

			if (!session) {
				setError(
					"Sesión inválida o expirada. Por favor, solicita un nuevo enlace de recuperación."
				);
				setCheckingSession(false);
				return;
			}

			// Check if this is from a password recovery flow
			const accessToken = searchParams.get("access_token");
			const refreshToken = searchParams.get("refresh_token");

			if (accessToken && refreshToken) {
				// Set the session from URL parameters
				const { error: setSessionError } = await supabase.auth.setSession({
					access_token: accessToken,
					refresh_token: refreshToken,
				});

				if (setSessionError) {
					console.error("Set session error:", setSessionError);
					setError(
						"Error al establecer la sesión. Por favor, solicita un nuevo enlace."
					);
					setCheckingSession(false);
					return;
				}
			}

			setIsValidSession(true);
			setCheckingSession(false);
		} catch (err) {
			console.error("Error checking session:", err);
			setError(
				"Error inesperado. Por favor, solicita un nuevo enlace de recuperación."
			);
			setCheckingSession(false);
		}
	};

	const validatePassword = (pwd: string): string[] => {
		const errors: string[] = [];

		if (pwd.length < 6) {
			errors.push("Debe tener al menos 6 caracteres");
		}

		if (!/[A-Za-z]/.test(pwd)) {
			errors.push("Debe contener al menos una letra");
		}

		if (!/[0-9]/.test(pwd)) {
			errors.push("Debe contener al menos un número");
		}

		return errors;
	};

	const handleUpdatePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		// Validate passwords match
		if (password !== confirmPassword) {
			setError("Las contraseñas no coinciden");
			setLoading(false);
			return;
		}

		// Validate password strength
		const passwordErrors = validatePassword(password);
		if (passwordErrors.length > 0) {
			setError(`La contraseña no es válida: ${passwordErrors.join(", ")}`);
			setLoading(false);
			return;
		}

		try {
			const { error } = await supabase.auth.updateUser({
				password: password,
			});

			if (error) {
				throw error;
			}

			// Password updated successfully
			alert(
				"¡Contraseña actualizada exitosamente! Ahora puedes iniciar sesión con tu nueva contraseña."
			);

			// Sign out the user so they need to login with new password
			await supabase.auth.signOut();

			// Redirect to login
			router.push("/auth/login?message=password_updated");
		} catch (err: any) {
			console.error("Password update error:", err);

			if (err.message?.includes("New password should be different")) {
				setError("La nueva contraseña debe ser diferente a la actual.");
			} else if (err.message?.includes("Password should be at least")) {
				setError("La contraseña debe tener al menos 6 caracteres.");
			} else {
				setError(
					err.message ||
						"Error al actualizar la contraseña. Intenta nuevamente."
				);
			}
		} finally {
			setLoading(false);
		}
	};

	const getPasswordStrength = (
		pwd: string
	): { strength: string; color: string; width: string } => {
		if (pwd.length === 0) return { strength: "", color: "", width: "0%" };

		const errors = validatePassword(pwd);

		if (errors.length === 0) {
			return { strength: "Fuerte", color: "bg-green-500", width: "100%" };
		} else if (errors.length === 1) {
			return { strength: "Media", color: "bg-yellow-500", width: "66%" };
		} else {
			return { strength: "Débil", color: "bg-red-500", width: "33%" };
		}
	};

	// Loading state while checking session
	if (checkingSession) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Verificando sesión...</p>
				</div>
			</div>
		);
	}

	// Invalid session state
	if (!isValidSession) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="max-w-md w-full text-center px-4">
					<div className="bg-white rounded-lg shadow-md p-6">
						<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Lock className="w-8 h-8 text-red-600" />
						</div>
						<h2 className="text-xl font-semibold text-gray-900 mb-2">
							Sesión Inválida
						</h2>
						{error && <p className="text-red-600 text-sm mb-4">{error}</p>}
						<p className="text-gray-600 text-sm mb-6">
							El enlace ha expirado o es inválido. Solicita un nuevo enlace de
							recuperación.
						</p>
						<Button
							onClick={() => router.push("/auth/reset-password")}
							className="w-full"
						>
							Solicitar nuevo enlace
						</Button>
					</div>
				</div>
			</div>
		);
	}

	const passwordStrength = getPasswordStrength(password);

	return (
		<div className="flex min-h-screen bg-white">
			{/* Left side - Update Password Form */}
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
						<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Lock className="w-8 h-8 text-green-600" />
						</div>
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-700 mb-2 leading-tight">
							Nueva Contraseña
						</h2>
						<p className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium leading-relaxed px-2 sm:px-4">
							Crea una contraseña segura para proteger tu cuenta.
						</p>
					</div>

					{/* Separator */}
					<div className="border-t border-gray-200 my-6 sm:my-8"></div>

					{/* Error Messages */}
					{error && (
						<div className="p-3 sm:p-4 mb-4 sm:mb-6 text-sm sm:text-base text-red-700 bg-red-50 border border-red-200 rounded-lg">
							{error}
						</div>
					)}

					{/* Update Password Form */}
					<form
						onSubmit={handleUpdatePassword}
						className="space-y-4 sm:space-y-6"
					>
						{/* New Password */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm sm:text-base font-medium text-gray-700 mb-2"
							>
								Nueva Contraseña
							</label>
							<div className="relative">
								<Input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full px-3 sm:px-4 py-3 sm:py-4 pr-12 border border-gray-300 rounded-lg 
                            text-sm sm:text-base placeholder-gray-400
                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                            hover:border-gray-400 transition-colors duration-200
                            disabled:bg-gray-50 disabled:cursor-not-allowed"
									placeholder="Mínimo 6 caracteres"
									disabled={loading}
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
									) : (
										<Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
									)}
								</button>
							</div>

							{/* Password Strength Indicator */}
							{password && (
								<div className="mt-2">
									<div className="flex justify-between items-center mb-1">
										<span className="text-xs text-gray-500">Fortaleza:</span>
										<span
											className={`text-xs font-medium ${
												passwordStrength.color === "bg-green-500"
													? "text-green-600"
													: passwordStrength.color === "bg-yellow-500"
													? "text-yellow-600"
													: "text-red-600"
											}`}
										>
											{passwordStrength.strength}
										</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
											style={{ width: passwordStrength.width }}
										></div>
									</div>
								</div>
							)}
						</div>

						{/* Confirm Password */}
						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-sm sm:text-base font-medium text-gray-700 mb-2"
							>
								Confirmar Nueva Contraseña
							</label>
							<div className="relative">
								<Input
									id="confirmPassword"
									name="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									required
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									className="w-full px-3 sm:px-4 py-3 sm:py-4 pr-12 border border-gray-300 rounded-lg 
                            text-sm sm:text-base placeholder-gray-400
                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                            hover:border-gray-400 transition-colors duration-200
                            disabled:bg-gray-50 disabled:cursor-not-allowed"
									placeholder="Repite la nueva contraseña"
									disabled={loading}
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								>
									{showConfirmPassword ? (
										<EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
									) : (
										<Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
									)}
								</button>
							</div>

							{/* Password Match Indicator */}
							{confirmPassword && (
								<div className="mt-2 flex items-center">
									{password === confirmPassword ? (
										<div className="flex items-center text-green-600">
											<CheckCircle className="w-4 h-4 mr-1" />
											<span className="text-xs">Las contraseñas coinciden</span>
										</div>
									) : (
										<span className="text-xs text-red-600">
											Las contraseñas no coinciden
										</span>
									)}
								</div>
							)}
						</div>

						<div className="pt-2 sm:pt-4">
							<Button
								type="submit"
								disabled={
									loading ||
									!password ||
									!confirmPassword ||
									password !== confirmPassword
								}
								className="w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold 
                          text-white bg-blue-600 rounded-lg hover:bg-blue-700 
                          focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          disabled:bg-blue-400 disabled:cursor-not-allowed 
                          transition-colors duration-200"
							>
								{loading ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
										Actualizando...
									</>
								) : (
									<>
										<Lock className="w-4 h-4 mr-2" />
										Actualizar Contraseña
									</>
								)}
							</Button>
						</div>
					</form>

					{/* Password Requirements */}
					<div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
						<h4 className="text-sm font-medium text-gray-700 mb-2">
							Requisitos de la contraseña:
						</h4>
						<ul className="text-xs text-gray-600 space-y-1">
							<li className="flex items-center">
								<div
									className={`w-2 h-2 rounded-full mr-2 ${
										password.length >= 6 ? "bg-green-500" : "bg-gray-300"
									}`}
								></div>
								Al menos 6 caracteres
							</li>
							<li className="flex items-center">
								<div
									className={`w-2 h-2 rounded-full mr-2 ${
										/[A-Za-z]/.test(password) ? "bg-green-500" : "bg-gray-300"
									}`}
								></div>
								Al menos una letra
							</li>
							<li className="flex items-center">
								<div
									className={`w-2 h-2 rounded-full mr-2 ${
										/[0-9]/.test(password) ? "bg-green-500" : "bg-gray-300"
									}`}
								></div>
								Al menos un número
							</li>
						</ul>
					</div>

					{/* Security note */}
					<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
						<p className="text-xs text-blue-700 leading-relaxed">
							<strong>Por tu seguridad:</strong>
							<br />
							• Usa una contraseña única que no hayas usado en otros sitios
							<br />
							• Después de actualizar tu contraseña, serás redirigido al login
							<br />• Guarda tu nueva contraseña en un lugar seguro
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
