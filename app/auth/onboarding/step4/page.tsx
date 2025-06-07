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
		<div className="flex flex-col items-center">
			{/* Progress bar */}
			<div className="w-full flex justify-between mb-8 gap-1">
				<div className="h-1 bg-blue-500 w-1/4 rounded-full"></div>
				<div className="h-1 bg-blue-500 w-1/4 rounded-full"></div>
				<div className="h-1 bg-blue-500 w-1/4 rounded-full"></div>
				<div className="h-1 bg-blue-500 w-1/4 rounded-full"></div>
			</div>
			<div className="text-center mb-4">
				<h1 className="text-3xl font-bold mb-2">Bienvenido a Tutorcito</h1>
			</div>

			<h2 className="text-xl font-semibold text-gray-500 mb-6">
				Últimos pasos
			</h2>

            {/* Phone Input */}
			<div className="flex flex-col items-start w-full max-w-sm mb-6">
				<Input
					type="tel"
					placeholder="Número de teléfono"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
					className="w-full min-w-xs mb-3"
				/>
				<div className="flex gap-2 items-center justify-center">
					<Info />
					<p className="font-medium text-sm text-gray-500">
						Solo los estudiantes que reserven tu tutoría lo verán.
					</p>
				</div>
			</div>

            {/* Calendly input + button row */}
			<div className="flex flex-col items-start w-full max-w-sm mb-4">
				<div className="flex gap-2 w-full mb-3">
					<Input
						type="url"
						placeholder="Link de Calendly"
                        value={calendly}
                        onChange={(e) => setCalendly(e.target.value)}
						className="flex-1"
					/>
					<Button 
                        asChild 
                        variant="default"
                        className="bg-blue-500 text-white hover:bg-blue-600 hover:cursor-pointer whitespace-nowrap"
                    >
                        <Link href={'https://calendly.com/es'} target="_blank" >
                            Calendly
                        </Link>
					</Button>
				</div>

				{/* Info text below */}
				<div className="flex gap-2 items-center">
					<Info />
					<p className="font-medium text-sm text-gray-500">
						Usamos Calendly para mostrar tu disponibilidad.
					</p>
				</div>
			</div>

            {/* Calendly walkthrough video ddialog */}
            <Dialog >
                <DialogTrigger className="hover:cursor-pointer">
                    <p className="text-gray-500 font-medium underline mb-10">Guía para configurar Calendly</p>
                </DialogTrigger>
                <DialogContent className="bg-white min-w-3/4">
                    <DialogHeader>
                        <DialogTitle>Te ayudamos a configurar tu Calendly!</DialogTitle>
                        <DialogDescription>
                            Mirá este video cortito para entender cómo configurar tu calendario y tus ventanas de
                            disponibilidad correctamente.
                        </DialogDescription>
                    </DialogHeader>
                    <iframe
                        className="w-full aspect-video mt-4 rounded"
                        src="https://www.youtube.com/embed/gsgyFZf4Stg"
                        title="Calendly Tutorial"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </DialogContent>
            </Dialog>

            <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-blue-500 text-white hover:bg-blue-600 hover:cursor-pointer w-full max-w-xs"
            >
                {isLoading ? "guardando..." : "Finalizar"}
            </Button>
		</div>
	);
};

export default Step4;
