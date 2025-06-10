"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Step4 = () => {
    const [phone, setPhone] = useState("");
    const [calendly, setCalendly] = useState("");
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const fetchUserId = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.log("User not found.")
            router.push('/auth/login')
        } else {
            setUserId(user.id);
        };
    };

    useEffect(() => {
        fetchUserId();
    }, []);

    const handleSubmit = async () => {
        setIsLoading(true);
        const { error } = await supabase
        .from('profiles')
        .update({ phone_number: phone, calendly_link: calendly })
        .eq('id', userId);

        if (error) {
            setIsLoading(false);
            alert("Error al guardar datos.")
            console.error("Error al guardar telefono y link: ", error)
            return;
        };

        router.push("/")
    }

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
                        Últimos pasos
                    </h2>
                </div>

                {/* Phone Input */}
                <div className="mb-8">
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

                    {/* Info text below */}
                    <div className="flex gap-3 items-start">
                        <Info className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Usamos Calendly para mostrar tu disponibilidad.
                        </p>
                    </div>
                </div>

                {/* Calendly walkthrough video dialog */}
                <div className="mb-10 text-center">
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

                {/* Submit Button */}
                <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-blue-500 text-white hover:bg-blue-600 w-full h-14 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                >
                    {isLoading ? "Guardando..." : "Finalizar"}
                </Button>
                            </div>
            </div>
        </div>
    );
};

export default Step4;