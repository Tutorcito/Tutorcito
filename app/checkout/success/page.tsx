// app/checkout/success/page.tsx
"use client";

import { Suspense } from "react";
import PageLoading from "@/components/PageLoading";
import SuccessContent from "@/components/checkout/SuccessContent";

export default function PaymentSuccessPage() {
	return (
		<Suspense fallback={<PageLoading />}>
			<SuccessContent />
		</Suspense>
	);
}
