"use client";

import CardsCta from "@/components/cardsCta";
import ClassCardCarousel from "@/components/classCardCarrusel";
import ResourceCarrusel from "@/components/ResourceCarrusel";
import TutorCarousel from "@/components/tutorCarrusel";
import SponsoredCarousel from "@/components/SponsoredCarousel";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
const tutorsData = [
    {
      id: 1,
      name: "Pepe Juan",
      profileImage: "/tutor-pepe-juan.jpg",
      subjects: "Programación I | Programación II",
      rating: 5
    },
    {
      id: 2,
      name: "María García",
      profileImage: "/tutor-maria-garcia.jpg",
      subjects: "Matemáticas | Cálculo",
      rating: 4
    },
    {
      id: 3,
      name: "Carlos López",
      profileImage: "/tutor-carlos-lopez.jpg",
      subjects: "Física | Química",
      rating: 5
    },
    {
      id: 4,
      name: "Ana Martínez",
      profileImage: "/tutor-ana-martinez.jpg",
      subjects: "Inglés | Literatura",
      rating: 4
    },
    {
      id: 5,
      name: "Diego Rodríguez",
      profileImage: "/tutor-diego-rodriguez.jpg",
      subjects: "Historia | Geografía",
      rating: 5
    },
    {
      id: 6,
      name: "Laura Sánchez",
      profileImage: "/tutor-laura-sanchez.jpg",
      subjects: "Biología | Anatomía",
      rating: 4
    }
  ];
const classesData = [
    {
      id: 1,
      subject: "Análisis Matemático II",
      students: 18500,
      tutors: 12430,
      classImage: "/clase-analisis-2.jpg"
    },
    {
      id: 2,
      subject: "Programación I",
      students: 15200,
      tutors: 8950,
      classImage: "/clase-prog.jpg"
    },
    {
      id: 3,
      subject: "Física General",
      students: 12800,
      tutors: 6720,
      classImage: "/clase-fisica.jpg"
    },
    {
      id: 4,
      subject: "Química Orgánica",
      students: 9500,
      tutors: 4320,
      classImage: "/clase-quimica.jpg"
    },
    {
      id: 5,
      subject: "Cálculo Diferencial",
      students: 14600,
      tutors: 7890,
      classImage: "/clase-mate.jpg"
    },
    {
      id: 6,
      subject: "Inglés Técnico",
      students: 11200,
      tutors: 5670,
      classImage: "/clase-ingles.jpg"
    }
  ];

export default function Home() {
  const [profileName, setProfileName] = useState<any>(null);

  const fetchUser = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Error en el fetch del usuario.");
      };
      

      const { data, error } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

      if (error || !data) {
        throw new Error("Error en el fetch a Supabase.");
      };

      const name = data.full_name?.split(" ")[0] ?? "Usuario";
      setProfileName(name);

    } catch (error) {
      console.error("Hubo un error en el Fetch del usuario: ", error);
    };
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
    <div className="w-full max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-start">
        Bienvenido{profileName ? `, ${profileName}` : ""} 👋
      </h1>
    </div>
    <SponsoredCarousel />
    <TutorCarousel 
          tutors={tutorsData}
          title="Nuestros Mejores Tutores"
        />
      <ClassCardCarousel 
          classes={classesData}
          title="Explora Nuestras Materias"
        />
    <ResourceCarrusel />
    <CardsCta />
    </>
    
  );
}
