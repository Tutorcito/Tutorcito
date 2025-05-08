// app/components/Navbar.jsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import ButtonProfile from "./ui/buttonProfile";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google", // o github, etc.
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };
  return (
    <nav className="flex items-center justify-between  px-5 py-4 bg-white shadow-md h-12 ">
      <div className="flex items-center space-x-1">
        <Image src="/logo.png" alt="Logo Tutorcito" width={40} height={32} />
        <span className="text-lg font-bold  ">Tutorcito</span>
      </div>

      {user ? (
        <ButtonProfile user={user} />
      ) : (
        <Button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={handleLogin}
        >
          Ingresar
        </Button>
      )}

    </nav>
  );
}
