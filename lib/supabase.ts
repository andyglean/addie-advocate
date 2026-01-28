import { createClient } from "@supabase/supabase-js";
import { config } from 'dotenv';
import path from 'path';

// Load .env.local explicitly
config({ path: path.join(process.cwd(), '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side admin client (do not expose in client)
export const supabaseAdmin = createClient(url, serviceKey, {
	auth: { persistSession: false },
	global: { headers: { "x-allie-role": "server" } }
});


