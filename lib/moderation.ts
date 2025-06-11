// lib/moderation.ts
export interface ModerationResult {
	flagged: boolean;
	categories: {
		harassment: boolean;
		"harassment/threatening": boolean;
		hate: boolean;
		"hate/threatening": boolean;
		"self-harm": boolean;
		"self-harm/instructions": boolean;
		"self-harm/intent": boolean;
		sexual: boolean;
		"sexual/minors": boolean;
		violence: boolean;
		"violence/graphic": boolean;
	};
	categoryScores: {
		harassment: number;
		"harassment/threatening": number;
		hate: number;
		"hate/threatening": number;
		"self-harm": number;
		"self-harm/instructions": number;
		"self-harm/intent": number;
		sexual: number;
		"sexual/minors": number;
		violence: number;
		"violence/graphic": number;
	};
}

export const moderateContent = async (
	text: string
): Promise<ModerationResult> => {
	try {
		const response = await fetch("https://api.openai.com/v1/moderations", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				input: text,
			}),
		});

		if (!response.ok) {
			throw new Error(`OpenAI API error: ${response.status}`);
		}

		const result = await response.json();

		return {
			flagged: result.results[0].flagged,
			categories: result.results[0].categories,
			categoryScores: result.results[0].category_scores,
		};
	} catch (error) {
		console.error("Moderation error:", error);
		// Return safe defaults if API fails
		return {
			flagged: false,
			categories: {
				harassment: false,
				"harassment/threatening": false,
				hate: false,
				"hate/threatening": false,
				"self-harm": false,
				"self-harm/instructions": false,
				"self-harm/intent": false,
				sexual: false,
				"sexual/minors": false,
				violence: false,
				"violence/graphic": false,
			},
			categoryScores: {
				harassment: 0,
				"harassment/threatening": 0,
				hate: 0,
				"hate/threatening": 0,
				"self-harm": 0,
				"self-harm/instructions": 0,
				"self-harm/intent": 0,
				sexual: 0,
				"sexual/minors": 0,
				violence: 0,
				"violence/graphic": 0,
			},
		};
	}
};
