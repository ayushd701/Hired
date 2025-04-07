import { createSupabaseClientWithToken } from "@/utils/supabase";

export async function getJobs(accessToken) {
  const supabase = createSupabaseClientWithToken(accessToken);

  const { data, error } = await supabase.from("jobs").select("*");

  if (error) {
    console.error("Error fetching jobs", error);
    return null;
  }
  return data;
}

