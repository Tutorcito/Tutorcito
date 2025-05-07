"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, supabase } from "@/lib/supabase";

export default function AuthCallback() {
	const router = useRouter();

	const handleAuthCallback = async () => {
		try {
			const { data, error } = await auth.getSession();

			if (error) {
				throw error;
			}

			if (data?.session) {
				const { data: profile, error: profileError } = await supabase
					.from("profiles")
					.select("*")
					.eq("id", data.session.user.id)
					.single();

				if (profileError && profileError.code === "PGRST116") {
					router.push("/onboarding/step1");
				} else {
					router.push("/");
				}
			} else {
				router.push("/auth/login");
			}
		} catch (error) {
			console.error("Error during auth callback: ", error);
			router.push("/auth/login?error=callback");
		}
	};

	useEffect(() => {
		handleAuthCallback();
	}, [router]);

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<h1 className="text-2xl font-bold">Procesando tu solicitud...⏳</h1>
				<p className="mt-4">Por favor espera mientras creamos tu cuenta.</p>
			</div>
		</div>
	);
}
