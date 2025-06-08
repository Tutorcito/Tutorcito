"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import TutorProfileContainer from "@/components/tutor/tutorContainer";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { useParams } from "next/navigation";
import { Database } from "@/types/supabase";

export default function TutorPage() {
  const params = useParams();
  const tutorId = typeof params?.tutorId === "string" ? params.tutorId : "";
  if (!tutorId) {
    return <div className="text-center py-10">Esperando ID del tutor...</div>;
  }
  console.log("params:", params);
console.log("tutorId:", tutorId);

  const [comments, setComments] = useState<Database["public"]["Tables"]["tutor_comments"]["Row"][]>([]);
  const [profilesMap, setProfilesMap] = useState<Record<string, { full_name: string }>>({});
  const [tutorProfile, setTutorProfile] = useState<Database["public"]["Tables"]["profiles"]["Row"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const fetchTutor = async () => {
      if (!tutorId) return;
      setProfileLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", tutorId)
        .eq("role", "tutor")
        .maybeSingle();

      if (error) {
        console.error("Error loading tutor profile", error);
      } else {
        setTutorProfile(data);
      }
      setProfileLoading(false);
    };

    fetchTutor();
  }, [tutorId]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!tutorId) return;

      const { data: commentsData, error } = await supabase
        .from("tutor_comments")
        .select("*, user_id")
        .eq("tutor_id", tutorId)
        .order("created_at", { ascending: false });

      if (error) return console.error(error);
      setComments(commentsData || []);

      const userIds = [...new Set((commentsData || []).map((c:any) => c.user_id))];
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);

      const profileMap = Object.fromEntries(
        (profileData || []).map((p:any) => [p.id, { full_name: p.full_name }])
      );
      setProfilesMap(profileMap);
    };

    fetchComments();
  }, [tutorId]);

  const handleSubmitComment = async (content: string, rating: number) => {
    setLoading(true);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      alert("Debes estar autenticado para comentar.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.from("tutor_comments").insert([
      {
        tutor_id: tutorId,
        user_id: user.id,
        content,
        rating,
      },
    ]);

    if (error) {
      alert("Error al enviar comentario");
      console.error(error);
    } else {
      setComments((prev) => [
        ...(data || []),
        ...prev,
      ]);
    }
    setLoading(false);
  };

  if (profileLoading) {
    return <div className="text-center py-10">Cargando perfil del tutor...</div>;
  }

  if (!tutorProfile) {
    return <div className="text-center py-10 text-red-600">Perfil de tutor no encontrado.</div>;
  }

  const formattedComments = comments.map((c) => ({
    name: profilesMap[c.user_id]?.full_name || "Anon",
    date: new Date(c.created_at || "").toLocaleDateString(),
    rating: c.rating || 5,
    text: c.content,
  }));

  const tutorData = {
    name: tutorProfile.full_name || "Tutor sin nombre",
    specialty: "Laboratorio III | Programación II",
    rating:
      comments.reduce((sum, c) => sum + (c.rating || 5), 0) /
      (comments.length || 1),
    bannerUrl: "/api/placeholder/800/200",
    avatarUrl: tutorProfile.profile_picture || "/api/placeholder/200/200",
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
    comments: formattedComments,
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <EditProfileDialog />
      <TutorProfileContainer
        tutorData={tutorData}
        onEditAbout={() => {}}
        onEditKnowledge={() => {}}
        onEditPrices={() => {}}
        onSubmitComment={handleSubmitComment}
        submitting={loading}
      />
    </div>
  );
}
