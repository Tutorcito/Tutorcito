export interface TutorPricing {
	price: string; // "ARS 2.500"
	duration: string; // "15 min"
}

export interface ParsedPricing {
	duration_minutes: number;
	price_ars: number;
	original: TutorPricing;
}

export function parseTutorPricing(
	pricingArray: TutorPricing[]
): ParsedPricing[] {
	return pricingArray.map((item) => ({
		duration_minutes: parseInt(item.duration.replace(" min", "")),
		price_ars: parseFloat(
			item.price.replace("ARS ", "").replace(".", "").replace(",", ".")
		),
		original: item,
	}));
}

export function findPriceByDuration(
	pricingArray: TutorPricing[],
	durationMinutes: number
): number | null {
	const parsed = parseTutorPricing(pricingArray);
	const found = parsed.find((p) => p.duration_minutes === durationMinutes);
	return found ? found.price_ars : null;
}
