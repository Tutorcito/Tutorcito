import { supabase } from "./supabase";

export const getSponsoredTutors = async () => {
    const { data, error } = await supabase
    .from('profiles')
    .select(`
        id,
        full_name,
        profile_picture,
        tutor_subjects (
            subject_name
        )
    `)
    .eq("sponsored", true);

    console.log("Raw data from Supabase:", data);
    console.log("Error if any:", error);

    if (error || !data) {
		throw new Error("Failed to fetch tutors: " + error?.message);
	}

    data.forEach(tutor => {
        console.log(`${tutor.full_name} subjects:`, tutor.tutor_subjects);
    });

    return data.map((tutor) => ({
        id: tutor.id,
        full_name: tutor.full_name,
        profile_picture: tutor.profile_picture ?? "/logo.png",
        subjects: (tutor.tutor_subjects || []).map((subject) => subject.subject_name).join(" | "),
    }));
}