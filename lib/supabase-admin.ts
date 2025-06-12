// Create this file: lib/supabase-admin.ts

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Admin client with service role key - only use on server side
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
	},
});

// This client has admin privileges and can:
// - Delete users from auth
// - Bypass RLS policies
// - Access all data
// NEVER use this client on the frontend!
