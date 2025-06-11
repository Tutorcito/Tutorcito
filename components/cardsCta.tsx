'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/useToast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PaymentButton from "./paymentButton";
import type { PaymentItem } from "./paymentButton";

const subscriptionItems: PaymentItem[] = [
  {
    id: 'premium',
    title: 'Suscripción Premium',
    quantity: 1,
    unit_price: 5000,
    currency_id: 'ARS',
  }
];


const CardsCta = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { info } = useToast();

  // Obtener usuario y perfil
  const getUserAndProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setUserProfile(profile);
    }
  };

  useEffect(() => {
    getUserAndProfile();
  }, []);

  const handleBecomeTeacher = async () => {
    setIsLoading(true);

    try {
      if (!user) {
        // Usuario no logueado - ir al paso 1
        router.push('/auth/login');
        return;
      }

      // Usuario logueado - verificar su perfil y estado
      if (!userProfile) {
        // Si no tiene perfil, ir al paso 1 para configurarlo
        router.push('/auth/onboarding/step1');
        return;
      }

      // Verificar si el usuario ya es tutor o ambos
      if (userProfile.role === 'tutor' || userProfile.role === 'ambos') {
        if (userProfile.role === 'tutor') {
          info("¡Ya sos tutor! Podés empezar a recibir estudiantes o configurar tu perfil.");
        } else if (userProfile.role === 'ambos') {
          info("¡Ya tenés el rol de tutor activado! Podés empezar a recibir estudiantes.");
        }
      } else if (userProfile.role === 'estudiante') {
        // Es estudiante, necesita cambiar su rol - ir al paso 1
        router.push('/auth/onboarding/step1');
      } else {
        // Rol no definido o incompleto - ir al paso 1
        router.push('/auth/onboarding/step1');
      }
    } catch (error) {
      console.error('Error al verificar usuario:', error);
      // En caso de error, ir al paso 1
      router.push('/auth/login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 px-4 sm:px-80 py-10 mb-32 place-items-center">
      {/* CARD 1 */}
      <Card className="w-full max-w-sm h-full max-h-[400px] rounded-lg shadow-md shadow-blue-200 overflow-hidden border-transparent bg-[#FFFFFF] lg:mx-4 mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-xl">
            ¿Querés generar ingresos mientras estudias?
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <ul className="space-y-3 mb-8">
            <li className="flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#0077B6] mr-1" />
              <span>Vos definís tus horarios.</span>
            </li>
            <li className="flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#0077B6] mr-1" />
              <span>Generá ingresos por tutorías.</span>
            </li>
            <li className="flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#0077B6] mr-1" />
              <span>Ayudás a otros estudiantes.</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="mt-auto">
          <button 
            className="w-full bg-[#0077B6] text-white py-3 px-4 rounded font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleBecomeTeacher}
            disabled={isLoading}
          >
            {isLoading ? "Verificando..." : "¡Quiero ser tutor!"}
          </button>
        </CardFooter>
      </Card>

      {/* CARD 2 */}
      <Card className="w-full max-w-sm h-full max-h-[400px] rounded-lg shadow-md shadow-blue-200 overflow-hidden bg-[#0077B6] text-white border-transparent lg:mx-4">
        <CardHeader className="pb-0">
          <CardTitle className="text-center text-xl">
            ¿Ya sos tutor y querés llegar a más estudiantes?
          </CardTitle>
          <CardDescription className="text-center text-white text-sm mt-3">
            por solo ARS 5,000/mes:
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <ul className="space-y-3 mb-8">
            <li className="flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white mr-1" />
              <span>Mejorá tu visibilidad en Tutorcito.</span>
            </li>
            <li className="flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white mr-1" />
              <span>Quedate con el 100% de lo generado.</span>
            </li>
            <li className="flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white mr-1" />
              <span>Mejor porcentaje de conversión.</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="mt-auto">
          {/* <button className="w-full bg-black text-white py-3 px-4 rounded font-medium hover:bg-gray-800 transition-colors">
            Ser tutor patrocinado
          </button> */}
          <PaymentButton
            items={subscriptionItems}
            accessToken="TU_ACCESS_TOKEN_AQUI"
            className="w-auto px-6 py-2 text-white bg-black hover:bg-gray-900 text-sm rounded-lg"
            onSuccess={() => console.log('Redirigido')}
            onError={(e: string) => console.log(e)} backUrls={{
              success: "http://localhost:3000",
              failure: "http://localhost:3000",
              pending: "http://localhost:3000"
            }}          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default CardsCta;