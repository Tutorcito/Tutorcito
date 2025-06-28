// app/checkout/subscription/success/page.tsx
"use client";

import { Suspense } from "react";
import PageLoading from "@/components/PageLoading";
import SubscriptionSuccessContent from "@/components/checkout/SubscriptionSuccessContent";

export default function SubscriptionSuccessPage() {
	return (
		<Suspense fallback={<PageLoading />}>
			<SubscriptionSuccessContent />
		</Suspense>
	);
}
