import { createSupabaseClientWithToken , supabaseUrl } from "@/utils/supabase";

export async function applyToJob(accessToken , _ ,jobData) {
  const supabase = createSupabaseClientWithToken(accessToken);

  const random = Math.floor(Math.random()*90000)
  const filename = `resume-${random}-${jobData.candidate_id}`

  const {error : storageError} = await supabase.storage.from("resumes").upload(filename , jobData.resume)

  if (storageError) {
    console.error("Error storing resume", storageError);
    return null;
  }

  const resume =`${supabaseUrl}/storage/v1/object/public/resumes//${filename}`

  const { data: applyJobData, error: applyJobError } = await supabase
    .from("applications")
    .insert([{...jobData , resume}])
    .select();

  if (applyJobError) {
    console.error("Error in applying to job", applyJobError);
    return null;
  }
  return applyJobData;
}

export async function updateApplicationStatus(accessToken , {job_id} , status) {
  const supabase = createSupabaseClientWithToken(accessToken);

  const { data: updateData, error: updateDataError } = await supabase
    .from("applications")
    .update({status})
    .eq("job_id" ,job_id)
    .select()

  if (updateDataError || updateData.length === 0) {
    console.error("Error updating status", updateDataError);
    return null;
  }
  return updateData;
}

export async function getApplications(accessToken , {user_id}) {
  const supabase = createSupabaseClientWithToken(accessToken);

  let query = supabase
    .from("applications")
    .select("* , job:jobs(title , company: companies(name))")
    .eq("candidate_id" , user_id)

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching applications", error);
    return null;
  }
  return data;
}