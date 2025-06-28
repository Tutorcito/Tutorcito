// app/auth/login/page.tsx
"use client";

import { Suspense } from "react";
import PageLoading from "@/components/PageLoading";
import LoginContent from "@/components/auth/LoginContent";

export default function LoginPage() {
	return (
		<Suspense fallback={<PageLoading />}>
			<LoginContent />
		</Suspense>
	);
}
