"use client";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import React, { useEffect, useState } from "react";
import TutorProfileContainer from "@/components/tutor/tutorContainer";
import { supabase } from "@/lib/supabase";
export default function TutorPage() {
  const [comments, setComments] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const tutorId = "tutor-id-actual"; // Reemplazar con ID real del tutor

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("tutor_comments")
      .select(`id, content, rating, created_at, user_id, profiles ( full_name )`)
      .eq("tutor_id", tutorId)
      .order("created_at", { ascending: false });

    if (!error) setComments(data);
    setLoading(false);
  };

  const handleSubmitComment = async (content: string, rating: number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return alert("Debes estar logueado para comentar");

    const { error } = await supabase.from("tutor_comments").insert([
      {
        tutor_id: tutorId,
        user_id: user.id,
        content,
        rating,
      },
    ]);

    if (!error) fetchComments();
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Datos del tutor
  const tutorData = {
    name: "Joaquín Cortez",
    specialty: "Laboratorio III | Programación II",
    rating: 4.7,
    bannerUrl: "/api/placeholder/800/200",
    avatarUrl: "/api/placeholder/200/200",
    aboutMe:
      "Soy estudiante de Informática de 2do año. Me dedico a crear agentes de IA con Python y OpenAI. Puedo ayudarte con tu lógica de programación en lenguajes como Python, JavaScript y Node.",
    knowledge: [
      { icon: "📊", label: "Análisis secundario" },
      { icon: "📝", label: "Materias aprobadas" },
      { icon: "👨‍🎓", label: "Alumno regular" },
    ],
    prices: [
      { price: "ARS 3.500", duration: "30 min" },
      { price: "ARS 5.000", duration: "60 min" },
      { price: "ARS 7.500", duration: "90 min" },
    ],
    comments: loading
      ? []
      : comments.map((c: any) => ({
          name: c.profiles?.full_name || "Anónimo",
          date: new Date(c.created_at).toLocaleDateString("es-AR"),
          rating: c.rating,
          text: c.content,
        })),
  };

  const handleEditAbout = () => console.log("Editando sobre mí");
  const handleEditKnowledge = () => console.log("Editando conocimientos");
  const handleEditPrices = () => console.log("Editando precios");

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <EditProfileDialog />
      <TutorProfileContainer
        tutorData={tutorData}
        onEditAbout={handleEditAbout}
        onEditKnowledge={handleEditKnowledge}
        onEditPrices={handleEditPrices}
        onSubmitComment={handleSubmitComment}
      />
    </div>
  );
}
