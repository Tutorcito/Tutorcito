"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/supabase";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Login() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(
		error === "callback"
			? "There was an error loggin in, please try again."
			: null
	);

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
			setErrorMessage(error.message || "Failed to sign in with Google.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleEmailLogin = async (e: React.FormEvent) => {
		e.preventDefault();

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
			setErrorMessage(error.message || "Invalid email or password.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen">
			{/* Lado izquierdo - Formulario de Login */}
			<div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center">
				<div className="max-w-md w-full">
					{/* Logo y titulo */}
					<div className="flex items-center mb-2 pl-32">
						<Image
							src={"/tutorcito-logo.png"}
							alt="Logo de Tutorcito"
							width={60}
							height={60}
						/>
						<h1 className="text-2xl font-bold">Tutorcito</h1>
					</div>
					{/* Formulario de login */}
					<div className="mb-12">
						<h2 className="text-4xl text-center font-bold text-gray-700 mb-1">
							Aprendé con quienes
						</h2>
						<h2 className="text-4xl text-center font-bold text-blue-500 mb-6">
							ya pasaron por ahí
						</h2>
						<p className="text-gray-600 text-center font-medium">
							Accedé a ayuda personalizada, de estudiante a estudiante, cuándo
							más lo necesites.
						</p>
					</div>

					<div className="border-t border-gray-300 my-4"></div>

					{errorMessage && (
						<div className="p-3 mb-4 text-sm text-red-600 bg-red-100 rounded-b-md">
							{errorMessage}
						</div>
					)}

					<div className="mb-6">
						<p className="text-center text=lg font-medium text-gray-700 text-pretty">
							Ingresá a tutorcito
						</p>
					</div>

					{/* Boton de Google */}
					<Button
						variant={"default"}
						onClick={handleGoogleLogin}
						disabled={isLoading}
						className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 mb-4"
					>
						<div className="flex items-center">
							<div className="text-white p-1 rounded mr-3">
								<Image
									src={"/googleLogo.png"}
									alt="google logo"
									height={20}
									width={20}
								/>
							</div>
							<span className="text-gray-700">Ingresar con Google</span>
						</div>
					</Button>

					{/* Formulario tradicional (opcional) */}
					<div className="">
						<form onSubmit={handleEmailLogin} className="space-y-4">
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700"
								>
									Email
								</label>
								<input
									id="email"
									name="email"
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
								/>
							</div>

							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium text-gray-700"
								>
									Contraseña
								</label>
								<input
									id="password"
									name="password"
									type="password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
								/>
							</div>

							<div>
								<button
									type="submit"
									disabled={isLoading}
									className="w-full px-4 py-2 text-white font-medium bg-blue-500 rounded-md hover:bg-blue-600"
								>
									{isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>

			{/*  Lado derecho - imagen */}
			<div className="hidden md:block md:w-1/2 bg-gray-100">
				<div className="h-full w-full relative">
					<Image
						src={"/onboarding.jpg"}
						alt="Students having a tutoring session together."
						height={1400}
						width={1400}
						className="absolute inset-0 bg-cover bg-center h-full w-full"
					/>
				</div>
			</div>
		</div>
	);
}
