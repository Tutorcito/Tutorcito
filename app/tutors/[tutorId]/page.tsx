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

  const [comments, setComments] = useState<Database["public"]["Tables"]["tutor_comments"]["Row"][]>([]);
  const [profilesMap, setProfilesMap] = useState<Record<string, { full_name: string; profile_picture: string | null }>>({});
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
        .in("role", ["tutor", "ambos"])
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
        .select("*")
        .eq("tutor_id", tutorId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching comments:", error);
        return;
      }
      
      setComments(commentsData || []);

      // Fetch user profiles for all comments
      const userIds = [...new Set((commentsData || []).map((c) => c.user_id))];
      
      if (userIds.length > 0) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, profile_picture")
          .in("id", userIds);

        if (profileError) {
          console.error("Error fetching profiles:", profileError);
        } else {
          const profileMap = Object.fromEntries(
            (profileData || []).map((p) => [p.id, { 
              full_name: p.full_name,
              profile_picture: p.profile_picture 
            }])
          );
          setProfilesMap(profileMap);
        }
      }
    };

    fetchComments();
  }, [tutorId]);

  const handleSubmitComment = async (content: string, rating: number) => {
    setLoading(true);
    
    try {
      // Get current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        alert("Debes estar autenticado para comentar.");
        setLoading(false);
        return;
      }

      // Insert the new comment and return the inserted data
      const { data: newComment, error: insertError } = await supabase
        .from("tutor_comments")
        .insert([
          {
            tutor_id: tutorId,
            user_id: user.id,
            content,
            rating,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting comment:", insertError);
        alert("Error al enviar comentario");
        setLoading(false);
        return;
      }

      // Get the current user's profile if not already in profilesMap
      if (!profilesMap[user.id]) {
        const { data: userProfile, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, profile_picture")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
        } else {
          // Update profilesMap with the new user
          setProfilesMap(prev => ({
            ...prev,
            [user.id]: { 
              full_name: userProfile.full_name,
              profile_picture: userProfile.profile_picture 
            }
          }));
        }
      }

      // Add the new comment to the beginning of the comments array
      setComments(prev => [newComment, ...prev]);

      // Show success message
      alert("Comentario enviado exitosamente!");

    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Error inesperado al enviar comentario");
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return <div className="text-center py-10">Cargando perfil del tutor...</div>;
  }

  if (!tutorProfile) {
    return <div className="text-center py-10 text-red-600">Perfil de tutor no encontrado.</div>;
  }

  const formattedComments = comments.map((c) => ({
    name: profilesMap[c.user_id]?.full_name || "Usuario Anónimo",
    profilePicture: profilesMap[c.user_id]?.profile_picture || "/api/placeholder/40/40",
    date: new Date(c.created_at || "").toLocaleDateString(),
    rating: c.rating || 5,
    text: c.content,
  }));

  // Calculate average rating
  const averageRating = comments.length > 0 
    ? comments.reduce((sum, c) => sum + (c.rating || 5), 0) / comments.length
    : 5;

  const tutorData = {
    name: tutorProfile.full_name || "Tutor sin nombre",
    specialty: "Laboratorio III | Programación II",
    rating: averageRating,
    bannerUrl: "/tutor-bg.jpg",
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