import { createSupabaseClientWithToken } from "@/utils/supabase";

export async function getJobs(
  accessToken,
  { location, company_id, searchQuery }
) {
  const supabase = createSupabaseClientWithToken(accessToken);

  const { data, error } = await supabase.from("jobs").select("* , company: companies(name , logo_url) , saved: saved_jobs(id)");

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.eq("title", `%${searchQuery}%`);
  }

  if (error) {
    console.error("Error fetching jobs", error);
    return null;
  }
  return data;
}
