"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { auth } from "@/app/lib/supabase";
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
					<div className="flex items-center mb-2">
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
						<h2 className="text-4xl font-bold text-gray-700 mb-1">
							Aprendé con quienes
						</h2>
						<h2 className="text-4xl font-bold text-blue-500 mb-6">
							ya pasaron por ahí
						</h2>
						<p className="text-gray-600 font-medium">
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
						<p className="text-center text=lg font-medium text-gray-700">
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
							<div className="bg-blue-500 text-white p-1 rounded mr-3">
                                
							</div>
							<span className="text-gray-700">Ingresar con Google</span>
						</div>
					</Button>
				</div>
			</div>
		</div>
	);
}
