"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase, auth, Profile, getUserProfile } from "@/lib/supabase";

type AuthContextType = {
	user: User | null;
	profile: Profile | null;
	session: Session | null;
	isLoading: boolean;
	signInWithGoogle: () => Promise<void>;
	signIn: (email: string, password: string) => Promise<{ error: any | null }>;
	signUp: (email: string, password: string) => Promise<{ error: any | null }>;
	signOut: () => Promise<void>;
	refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch user profile
	const fetchProfile = async (userId: string) => {
		if (!userId) return null;

		const profileData = await getUserProfile(userId);
		setProfile(profileData);
		return profileData;
	};

	// Refresh profile data
	const refreshProfile = async () => {
		if (user) {
			await fetchProfile(user.id);
		}
	};

	// Sign in with Google
	const signInWithGoogle = async () => {
		setIsLoading(true);
		try {
			const { error } = await auth.signInWithGoogle();
			if (error) throw error;
		} catch (error) {
			console.error("Error signing in with Google:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	// Sign in with email/password
	const signIn = async (email: string, password: string) => {
		setIsLoading(true);
		try {
			const { error } = await auth.signIn(email, password);
			return { error };
		} catch (error) {
			console.error("Error signing in:", error);
			return { error };
		} finally {
			setIsLoading(false);
		}
	};

	// Sign up with email/password
	const signUp = async (email: string, password: string) => {
		setIsLoading(true);
		try {
			const { error } = await auth.signUp(email, password);
			return { error };
		} catch (error) {
			console.error("Error signing up:", error);
			return { error };
		} finally {
			setIsLoading(false);
		}
	};

	// Sign out
	const signOut = async () => {
		setIsLoading(true);
		try {
			const { error } = await auth.signOut();
			if (error) throw error;

			// Clear user state
			setUser(null);
			setProfile(null);
			setSession(null);
		} catch (error) {
			console.error("Error signing out:", error);
		} finally {
			setIsLoading(false);
		}
	};

	// Set up auth listener
	useEffect(() => {
		setIsLoading(true);

		// Get initial session
		const initializeAuth = async () => {
			try {
				const { data, error } = await auth.getSession();

				if (error) {
					throw error;
				}

				if (data.session) {
					setSession(data.session);
					setUser(data.session.user);
					await fetchProfile(data.session.user.id);
				}
			} catch (error) {
				console.error("Error initializing auth:", error);
			} finally {
				setIsLoading(false);
			}
		};

		initializeAuth();

		// Set up auth listener
		const { data: authListener } = supabase.auth.onAuthStateChange(
			async (event, session) => {
				setSession(session);
				setUser(session?.user || null);

				if (session?.user) {
					await fetchProfile(session.user.id);
				} else {
					setProfile(null);
				}

				setIsLoading(false);
			}
		);

		// Clean up subscription
		return () => {
			authListener?.subscription.unsubscribe();
		};
	}, []);

	const value = {
		user,
		profile,
		session,
		isLoading,
		signInWithGoogle,
		signIn,
		signUp,
		signOut,
		refreshProfile,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
