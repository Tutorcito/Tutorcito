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
        <div className="flex min-h-screen bg-white">
            {/* Lado izquierdo - Formulario de Login */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
                    {/* Logo y titulo */}
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
                    {/* Encabezado principal */}
                    <div className="mb-8 sm:mb-10 lg:mb-12 text-center">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-700 mb-1 sm:mb-2 leading-tight">
                            Aprendé con quienes
                        </h2>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-blue-500 mb-4 sm:mb-6 leading-tight">
                            ya pasaron por ahí
                        </h2>
                        <p className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium leading-relaxed px-2 sm:px-4">
                            Accedé a ayuda personalizada, de estudiante a estudiante, cuándo más lo necesites.
                        </p>
                    </div>
                    {/* Separador */}
                    <div className="border-t border-gray-200 my-6 sm:my-8"></div>
                    {/* Mensaje de error */}
                    {errorMessage && (
                        <div className="p-3 sm:p-4 mb-4 sm:mb-6 text-sm sm:text-base text-red-700 bg-red-50 border border-red-200 rounded-lg">
                            {errorMessage}
                        </div>
                    )}
                    {/* Título de ingreso */}
                    <div className="mb-6 sm:mb-8">
                        <p className="text-center text-base sm:text-lg font-semibold text-gray-700">
                            Ingresá a Tutorcito
                        </p>
                    </div>
                    {/* Botón de Google */}
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
                    {/* Separador con texto */}
                    <div className="relative mb-6 sm:mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500 font-medium">o continúa con email</span>
                        </div>
                    </div>
                    {/* Formulario de email */}
                    <form onSubmit={handleEmailLogin} className="space-y-4 sm:space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm sm:text-base font-medium text-gray-700 mb-2"
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
                            <input
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
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold 
                                    text-white bg-blue-600 rounded-lg hover:bg-blue-700 
                                    focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                    disabled:bg-blue-400 disabled:cursor-not-allowed 
                                    transition-colors duration-200"
                            >
                                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                            </button>
                        </div>
                    </form>
                    {/* Enlaces adicionales */}
                    <div className="mt-6 sm:mt-8 text-center">
                        <p className="text-xs sm:text-sm text-gray-500">
                            ¿No tenés cuenta?{" "}
                            <Link
                                href="/auth/register"
                                className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors duration-200"
                            >
                                Registrate aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            {/* Lado derecho - Imagen */}
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