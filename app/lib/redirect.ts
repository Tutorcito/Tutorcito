import { auth } from "./supabase";
import { redirect } from "next/navigation";

export async function redirectIfAuthenticated(redirectTo: string = "/") {
	try {
		const { data } = await auth.getSession();

		if (data.session) {
			redirect(redirectTo);
		}
	} catch (error) {
		console.error("Error checking auth status: ", error);
	}
}

export async function redirectIfUnauthenticated(
	redirectTo: string = "/auth/login"
) {
	try {
		const { data } = await auth.getSession();

		if (!data.session) {
			redirect(redirectTo);
		}

		return data.session.user;
	} catch (error) {
		console.error("Error checking auth status: ", error);
		redirect(redirectTo);
	}
}

export async function checkOnboardingStatus(supabase: any) {
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return null;

		const { data: profile, error } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", user.id)
			.single();

		if (error) {
			redirect("/onboarding/step1");
		}

		const requiredFields = ["full_name", "role", "degree", "year_in_degree"];
		const isComplete = requiredFields.every((field) => profile[field]);

		if (!isComplete) {
			if (!profile.role) {
				redirect("/onboarding/step1");
			} else if (!profile.full_name) {
				redirect("/onboarding/step2");
			} else if (!profile.degree) {
                redirect('/onboarding/step2')
            } else if (!profile.year_in_degree) {
                redirect('/onboarding/step2')
            };
		}
	} catch (error) {
        console.error('Error checking onboarding status:', error);
        return null;
    }
}
