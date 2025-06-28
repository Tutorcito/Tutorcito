import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type PriceOption = {
    price: string;
    duration: string;
};

export type Profile = {
    id: string;
    full_name: string | null;
    profile_picture: string | null;
    role: string | null;
    degree: string | null;
    year_in_degree: number | null;
    phone_number: string | null;
    calendly_link: string | null;
    about_me: string | null;
    prices: PriceOption[] | null;
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
    }

    return data as Profile;
}

export const auth = {
    signInWithGoogle: async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `https://tutorcito.netlify.app/auth/callback`,
            },
        });
        return { data, error };
    },

    signUp: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `https://tutorcito.netlify.app/auth/callback`,
            },
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
    },

    // Password recovery functions
    resetPasswordForEmail: async (email: string, options?: { redirectTo?: string }) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: options?.redirectTo || `https://tutorcito.netlify.app/auth/update-password`,
        });
        return { data, error };
    },

    updatePassword: async (newPassword: string) => {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });
        return { data, error };
    },

    // Email confirmation resend
    resendConfirmation: async (email: string) => {
        const { data, error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
            options: {
                emailRedirectTo: `https://tutorcito.netlify.app/auth/callback`,
            }
        });
        return { data, error };
    }
};