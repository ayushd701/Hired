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