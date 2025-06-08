import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CardsCta = () => {
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
          <button className="w-full bg-[#0077B6] text-white py-3 px-4 rounded font-medium hover:bg-blue-700 transition-colors">
            ¡Quiero ser tutor!
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
          <button className="w-full bg-black text-white py-3 px-4 rounded font-medium hover:bg-gray-800 transition-colors">
            Ser tutor patrocinado
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CardsCta;