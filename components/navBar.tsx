// app/components/Navbar.jsx
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

  const handleLogin = () => {
    router.push("/auth/login")
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 bacdrop-blur-md border border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link 
          className="flex items-center justify-center gap-2"
          href={"/"}
        >
          <Image
            src={"/tutorcito-logo.png"}
            alt="Logo de Tutorcito"
            width={56}
            height={56}
          />
          <div className="text-xl font-semibold">Tutorcito</div>
        </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <ButtonProfile />
            ) : (
              <Button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
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
