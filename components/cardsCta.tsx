'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
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
        router.push('/auth/onboarding/step1');
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
        // Verificar si ya completó el paso 2 (datos personales)
        if (userProfile.full_name && userProfile.degree && userProfile.year_in_degree) {
          // Ya tiene los datos básicos, ir directamente al paso 3 (carga de archivos)
          router.push('/auth/onboarding/step3');
        } else {
          // Falta completar datos del paso 2
          router.push('/auth/onboarding/step2');
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
      router.push('/auth/onboarding/step1');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-20 p-4 sm:px-80 py-10 mb-32 place-items-center">
  {/* CARD 1 */}
  <Card className="w-full max-w-sm h-[400px] rounded-lg shadow-md shadow-blue-400 overflow-hidden border-transparent bg-[#FFFFFF] lg:mx-4 flex flex-col">
    <CardHeader className="pb-2">
      <CardTitle className="text-center text-xl">
        ¿Querés generar ingresos mientras estudias?
      </CardTitle>
    </CardHeader>
    <CardContent className="pb-6 flex-grow">
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
        className="w-full bg-[#0077B6] text-white py-3 px-4 rounded font-medium hover:bg-blue-900 transition-transform duration-300 hover:scale-105"
        onClick={handleBecomeTeacher}
        disabled={isLoading}
      >
        {isLoading ? "Verificando..." : "¡Quiero ser tutor!"}
      </button>
    </CardFooter>
  </Card>

  {/* CARD 2 */}
  <Card className="w-full max-w-sm h-full h-[400px] rounded-lg shadow-md shadow-blue-200 overflow-hidden bg-[#0077B6] text-white border-transparent lg:mx-4 flex flex-col">
    <CardHeader className="pb-0">
      <CardTitle className="text-center text-xl">
        ¿Ya sos tutor y querés llegar a más estudiantes?
      </CardTitle>
      <CardDescription className="text-center text-white text-sm mt-3">
        por solo ARS 5,000/mes:
      </CardDescription>
    </CardHeader>
    <CardContent className="pb-6 flex-grow">
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
      <PaymentButton 
        items={subscriptionItems}
        accessToken="TU_ACCESS_TOKEN_AQUI"
        className="w-full px-4 py-3 text-white bg-black hover:bg-gray-900 text-sm rounded-lg"
        onSuccess={() => console.log('Redirigido')}
        onError={(e: string) => console.log(e)} 
        backUrls={{
          success: "http://localhost:3000",
          failure: "http://localhost:3000",
          pending: "http://localhost:3000"
        }}
      />
    </CardFooter>
  </Card>
</div>
  );
};

export default CardsCta;