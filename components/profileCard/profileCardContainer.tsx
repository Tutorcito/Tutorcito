"use client";

import React, { useEffect, useState } from "react";
import { supabase, getUserProfile, Profile } from "@/lib/supabase";

import ProfileBanner from "./profileBanner";
import ProfileHeader from "./profileHeader";
import AboutMe from "./aboutMe";
import PricingSection from "./pricingSection";
import KnowledgeSection from "./knowledgeSection";
import ProfileActions from "./profileActions";

const ProfileCardContainer: React.FC = () => {
  const [userData, setUserData] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const profile = await getUserProfile(user.id);
      if (profile) setUserData(profile);
    };

    fetchProfile();
  }, []);

  if (!userData) return <p className="text-center mt-10">Cargando perfil...</p>;

  const knowledge = [
    { icon: "📘", label: "Analítico secundario" },
    { icon: "📔", label: "Materias aprobadas" },
    { icon: "📓", label: "Alumno regular" },
  ];

  const prices = [
    { price: "ARS 3500", duration: "30 min" },
    { price: "ARS 5000", duration: "60 min" },
    { price: "ARS 7500", duration: "100 min" },
  ];

  return (
    <div className="flex justify-center items-start min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col gap-4 pb-10">
        <ProfileBanner bannerUrl="" avatarUrl={userData.profile_picture ?? ""} />
        <ProfileHeader
          name={userData.full_name ?? "Sin nombre"}
          title={userData.degree ?? ""}
          year={userData.year_in_degree?.toString() ?? ""}
        />
        <AboutMe content={userData.role ?? "Aquí va la descripción si está en la base de datos."} />
        <PricingSection prices={prices} />
        <KnowledgeSection knowledge={knowledge} />
        <div className="mt-4 px-4">
          <ProfileActions />
        </div>
      </div>
    </div>
  );
};

export default ProfileCardContainer;

