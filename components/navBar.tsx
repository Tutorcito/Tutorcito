"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import ButtonProfile from "./buttonProfile";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
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

  const handleLogin = () => {
    router.push("/auth/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/tutorcito-logo.png"
            alt="Logo de Tutorcito"
            width={36}
            height={36}
            className="w-9 h-9"
          />
          <span className="text-lg sm:text-xl font-semibold whitespace-nowrap">
            Tutorcito
          </span>
        </Link>

        {/* Perfil o login */}
        <div className="flex items-center gap-2 shrink-0 overflow-hidden">
          {user ? (
            <ButtonProfile />
          ) : (
            <Button
              className="bg-blue-500 text-white py-1.5 px-3 sm:py-2 sm:px-4 text-sm sm:text-base rounded hover:bg-blue-600"
              onClick={handleLogin}
            >
              Ingresar
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}