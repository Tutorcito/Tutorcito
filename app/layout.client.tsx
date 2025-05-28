// ✅ app/layout.client.tsx
"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import NavBar from "@/components/navBar";
import Footer from "@/components/footer";

export default function RootLayoutClient({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const isOnboarding = pathname.startsWith("/auth/onboarding");

	return (
		<AuthProvider>
			{!isOnboarding && <NavBar />}
			{children}
			{!isOnboarding && <Footer />}
		</AuthProvider>
	);
}
