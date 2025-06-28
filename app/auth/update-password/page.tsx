// app/auth/update-password/page.tsx
"use client";

import { Suspense } from "react";
import PageLoading from "@/components/PageLoading";
import UpdatePasswordContent from "@/components/auth/UpdatePasswordContent";

export default function UpdatePasswordPage() {
	return (
		<Suspense fallback={<PageLoading />}>
			<UpdatePasswordContent />
		</Suspense>
	);
}
