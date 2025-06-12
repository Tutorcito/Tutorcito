"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		name: "",
	});
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccessMessage("");

		const { email, password, name } = formData;

		// Validaciones
		if (!email || !password || !name) {
			setError("Por favor completá todos los campos.");
			return;
		}

		if (password.length < 6) {
			setError("La contraseña debe tener al menos 6 caracteres.");
			return;
		}

		if (name.length < 2) {
			setError("El nombre debe tener al menos 2 caracteres.");
			return;
		}

		setLoading(true);

		try {
			// Step 1: Sign up the user
			const { data, error: signUpError } = await auth.signUp(email, password);

			if (signUpError) {
				throw signUpError;
			}

			if (!data?.user) {
				throw new Error("No se pudo crear el usuario. Intenta nuevamente.");
			}

			console.log("User created successfully:", data.user.id);

			// Step 2: Check if email confirmation is required
			if (!data.session && data.user && !data.user.email_confirmed_at) {
				// Email confirmation is required
				setSuccessMessage(
					"Registro exitoso! Te enviamos un email de confirmación. Revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta."
				);

				// Store the name temporarily in localStorage to use after email confirmation
				localStorage.setItem("pendingUserName", name);
				localStorage.setItem("pendingUserId", data.user.id);
			} else {
				// No email confirmation required, create profile immediately
				await createUserProfile(data.user.id, name);
				setSuccessMessage("Registro exitoso! Ya puedes iniciar sesión.");

				// Redirect to login after 2 seconds
				setTimeout(() => {
					router.push("/auth/login");
				}, 2000);
			}
		} catch (err: any) {
			console.error("Registration error:", err);

			// Handle specific Supabase errors
			if (err.message?.includes("User already registered")) {
				setError("Este email ya está registrado. ¿Quieres iniciar sesión?");
			} else if (err.message?.includes("Invalid email")) {
				setError("El formato del email no es válido.");
			} else if (err.message?.includes("Password should be at least")) {
				setError("La contraseña debe tener al menos 6 caracteres.");
			} else {
				setError(
					err.message || "Error durante el registro. Intenta nuevamente."
				);
			}
		} finally {
			setLoading(false);
		}
	};

	const createUserProfile = async (userId: string, fullName: string) => {
		try {
			const { error: profileError } = await supabase.from("profiles").insert({
				id: userId,
				full_name: fullName,
				created_at: new Date().toISOString(),
			});

			if (profileError) {
				console.error("Profile creation error:", profileError);
				throw new Error("Error al crear el perfil de usuario.");
			}

			console.log("Profile created successfully for user:", userId);
		} catch (error) {
			console.error("Error in createUserProfile:", error);
			throw error;
		}
	};

	return (
		<div className="flex min-h-screen bg-white">
			{/* Left side - Registration Form */}
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
						<h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-700 mb-1 sm:mb-2 leading-tight">
							Únete a Tutorcito
						</h2>
						<h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-blue-500 mb-4 sm:mb-6 leading-tight">
							y empieza a aprender
						</h2>
						<p className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium leading-relaxed px-2 sm:px-4">
							Crea tu cuenta y accede a tutorías personalizadas con estudiantes
							expertos.
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

					{successMessage && (
						<div className="p-3 sm:p-4 mb-4 sm:mb-6 text-sm sm:text-base text-green-700 bg-green-50 border border-green-200 rounded-lg">
							{successMessage}
						</div>
					)}

					{/* Registration title */}
					<div className="mb-6 sm:mb-8">
						<p className="text-center text-base sm:text-lg font-semibold text-gray-700">
							Crear nueva cuenta
						</p>
					</div>

					{/* Registration Form */}
					<form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
						<div>
							<label
								htmlFor="name"
								className="block text-sm sm:text-base font-medium text-gray-700 mb-2"
							>
								Nombre completo
							</label>
							<Input
								id="name"
								name="name"
								type="text"
								required
								value={formData.name}
								onChange={handleChange}
								className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-lg 
                          text-sm sm:text-base placeholder-gray-400
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                          hover:border-gray-400 transition-colors duration-200
                          disabled:bg-gray-50 disabled:cursor-not-allowed"
								placeholder="Tu nombre completo"
								disabled={loading}
							/>
						</div>

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
								value={formData.email}
								onChange={handleChange}
								className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-lg 
                          text-sm sm:text-base placeholder-gray-400
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                          hover:border-gray-400 transition-colors duration-200
                          disabled:bg-gray-50 disabled:cursor-not-allowed"
								placeholder="tu@email.com"
								disabled={loading}
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
								value={formData.password}
								onChange={handleChange}
								className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-lg 
                          text-sm sm:text-base placeholder-gray-400
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                          hover:border-gray-400 transition-colors duration-200
                          disabled:bg-gray-50 disabled:cursor-not-allowed"
								placeholder="Mínimo 6 caracteres"
								disabled={loading}
							/>
						</div>

						<div className="pt-2 sm:pt-4">
							<Button
								type="submit"
								disabled={loading}
								className="w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold 
                          text-white bg-blue-600 rounded-lg hover:bg-blue-700 
                          focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          disabled:bg-blue-400 disabled:cursor-not-allowed 
                          transition-colors duration-200"
							>
								{loading ? "Creando cuenta..." : "Crear cuenta"}
							</Button>
						</div>
					</form>

					{/* Additional links */}
					<div className="mt-6 sm:mt-8 text-center">
						<p className="text-xs sm:text-sm text-gray-500">
							¿Ya tenés cuenta?{" "}
							<Link
								href="/auth/login"
								className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors duration-200"
							>
								Inicia sesión aquí
							</Link>
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
