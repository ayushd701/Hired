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

  const { data, error } = await query;

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
    const { data, error: insertError } = await supabase
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

export async function getSingleJob(accessToken, { job_id }) {
  const supabase = createSupabaseClientWithToken(accessToken);

  const { data: jobData, error: jobError } = await supabase
    .from("jobs")
    .select(
      "* , company: companies(name , logo_url) , applications: applications(*) "
    )
    .eq("id", job_id)
    .single();

  if (jobError) {
    console.error("Error fetching job", jobError);
    return null;
  }
  return jobData;
}

export async function updateHiringStatus(accessToken, { job_id }, isOpen) {
  const supabase = createSupabaseClientWithToken(accessToken);

  const { data: updateData, error: updateError } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  if (updateError) {
    console.error("Error updating hiring status", updateError);
    return null;
  }
  return updateData;
}

export async function addNewJob(accessToken, _, jobData) {
  const supabase = createSupabaseClientWithToken(accessToken);

  const { data: addJobData, error: addJobError } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (addJobError) {
    console.error("Error adding new job", addJobError);
    return null;
  }
  return addJobData;
}

export async function getSavedJobs(accessToken) {
  const supabase = createSupabaseClientWithToken(accessToken);

  let query = supabase
    .from("saved_jobs")
    .select("* , job:jobs(* , company: companies(name , logo_url))");

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching saved jobs", error);
    return null;
  }
  return data;
}

export async function getCreatedJobs(accessToken , {recruiter_id}) {
  const supabase = createSupabaseClientWithToken(accessToken);

  let query = supabase
    .from("jobs")
    .select("*,company: companies(name , logo_url)")
    .eq("recruiter_id" , recruiter_id)

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching created jobs", error);
    return null;
  }
  return data;
}

export async function deleteMyJobs(accessToken , {job_id}) {
  const supabase = createSupabaseClientWithToken(accessToken);

  let query = supabase
    .from("jobs")
    .delete()
    .eq("id" , job_id)
    .select()

  const { data, error } = await query;

  if (error) {
    console.error("Error deleting jobs", error);
    return null;
  }
  return data;
}

