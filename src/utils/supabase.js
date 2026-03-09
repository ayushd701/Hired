import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export const createSupabaseClient = (session) => {
  return createClient(
    supabaseUrl,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    {
      accessToken: async () => session?.getToken() ?? null,
    }
  );
};
