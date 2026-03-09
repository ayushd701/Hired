import { createSupabaseClient , supabaseUrl } from "@/utils/supabase";

export async function applyToJob(session, _, jobData) {
  const supabase = createSupabaseClient(session);

  const random = Math.floor(Math.random() * 90000);
  const filename = `resume-${random}-${jobData.candidate_id}`;

  const { error: storageError } = await supabase
    .storage
    .from("resumes")
    .upload(filename, jobData.resume);

  if (storageError) {
    console.error("Error storing resume", storageError);
    return null;
  }

  const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${filename}`;

  const { data, error } = await supabase
    .from("applications")
    .insert([{ ...jobData, resume }])
    .select();

  if (error) {
    console.error("Error applying to job", error);
    return null;
  }

  return data;
}

export async function updateApplicationStatus(session, { job_id }, status) {
  const supabase = createSupabaseClient(session);

  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("job_id", job_id)
    .select();

  if (error || data.length === 0) {
    console.error("Error updating status", error);
    return null;
  }

  return data;
}

export async function getApplications(session, { user_id }) {
  const supabase = createSupabaseClient(session);

  const { data, error } = await supabase
    .from("applications")
    .select(`
      *,
      job:jobs(
        title,
        company:companies(name)
      )
    `)
    .eq("candidate_id", user_id);

  if (error) {
    console.error("Error fetching applications", error);
    return null;
  }

  return data;
}