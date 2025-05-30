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

    if (error || !data) {
		throw new Error("Failed to fetch tutors: " + error?.message);
	}
    console.log("Full sponsored tutor data:", JSON.stringify(data, null, 2));

    return data.map((tutor) => ({
        id: tutor.id,
        full_name: tutor.full_name,
        profile_picture: tutor.profile_picture ?? "/logo.png",
        subjects: (tutor.tutor_subjects || []).map((subject) => subject.subject_name).join(" | "),
    }));
}