"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

interface ProfileData {
  full_name: string | null;
  profile_picture: string | null;
};

export default function ButtonProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchProfile = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Error obteniendo usuario: ", userError);
    };

    if (user) setUserId(user.id);

    const { data, error } = await supabase
    .from("profiles")
    .select('full_name, profile_picture')
    .eq('id', user?.id)
    .single();

    if (error) {
      console.error("Error de fetch del perfil: ", error);
    } else {
      setProfile(data);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const name = profile?.full_name || "Perfil";
  const avatar = profile?.profile_picture || "/logo.png"

  return (
    <Link href={`/profiles/${userId}`}>
      <div className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded hover:bg-gray-100 transition-colors">
        <Image
          src={avatar}
          alt="Avatar del usuario"
          width={38}
          height={32}
          className="rounded-full"
        />
        <span className="text-m font-medium text-gray-800">{name}</span>
      </div>
    </Link>
  );
}
