"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Info, CreditCard, AlertCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Step4 = () => {
    const [phone, setPhone] = useState("");
    const [calendly, setCalendly] = useState("");
    const [mercadoPagoUserId, setMercadoPagoUserId] = useState("");
    const [userId, setUserId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const fetchUserId = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.log("User not found.")
            router.push('/auth/login')
        } else {
            setUserId(user.id);
            
            // Get user role to determine if they're a tutor
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();
            
            if (profile) {
                setUserRole(profile.role);
            }
        };
    };

    useEffect(() => {
        fetchUserId();
    }, []);

    // Check if user is a tutor (needs MercadoPago integration)
    const isTutor = userRole === "tutor" || userRole === "ambos";

    const validateForm = () => {
        // Basic validation for all users
        if (!phone.trim()) {
            alert("Por favor ingresa tu número de teléfono");
            return false;
        }

        if (!calendly.trim()) {
            alert("Por favor ingresa tu link de Calendly");
            return false;
        }

        // Additional validation for tutors
        if (isTutor && !mercadoPagoUserId.trim()) {
            alert("Como tutor, necesitas ingresar tu User ID de MercadoPago para recibir pagos");
            return false;
        }

        // Validate MercadoPago User ID format (should be numeric)
        if (isTutor && mercadoPagoUserId.trim() && !/^\d+$/.test(mercadoPagoUserId.trim())) {
            alert("El User ID de MercadoPago debe ser un número");
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        
        try {
            // Prepare update data
            const updateData: any = { 
                phone_number: phone.trim(), 
                calendly_link: calendly.trim() 
            };

            // Add MercadoPago user ID for tutors
            if (isTutor) {
                updateData.mercadopago_user_id = mercadoPagoUserId.trim();
            }

            const { error } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', userId);

            if (error) {
                throw error;
            }

            router.push("/");
        } catch (error) {
            console.error("Error al guardar datos: ", error);
            alert("Error al guardar datos. Por favor intenta nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 overflow-y-auto">
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 mx-auto">
                {/* Progress bar */}
                <div className="w-full flex justify-between mb-10 gap-1">
                    <div className="h-1.5 bg-blue-500 flex-1 rounded-full"></div>
                    <div className="h-1.5 bg-blue-500 flex-1 rounded-full"></div>
                    <div className="h-1.5 bg-blue-500 flex-1 rounded-full"></div>
                    <div className="h-1.5 bg-blue-500 flex-1 rounded-full"></div>
                </div>

                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold mb-3 text-gray-900">
                        Bienvenido a Tutorcito
                    </h1>
                    <h2 className="text-xl font-medium text-gray-500">
                        {isTutor ? "Configuración final para tutores" : "Últimos pasos"}
                    </h2>
                </div>

                {/* Phone Input */}
                <div className="mb-6">
                    <Input
                        type="tel"
                        placeholder="Número de teléfono"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full mb-4 h-14 text-base px-4 rounded-xl border-gray-200"
                    />
                    <div className="flex gap-3 items-start">
                        <Info className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Solo los estudiantes que reserven tu tutoría lo verán.
                        </p>
                    </div>
                </div>

                {/* Calendly input + button */}
                <div className="mb-6">
                    <div className="flex gap-3 w-full mb-4">
                        <Input
                            type="url"
                            placeholder="Link de Calendly"
                            value={calendly}
                            onChange={(e) => setCalendly(e.target.value)}
                            className="flex-1 h-14 text-base px-4 rounded-xl border-gray-200"
                        />
                        <Button 
                            asChild 
                            variant="default"
                            className="bg-blue-500 text-white hover:bg-blue-600 h-14 px-6 rounded-xl font-medium text-base whitespace-nowrap"
                        >
                            <Link href={'https://calendly.com/es'} target="_blank">
                                Calendly
                            </Link>
                        </Button>
                    </div>

                    <div className="flex gap-3 items-start">
                        <Info className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Usamos Calendly para mostrar tu disponibilidad.
                        </p>
                    </div>
                </div>

                {/* MercadoPago Integration - Only for tutors */}
                {isTutor && (
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                            <h3 className="font-medium text-gray-900">Configuración de pagos</h3>
                        </div>
                        
                        <Input
                            type="text"
                            placeholder="User ID de MercadoPago"
                            value={mercadoPagoUserId}
                            onChange={(e) => setMercadoPagoUserId(e.target.value)}
                            className="w-full mb-4 h-14 text-base px-4 rounded-xl border-gray-200"
                        />

                        <div className="flex gap-3 items-start mb-4">
                            <AlertCircle className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                            <p className="text-sm text-blue-600 leading-relaxed">
                                Necesario para recibir pagos. Los estudiantes pagarán directamente a tu cuenta.
                            </p>
                        </div>

                        {/* How to get User ID */}
                        <Dialog>
                            <DialogTrigger className="hover:cursor-pointer w-full">
                                <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors p-2 border border-gray-200 rounded-lg hover:border-gray-300">
                                    <ExternalLink className="w-4 h-4" />
                                    <span>¿Cómo obtener mi User ID de MercadoPago?</span>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="bg-white max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Obtener tu User ID de MercadoPago</DialogTitle>
                                    <DialogDescription>
                                        Sigue estos pasos para encontrar tu User ID
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <ol className="space-y-3 text-sm">
                                        <li className="flex gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                            <span>Ingresá a tu cuenta de MercadoPago</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                            <span>Andá a "Tu negocio" → "Configuración"</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                            <span>En "Datos básicos" encontrarás tu "User ID"</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                                            <span>Copiá ese número (solo números) y pegalo arriba</span>
                                        </li>
                                    </ol>
                                    
                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                        <p className="text-amber-800 text-sm">
                                            <strong>Importante:</strong> El User ID es un número único que identifica tu cuenta. 
                                            Con esto, los pagos irán directamente a tu cuenta y Tutorcito retendrá solo el 4.5% como comisión.
                                        </p>
                                    </div>

                                    <Button asChild className="w-full">
                                        <Link href="https://www.mercadopago.com.ar/settings/account" target="_blank">
                                            Abrir configuración de MercadoPago
                                        </Link>
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}

                {/* Calendly walkthrough video dialog */}
                <div className="mb-8 text-center">
                    <Dialog>
                        <DialogTrigger className="hover:cursor-pointer">
                            <p className="text-gray-500 font-medium underline hover:text-gray-700 transition-colors text-base">
                                Guía para configurar Calendly
                            </p>
                        </DialogTrigger>
                        <DialogContent className="bg-white w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-lg sm:text-xl">
                                    Te ayudamos a configurar tu Calendly!
                                </DialogTitle>
                                <DialogDescription className="text-sm sm:text-base">
                                    Mirá este video cortito para entender cómo configurar tu calendario y tus ventanas de
                                    disponibilidad correctamente.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4">
                                <iframe
                                    className="w-full aspect-video rounded-lg"
                                    src="https://www.youtube.com/embed/gsgyFZf4Stg"
                                    title="Calendly Tutorial"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Information about commission for tutors */}
                {isTutor && (
                    <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">💰 Comisiones</h4>
                        <ul className="text-sm text-green-800 space-y-1">
                            <li>• Tutorcito retiene solo el <strong>4.5%</strong> de cada tutoría</li>
                            <li>• Vos te quedás con el <strong>95.5%</strong> del pago</li>
                            <li>• Los pagos van directo a tu cuenta de MercadoPago</li>
                            <li>• Sin costos ocultos ni sorpresas</li>
                        </ul>
                    </div>
                )}

                {/* Submit Button */}
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-blue-500 text-white hover:bg-blue-600 w-full h-14 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                >
                    {isLoading ? "Guardando..." : (isTutor ? "Finalizar configuración" : "Finalizar")}
                </Button>
                </div>
            </div>
        </div>
    );
};

export default Step4;