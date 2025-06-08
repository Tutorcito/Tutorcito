"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

interface ProfileData {
  full_name: string | null;
  profile_picture: string | null;
}

export default function ButtonProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from("profiles")
        .select("full_name, profile_picture")
        .eq("id", user.id)
        .single();

      if (data) setProfile(data);
    };

    fetchProfile();
  }, []);

  const name = profile?.full_name || "Perfil";
  const avatar = profile?.profile_picture || "/logo.png";

  return (
    <Link href={`/profiles/${userId}`}>
      <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 transition-colors h-10">
        <Image
          src={avatar}
          alt="Avatar del usuario"
          width={32}
          height={32}
          className="w-8 h-8 rounded-full object-cover shrink-0"
        />
        <span className="hidden sm:inline-block truncate text-sm font-medium text-gray-800 max-w-[100px]">
          {name}
        </span>
      </div>
    </Link>
  );
}


