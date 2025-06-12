import { supabase } from "./supabase";

export const getAllTutors = async () => {
	const { data, error } = await supabase
		.from("profiles")
		.select(
			`
        id,
        full_name,
        profile_picture,
        tutor_subjects (
            subject_name
        )
    `
		)
		.in("role", ["tutor", "ambos"])
		.eq("sponsored", false); // Only non-sponsored tutors

	if (error || !data) {
		console.error("Failed to fetch tutors:", error);
		return [];
	}

	console.log("All tutors data:", data);

	return data.map((tutor) => ({
		id: tutor.id,
		name: tutor.full_name,
		profileImage: tutor.profile_picture ?? "/logo.png",
		subjects:
			(tutor.tutor_subjects || [])
				.map((subject) => subject.subject_name)
				.join(" | ") || "Sin materias asignadas",
		rating: 5, // You can calculate this from tutor_comments later
	}));
};
