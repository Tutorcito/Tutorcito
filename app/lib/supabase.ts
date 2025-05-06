import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    process.env.SUPABASE_PUBLIC_URL!,
    process.env.SUPABASE_ANON_KEY!
);

export type Profile = {
    id: string;
    full_name: string | null;
    profile_picture: string | null;
    role: string | null;
    degree: string | null;
    year_in_degree: number | null;
    phone_number: string | null;
    calendly_link: string | null;
    created_at: string | null;
};

export async function getUserProfile(userId: string) {
    const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

    if (error) {
        console.error("Error fetching user profile: ", error);
        return null;
    };

    return data as Profile;
};

export const auth = {
    signInWithGoogle: async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        return { data, error };
    },

    signUp: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        return { data, error };
    },

    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        return { data, error };
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    getSession: async () => {
        const { data, error } = await supabase.auth.getSession();
        return { data, error };
    },

    getUser: async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        return { user, error };
    },

    onAuthStateChange: (callback: any) => {
        return supabase.auth.onAuthStateChange(callback);
    }
};
