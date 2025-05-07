'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function Step1() {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);

    const getUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
    };

    useEffect(() => {
        getUser();  
    }, []);

    const handleRoleSelection = (role: string) => {
        setSelectedRole(role);
    };

    const handleNext = async () => {
        if (!selectedRole || !user) return;

        setLoading(true);

        try {
            const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

            if (existingProfile) {
                await supabase
                .from('profiles')
                .update({role: selectedRole})
                .eq('id', user.id);
            } else {
                await supabase
                .from('profiles')
                .insert([{ id: user.id, role: selectedRole }]);
            }
            router.push('/auth/onboarding/step2');
        } catch (error) {
            console.error('Error saving role: ', error);
        } finally {
            setLoading(false);
        };
    };

    return (
        <div className="flex flex-col items-center">
            {/* barra de progreso */}
            <div className="w-full flex justify-between mb-8 gap-1">
                <div className="h-1 bg-blue-500 w-1/4 rounded-full"></div>
                <div className="h-1 bg-blue-200 w-1/4 rounded-full"></div>
                <div className="h-1 bg-blue-200 w-1/4 rounded-full"></div>
                <div className="h-1 bg-blue-200 w-1/4 rounded-full"></div>
            </div>
            <div className="text-center mb-4">
                        <h1 className="text-3xl font-bold mb-2">Bienvenido a Tutorcito</h1>
            </div>

            <h2 className="text-xl font-semibold text-gray-500 mb-6">Selecciona tu tipo de usuario</h2>

            <div className="grid grid-cols-3 gap-4 w-full max-w-md mb-8">
                <Button
                    variant={selectedRole === "estudiante" ? 'default' : 'outline'}
                    className={`py-2 px-4 ${selectedRole === "estudiante" ? "bg-blue-400" : "bg-blue-200"} border-none rounded-sm`}
                    onClick={() => handleRoleSelection("estudiante")}
                >
                    Estudiante
                </Button>
                <Button
                    variant={selectedRole === "tutor" ? 'default' : 'outline'}
                    className={`py-2 px-4 ${selectedRole === "tutor" ? "bg-blue-400" : "bg-blue-200"} border-none rounded-sm`}
                    onClick={() => handleRoleSelection("tutor")}
                >
                    Tutor
                </Button>
                <Button
                    variant={selectedRole === "ambos" ? 'default' : 'outline'}
                    className={`py-2 px-4 ${selectedRole === "ambos" ? "bg-blue-400" : "bg-blue-200"} border-none rounded-sm`}
                    onClick={() => handleRoleSelection("ambos")}
                >
                    Ambos
                </Button>
            </div>

            <Button
                variant={'default'}
                onClick={handleNext}
                disabled={!selectedRole || isLoading}
                className="w-full max-w-xs border mt-8 bg-blue-200 border-none hover:bg-blue-500 hover:text-white"
            >
                {isLoading ? "Guardando..." : "Siguiente"}
            </Button>
        </div>
    )
}