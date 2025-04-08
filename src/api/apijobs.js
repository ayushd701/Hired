import { createSupabaseClientWithToken } from "@/utils/supabase";

export async function getJobs(
  accessToken,
  { location, company_id, searchQuery }
) {
  const supabase = createSupabaseClientWithToken(accessToken);

  let query = supabase
    .from("jobs")
    .select("* , company: companies(name , logo_url) , saved: saved_jobs(id)");

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data , error } = await query

  if (error) {
    console.error("Error fetching jobs", error);
    return null;
  }
  return data;
}

export async function saveJob(accessToken, { alreadySaved }, saveData) {
  const supabase = createSupabaseClientWithToken(accessToken);

  if (alreadySaved) {
    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", saveData.job_id);
    if (deleteError) {
      console.error("Error deleting saved job", deleteError);
      return null;
    }
    return data;
  } else {
    const { data, error:insertError } = await supabase
      .from("saved_jobs")
      .insert([saveData])
      .select();

    if (insertError) {
      console.error("Error inserting to saved jobs", error);
      return null;
    }
    return data;
  }
}
